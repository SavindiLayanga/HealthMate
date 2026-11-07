import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { HealthRecord, NewHealthRecord, HealthSummary, DailyGoals } from '../types';
import { HealthRecordRepository } from '../database/healthRecord';
import { initDatabase, resetDatabaseWithDummyData } from '../database/database';
import { getTodayDateString } from '../utils/validation';
import { DEFAULT_GOALS } from '../constants/theme';

interface HealthContextType {
  records: HealthRecord[];
  filteredRecords: HealthRecord[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  todaySummary: HealthSummary;
  overallSummary: HealthSummary;
  isLoading: boolean;
  selectedRecord: HealthRecord | null;
  setSelectedRecord: (record: HealthRecord | null) => void;
  goals: DailyGoals;
  updateGoals: (goals: DailyGoals) => void;
  refreshRecords: () => Promise<void>;
  addRecord: (record: NewHealthRecord) => Promise<boolean>;
  updateRecord: (record: HealthRecord) => Promise<boolean>;
  deleteRecord: (id: number) => Promise<boolean>;
  quickAddWater: (amountMl?: number) => Promise<void>;
  resetWithDummyData: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [todaySummary, setTodaySummary] = useState<HealthSummary>({
    totalSteps: 0,
    totalCalories: 0,
    totalWater: 0,
    recordCount: 0,
  });
  const [overallSummary, setOverallSummary] = useState<HealthSummary>({
    totalSteps: 0,
    totalCalories: 0,
    totalWater: 0,
    recordCount: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [goals, setGoals] = useState<DailyGoals>(DEFAULT_GOALS);

  /**
   * Refreshes all records and calculated summaries from SQLite
   */
  const refreshRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      const all = await HealthRecordRepository.getAll();
      setRecords(all);

      // Apply current search filter
      if (searchQuery.trim()) {
        const filtered = await HealthRecordRepository.searchByDate(searchQuery);
        setFilteredRecords(filtered);
      } else {
        setFilteredRecords(all);
      }

      // Calculate today's summary
      const today = getTodayDateString();
      const todayStats = await HealthRecordRepository.getSummaryForDate(today);
      setTodaySummary(todayStats);

      // Calculate overall summary
      const overall = await HealthRecordRepository.getOverallSummary();
      setOverallSummary(overall);
    } catch (error) {
      console.error('Failed to load health records from SQLite:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // Initial load: initialize SQLite schema and seed if empty
  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        await refreshRecords();
      } catch (err) {
        console.error('Database setup failed:', err);
      }
    }
    setup();
  }, []);

  // Update filtered records when searchQuery changes
  useEffect(() => {
    async function filter() {
      if (!searchQuery.trim()) {
        setFilteredRecords(records);
      } else {
        const filtered = await HealthRecordRepository.searchByDate(searchQuery);
        setFilteredRecords(filtered);
      }
    }
    filter();
  }, [searchQuery, records]);

  /**
   * CREATE: Adds a new record
   */
  const addRecord = async (newRecord: NewHealthRecord): Promise<boolean> => {
    try {
      await HealthRecordRepository.create(newRecord);
      await refreshRecords();
      return true;
    } catch (error) {
      console.error('Failed to add record:', error);
      return false;
    }
  };

  /**
   * UPDATE: Updates an existing record
   */
  const updateRecord = async (record: HealthRecord): Promise<boolean> => {
    try {
      const success = await HealthRecordRepository.update(record);
      if (success) {
        setSelectedRecord(null);
        await refreshRecords();
      }
      return success;
    } catch (error) {
      console.error('Failed to update record:', error);
      return false;
    }
  };

  /**
   * DELETE: Deletes a record by ID
   */
  const deleteRecord = async (id: number): Promise<boolean> => {
    try {
      const success = await HealthRecordRepository.delete(id);
      if (success) {
        await refreshRecords();
      }
      return success;
    } catch (error) {
      console.error('Failed to delete record:', error);
      return false;
    }
  };

  /**
   * BONUS: Quick-add water for today
   */
  const quickAddWater = async (amountMl: number = 250): Promise<void> => {
    try {
      const today = getTodayDateString();
      await HealthRecordRepository.quickAddWater(today, amountMl);
      await refreshRecords();
    } catch (error) {
      console.error('Failed to quick-add water:', error);
    }
  };

  /**
   * BONUS: Reset database with fresh dummy data
   */
  const resetWithDummyData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await resetDatabaseWithDummyData();
      await refreshRecords();
    } catch (error) {
      console.error('Failed to reset dummy records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoals = (newGoals: DailyGoals) => {
    setGoals(newGoals);
  };

  return (
    <HealthContext.Provider
      value={{
        records,
        filteredRecords,
        searchQuery,
        setSearchQuery,
        todaySummary,
        overallSummary,
        isLoading,
        selectedRecord,
        setSelectedRecord,
        goals,
        updateGoals,
        refreshRecords,
        addRecord,
        updateRecord,
        deleteRecord,
        quickAddWater,
        resetWithDummyData,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export function useHealth(): HealthContextType {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}
