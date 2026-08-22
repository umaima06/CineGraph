import express from "express";
import cors from "cors";
import "dotenv/config";
import { verifyConnection, closeDriver } from "./db.js";
import moviesRouter from "./routes/movies.js";
import usersRouter from "./routes/users.js";
import recommendRouter from "./routes/recommend.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  const connected = await verifyConnection();
  res.status(connected ? 200 : 503).json({ status: connected ? "ok" : "db_unreachable" });
});

app.use("/api/movies", moviesRouter);
app.use("/api/users", usersRouter);
app.use("/api/recommend", recommendRouter);

// Central error handler as a last line of defence for anything the route
// handlers don't already catch themselves.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong on our end." });
});

const PORT = process.env.PORT || 4000;

async function start() {
  const connected = await verifyConnection();
  if (!connected) {
    console.error("Starting anyway — API will return 503s until CognoDB is reachable.");
  }
  app.listen(PORT, () => console.log(`🎬 CineGraph API running on http://localhost:${PORT}`));
}

process.on("SIGINT", async () => {
  await closeDriver();
  process.exit(0);
});

start();
