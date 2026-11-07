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
    
    }
}
