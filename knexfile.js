/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'sweet_crust_db'
        },
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },

    production: {
        client: 'mysql2',
        connection: {
            host: 'maglev.proxy.rlwy.net',
            port: 15527,
            user: 'root',
            password: 'BQYUYgyrghmpbbEUhJXAWkgZrqXZERzg',
            database: 'railway'
        },
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './seeds'
        }
    }
};