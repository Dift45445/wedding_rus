import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Or use individual params:
  // host: process.env.DB_HOST || 'localhost',
  // port: process.env.DB_PORT || 5432,
  // database: process.env.DB_NAME || 'sakeenah',
  // user: process.env.DB_USER || 'postgres',
  // password: process.env.DB_PASSWORD || 'postgres',
})

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message)
  } else {
    console.log('✅ Database connected at:', res.rows[0].now)
  }
})

export default pool