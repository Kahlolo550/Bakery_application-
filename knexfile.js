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
            host: 'mysql.railway.internal',
            user: 'root',
            password: 'BQYUYgyrghmpbbEUhJXAWkgZrqXZERzg',
            database: 'railway',
            port: 3306
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