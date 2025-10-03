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
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { 
      extension: 'ts', // Keep as 'ts' if you're running with ts-node in production
      directory: './migrations' // Use same directory
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};

export default config;