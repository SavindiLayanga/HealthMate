import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { THEME } from '../constants/theme';
import { useHealth } from '../context/HealthContext';
import { StatCard } from '../components/StatCard';
import { CalendarModal } from '../components/CalendarModal';
import { BmiModal } from '../components/BmiModal';
import { StepsModal } from '../components/StepModal';
import { formatDateWithWeekday, getDateRelativeBadge, getTodayDateString,} from '../utils/validation';

export default function DashboardScreen() {
  const {
    selectedDate,
    setSelectedDate,
    selectedDateSummary,
    todaySummary,
    records,
    goals,
    quickAddWater,
    updateGoals,
    updateTodaySteps,
  } = useHealth();

  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [bmiModalVisible, setBmiModalVisible] = useState(false);
  const [bmiValue, setBmiValue] = useState<number>(22.4);
  const [bmiCategory, setBmiCategory] = useState<string>('Normal');

  const todayDate = getTodayDateString();

  const currentSummary = selectedDateSummary || todaySummary;

  const stepsGoal = goals?.stepsGoal || 10000;
  const caloriesGoal = goals?.caloriesGoal || 2200;
  const waterGoal = goals?.waterGoal || 2500;

  const stepsPercent = Math.min(
    Math.round(((currentSummary?.totalSteps || 0) / stepsGoal) * 100),
    100
  );
  const caloriesPercent = Math.min(
    Math.round(((currentSummary?.totalCalories || 0) / caloriesGoal) * 100),
    100
  );
  const waterPercent = Math.min(
    Math.round(((currentSummary?.totalWater || 0) / waterGoal) * 100),
    100
  );

  const handleQuickWater = async () => {
    await quickAddWater(250);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. Sub-topic */}
        <View style={styles.subTopicContainer}>
          <Text style={styles.subTopicTitle}>
            Track Your Daily Health Activities
          </Text>
          <Text style={styles.subTopicSubtitle}>
            Monitor your vital metrics and daily habits in real-time
          </Text>
        </View>

        {/* 3. Today date box */}
        <TouchableOpacity
          style={styles.dateCard}
          onPress={() => setCalendarModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.dateCardLeft}>
            {/* Dynamic badge */}
            <View style={styles.calenderBadge}>
              <Ionicons name="calendar" size={16} color="#10B981" />
              <Text style={styles.calenderBadgeText}>
                {getDateRelativeBadge(selectedDate)}
              </Text>
              <Ionicons name="chevron-down" size={13} color="#10B981" />
            </View>

            {/* Dynamic Formatted Date */}
            <Text style={styles.dateText}>
              {formatDateWithWeekday(selectedDate)}
            </Text>

            {/* Past date notice */}
            {selectedDate !== todayDate && (
              <View style={styles.pastDateNotice}>
                <Ionicons name="time-outline" size={12} color="#F59E0B" />
                <Text style={styles.pastDateNoticeText}>
                  Viewing historical records
                </Text>
              </View>
            )}
          </View>

          {/* Quick Water Button inside Date Box */}
          <TouchableOpacity
            style={styles.quickWaterBtn}
            onPress={(e) => {
              e.stopPropagation();
              handleQuickWater();
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="water" size={16} color="#FFFFFF" />
            <Text style={styles.quickWaterBtnText}>+250 ml</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Cards */}
        <View style={styles.metricsGrid}>
          
          <View style={styles.gridRow}>

            {/* Steps Card */}
            <StatCard
              title="Steps"
              value={(currentSummary?.totalSteps || 0).toLocaleString()}
              unit="steps"
              subText={`Goal: ${stepsGoal.toLocaleString()}`}
              icon="walk"
              color="rgb(185, 16, 165)"
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
              onPress={() => {
                router.navigate('/calories-detail');
              }}
            />
          </View>

          {/* second row */}
          <View style={styles.gridRow}>
            {/* Water Intake Card */}
            <StatCard
              title="Water Intake"
              value={(currentSummary?.totalWater || 0).toLocaleString()}
              unit="ml"
              subText={`Goal: ${waterGoal.toLocaleString()}`}
              icon="water"
              color="#0EA5E9"
              bgColor="#E0F2FE"
              progress={waterPercent}
              onPress={handleQuickWater}
            />

            {/* BMI Calculator Card) */}
            <StatCard
              title="BMI Calculator"
              value={bmiValue.toString()}
              unit="BMI"
              subText="Tap to calculate"
              icon="fitness"
              color="#6366F1"
              bgColor="#EEF2FF"
              badge={bmiCategory}
              badgeColor= {
                bmiCategory.toLowerCase().includes('normal')
                  ? '#16A34A': '#EF4444'
              }
              badgeBgColor={
                bmiCategory.toLocaleLowerCase().includes('normal')
                ? '#DCFCE7': '#FEE2E2'
              }
              onPress={() => setBmiModalVisible(true)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Interactive Calendar Modal */}
      <CalendarModal
        visible={calendarModalVisible}
        selectedDate={selectedDate}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
        onClose={() => setCalendarModalVisible(false)}
        markedDates={records.map((r) => r.date)}
      />

      {/* Interactive BMI Calculator Modal */}
      <BmiModal
        visible={bmiModalVisible}
        onClose={() => setBmiModalVisible(false)}
        onBmiCalculated={(val, cat) => {
          setBmiValue(val);
          setBmiCategory(cat);
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
    fontSize: 18,
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
});