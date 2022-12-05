// import fs async
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  host: process.env['DB_HOST'],
  database: process.env['DB_NAME'],
  port: parseInt(process.env['DB_PORT'] || ""),
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD']
});

async function loadDump() {
  const BASE_URL = path.join(__dirname, 'pg_init');
  const pgSchema = await fs.readFile(path.join(BASE_URL, 'pg_schema.sql'), 'utf8');
  const pgDump = await fs.readFile(path.join(BASE_URL, 'pg_dump.sql'), 'utf8');

  // Create tables
  await pool.query(pgSchema);

  // Insert data
  await pool.query(pgDump);

  // Close connection
  await pool.end();
}

loadDump().catch(console.error);