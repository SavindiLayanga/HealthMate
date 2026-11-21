import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { useHealth } from '../context/HealthContext';
import { HealthRecord } from '../types';

export function useRecordsViewModel() {
  const {
    filteredRecords,
    searchQuery,
    setSearchQuery,
    isLoading,
    deleteRecord,
    resetWithDummyData,
    refreshRecords,
    setSelectedRecord,
  } = useHealth();

  const [refreshing, setRefreshing] = useState(false);

  const displayRecords = filteredRecords;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshRecords();
    setRefreshing(false);
  }, [refreshRecords]);

  const handleEdit = (record: HealthRecord) => {
    setSelectedRecord(record);
    router.push('/add');
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    router.push('/add');
  };

  return {
    searchQuery,
    setSearchQuery,
    isLoading,
    deleteRecord,
    resetWithDummyData,
    refreshing,
    displayRecords,
    onRefresh,
    handleEdit,
    handleAdd,
  };
}
