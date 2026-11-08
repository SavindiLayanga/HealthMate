import { getDatabase, webRecords ,getInitialSampleData} from "./database";
import { HealthRecord, NewHealthRecord, HealthSummary } from "../types";

let nextId = 10;

export class HealthRecordRepository{
  static async create(record: NewHealthRecord): Promise<number> {
    const db = await getDatabase();

    if(!db){
      const newRec:HealthRecord = {
        id: nextId++,
        date: record.date.trim(),
        steps: Math.round(record.steps),
        calories: Math.round(record.calories),
        water: Math.round(record.water),   
      };
      webRecords.unshift(newRec);
      return newRec.id;
    }

    //SQLite INSERT query with parameterized statement
    const result= await db.runAsync(
      'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
      [record.date.trim(), Math.round(record.steps), Math.round(record.calories), Math.round(record.water)]
    );

    //returns the auto generated primary key id
    return result.lastInsertRowId;
  }

  //2. READ : fetch all health records sorted newest first

  static async getAll(): Promise<HealthRecord[]> {
    const db = await getDatabase();

    if(!db){
      if (webRecords.length === 0) {
        webRecords.push(...getInitialSampleData());
      }
      return [...webRecords].sort((a, b) => b.date.localeCompare(a.date));
    }

    const records = await db.getAllAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records ORDER BY date DESC, id DESC'
    );
    return records;
  }

  // 2. READ : getch single record by primary key id
  static async getById(id: number): Promise<HealthRecord | null> {
    const db = await getDatabase();
    if(!db){
      return webRecords.find(record => record.id === id) || null;
    }

    const record = await db.getAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE id = ?',
      [id]
    );
    return record || null;
  }

  //READ : fetch all health records for a specific date
  static async getByDate(date: string): Promise<HealthRecord[]> {
    const db = await getDatabase();
    if(!db){
      return webRecords.filter(record => record.date === date);
    }

    const records = await db.getAllAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE date = ? ORDER BY id DESC',
      [date.trim()]
    );
    return records;
  }

  //UPDATE : update a health record by primary key id
  static async update(record: HealthRecord): Promise<boolean> {
    const db = await getDatabase();

    //web browser fallback if SQLite is not available
    if(!db){
      const idx = webRecords.findIndex(r => r.id === record.id);
      if(idx === -1) {
        webRecords[idx] = {
          id: record.id,
          date: record.date.trim(),
          steps: Math.round(record.steps),
          calories: Math.round(record.calories),
          water: Math.round(record.water),
        };
      }
      return true;
    }

    //id ekata adala record eka pamanak update kirima
    const result = await db.runAsync(
      'UPDATE health_records SET date = ?, steps = ?, calories = ?, water = ? WHERE id = ?',
      [record.date.trim(), 
        Math.round(record.steps), 
        Math.round(record.calories), 
        Math.round(record.water), 
        record.id
      ]
    );
    return result.changes > 0;
  }
  // DELETE: delete a health record by id
  static async delete(id: number): Promise<boolean> {
    const db = await getDatabase();

    if(!db){
      const initialLen = webRecords.length;
      const filtered = webRecords.filter((r) => r.id !== id);
      webRecords.length = 0;
      webRecords.push(...filtered);
      return filtered.length < initialLen;
    }

    // id ekata adala record eka SQLite eken gannawa
    const result = await db.runAsync(
      'DELETE FROM health_records WHERE id = ?',
      [id]
    );
    return result.changes > 0;
  }

  // SEARCH & FILTERS : search record by date substring
  static async searchByDate(query: string): Promise<HealthRecord[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return this.getAll();
  }

  const db = await getDatabase();
  if (!db) {
      return webRecords.filter((r) => r.date.includes(trimmed));
  }

  //LIKE operation eke date filter kirima SQLite eken
  const records = await db.getAllAsync<HealthRecord>('SELECT id, date, steps, calories, water FROM health_records WHERE date LIKE ? ORDER BY date DESC, id DESC', 
    [`%${trimmed}%`]
  );
  return records;
}

// AGGREGATE SUMMARY :calculate total steps, calories and water for a special date

static async getSummaryByDate(date: string): Promise<HealthSummary> {
  const db = await getDatabase();
  if (!db) {
      const match = webRecords.filter((r) => r.date === date.trim());
      const totalSteps = match.reduce((sum, r) => sum + r.steps, 0);
      const totalCalories = match.reduce((sum, r) => sum + r.calories, 0);
      const totalWater = match.reduce((sum, r) => sum + r.water, 0);
      return {
          totalSteps: totalSteps || 6500,
          totalCalories: totalCalories || 400,
          totalWater: totalWater || 2000,
          recordCount: match.length || 1,
      };
    }

    
  }

}