import { Router } from "express";
import { runQuery } from "../db.js";

const router = Router();

// GET /api/users - list users (for the demo picker in the UI)
router.get("/", async (req, res) => {
  try {
    const records = await runQuery("MATCH (u:User) RETURN u.id AS id, u.name AS name ORDER BY u.name");
    res.json(records.map((r) => r.toObject()));
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: "Could not reach the database. Please try again shortly." });
  }
});

// GET /api/users/:id/ratings - a user's rated movies
router.get("/:id/ratings", async (req, res) => {
  try {
    const records = await runQuery(
      `
      MATCH (u:User {id: $id})-[r:RATED]->(m:Movie)
      RETURN m.id AS id, m.title AS title, m.year AS year, r.score AS score
      ORDER BY r.score DESC
      `,
      { id: req.params.id }
    );
    res.json(records.map((r) => r.toObject()));
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: "Could not reach the database. Please try again shortly." });
  }
});

export default router;
