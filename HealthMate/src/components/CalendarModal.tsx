import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { getTodayDateString, isValidDate } from '../utils/validation';

interface CalendarModalProps {
  visible: boolean;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  onClose: () => void;
  markedDates?: string[]; 
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
  markedDates = [],
}) => {
  const today = getTodayDateString();

  const getInitialYearMonth = () => {
    if (isValidDate(selectedDate)) {
      const [y, m] = selectedDate.split('-').map(Number);
      return { year: y, month: m - 1 };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  };

  const [currentYear, setCurrentYear] = useState<number>(() => getInitialYearMonth().year);
  const [currentMonth, setCurrentMonth] = useState<number>(() => getInitialYearMonth().month);

  useEffect(() => {
    if (visible && isValidDate(selectedDate)) {
      const [y, m] = selectedDate.split('-').map(Number);
      setCurrentYear(y);
      setCurrentMonth(m - 1);
    }
  }, [visible, selectedDate]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleSelectToday = () => {
    onSelectDate(today);
    onClose();
  };

  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const days: {
    day: number;
    dateString: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    hasRecord: boolean;
  }[] = [];

  // kalin mase dina
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = totalDaysInPrevMonth - i;
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateString = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      day,
      dateString,
      isCurrentMonth: false,
      isToday: dateString === today,
      isSelected: dateString === selectedDate,
      hasRecord: markedDates.includes(dateString),
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      day: d,
      dateString,
      isCurrentMonth: true,
      isToday: dateString === today,
      isSelected: dateString === selectedDate,
      hasRecord: markedDates.includes(dateString),
    });
  }

  // Leading days
  const remainingCells = 7 - (days.length % 7);
  if (remainingCells < 7) {
    for (let d = 1; d <= remainingCells; d++) {
      const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateString = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        dateString,
        isCurrentMonth: false,
        isToday: dateString === today,
        isSelected: dateString === selectedDate,
        hasRecord: markedDates.includes(dateString),
      });
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconWrapper}>
                <Ionicons name="calendar" size={20} color={THEME.colors.primary} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Select Date</Text>
                <Text style={styles.headerSubtitle}>View or log activity for this day</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Month / Year Navigator */}
          <View style={styles.monthNav}>
            <TouchableOpacity style={styles.navArrowBtn} onPress={handlePrevMonth}>
              <Ionicons name="chevron-back" size={20} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity style={styles.navArrowBtn} onPress={handleNextMonth}>
              <Ionicons name="chevron-forward" size={20} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Weekday Row */}
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((w, idx) => (
              <View key={idx} style={styles.weekdayCell}>
                <Text style={[styles.weekdayText, idx === 0 || idx === 6 ? styles.weekendText : null]}>
                  {w}
                </Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {days.map((item, index) => {
              const isSelected = item.isSelected;
              const isToday = item.isToday && !isSelected;
              return (
                <TouchableOpacity
                  key={`${item.dateString}-${index}`}
                  style={[
                    styles.dayCell,
                    isSelected ? styles.selectedDayCell : null,
                    isToday ? styles.todayDayCell : null,
                  ]}
                  onPress={() => {
                    onSelectDate(item.dateString);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !item.isCurrentMonth ? styles.otherMonthDayText : null,
                      isToday ? styles.todayDayText : null,
                      isSelected ? styles.selectedDayText : null,
                    ]}
                  >
                    {item.day}
                  </Text>
                  {item.hasRecord && (
                    <View style={[styles.recordDot, isSelected ? styles.recordDotSelected : null]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.todayButton} onPress={handleSelectToday}>
              <Ionicons name="today-outline" size={16} color={THEME.colors.primary} />
              <Text style={styles.todayButtonText}>Jump to Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: THEME.colors.textPrimary },
  headerSubtitle: { fontSize: 12, color: THEME.colors.textSecondary, marginTop: 1 },
  closeBtn: { padding: 6 },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surfaceVariant,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 14,
  },
  navArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: THEME.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: { fontSize: 15, fontWeight: '700', color: THEME.colors.textPrimary },
  weekdayRow: { flexDirection: 'row', marginBottom: 8 },
  weekdayCell: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  weekdayText: { fontSize: 12, fontWeight: '600', color: THEME.colors.textMuted },
  weekendText: { color: '#EF4444' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 2,
    position: 'relative',
  },
  selectedDayCell: { backgroundColor: THEME.colors.primary },
  todayDayCell: {
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  dayText: { fontSize: 14, fontWeight: '600', color: THEME.colors.textPrimary },
  otherMonthDayText: { color: '#CBD5E1' },
  todayDayText: { color: THEME.colors.primary, fontWeight: '700' },
  selectedDayText: { color: '#FFFFFF', fontWeight: '800' },
  recordDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.steps,
    position: 'absolute',
    bottom: 4,
  },
  recordDotSelected: { backgroundColor: '#FFFFFF' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.primaryLight,
  },
  todayButtonText: { fontSize: 13, fontWeight: '700', color: THEME.colors.primary },
  cancelButton: { paddingVertical: 8, paddingHorizontal: 14 },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: THEME.colors.textSecondary },
});