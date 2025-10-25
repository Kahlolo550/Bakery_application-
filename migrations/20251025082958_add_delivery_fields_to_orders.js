/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
    return knex.schema.alterTable('orders', function(table) {
        table.text('address').nullable();
        table.string('phone', 20).nullable();
        table.text('note').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('orders', function(table) {
        table.dropColumn('address');
        table.dropColumn('phone');
        table.dropColumn('note');
    });
};