import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.PG_URI;
const pgPool = new Pool({ connectionString });

export default pgPool;
