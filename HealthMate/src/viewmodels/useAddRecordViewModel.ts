import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useHealth } from '../context/HealthContext';
import { validateHealthRecordForm, getTodayDateString } from '../utils/validation';
import { FormErrors } from '../types';

export function useAddRecordViewModel() {
  const {
    selectedRecord,
    setSelectedRecord,
    records,
    addRecord,
    updateRecord,
  } = useHealth();

  const isEditMode = selectedRecord !== null;

  const [date, setDate] = useState(getTodayDateString());
  const [steps, setSteps] = useState('');
  const [calories, setCalories] = useState('');
  const [water, setWater] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  useEffect(() => {
    if (selectedRecord) {
      setDate(selectedRecord.date);
      setSteps(selectedRecord.steps.toString());
      setCalories(selectedRecord.calories.toString());
      setWater(selectedRecord.water.toString());
    } else {
      setDate(getTodayDateString());
      setSteps('');
      setCalories('');
      setWater('');
    }
    setErrors({});
  }, [selectedRecord]);

  const handleSetToday = () => {
    setDate(getTodayDateString());
    if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
  };

  const handleResetForm = () => {
    setDate(getTodayDateString());
    setSteps('');
    setCalories('');
    setWater('');
    setErrors({});
  };

  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validateHealthRecordForm({
      date,
      steps,
      calories,
      water,
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const recordData = {
        date: date.trim(),
        steps: Number(steps),
        calories: Number(calories),
        water: Number(water),
      };

      let success: boolean;
      if (isEditMode && selectedRecord) {
        success = await updateRecord({ ...selectedRecord, ...recordData });
      } else {
        success = await addRecord(recordData);
      }

      if (success) {
        setSelectedRecord(null);
        router.back();
      } else {
        Alert.alert('Error', 'Failed to save record. Please try again.');
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    setSelectedRecord,
    records,
    isEditMode,
    date,
    setDate,
    calendarModalVisible,
    setCalendarModalVisible,
    steps,
    setSteps,
    calories,
    setCalories,
    water,
    setWater,
    errors,
    setErrors,
    isSubmitting,
    handleSetToday,
    handleResetForm,
    handleSubmit,
  };
}
