import pg from 'pg'
const { Pool } = pg
 
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  max: 6,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export default pool;