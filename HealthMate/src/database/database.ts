import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { HealthRecord } from '../types';

let dbInstance: SQLite.SQLiteDatabase | null = null;

// In-memory / web fallback store for browser preview
let webRecords: HealthRecord[] = [];

/**
 * Returns the open SQLite database connection singleton on native devices.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase | null> {
  if (Platform.OS === 'web') {
    return null;
  }
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('healthmate.db');
  }
  return dbInstance;
}

/**
 * Helper to get a formatted date string (YYYY-MM-DD) for n days ago.
 */
export function getDateNDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Default sample records for initial testing (matches Coursework scenario)
 */
export function getInitialSampleData(): HealthRecord[] {
  return [
    { id: 1, date: getDateNDaysAgo(0), steps: 7850, calories: 420, water: 2000 }, // Today (Scenario example)
    { id: 2, date: getDateNDaysAgo(1), steps: 9400, calories: 510, water: 2500 }, // Yesterday
    { id: 3, date: getDateNDaysAgo(2), steps: 6200, calories: 340, water: 1800 },
    { id: 4, date: getDateNDaysAgo(3), steps: 8100, calories: 450, water: 2200 },
    { id: 5, date: getDateNDaysAgo(4), steps: 10500, calories: 600, water: 3000 },
    { id: 6, date: getDateNDaysAgo(5), steps: 5300, calories: 290, water: 1500 },
    { id: 7, date: getDateNDaysAgo(6), steps: 7200, calories: 390, water: 2100 },
  ];
}

/**
 * Initializes the SQLite database on native platforms, or memory store on web.
 */
export async function initDatabase(): Promise<void> {
  if (Platform.OS === 'web') {
    if (webRecords.length === 0) {
      webRecords = getInitialSampleData();
    }
    return;
  }

  try {
    const db = await getDatabase();
    if (!db) return;

    // Enable Write-Ahead Logging (WAL) for high performance and concurrency
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

    // Check if records already exist
    const countResult = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM health_records'
    );

    if (countResult && countResult.count === 0) {
      await seedDummyRecords();
    }
  } catch (err) {
    console.warn('Native SQLite init fallback:', err);
    webRecords = getInitialSampleData();
  }
}

/**
 * Seeds realistic dummy health records for initial testing.
 */
export async function seedDummyRecords(): Promise<void> {
  if (Platform.OS === 'web') {
    webRecords = getInitialSampleData();
    return;
  }

  try {
    const db = await getDatabase();
    if (!db) return;

    const dummyRecords = getInitialSampleData();

    for (const record of dummyRecords) {
      await db.runAsync(
        'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
        [record.date, record.steps, record.calories, record.water]
      );
    }
  } catch (err) {
    console.warn('Native seed fallback:', err);
    webRecords = getInitialSampleData();
  }
}

/**
 * Clears and re-seeds dummy records (useful for test resets).
 */
export async function resetDatabaseWithDummyData(): Promise<void> {
  if (Platform.OS === 'web') {
    webRecords = getInitialSampleData();
    return;
  }

  try {
    const db = await getDatabase();
    if (!db) {
      webRecords = getInitialSampleData();
      return;
    }
    await db.runAsync('DELETE FROM health_records');
    await seedDummyRecords();
  } catch {
    webRecords = getInitialSampleData();
  }
}

export { webRecords };