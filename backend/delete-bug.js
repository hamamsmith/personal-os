require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const res = await pool.query("DELETE FROM debriefs WHERE timestamp::text LIKE '2026-07-22%'");
    console.log(`Deleted ${res.rowCount} debriefs for tomorrow.`);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
