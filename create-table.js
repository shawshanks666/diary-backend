// create-tables.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
        user_id BIGSERIAL PRIMARY KEY,
        username VARCHAR NOT NULL DEFAULT '',
        email_address VARCHAR NOT NULL DEFAULT '',
        password VARCHAR NOT NULL DEFAULT '',
        salt BYTEA NOT NULL,
        lastEntryDate DATE,
        streak INT NOT NULL DEFAULT 0,
        role VARCHAR NOT NULL DEFAULT 'user'
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS diaries (
        entry_id BIGSERIAL PRIMARY KEY,
        date DATE NOT NULL,
        diaryEntry BYTEA NOT NULL,
        mood INT,
        rating INT,
        count INT,
        iv BYTEA NOT NULL,
        user_id BIGINT REFERENCES users(user_id)
    );
  `);

  console.log('Tables created!');
  await client.end();
}

main().catch(console.error);
