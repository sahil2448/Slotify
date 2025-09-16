"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    development: {
        client: "pg",
        connection: {
            host: process.env.PG_HOST || "127.0.0.1",
            port: Number(process.env.PG_PORT || 5432),
            user: process.env.PG_USER || "slotify_user",
            password: process.env.PG_PASSWORD || "slotify_pass",
            database: process.env.PG_DATABASE || "slotify_db",
        },
        migrations: {
            extension: "ts",
            directory: "./migrations",
        },
    },
};
exports.default = config;
