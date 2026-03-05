import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/postgres',
});

async function createDb() {
  try {
    const res = await pool.query("SELECT 1 FROM pg_database WHERE datname = 'sakeenah'");
    if (res.rowCount === 0) {
      console.log('Creating database sakeenah...');
      await pool.query('CREATE DATABASE sakeenah');
      console.log('Database sakeenah created!');
    } else {
      console.log('Database sakeenah already exists.');
    }
  } catch (err) {
    console.error('Failed to create database:', err);
  } finally {
    await pool.end();
  }
}

createDb();
