/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders', table => {
        table.increments('id').primary();
        table.integer('userId').unsigned().references('id').inTable('users');
        table.integer('productId').unsigned().references('id').inTable('products');
        table.integer('quantity').notNullable();
        table.date('orderDate').notNullable();
        table.string('status').defaultTo('Pending');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('orders');
};