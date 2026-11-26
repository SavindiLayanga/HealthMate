
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import { THEME } from '../constants/theme';
import { useDashboardViewModel } from '../viewmodels/useDashboardViewModel';
import { StatCard } from '../components/statCard';
import { CalendarModal } from '../components/calendarModal';
import { BmiModal } from '../components/bmiModal';
import { StepsModal } from '../components/stepModal';
import { CaloriesModal } from '../components/caloriesModal';
import { WaterModal } from '../components/waterModal';

import {
  formatDateWithWeekday,
  getDateRelativeBadge,
} from '../utils/validation';

// NEW: Circular progress configuration
const CIRCLE_SIZE = 170;
const CIRCLE_STROKE = 12;
const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE) / 2;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

// NEW: Keep progress between 0 and 100
const clampPercent = (value: number) =>
  Math.min(100, Math.max(0, Number(value) || 0));

export default function DashboardScreen() {
  const [waterCupSize, setWaterCupSize] = useState(250);

  const {
    records,
    selectedDate,
    setSelectedDate,
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
  } = useDashboardViewModel();

  // ==========================================
  // NEW: Calculate Overall Daily Health Progress
  // ==========================================

  const safeStepsPercent = clampPercent(stepsPercent);
  const safeCaloriesPercent = clampPercent(caloriesPercent);
  const safeWaterPercent = clampPercent(waterPercent);

  // Average of Steps, Calories and Water progress
  const overallProgress = Math.round(
    (safeStepsPercent +
      safeCaloriesPercent +
      safeWaterPercent) / 3
  );

  // NEW: Circular progress animation calculation
  const circleDashOffset =
    CIRCLE_CIRCUMFERENCE *
    (1 - overallProgress / 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Dashboard Subtitle */}
        <View style={styles.subTopicContainer}>
          <Text style={styles.subTopicTitle}>
            Track Your Daily Health Activities
          </Text>

          <Text style={styles.subTopicSubtitle}>
            Monitor your vital metrics and daily habits in real-time
          </Text>
        </View>

        {/* Date Card */}
        <TouchableOpacity
          style={styles.dateCard}
          onPress={() => setCalendarModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.dateCardLeft}>

            <View style={styles.calenderBadge}>
              <Ionicons name="calendar" size={16} color="#10B981" />

              <Text style={styles.calenderBadgeText}>
                {getDateRelativeBadge(selectedDate)}
              </Text>

              <Ionicons name="chevron-down" size={13} color="#10B981" />
            </View>

            <Text style={styles.dateText}>
              {formatDateWithWeekday(selectedDate)}
            </Text>

            {selectedDate !== todayDate && (
              <View style={styles.pastDateNotice}>
                <Ionicons name="time-outline" size={12} color="#F59E0B" />

                <Text style={styles.pastDateNoticeText}>
                  Viewing historical records
                </Text>
              </View>
            )}
          </View>

          {/* Quick Water Button */}
          <TouchableOpacity
            style={styles.quickWaterBtn}
            onPress={(e) => {
              e.stopPropagation();
              handleQuickWater(waterCupSize);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="water" size={16} color="#FFFFFF" />

            <Text style={styles.quickWaterBtnText}>
              +{waterCupSize} ml
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* ===================================== */}
        {/* Existing Health Metric Cards */}
        {/* ===================================== */}

        <View style={styles.metricsGrid}>

          <View style={styles.gridRow}>

            {/* Steps Card */}
            <StatCard
              title="Steps"
              value={(currentSummary?.totalSteps || 0).toLocaleString()}
              unit="steps"
              subText={`Goal: ${stepsGoal.toLocaleString()}`}
              icon="walk"
              color="#b910a5"
              bgColor="#efd3eb"
              progress={stepsPercent}
              onPress={() => setStepsModalVisible(true)}
            />

            {/* Calories Card */}
            <StatCard
              title="Calories"
              value={(currentSummary?.totalCalories || 0).toLocaleString()}
              unit="kcal"
              subText={`Goal: ${caloriesGoal.toLocaleString()}`}
              icon="flame"
              color="#F59E0B"
              bgColor="#FEF3C7"
              progress={caloriesPercent}
              onPress={() => setCaloriesModalVisible(true)}
            />

          </View>

          <View style={styles.gridRow}>

            {/* Water Intake Card */}
            <StatCard
              title="Water Intake"
              value={(currentSummary?.totalWater || 0).toLocaleString()}
              unit="ml"
              subText={`Goal: ${waterGoal.toLocaleString()}`}
              icon="water"
              color={THEME.colors.water}
              bgColor="#E0F2FE"
              progress={waterPercent}
              onPress={() => setWaterModalVisible(true)}
            />

            {/* BMI Calculator Card */}
            <StatCard
              title="BMI Calculator"
              value={bmiValue.toString()}
              unit="BMI"
              subText="Tap to calculate"
              icon="fitness"
              color="#6366F1"
              bgColor="#EEF2FF"
              badge={bmiCategory}
              badgeColor={
                bmiCategory.toLowerCase().includes('normal')
                  ? '#16A34A'
                  : '#EF4444'
              }
              badgeBgColor={
                bmiCategory.toLowerCase().includes('normal')
                  ? '#DCFCE7'
                  : '#FEE2E2'
              }
              onPress={() => setBmiModalVisible(true)}
            />
          </View>
        </View>

        <View style={styles.dailyProgressCard}>

          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}> Daily Health Progress </Text>
              <Text style={styles.progressSubtitle}>  Your overall daily activity summary </Text>
            </View>
          </View>

          {/* main circular  progress */}
          <View style={styles.circularProgressContainer}>

            <Svg
              width={CIRCLE_SIZE}
              height={CIRCLE_SIZE}
            >

              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke="#E5E7EB"
                strokeWidth={CIRCLE_STROKE}
                fill="none"
              />

              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke="#10B981"
                strokeWidth={CIRCLE_STROKE}
                fill="none"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeDashoffset={circleDashOffset}
                strokeLinecap="round"
                rotation={-90}
                originX={CIRCLE_SIZE / 2}
                originY={CIRCLE_SIZE / 2}
              />

            </Svg>

          
            <View style={styles.circularProgressCenter}>
              <Text style={styles.progressPercentage}>
                {overallProgress}%
              </Text>
              <Text style={styles.progressCompleted}> Completed </Text>
              <Text style={styles.progressDailyLabel}> Daily Progress </Text>
            </View>
          </View>

          {/* Progress Details */}
          <View style={styles.progressDetailsContainer}>
            
            {/* steps details*/}
            <View style={styles.progressDetailRow}>
              <View style={styles.progressDetailLeft}>
                <View style={[styles.progressDetailIcon, {
                  backgroundColor: '#F3E5F5'
                }]}>
                  <Ionicons
                    name="walk"
                    size={19}
                    color="#B910A5"
                  />
                </View>

                <View>
                  <Text style={styles.progressDetailTitle}> Steps </Text>
                  <Text style={styles.progressDetailSubtitle}> Daily step goal </Text>
                </View>
              </View>

              <View style={styles.progressDetailRight}>
                <Text style={styles.progressDetailValue}>
                  {(currentSummary?.totalSteps || 0).toLocaleString()}
                  {' / '}
                  {stepsGoal.toLocaleString()}
                </Text>

                <Text style={[styles.progressDetailPercent, {
                  color: '#B910A5'
                }]}>
                  {Math.round(safeStepsPercent)}%
                </Text>
              </View>

            </View>

            {/* water details */}
            <View style={styles.progressDetailRow}>

              <View style={styles.progressDetailLeft}>
                <View style={[styles.progressDetailIcon, {
                  backgroundColor: '#E0F2FE'
                }]}>
                  <Ionicons
                    name="water"
                    size={19}
                    color="#0EA5E9"
                  />
                </View>

                <View>
                  <Text style={styles.progressDetailTitle}> Water Intake </Text>
                  <Text style={styles.progressDetailSubtitle}> Daily water goal </Text>
                </View>
              </View>

              <View style={styles.progressDetailRight}>
                <Text style={styles.progressDetailValue}>
                  {(currentSummary?.totalWater || 0).toLocaleString()}
                  {' / '}
                  {waterGoal.toLocaleString()} ml
                </Text>

                <Text style={[styles.progressDetailPercent, {
                  color: '#0EA5E9'
                }]}>
                  {Math.round(safeWaterPercent)}%
                </Text>
              </View>

            </View>

            {/* calories details */}
            <View style={styles.progressDetailRow}>

              <View style={styles.progressDetailLeft}>
                <View style={[styles.progressDetailIcon, {
                  backgroundColor: '#FEF3C7'
                }]}>
                  <Ionicons
                    name="flame"
                    size={19}
                    color="#F59E0B"
                  />
                </View>

                <View>
                  <Text style={styles.progressDetailTitle}> Calories </Text>
                  <Text style={styles.progressDetailSubtitle}> Daily calorie goal </Text>
                </View>
              </View>

              <View style={styles.progressDetailRight}>
                <Text style={styles.progressDetailValue}>
                  {(currentSummary?.totalCalories || 0).toLocaleString()}
                  {' / '}
                  {caloriesGoal.toLocaleString()} kcal
                </Text>

                <Text style={[styles.progressDetailPercent, {
                  color: '#F59E0B'
                }]}>
                  {Math.round(safeCaloriesPercent)}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />

      </ScrollView>

      {/* Calendar Modal */}
      <CalendarModal
        visible={calendarModalVisible}
        selectedDate={selectedDate}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
        onClose={() => setCalendarModalVisible(false)}
        markedDates={records.map((r) => r.date)}
      />

      {/* BMI Calculator Modal */}
      <BmiModal
        visible={bmiModalVisible}
        onClose={() => setBmiModalVisible(false)}
        onBmiCalculated={(val, cat) => {
          setBmiValue(val);
          setBmiCategory(cat);
        }}
      />

      {/* Steps Modal */}
      <StepsModal
        visible={stepsModalVisible}
        onClose={() => setStepsModalVisible(false)}
        currentSteps={currentSummary?.totalSteps || 0}
        currentGoal={stepsGoal}
        onSave={async (newSteps, newGoal) => {
          updateGoals({ ...goals, stepsGoal: newGoal });
          await updateSteps(newSteps);
        }}
      />

      {/* Calories Modal */}
      <CaloriesModal
        visible={caloriesModalVisible}
        onClose={() => setCaloriesModalVisible(false)}
        currentCalories={currentSummary?.totalCalories || 0}
        currentGoal={caloriesGoal}
        onSave={async (newCalories, newGoal) => {
          updateGoals({ ...goals, caloriesGoal: newGoal });
          await updateTodayCalories(newCalories, selectedDate);
        }}
      />

      {/* Water Modal */}
      <WaterModal
        visible={waterModalVisible}
        onClose={() => setWaterModalVisible(false)}
        currentWater={currentSummary?.totalWater || 0}
        currentGoal={waterGoal}
        onSave={async (newWater, newGoal, newCupSize) => {
          updateGoals({ ...goals, waterGoal: newGoal });
          await updateTodayWater(newWater, selectedDate);
          setWaterCupSize(newCupSize);
        }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subTopicContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  subTopicTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  subTopicSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  dateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateCardLeft: {
    flex: 1,
  },
  calenderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  calenderBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  pastDateNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  pastDateNoticeText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
  },
  quickWaterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  quickWaterBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  metricsGrid: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dailyProgressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 2,
    marginBottom: 10,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  circularProgressContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  circularProgressCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 34,
    fontWeight: '800',
    color: '#10B981',
  },
  progressCompleted: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 1,
  },
  progressDailyLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
  },
  progressDetailsContainer: {
    gap: 16,
  },
  progressDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressDetailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  progressDetailIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDetailTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  progressDetailSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 3,
  },
  progressDetailRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  progressDetailValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  progressDetailPercent: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
});
