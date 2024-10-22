const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '54.254.162.138', // ไม่ใช่ 127.0.0.1
  database: 'stockdb',
  password: 'Ntw0622433755.',
  port: 5432,
});
  
module.exports = pool;
