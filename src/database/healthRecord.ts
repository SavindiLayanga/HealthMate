import { getDatabase, webRecords } from './database';
import { HealthRecord, NewHealthRecord, HealthSummary } from '../types';

let nextId = 1;

export class HealthRecordRepositor {

  // create
  static async create(record: NewHealthRecord): Promise<number> {
    const db = await getDatabase();

    if (!db) {
      const newRec: HealthRecord = {
        id: nextId++,
        date: record.date.trim(),
        steps: Math.round(record.steps),
        calories: Math.round(record.calories),
        water: Math.round(record.water),
      };

      webRecords.unshift(newRec);
      return newRec.id;
    }

    const result = await db.runAsync(
      'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
      [
        record.date.trim(),
        Math.round(record.steps),
        Math.round(record.calories),
        Math.round(record.water)
      ]
    );

    return result.lastInsertRowId;
  }

  static async getAll(): Promise<HealthRecord[]> {
    const db = await getDatabase();

    if (!db) {
      return [...webRecords].sort((a, b) =>
        b.date.localeCompare(a.date)
      );
    }

    const records = await db.getAllAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records ORDER BY date DESC, id DESC'
    );

    return records;
  }

  // read bu id
  static async getById(id: number): Promise<HealthRecord | null> {
    const db = await getDatabase();

    if (!db) {
      return webRecords.find(record => record.id === id) || null;
    }

    const record = await db.getFirstAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE id = ?',
      [id]
    );

    return record || null;
  }

  // Rread by date
  static async getByDate(date: string): Promise<HealthRecord[]> {
    const db = await getDatabase();

    if (!db) {
      return webRecords.filter(record => record.date === date);
    }

    const records = await db.getAllAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE date = ? ORDER BY id DESC',
      [date.trim()]
    );

    return records;
  }

  // update
  static async update(record: HealthRecord): Promise<boolean> {
    const db = await getDatabase();

    if (!db) {
      const idx = webRecords.findIndex(r => r.id === record.id);

      if (idx !== -1) {
        webRecords[idx] = {
          id: record.id,
          date: record.date.trim(),
          steps: Math.round(record.steps),
          calories: Math.round(record.calories),
          water: Math.round(record.water),
        };

        return true;
      }

      return false;
    }

    const result = await db.runAsync(
      'UPDATE health_records SET date = ?, steps = ?, calories = ?, water = ? WHERE id = ?',
      [
        record.date.trim(),
        Math.round(record.steps),
        Math.round(record.calories),
        Math.round(record.water),
        record.id
      ]
    );

    return result.changes > 0;
  }

  // delete
  static async delete(id: number): Promise<boolean> {
    const db = await getDatabase();

    if (!db) {
      const initialLen = webRecords.length;
      const filtered = webRecords.filter(r => r.id !== id);

      webRecords.length = 0;
      webRecords.push(...filtered);

      return filtered.length < initialLen;
    }

    const result = await db.runAsync(
      'DELETE FROM health_records WHERE id = ?',
      [id]
    );

    return result.changes > 0;
  }

  static async searchByDate(query: string): Promise<HealthRecord[]> {
    const trimmed = query.trim();

    if (!trimmed) {
      return this.getAll();
    }

    const db = await getDatabase();

    if (!db) {
      return webRecords.filter(r => r.date.includes(trimmed));
    }

    const records = await db.getAllAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE date LIKE ? ORDER BY date DESC, id DESC',
      [`%${trimmed}%`]
    );

    return records;
  }

  static async getSummaryForDate(date: string): Promise<HealthSummary> {
    const db = await getDatabase();

    if (!db) {
      const match = webRecords.filter(r => r.date === date.trim());

      const totalSteps = match.reduce((sum, r) => sum + r.steps, 0);
      const totalCalories = match.reduce((sum, r) => sum + r.calories, 0);
      const totalWater = match.reduce((sum, r) => sum + r.water, 0);

      return {
        totalSteps,
        totalCalories,
        totalWater,
        recordCount: match.length,
      };
    }

    const result = await db.getFirstAsync<{
      totalSteps: number | null;
      totalCalories: number | null;
      totalWater: number | null;
      recordCount: number;
    }>(
      'SELECT SUM(steps) AS totalSteps, SUM(calories) AS totalCalories, SUM(water) AS totalWater, COUNT(*) AS recordCount FROM health_records WHERE date = ?',
      [date.trim()]
    );

    const count = result?.recordCount || 0;

    return {
      totalSteps: count > 0 ? (result?.totalSteps || 0) : 0,
      totalCalories: count > 0 ? (result?.totalCalories || 0) : 0,
      totalWater: count > 0 ? (result?.totalWater || 0) : 0,
      recordCount: count,
    };
  }

  // summary
  static async getOverallSummary(): Promise<HealthSummary> {
    const db = await getDatabase();

    if (!db) {
      const totalSteps = webRecords.reduce((sum, r) => sum + r.steps, 0);
      const totalCalories = webRecords.reduce((sum, r) => sum + r.calories, 0);
      const totalWater = webRecords.reduce((sum, r) => sum + r.water, 0);

      return {
        totalSteps,
        totalCalories,
        totalWater,
        recordCount: webRecords.length,
      };
    }

    const result = await db.getFirstAsync<{
      totalSteps: number | null;
      totalCalories: number | null;
      totalWater: number | null;
      recordCount: number;
    }>(
      'SELECT SUM(steps) AS totalSteps, SUM(calories) AS totalCalories, SUM(water) AS totalWater, COUNT(*) AS recordCount FROM health_records'
    );

    return {
      totalSteps: result?.totalSteps ?? 0,
      totalCalories: result?.totalCalories ?? 0,
      totalWater: result?.totalWater ?? 0,
      recordCount: result?.recordCount ?? 0,
    };
  }

  // quick add water
  static async quickAddWater(
    date: string,
    amountML: number = 250
  ): Promise<void> {
    const db = await getDatabase();

    if (!db) {
      const todayRec = webRecords.find(r => r.date === date);

      if (todayRec) {
        todayRec.water += amountML;
      } else {
        webRecords.unshift({
          id: nextId++,
          date,
          steps: 0,
          calories: 0,
          water: amountML,
        });
      }

      return;
    }

    const todayRec = await db.getFirstAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE date = ? ORDER BY id DESC LIMIT 1',
      [date]
    );

    if (todayRec) {
      await db.runAsync(
        'UPDATE health_records SET water = water + ? WHERE id = ?',
        [amountML, todayRec.id]
      );
    } else {
      await db.runAsync(
        'INSERT INTO health_records (date, steps, calories, water) VALUES (?, 0, 0, ?)',
        [date, amountML]
      );
    }
  }

  // update steps
  static async updateStepsForDate(
    date: string,
    newSteps: number
  ): Promise<void> {
    const trimmedDate = date.trim();
    const db = await getDatabase();

    if (!db) {
      const todayRec = webRecords.find(r => r.date === trimmedDate);

      if (todayRec) {
        webRecords.forEach(r => {
          if (r.date === trimmedDate) r.steps = 0;
        });

        todayRec.steps = Math.round(newSteps);
      } else {
        webRecords.unshift({
          id: nextId++,
          date: trimmedDate,
          steps: Math.round(newSteps),
          calories: 0,
          water: 0,
        });
      }

      return;
    }

    const latestToday = await db.getFirstAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE date = ? ORDER BY id DESC LIMIT 1',
      [trimmedDate]
    );

    if (latestToday) {
      await db.runAsync(
        'UPDATE health_records SET steps = 0 WHERE date = ? AND id != ?',
        [trimmedDate, latestToday.id]
      );

      await db.runAsync(
        'UPDATE health_records SET steps = ? WHERE id = ?',
        [Math.round(newSteps), latestToday.id]
      );
    } else {
      await db.runAsync(
        'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, 0, 0)',
        [trimmedDate, Math.round(newSteps)]
      );
    }
  }

  // update calories
  static async updateCaloriesForDate(
    date: string,
    newCalories: number
  ): Promise<void> {
    const trimmedDate = date.trim();
    const roundedCalories = Math.round(newCalories);
    const db = await getDatabase();

    if (!db) {
      const todayRec = webRecords.find(r => r.date === trimmedDate);

      if (todayRec) {
        webRecords.forEach(r => {
          if (r.date === trimmedDate) r.calories = 0;
        });

        todayRec.calories = roundedCalories;
      } else {
        webRecords.unshift({
          id: nextId++,
          date: trimmedDate,
          steps: 0,
          calories: roundedCalories,
          water: 0,
        });
      }

      return;
    }

    const latestToday = await db.getFirstAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE date = ? ORDER BY id DESC LIMIT 1',
      [trimmedDate]
    );

    if (latestToday) {
      await db.runAsync(
        'UPDATE health_records SET calories = 0 WHERE date = ? AND id != ?',
        [trimmedDate, latestToday.id]
      );

      await db.runAsync(
        'UPDATE health_records SET calories = ? WHERE id = ?',
        [roundedCalories, latestToday.id]
      );
    } else {
      await db.runAsync(
        'INSERT INTO health_records (date, steps, calories, water) VALUES (?, 0, ?, 0)',
        [trimmedDate, roundedCalories]
      );
    }
  }

  // update water
  static async updateWaterForDate(
    date: string,
    newWater: number
  ): Promise<void> {
    const trimmedDate = date.trim();
    const roundedWater = Math.round(newWater);
    const db = await getDatabase();

    if (!db) {
      const todayRec = webRecords.find(r => r.date === trimmedDate);

      if (todayRec) {
        webRecords.forEach(r => {
          if (r.date === trimmedDate) r.water = 0;
        });

        todayRec.water = roundedWater;
      } else {
        webRecords.unshift({
          id: nextId++,
          date: trimmedDate,
          steps: 0,
          calories: 0,
          water: roundedWater,
        });
      }

      return;
    }

    const latestToday = await db.getFirstAsync<HealthRecord>(
      'SELECT id, date, steps, calories, water FROM health_records WHERE date = ? ORDER BY id DESC LIMIT 1',
      [trimmedDate]
    );

    if (latestToday) {
      await db.runAsync(
        'UPDATE health_records SET water = 0 WHERE date = ? AND id != ?',
        [trimmedDate, latestToday.id]
      );

      await db.runAsync(
        'UPDATE health_records SET water = ? WHERE id = ?',
        [roundedWater, latestToday.id]
      );
    } else {
      await db.runAsync(
        'INSERT INTO health_records (date, steps, calories, water) VALUES (?, 0, 0, ?)',
        [trimmedDate, roundedWater]
      );
    }
  }
}
