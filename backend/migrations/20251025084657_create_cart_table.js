/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
    return knex.schema.createTable('cart', function(table) {
        table.increments('id').primary();
        table.integer('userId').unsigned().notNullable();
        table.integer('productId').unsigned().notNullable();
        table.integer('quantity').unsigned().defaultTo(1);
        table.timestamp('added_at').defaultTo(knex.fn.now());

        table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('productId').references('id').inTable('products').onDelete('CASCADE');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cart');
};