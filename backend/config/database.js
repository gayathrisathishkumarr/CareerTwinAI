import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH 
  ? path.resolve(__dirname, '..', process.env.DB_PATH)
  : path.resolve(__dirname, '../../db/careertwin.db');

sqlite3.verbose();

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`❌ Failed to connect to SQLite database at ${dbPath}:`, err.message);
  } else {
    console.log(`✅ Connected to SQLite database at ${dbPath}`);
  }
});

// Enable foreign key constraints
db.run('PRAGMA foreign_keys = ON');

export default db;
