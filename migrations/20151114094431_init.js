
exports.up = function(knex, Promise) {
    return knex.schema.createTable('urls', function (table) {
        table.string('long_url').notNullable().primary();
        table.string('short_url').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('urls');
};
