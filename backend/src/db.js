import pg from 'pg';
const { Pool } = pg;


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CoffeHouse',
  password: 'senai',
  port: 5432,
});


export default pool;


