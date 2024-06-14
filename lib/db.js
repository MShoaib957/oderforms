import pg from "pg";
// const { Client } = pg;

// const client = new Client({
//   user: "postgres",
//   password: "erp12345",
//   host: process.env.PGHOST,
//   port: 5432,
//   database: "mydb",
// });

// export const db = await client.connect();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,
  max: 10, // maximum number of clients in the pool
  idleTimeoutMillis: 10000, // how long a client is allowed to remain idle before being closed
});

export default pool;
