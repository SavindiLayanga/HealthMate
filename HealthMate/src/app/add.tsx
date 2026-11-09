import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHealth } from '../context/HealthContext';
import { FormField } from '../components/FormField';
import { CalendarModal } from '../components/CalendarModal';
import { THEME } from '../constants/theme';
import { validateHealthRecordForm, getTodayDateString } from '../utils/validation';
import { FormErrors } from '../types';

export default function AddRecordScreen() {
  const { addRecord, updateRecord, selectedRecord, setSelectedRecord, records } = useHealth();

  const isEditMode = selectedRecord !== null;

  const [date, setDate] = useState<string>('');
  const [calendarModalVisible, setCalendarModalVisible] = useState<boolean>(false);
  const [steps, setSteps] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [water, setWater] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
  };

  const handleResetForm = () => {
    if (isEditMode && selectedRecord) {
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
      Alert.alert('Validation Error', 'Please check the highlighted fields.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      if (isEditMode && selectedRecord) {
        const success = await updateRecord({
          id: selectedRecord.id,
          date: date.trim(),
          steps: parseInt(steps, 10),
          calories: parseInt(calories, 10),
          water: parseInt(water, 10),
        });

        if (success) {
          Alert.alert('Success', 'Health record updated successfully!', [
            { text: 'OK', onPress: () => router.push('/records') },
          ]);
        }
      } else {
        const success = await addRecord({
          date: date.trim(),
          steps: parseInt(steps, 10),
          calories: parseInt(calories, 10),
          water: parseInt(water, 10),
        });

        if (success) {
          Alert.alert('Success', 'Daily activity saved to SQLite database!', [
            { text: 'View Records', onPress: () => router.push('/records') },
            {
              text: 'Add Another',
              style: 'cancel',
              onPress: () => {
                setSteps('');
                setCalories('');
                setWater('');
              },
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Record' : 'Add Health Record'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditMode ? `Updating ID #${selectedRecord?.id}` : 'Record steps, calories & water'}
          </Text>
        </View>

        {isEditMode ? (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setSelectedRecord(null);
              router.back();
            }}
          >
            <Ionicons name="close" size={22} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark" size={18} color={THEME.colors.primary} />
            <Text style={styles.infoText}>
              All entries are validated and saved securely to the embedded SQLite database.
            </Text>
          </View>

          {/* Date Input Field */}
          <View style={styles.dateFieldWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setCalendarModalVisible(true)}
            >
              <FormField
                label="Activity Date"
                iconName="calendar-outline"
                iconColor={THEME.colors.primary}
                value={date}
                editable={false}
                placeholder="YYYY-MM-DD (e.g. 2026-08-18)"
                error={errors.date}
              />
            </TouchableOpacity>

            <View style={styles.dateActionBtns}>
              <TouchableOpacity
                style={styles.calendarPickBtn}
                onPress={() => setCalendarModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar" size={13} color={THEME.colors.primary} />
                <Text style={styles.todayBtnText}>Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.todayBtn}
                onPress={handleSetToday}
                activeOpacity={0.7}
              >
                <Ionicons name="today" size={13} color={THEME.colors.primary} />
                <Text style={styles.todayBtnText}>Today</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Steps Field */}
          <FormField
            label="Steps Walked"
            iconName="walk"
            iconColor={THEME.colors.steps}
            unit="steps"
            value={steps}
            onChangeText={(t) => {
              setSteps(t);
              if (errors.steps) setErrors((prev) => ({ ...prev, steps: undefined }));
            }}
            placeholder="e.g. 7850"
            keyboardType="number-pad"
            error={errors.steps}
          />

          {/* Calories Field */}
          <FormField
            label="Calories Burned"
            iconName="flame"
            iconColor={THEME.colors.calories}
            unit="kcal"
            value={calories}
            onChangeText={(t) => {
              setCalories(t);
              if (errors.calories) setErrors((prev) => ({ ...prev, calories: undefined }));
            }}
            placeholder="e.g. 420"
            keyboardType="number-pad"
            error={errors.calories}
          />

          {/* Water Field */}
          <FormField
            label="Water Intake"
            iconName="water"
            iconColor={THEME.colors.water}
            unit="ml"
            value={water}
            onChangeText={(t) => {
              setWater(t);
              if (errors.water) setErrors((prev) => ({ ...prev, water: undefined }));
            }}
            placeholder="e.g. 2000"
            keyboardType="number-pad"
            error={errors.water}
          />

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.saveBtn, isSubmitting ? styles.disabledBtn : null]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isEditMode ? 'checkmark-circle' : 'add-circle'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.saveBtnText}>
                {isSubmitting
                  ? 'Saving to SQLite...'
                  : isEditMode
                  ? 'Update Health Record'
                  : 'Save Health Record'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetForm}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={16} color={THEME.colors.textSecondary} />
              <Text style={styles.resetBtnText}>Reset Form</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <CalendarModal
        visible={calendarModalVisible}
        selectedDate={date}
        onSelectDate={(newDate) => {
          setDate(newDate);
          if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
        }}
        onClose={() => setCalendarModalVisible(false)}
        markedDates={records.map((r) => r.date)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  header: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...THEME.elevation.card,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  cancelBtn: {
    padding: 6,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryLight,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.primary,
    lineHeight: 16,
    fontWeight: '500',
  },
  dateFieldWrapper: {
    position: 'relative',
  },
  dateActionBtns: {
    position: 'absolute',
    right: 10,
    top: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
    gap: 4,
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
    gap: 4,
  },
  todayBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  actions: {
    marginTop: 10,
    gap: 10,
  },
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    gap: 8,
    ...THEME.elevation.card,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  resetBtn: {
    backgroundColor: THEME.colors.surfaceVariant,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
  },
  resetBtnText: {
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
});