import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("slots", (table) => {
    table.increments("id").primary();
    table.integer("day_of_week").notNullable(); // 0=Sun .. 6=Sat
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("slots");
}
