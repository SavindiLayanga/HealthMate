import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { getTodayDateString } from '../utils/validation';

export function useDashboardViewModel() {
  const {
    records,
    selectedDate,
    setSelectedDate,
    selectedDateSummary,
    goals,
    updateGoals,
    updateSteps,
    updateTodayCalories,
    updateTodayWater,
    quickAddWater,
  } = useHealth();

  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [bmiModalVisible, setBmiModalVisible] = useState(false);
  const [stepsModalVisible, setStepsModalVisible] = useState(false);
  const [caloriesModalVisible, setCaloriesModalVisible] = useState(false);
  const [waterModalVisible, setWaterModalVisible] = useState(false);
  const [bmiValue, setBmiValue] = useState(0);
  const [bmiCategory, setBmiCategory] = useState('');

  const todayDate = getTodayDateString();
  const currentSummary = selectedDateSummary;

  const stepsGoal = goals.stepsGoal;
  const caloriesGoal = goals.caloriesGoal;
  const waterGoal = goals.waterGoal;

  const stepsPercent = stepsGoal > 0
    ? Math.min((currentSummary.totalSteps / stepsGoal) * 100, 100)
    : 0;
  const caloriesPercent = caloriesGoal > 0
    ? Math.min((currentSummary.totalCalories / caloriesGoal) * 100, 100)
    : 0;
  const waterPercent = waterGoal > 0
    ? Math.min((currentSummary.totalWater / waterGoal) * 100, 100)
    : 0;

  const handleQuickWater = () => {
    quickAddWater(250, selectedDate);
  };

  return {
    selectedDate,
    setSelectedDate,
    records,
    goals,
    updateGoals,
    updateSteps,
    updateTodayCalories,
    updateTodayWater,
    calendarModalVisible,
    setCalendarModalVisible,
    bmiModalVisible,
    setBmiModalVisible,
    stepsModalVisible,
    setStepsModalVisible,
    caloriesModalVisible,
    setCaloriesModalVisible,
    waterModalVisible,
    setWaterModalVisible,
    bmiValue,
    setBmiValue,
    bmiCategory,
    setBmiCategory,
    todayDate,
    currentSummary,
    stepsGoal,
    caloriesGoal,
    waterGoal,
    stepsPercent,
    caloriesPercent,
    waterPercent,
    handleQuickWater,
  };
}
