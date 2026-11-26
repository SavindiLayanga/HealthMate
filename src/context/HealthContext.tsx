import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { HealthRecord, NewHealthRecord, HealthSummary, DailyGoals } from '../types';
import { HealthRecordRepositor as HealthRecordRepository } from '../database/healthRecord';
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
  selectedDate: string;
  setSelectedDate: (date: string) =>void;
  selectedDateSummary: HealthSummary;
  isLoading: boolean;
  isInitializing: boolean;
  selectedRecord: HealthRecord | null;
  setSelectedRecord: (react: HealthRecord | null) => void;
  goals: DailyGoals;
  updateGoals: (goals: DailyGoals) => void;
  updateSteps: (steps: number, targetDate?: string) => Promise<void>;
  refreshRecords: () => Promise<void>;
  addRecord: (record: NewHealthRecord) => Promise<boolean>;
  updateRecord: (record: HealthRecord) => Promise<boolean>;
  deleteRecord: (id: number) => Promise<boolean>;
  quickAddWater: (amountML?: number) => Promise<void>;
  updateTodaySteps: (newSteps: number, targetDate?: string) => Promise<void>;
  updateTodayCalories: (newCalories: number, targetDate?: string) => Promise<void>;
  updateTodayWater: (newWater: number, targetDate?: string) => Promise<void>;
  resetWithDummyData: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {  
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  const [todaySummary, setTodaySummary] = useState<HealthSummary>({
    totalSteps: 0,
    totalCalories: 0,
    totalWater: 0,
    recordCount: 0,
  });

  const [selectedDateSummary, setSelectedDateSummary] = useState<HealthSummary>({
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
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [goals, setGoals] = useState<DailyGoals>(DEFAULT_GOALS);  

  const refreshRecords = useCallback(async () => {
    try{
      setIsLoading(true);
      const all = await HealthRecordRepository.getAll();
      setRecords(all);
  
      if (searchQuery.trim()) {
        const filtered = await HealthRecordRepository.searchByDate(searchQuery);
        setFilteredRecords(filtered);
      }else {
        setFilteredRecords(all);
      }

      const today = getTodayDateString();
      const todayStats = await HealthRecordRepository.getSummaryForDate(today);
      setTodaySummary(todayStats);

      const selectedStats =
      selectedDate === today
      ? todayStats
      :await HealthRecordRepository.getSummaryForDate(selectedDate);
      setSelectedDateSummary(selectedStats);

      const overall = await HealthRecordRepository.getOverallSummary();
      setOverallSummary(overall);
    }catch (error) {
      console.error('Failed to load health records from SQLite:', error);
    }finally{
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    async function setup(){
      try{
        await initDatabase();
        await refreshRecords();
      }catch (err) {
        console.error('Database setup failed:', err);
      }
    }
    setup();
  },[]);

  useEffect(() =>{
    async function updateSelectedSummary(){
      try {
        const stats = await HealthRecordRepository.getSummaryForDate(selectedDate);
        setSelectedDateSummary(stats);
      } catch (err) {
        console.error('Failed to update selected date summary:', err);
      }
    }
    updateSelectedSummary();
  }, [selectedDate]);

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

//CREATE
const addRecord = async (newRecord: NewHealthRecord):Promise<boolean> =>{
  try{
    await HealthRecordRepository.create(newRecord);
    await refreshRecords();
    return true;
  }catch (error) {
    console.error('Faild to add record', error);
    return false;
  }
};

//UPDATE
const updateRecord = async (record: HealthRecord): Promise<boolean> => {
  try{
    const success = await HealthRecordRepository.update(record);
    if (success) {
      setSelectedRecord(null);
      await refreshRecords();
    }
    return success;
  }catch (error) {
    console.error('Failed to update record:', error);
    return false;
  }
};

// DELETE
const deleteRecord = async (id: number): Promise<boolean> => {
  try{
    const success = await HealthRecordRepository.delete(id);
    if (success) {
      await refreshRecords();
    }
    return success;
  }catch (error) {
    console.error('Failed to delete record:', error);
    return false;
  }
};

//Quick add water for today
const quickAddWater = async (amountMl: number = 250, targetDate?: string): Promise<void> => {
  try {
    const dateToUse = targetDate || selectedDate || getTodayDateString();
    await HealthRecordRepository.quickAddWater(dateToUse, amountMl);
    await refreshRecords();
  } catch (error) {
    console.error('Failed to quick add water:', error); 
  }
};

const resetWithDummyData = async (): Promise<void> => {
  try{
    await resetDatabaseWithDummyData();
    await refreshRecords();
  }catch (error) {
    console.error('Failed to reset database with dummy data:', error);
  }finally{
    setIsLoading(false);
  }
};
const updateGoals = (newGoals: DailyGoals) => {
  setGoals(newGoals);
};

// Update steps
const updateSteps = async (steps: number, targetDate?: string): Promise<void> => {
  try {
    const dateToUse = targetDate || selectedDate || getTodayDateString();
    await HealthRecordRepository.updateStepsForDate(dateToUse, steps);
    await refreshRecords();
  } catch (error) {
    console.error('Failed to update steps:', error);
  }
};

// Update calories
const updateCalories = async (calories: number, targetDate?: string): Promise<void> => {
  try {
    const dateToUse = targetDate || selectedDate || getTodayDateString();
    await HealthRecordRepository.updateCaloriesForDate(dateToUse, calories);
    await refreshRecords();
  } catch (error) {
    console.error('Failed to update calories:', error);
  }
};

// Update water
const updateWater = async (water: number, targetDate?: string): Promise<void> => {
  try {
    const dateToUse = targetDate || selectedDate || getTodayDateString();
    await HealthRecordRepository.updateWaterForDate(dateToUse, water);
    await refreshRecords();
  } catch (error) {
    console.error('Failed to update water:', error);
  }
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
      selectedDate,
      setSelectedDate,
      selectedDateSummary,
      isLoading,
      isInitializing,
      selectedRecord,
      setSelectedRecord,
      goals,
      updateGoals,
      updateSteps,
      updateTodaySteps: updateSteps,
      updateTodayCalories: updateCalories,
      updateTodayWater: updateWater,
      refreshRecords,
      addRecord,
      updateRecord,
      deleteRecord,
      quickAddWater,
      resetWithDummyData
    }}
  >
    {children}
  </HealthContext.Provider>
);
};

export function useHealth(): HealthContextType {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealthContext must be used within a HealthProvider');
  }
  return context;
}
