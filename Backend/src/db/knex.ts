// src/db/knex.ts
import knex from "knex";
import config from "../knexfile"; // <-- removed .ts extension
import type { Knex } from "knex";

const environment = (process.env.NODE_ENV as string) || "development";
const cfg = config[environment] as Knex.Config;
console.log('Knex config:', config);
console.log('Environment:', process.env.NODE_ENV);

const db = knex(cfg);


export default db;