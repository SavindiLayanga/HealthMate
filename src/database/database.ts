
import { Platform } from 'react-native';
import type { SQLiteDatabase } from 'expo-sqlite';
import { HealthRecord } from '../types';

let SQLite: typeof import('expo-sqlite') | null = null;

try {
  SQLite = require('expo-sqlite');
} catch (e) {
  console.warn('ExpoSQLite native module not available.');
}

let dbInstance: SQLiteDatabase | null = null;
let webRecords: HealthRecord[] = [];

export async function getDatabase(): Promise<SQLiteDatabase | null> {
  if (Platform.OS === 'web' || !SQLite) {
    return null;
  }

  try {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabaseAsync('healthmate.db');
    }
    return dbInstance;
  } catch (err) {
    console.warn('Could not open SQLite database:', err);
    return null;
  }
}

export async function initDatabase(): Promise<void> {
  if (Platform.OS === 'web' || !SQLite) {
    return;
  }

  try {
    const db = await getDatabase();
    if (!db) return;

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS health_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        steps INTEGER NOT NULL,
        calories INTEGER NOT NULL,
        water INTEGER NOT NULL
      );
    `);

  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

export async function resetDatabaseWithDummyData(): Promise<void> {
  console.warn('Dummy data is disabled.');
}

export { webRecords };
