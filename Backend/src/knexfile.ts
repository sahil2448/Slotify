// knexfile.ts
import type { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

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
    // If DATABASE_URL exists use it (string). Otherwise fall back to host object.
    connection: process.env.DATABASE_URL
      ? // pass a connection string — knex/pg will parse it correctly
        `${process.env.DATABASE_URL}`
      : {
          host: process.env.PG_HOST || "127.0.0.1",
          port: Number(process.env.PG_PORT || 5432),
          user: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
          database: process.env.PG_DATABASE,
        },
    // knex accepts `pool` and `migrations` same as below
    migrations: {
      extension: "ts",
      directory: "./migrations",
    },
    pool: { min: 2, max: 10 },
    // For runtime SSL we will provide client config in knex init (see src/db/knex.ts).
  },
};

export default config;
