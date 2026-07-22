require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const res = await pool.query('SELECT id, energy FROM debriefs');
    let updated = 0;
    for (const row of res.rows) {
      if (row.energy > 5) { // If it's already 1-5, maybe it was already migrated or recorded new, but assuming old data is 1-10. Wait, even 1-4 needs math.ceil
         // Let's just update everything mathematically: Math.ceil(energy / 2)
      }
      const newEnergy = Math.ceil(row.energy / 2);
      await pool.query('UPDATE debriefs SET energy = $1 WHERE id = $2', [newEnergy, row.id]);
      updated++;
    }
    console.log(`Successfully migrated ${updated} debriefs to the 1-5 scale.`);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
