// knexfile.ts
import type { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST || "127.0.0.1",
      port: Number(process.env.PG_PORT || 5432),
      user: process.env.PG_USER || "slotify_user",
      password: process.env.PG_PASSWORD || "password",
      database: process.env.PG_DATABASE || "slotify_db",
    },
    migrations: {
      extension: "ts",
      directory: "./migrations",
    },
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL as string,
      // Option A (preferred when CA is trusted by platform):
      ssl: true, // treated as sslmode=require by pg
      // Option B (only if you see cert errors from your host):
      // ssl: { rejectUnauthorized: false },
    },
    migrations: {
      extension: "ts",
      directory: "./migrations",
    },
    pool: { min: 2, max: 10 },
  },
};

export default config;
