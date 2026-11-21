import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { HealthRecord } from '../types';
import { formatDisplayDate, getTodayDateString } from '../utils/validation';

export const CUTE_COLORS = {
  steps: {
    icon: '#b910a5',
    bg: '#ffffff',
    iconBg: '#f7eaf5',
    border: '#FBCFE8',
    text: '#9D174D',
  },
  calories: {
    icon: '#F59E0B',
    bg: '#ffffff',
    iconBg: '#fdf8e7',
    border: '#FDE68A',
    text: '#B45309',
  },
  water: {
    icon: '#0EA5E9',
    bg: '#ffffff',
    iconBg: '#ebf5fc',
    border: '#BAE6FD',
    text: '#0369A1',
  },
  calendar: {
    icon: '#10B981',
    bg: '#f5fffa',
    border: '#A7F3D0',
    text: '#065F46',
  },
  editBtn: '#0EA5E9',
  deleteBtnBg: '#FEE2E2',
  deleteBtnText: '#EF4444',
  deleteBtnBorder: '#FECACA',
};

type RecordCardProps = {
  record: HealthRecord;
  onEdit: (record: HealthRecord) => void;
  onDelete: (id: number) => void;
};

export function RecordCard({ record, onEdit, onDelete }: RecordCardProps) {
  const isToday = record.date === getTodayDateString();

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete the record for ${formatDisplayDate(record.date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(record.id),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.dateBadge}>
          <Ionicons name="calendar" size={14} color={CUTE_COLORS.calendar.icon} />
          <Text style={styles.dateBadgeText}>{formatDisplayDate(record.date)}</Text>
        </View>

        {isToday && (
          <View style={styles.todayPill}>
            <Text style={styles.todayPillText}>TODAY</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.metricsColumn}>
          {/* Steps */}
          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: CUTE_COLORS.steps.bg,
                borderColor: CUTE_COLORS.steps.border,
              },
            ]}
          >
            <View
              style={[
                styles.metricIconBox,
                { backgroundColor: CUTE_COLORS.steps.iconBg },
              ]}
            >
              <Ionicons name="walk" size={15} color={CUTE_COLORS.steps.icon} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricLabel}>Steps</Text>
              <Text
                style={[
                  styles.metricValue,
                  { color: CUTE_COLORS.steps.text },
                ]}
              >
                {record.steps.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Calories */}
          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: CUTE_COLORS.calories.bg,
                borderColor: CUTE_COLORS.calories.border,
              },
            ]}
          >
            <View
              style={[
                styles.metricIconBox,
                { backgroundColor: CUTE_COLORS.calories.iconBg },
              ]}
            >
              <Ionicons name="flame" size={15} color={CUTE_COLORS.calories.icon} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricLabel}>Calories</Text>
              <Text
                style={[
                  styles.metricValue,
                  { color: CUTE_COLORS.calories.text },
                ]}
              >
                {record.calories.toLocaleString()}{' '}
                <Text style={styles.metricUnit}>kcal</Text>
              </Text>
            </View>
          </View>

          {/* Water Intake */}
          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: CUTE_COLORS.water.bg,
                borderColor: CUTE_COLORS.water.border,
              },
            ]}
          >
            <View
              style={[
                styles.metricIconBox,
                { backgroundColor: CUTE_COLORS.water.iconBg },
              ]}
            >
              <Ionicons name="water" size={15} color={CUTE_COLORS.water.icon} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricLabel}>Water</Text>
              <Text
                style={[
                  styles.metricValue,
                  { color: CUTE_COLORS.water.text },
                ]}
              >
                {record.water.toLocaleString()}{' '}
                <Text style={styles.metricUnit}>ml</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsColumn}>
          
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit(record)}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={14} color="#FFFFFF" />
            <Text style={styles.editBtnText}>EDIT</Text>
          </TouchableOpacity>

          
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDeletePress}
            activeOpacity={0.8}
          >
            <Ionicons
              name="trash-outline"
              size={14}
              color={CUTE_COLORS.deleteBtnText}
            />
            <Text style={styles.deleteBtnText}>DELETE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default RecordCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CUTE_COLORS.calendar.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CUTE_COLORS.calendar.border,
    gap: 6,
  },
  dateBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: CUTE_COLORS.calendar.text,
  },
  todayPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  todayPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3fbf6e',
    letterSpacing: 0.5,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricsColumn: {
    flex: 1,
    gap: 7,
  },
  metricBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  metricIconBox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  metricUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
  },
  buttonsColumn: {
    width: 88,
    gap: 8,
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: CUTE_COLORS.editBtn,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 4,
    shadowColor: CUTE_COLORS.editBtn,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  deleteBtn: {
    backgroundColor: CUTE_COLORS.deleteBtnBg,
    borderWidth: 1,
    borderColor: CUTE_COLORS.deleteBtnBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  deleteBtnText: {
    color: CUTE_COLORS.deleteBtnText,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
