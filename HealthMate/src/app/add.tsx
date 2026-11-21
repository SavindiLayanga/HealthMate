import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TextInput, TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHealth } from '../context/HealthContext';
import { CalendarModal } from '../components/CalendarModal';
import { THEME } from '../constants/theme';
import { validateHealthRecordForm, getTodayDateString, formatDisplayDate } from '../utils/validation';
import { FormErrors } from '../types';

const CUTE_COLORS = THEME.cute;

type FormFieldProps = {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBgColor?: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  editable?: boolean;
  unit?: string;
  unitColor?: string;
  unitBgColor?: string;
  error?: string;
};

function FormField({
  label,
  iconName,
  iconColor,
  iconBgColor = '#F1F5F9',
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable = true,
  unit,
  unitColor,
  unitBgColor,
  error,
}: FormFieldProps) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formFieldLabel}>{label}</Text>
      <View
        style={[
          styles.formFieldInputRow,
          error ? styles.formFieldInputError : null,
        ]}
      >
        <View style={[styles.fieldIconBox, { backgroundColor: iconBgColor }]}>
          <Ionicons name={iconName} size={18} color={iconColor} />
        </View>

        <TextInput
          style={styles.formFieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={editable}
          placeholderTextColor="#9CA3AF"
        />

        {unit ? (
          <View
            style={[
              styles.unitBadge,
              unitBgColor ? { backgroundColor: unitBgColor } : null,
            ]}
          >
            <Text
              style={[
                styles.formFieldUnit,
                unitColor ? { color: unitColor } : null,
              ]}
            >
              {unit}
            </Text>
          </View>
        ) : null}
      </View>
      {error ? <Text style={styles.formFieldError}>{error}</Text> : null}
    </View>
  );
}

