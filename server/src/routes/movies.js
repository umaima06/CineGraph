import { Router } from "express";
import { runQuery } from "../db.js";

const router = Router();

// GET /api/movies - list all movies with director + genres (basic 1-hop read)
router.get("/", async (req, res) => {
  try {
    const records = await runQuery(
      `
      MATCH (m:Movie)-[:DIRECTED_BY]->(d:Director)
      OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
      RETURN m.id AS id, m.title AS title, m.year AS year,
             d.name AS director, collect(DISTINCT g.name) AS genres
      ORDER BY m.title
      `
    );
    res.json(records.map((r) => r.toObject()));
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: "Could not reach the database. Please try again shortly." });
  }
});

// GET /api/movies/:id - single movie detail with cast
router.get("/:id", async (req, res) => {
  try {
    const records = await runQuery(
      `
      MATCH (m:Movie {id: $id})-[:DIRECTED_BY]->(d:Director)
      OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
      OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(m)
      RETURN m.id AS id, m.title AS title, m.year AS year,
             d.name AS director,
             collect(DISTINCT g.name) AS genres,
             collect(DISTINCT a.name) AS cast
      `,
      { id: req.params.id }
    );
    if (records.length === 0) {
      return res.status(404).json({ error: "Movie not found." });
    }
    res.json(records[0].toObject());
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: "Could not reach the database. Please try again shortly." });
  }
});

// GET /api/movies/:id/similar - movies connected through a shared actor,
// director, or genre, returned as three separate categories. Each is a
// straightforward 2-hop traversal (Movie -> Actor/Director/Genre -> other
// Movie), run independently so each category tells its own clear story
// instead of being blended into one ambiguous "similar" score.
router.get("/:id/similar", async (req, res) => {
  const { id } = req.params;
  try {
    const [byActorRecords, byDirectorRecords, byGenreRecords] = await Promise.all([
      runQuery(
        `
        MATCH (:Movie {id: $id})<-[:ACTED_IN]-(a:Actor)-[:ACTED_IN]->(other:Movie)
        WHERE other.id <> $id
        WITH other, collect(DISTINCT a.name) AS via
        RETURN other.id AS id, other.title AS title, other.year AS year, via
        ORDER BY size(via) DESC
        LIMIT 8
        `,
        { id }
      ),
      runQuery(
        `
        MATCH (:Movie {id: $id})-[:DIRECTED_BY]->(d:Director)<-[:DIRECTED_BY]-(other:Movie)
        WHERE other.id <> $id
        WITH other, collect(DISTINCT d.name) AS via
        RETURN other.id AS id, other.title AS title, other.year AS year, via
        ORDER BY other.title
        LIMIT 8
        `,
        { id }
      ),
      runQuery(
        `
        MATCH (:Movie {id: $id})-[:HAS_GENRE]->(g:Genre)<-[:HAS_GENRE]-(other:Movie)
        WHERE other.id <> $id
        WITH other, collect(DISTINCT g.name) AS via
        RETURN other.id AS id, other.title AS title, other.year AS year, via
        ORDER BY size(via) DESC
        LIMIT 8
        `,
        { id }
      ),
    ]);

    const toCardShape = (records, reasonType) =>
      records.map((record) => {
        const row = record.toObject();
        return {
          id: row.id,
          title: row.title,
          year: row.year,
          reasons: row.via.map((name) => ({ type: reasonType, via: name })),
        };
      });

    res.json({
      byActor: toCardShape(byActorRecords, "actor"),
      byDirector: toCardShape(byDirectorRecords, "director"),
      byGenre: toCardShape(byGenreRecords, "genre"),
    });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: "Could not reach the database. Please try again shortly." });
  }
});

export default router;