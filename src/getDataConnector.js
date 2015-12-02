import knex from 'knex';
import knexConfig from '../knexfile.js';

const node_env = process.env.NODE_ENV || 'development';

let db;

export default function () {
    db = db || knex(knexConfig[node_env]);
    return db;
}
