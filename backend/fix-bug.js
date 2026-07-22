require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await pool.query("UPDATE debriefs SET timestamp = '2026-07-21 12:00:00' WHERE id = 7");
    console.log(`Fixed the timestamp for id 7 to 12:00:00.`);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
