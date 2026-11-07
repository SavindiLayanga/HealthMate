import { getDatabase, webRecords ,getInitialSampleData} from "./database";
import { HealthRecord, NewHealthRecord } from "../types";

let nextId = 10;

export class HealthRecordRepository{
  static async create(record: NewHealthRecord): Promise<HealthRecord> {
    const db = await getDatabase();

    if(!db){
      const newRec:HealthRecord = {
        id: nextId++,
        Date: record.date.trim(),
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

    const records = await db.getallAsync<HealthRecord>(
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

    const records = await db.getallAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE date = ? ORDER BY id DESC',
      [date.trim()]
    );
    return records;
  }
}