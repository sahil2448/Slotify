import knex from "knex";
import config from "../../knexfile.ts";

const environment = process.env.NODE_ENV || "development";
const db = knex(config[environment]);

export default db;
