module.exports = {
    test: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:'
        }
    },

    development: {
        client: 'sqlite3',
        connection: {
            filename: './data/dev.sqlite3'
        }
    },

    production: {
        client: 'sqlite3',
        connection: {
            filename: './data/ipa-distribution.sqlite3'
        }
    }
};
