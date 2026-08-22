import { Router } from "express";
import { runQuery } from "../db.js";

const router = Router();

/**
 * GET /api/recommend/:userId
 *
 * Collaborative-filtering recommendation — a genuine multi-hop traversal:
 *
 *   (me:User)-[:RATED]->(shared:Movie)<-[:RATED]-(twin:User)-[:RATED]->(rec:Movie)
 *
 * "Find people who liked what I liked (hop 1-2), then see what else they
 * liked (hop 3) that I haven't watched yet." This is a natural graph walk;
 * in SQL it's a self-join across a ratings table three times over, and it
 * gets worse the more hops you add (find friends-of-friends-of-friends).
 *
 * We also return the "connector" movie and user so the UI can explain *why*
 * each recommendation was made — that explanation is essentially free here
 * because the path was already walked to find the result.
 */
router.get("/:userId", async (req, res) => {
  try {
    const records = await runQuery(
      `
      MATCH (me:User {id: $userId})-[:RATED]->(seen:Movie)
      WITH me, collect(seen.id) AS seenIds

      MATCH (me)-[myRating:RATED]->(shared:Movie)<-[twinRating:RATED]-(twin:User)
      WHERE myRating.score >= 4 AND twinRating.score >= 4 AND twin.id <> me.id

      MATCH (twin)-[recRating:RATED]->(rec:Movie)
      WHERE recRating.score >= 4 AND NOT rec.id IN seenIds

      OPTIONAL MATCH (rec)-[:DIRECTED_BY]->(d:Director)
      OPTIONAL MATCH (rec)-[:HAS_GENRE]->(g:Genre)

      WITH rec, d, collect(DISTINCT g.name) AS genres,
           count(DISTINCT twin) AS matchingTastes,
           collect(DISTINCT { via: twin.name, becauseOf: shared.title })[0] AS reason
      RETURN rec.id AS id, rec.title AS title, rec.year AS year,
             d.name AS director, genres, matchingTastes, reason
      ORDER BY matchingTastes DESC, rec.title
      LIMIT 10
      `,
      { userId: req.params.userId }
    );
    res.json(records.map((r) => r.toObject()));
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: "Could not reach the database. Please try again shortly." });
  }
});

/**
 * GET /api/recommend/co-stars/:actorName
 *
 * "Awkward for a relational DB" query: find actors this person has NOT
 * directly worked with, but who share 2+ co-stars with them — a
 * second-degree collaborator network. In SQL this needs a recursive CTE
 * and self-joins on a bridge table that grow combinatorially with each
 * extra hop. In Cypher it's a direct pattern match.
 */
router.get("/co-stars/:actorName", async (req, res) => {
  try {
    const records = await runQuery(
      `
      MATCH (me:Actor)
      WHERE toLower(me.name) = toLower($actorName)
      MATCH (me)-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(bridge:Actor)
      MATCH (bridge)-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(candidate:Actor)
      WHERE candidate <> me
        AND NOT (me)-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(candidate)
      WITH candidate, count(DISTINCT bridge) AS sharedCoStars,
           collect(DISTINCT bridge.name)[0..3] AS via
      WHERE sharedCoStars >= 2
      RETURN candidate.name AS name, sharedCoStars, via
      ORDER BY sharedCoStars DESC
      LIMIT 10
      `,
      { actorName: req.params.actorName }
    );
    res.json(records.map((r) => r.toObject()));
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: "Could not reach the database. Please try again shortly." });
  }
});

export default router;
