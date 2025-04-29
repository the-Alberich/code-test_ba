import Database from 'better-sqlite3';

const db = new Database('logs.db');

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    userName TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL
  )
`);

export default db;
