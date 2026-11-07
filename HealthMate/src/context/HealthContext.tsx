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