export default function AddRecordScreen() {
  const {
    addRecord,
    updateRecord,
    selectedRecord,
    setSelectedRecord,
    records,
    setSelectedDate,
  } = useHealth();

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
      const today = getTodayDateString();
      setDate(today);

      const existingToday = records.find((r) => r.date === today);
      if (existingToday) {
        setSteps(existingToday.steps.toString());
        setCalories(existingToday.calories.toString());
        setWater(existingToday.water.toString());
      } else {
        setSteps('');
        setCalories('');
        setWater('');
      }
    }
    setErrors({});
  }, [selectedRecord]);

  const handleSetToday = () => {
    const today = getTodayDateString();
    setDate(today);
    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));

    const existing = records.find((r) => r.date === today);
    if (existing) {
      setSteps(existing.steps.toString());
      setCalories(existing.calories.toString());
      setWater(existing.water.toString());
    }
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
      const targetDate = date.trim();
      const numSteps = parseInt(steps, 10);
      const numCalories = parseInt(calories, 10);
      const numWater = parseInt(water, 10);
      const existingRecord =
        isEditMode && selectedRecord
          ? selectedRecord
          : records.find((r) => r.date === targetDate);

      let success = false;
      if (existingRecord) {
        success = await updateRecord({
          id: existingRecord.id,
          date: targetDate,
          steps: numSteps,
          calories: numCalories,
          water: numWater,
        });
      } else {
        success = await addRecord({
          date: targetDate,
          steps: numSteps,
          calories: numCalories,
          water: numWater,
        });
      }

      if (success) {
        setSelectedDate(targetDate);
        Alert.alert(
          'Success',
          `Health record for ${formatDisplayDate(targetDate)} saved successfully!`,
          [
            { text: 'View Records', onPress: () => router.push('/records') },
            { text: 'OK', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to save health record.');
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
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Health Record' : 'Add Health Record'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditMode
              ? `Updating entry for ${formatDisplayDate(date)}`
              : 'Record your daily steps, calories & water'}
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
            <Ionicons name="close" size={20} color={THEME.colors.textSecondary} />
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
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.dateFieldWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setCalendarModalVisible(true)}
            >
              <FormField
                label="Activity Date"
                iconName="calendar"
                iconColor={CUTE_COLORS.calendar.icon}
                iconBgColor={CUTE_COLORS.calendar.iconBg}
                value={date}
                editable={false}
                placeholder="YYYY-MM-DD"
                error={errors.date}
              />
            </TouchableOpacity>

            <View style={styles.dateActionBtns}>
              <TouchableOpacity
                style={styles.cuteActionBtn}
                onPress={() => setCalendarModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="calendar"
                  size={14}
                  color={CUTE_COLORS.calendar.icon}
                />
                <Text style={styles.cuteActionBtnText}>Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cuteActionBtn}
                onPress={handleSetToday}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="today"
                  size={14}
                  color={CUTE_COLORS.calendar.icon}
                />
                <Text style={styles.cuteActionBtnText}>Today</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FormField
            label="Steps Walked"
            iconName="walk"
            iconColor={CUTE_COLORS.steps.icon}
            iconBgColor={CUTE_COLORS.steps.iconBg}
            unit="steps"
            unitColor={CUTE_COLORS.steps.text}
            unitBgColor={CUTE_COLORS.steps.tint}
            value={steps}
            onChangeText={(t: string) => {
              setSteps(t);
              if (errors.steps) setErrors((prev) => ({ ...prev, steps: undefined }));
            }}
            placeholder="e.g. 8000"
            keyboardType="number-pad"
            error={errors.steps}
          />

          <FormField
            label="Calories Burned"
            iconName="flame"
            iconColor={CUTE_COLORS.calories.icon}
            iconBgColor={CUTE_COLORS.calories.iconBg}
            unit="kcal"
            unitColor={CUTE_COLORS.calories.text}
            unitBgColor={CUTE_COLORS.calories.tint}
            value={calories}
            onChangeText={(t: string) => {
              setCalories(t);
              if (errors.calories)
                setErrors((prev) => ({ ...prev, calories: undefined }));
            }}
            placeholder="e.g. 450"
            keyboardType="number-pad"
            error={errors.calories}
          />

          <FormField
            label="Water Intake"
            iconName="water"
            iconColor={CUTE_COLORS.water.icon}
            iconBgColor={CUTE_COLORS.water.iconBg}
            unit="ml"
            unitColor={CUTE_COLORS.water.text}
            unitBgColor={CUTE_COLORS.water.tint}
            value={water}
            onChangeText={(t: string) => {
              setWater(t);
              if (errors.water) setErrors((prev) => ({ ...prev, water: undefined }));
            }}
            placeholder="e.g. 2500"
            keyboardType="number-pad"
            error={errors.water}
          />

          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetForm}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={16} color={CUTE_COLORS.resetBtnText} />
              <Text style={styles.resetBtnText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                isSubmitting ? styles.saveBtnDisabled : null,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>
                {isSubmitting
                  ? 'Saving...'
                  : isEditMode
                  ? 'Update Record'
                  : 'Save Record'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CalendarModal
        visible={calendarModalVisible}
        selectedDate={date}
        onSelectDate={(newDate) => {
          setDate(newDate);
          if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
          const existing = records.find((r) => r.date === newDate);
          if (existing) {
            setSteps(existing.steps.toString());
            setCalories(existing.calories.toString());
            setWater(existing.water.toString());
          }
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  cancelBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formField: {
    marginBottom: 16,
  },
  formFieldLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  formFieldInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  fieldIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formFieldInput: {
    flex: 1,
    minHeight: 48,
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  unitBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  formFieldUnit: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  formFieldInputError: {
    borderColor: '#EF4444',
  },
  formFieldError: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    marginLeft: 4,
  },
  dateFieldWrapper: {
    marginBottom: 16,
  },
  dateActionBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  cuteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CUTE_COLORS.calendar.tint,
    borderWidth: 1,
    borderColor: CUTE_COLORS.calendar.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  cuteActionBtnText: {
    color: CUTE_COLORS.calendar.text,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    marginBottom: 20,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CUTE_COLORS.resetBtnBg,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 6,
  },
  resetBtnText: {
    color: CUTE_COLORS.resetBtnText,
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: CUTE_COLORS.saveBtn,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    gap: 8,
    shadowColor: CUTE_COLORS.saveBtn,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
