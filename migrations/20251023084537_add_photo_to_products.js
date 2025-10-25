/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('products', function(table) {
        table.string('photo').nullable(); // stores filename or URL
    });
};

exports.down = function(knex) {
    return knex.schema.table('products', function(table) {
        table.dropColumn('photo');
    });
};