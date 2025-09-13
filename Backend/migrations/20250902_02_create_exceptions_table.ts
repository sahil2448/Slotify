import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("exceptions", (table) => {
    table.increments("id").primary();
    table.integer("slot_id").unsigned().references("id").inTable("slots").onDelete("CASCADE");
    table.date("exception_date").notNullable();
    table.time("new_start_time").nullable();
    table.time("new_end_time").nullable();
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["slot_id", "exception_date"]); // prevent duplicates for same date
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("exceptions");
}
