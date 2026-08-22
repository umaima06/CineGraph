import { driver, verifyConnection, closeDriver } from "./db.js";
import { movies, users, ratings } from "./seedData.js";

async function seed() {
  const ok = await verifyConnection();
  if (!ok) process.exit(1);

  const session = driver.session();
  try {
    console.log("Clearing existing data...");
    await session.run("MATCH (n) DETACH DELETE n");

    console.log("Creating constraints...");
    await session.run("CREATE CONSTRAINT movie_id IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE");
    await session.run("CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE");
    await session.run("CREATE CONSTRAINT actor_name IF NOT EXISTS FOR (a:Actor) REQUIRE a.name IS UNIQUE");
    await session.run("CREATE CONSTRAINT director_name IF NOT EXISTS FOR (d:Director) REQUIRE d.name IS UNIQUE");
    await session.run("CREATE CONSTRAINT genre_name IF NOT EXISTS FOR (g:Genre) REQUIRE g.name IS UNIQUE");

    console.log(`Loading ${movies.length} movies (+ actors, directors, genres)...`);
    for (const movie of movies) {
      await session.run(
        `
        MERGE (m:Movie {id: $id})
        SET m.title = $title, m.year = $year

        MERGE (d:Director {name: $director})
        MERGE (m)-[:DIRECTED_BY]->(d)

        WITH m
        UNWIND $genres AS genreName
        MERGE (g:Genre {name: genreName})
        MERGE (m)-[:HAS_GENRE]->(g)

        WITH m
        UNWIND $actors AS actorName
        MERGE (a:Actor {name: actorName})
        MERGE (a)-[:ACTED_IN]->(m)
        `,
        movie
      );
    }

    console.log(`Loading ${users.length} users...`);
    for (const user of users) {
      await session.run("MERGE (u:User {id: $id}) SET u.name = $name", user);
    }

    console.log(`Loading ${ratings.length} ratings...`);
    for (const r of ratings) {
      await session.run(
        `
        MATCH (u:User {id: $user}), (m:Movie {id: $movie})
        MERGE (u)-[rated:RATED]->(m)
        SET rated.score = $score
        `,
        r
      );
    }

    console.log("✅ Seed complete.");
  } finally {
    await session.close();
    await closeDriver();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
