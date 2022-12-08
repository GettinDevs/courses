// Connect to the database using PG client
import { Pool } from 'pg';
import { config } from '../config';

export const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
});