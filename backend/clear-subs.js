require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const res = await pool.query("DELETE FROM push_subscriptions");
    console.log(`✅ Berhasil menghapus ${res.rowCount} data langganan notifikasi lama.`);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
