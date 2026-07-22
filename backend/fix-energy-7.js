require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await pool.query("UPDATE debriefs SET energy = 4 WHERE id = 7");
    console.log(`Fixed the energy for id 7 to 4.`);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
