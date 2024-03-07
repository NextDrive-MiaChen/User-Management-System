const { Pool } = require('pg');

const pool = new Pool({
    user: 'admin',
    host: 'Localhost',
    database: 'postgres',
    password: '12345',
    port: 5432, 
});

module.exports = pool;