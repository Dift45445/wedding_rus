import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars if needed (dotenv is not in dependencies, assuming environment has them or defaults)
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/sakeenah';

const pool = new pg.Pool({
  connectionString,
});

async function migrate() {
  try {
    const sqlPath = path.join(__dirname, '../src/server/db/migrations/002-add-program-column.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration: 002-add-program-column.sql');
    await pool.query(sql);
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
