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
  selectRecord: (react: HealthRecord | null);
  goals: DailyGoals;
  updateGoals: (goals: DailyGoals) => void;
  refreshRecords: () => Promise<void>;
  addRecord: (record: NewHealthRecord) => Promise<void>;
  updateRecord: (record: HealthRecord) => Promise<boolean>;
  deleteRecord: (id: number) => Promise<boolean>;
  quickAddWater: (amount: number) => Promise<void>;
  resetWithDummyData: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {  
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [filterRecords, setFilterRecords] = useState<HealthRecord[]>([]);
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
  const [selectRecord | setSelectRecord]= useState<HealthRecord | null>(null);
  const [goals, setGoals] = useState<DailyGoals>(DEFAULT_GOALS);  

  const refreshRecords = useCallback(async () => {
    try{
      setIsLoading(true);
      const all = await HealthRecordRepository.getAll();
      setRecords(all);
  
      // aply current search filter
      if (searchQuery.trim()) {
        const filtered = await HealthRecordRepository.searchByDate(searchQuery);
        setFilterRecords(filtered);
      }else {
        setFilterRecords(all);
      }

      // Calculate today summary
      const today = getTodayDateString();
      const todayStatus = await HealthRecordRepository.getOverallSummary();
      setOverallSummary(overall);
    }catch (error) {
      console.error('Failed to load health records from SQLite:', error);
    }finally{
      setIsLoading(false);
    }
  }, [searchQuery]);

    // initialize SQLite schema and seed if empty
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

  //update filtered records when search query changes
  useEffect(() => {
    async function filter() {
      if (!searchQuery.trim()) {
        setFilterRecords(records);
      } else {
        const filtered = await HealthRecordRepository.searchByDate(searchQuery);
        setFilterRecords(filtered);
      }
    }
    filter();
}, [searchQuery, records]);

//CREATE: adds a new record
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

//UPDATE: Update an existing record
const updateRecord = async (record: HealthRecord): Promise<boolean> => {
  try{
    const success = await HealthRecordRepository.update(record);
    if (success) {
      setSelectRecord(null);
      await refreshRecords();
    }
    return success;
  }catch (error) {
    console.error('Failed to update record:', error);
    return false;
  }
};

}
