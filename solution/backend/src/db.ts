import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './contacts.db',
      driver: sqlite3.Database
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        age INTEGER NOT NULL
      )
    `);
  }
  return db;
} 