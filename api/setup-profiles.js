const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        account_ref text UNIQUE NOT NULL,
        name text NOT NULL,
        birth_date date,
        joined_at date,
        platform text NOT NULL DEFAULT 'android',
        username text,
        last_seen_at timestamptz,
        last_login_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS profiles_joined_at_idx
      ON profiles (joined_at DESC NULLS LAST)
    `);

    // Kolom untuk deployment lama yang tabelnya sudah ada
    await pool.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username text`);
    await pool.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamptz`);
    await pool.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at timestamptz`);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS profiles_last_seen_idx
      ON profiles (last_seen_at DESC NULLS LAST)
    `);

    const cols = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' ORDER BY ordinal_position"
    );
    console.log('Tabel profiles siap. Kolom:', cols.rows.map((r) => r.column_name).join(', '));
  } catch (err) {
    console.error('Gagal menyiapkan tabel profiles:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
