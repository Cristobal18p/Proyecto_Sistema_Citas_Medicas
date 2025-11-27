import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Evento de conexión
pool.on('connect', () => {
  console.log('Conectado a PostgreSQL');
});

// Evento de error
pool.on('error', (err) => {
  console.error('Error en la conexión a PostgreSQL', err);
});

export default pool;
