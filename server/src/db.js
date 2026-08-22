import neo4j from "neo4j-driver";
import "dotenv/config";

const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env;

if (!NEO4J_URI || !NEO4J_USER || !NEO4J_PASSWORD) {
  console.error(
    "Missing NEO4J_URI / NEO4J_USER / NEO4J_PASSWORD env vars. Copy .env.example to .env and fill in your CognoDB credentials."
  );
  process.exit(1);
}

// CognoDB speaks openCypher over Bolt, so the official Neo4j driver works unmodified.
export const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD),
  { maxConnectionPoolSize: 20, disableLosslessIntegers: true }
);

// Verify connectivity once at boot so failures show up immediately instead of
// surfacing as a confusing error on the first API request.
export async function verifyConnection() {
  try {
    await driver.verifyConnectivity();
    console.log("✅ Connected to CognoDB");
    return true;
  } catch (err) {
    console.error("❌ Could not connect to CognoDB:", err.message);
    return false;
  }
}

// Small helper so every route uses parameterised Cypher through a fresh session
// and always closes it, even if the query throws.
export async function runQuery(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}

export async function closeDriver() {
  await driver.close();
}
