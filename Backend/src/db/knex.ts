// src/db/knex.ts
import knex from "knex";
import config from "../knexfile"; // removed extension intentionally
import type { Knex } from "knex";

const environment = (process.env.NODE_ENV as string) || "development";
const cfg = config[environment] as Knex.Config;

console.log("Knex environment:", environment);
console.log("Using DATABASE_URL present?:", !!process.env.DATABASE_URL);

// If in production and DATABASE_URL is set, ensure pg uses SSL
if (environment === "production" && process.env.DATABASE_URL) {
  // knex doesn't expose a dedicated `ssl` top-level option; we provide client config
  // by merging into the cfg.connection when it's a string.
  if (typeof cfg.connection === "string") {
    // leave the connection string as-is; we will instruct pg to accept the cert later
    // by setting PGSSLMODE or using pg client config at runtime if needed.
  } else if (typeof cfg.connection === "object" && cfg.connection !== null) {
    // If you have an object here, ensure ssl is present for pg
    (cfg.connection as any).ssl = { rejectUnauthorized: false };
  }
}

// Create knex instance
const db = knex(cfg);

// Optional: test DB connection at startup (uncomment to use)
// (async () => {
//   try {
//     await db.raw("SELECT 1+1 AS result");
//     console.log("DB connection OK");
//   } catch (err: any) {
//     console.error("DB connection failed — check DATABASE_URL or DB env vars:", err.message || err);
//     process.exit(1);
//   }
// })();

export default db;
