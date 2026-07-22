require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const res = await pool.query('SELECT id, mood FROM debriefs');
    let updated = 0;
    for (const row of res.rows) {
      let e = 3;
      if (row.mood === '😁') e = 5;
      else if (row.mood === '🙂') e = 4;
      else if (row.mood === '😐') e = 3;
      else if (row.mood === '😕') e = 2;
      else if (row.mood === '😞') e = 1;
      
      await pool.query('UPDATE debriefs SET energy = $1 WHERE id = $2', [e, row.id]);
      updated++;
    }
    console.log(`Successfully mapped ${updated} debriefs energy to their mood emojis.`);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
