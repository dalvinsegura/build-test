import { Pool, Client } from 'pg';

export const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'user',
    database: 'instarecibo_db_test'
})


