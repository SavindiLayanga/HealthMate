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
  TextInput,
  TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHealth } from '../context/HealthContext';
import { CalendarModal } from '../components/CalendarModal';
import { THEME } from '../constants/theme';
import { validateHealthRecordForm, getTodayDateString } from '../utils/validation';
import { FormErrors } from '../types';

type FormFieldProps = {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  editable?: boolean;
  unit?: string;
  error?: string;
};

function FormField({
  label,
  iconName,
  iconColor,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable = true,
  unit,
  error,
}: FormFieldProps) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formFieldLabel}>{label}</Text>
      <View style={[styles.formFieldInputRow, error ? styles.formFieldInputError : null]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
        <TextInput
          style={styles.formFieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={editable}
          placeholderTextColor={THEME.colors.textSecondary}
        />
        {unit ? <Text style={styles.formFieldUnit}>{unit}</Text> : null}
      </View>
      {error ? <Text style={styles.formFieldError}>{error}</Text> : null}
    </View>
  );
}

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
            onChangeText={(t: string) => {
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
            onChangeText={(t: string) => {
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
            onChangeText={(t: React.SetStateAction<string>) => {
              setWater(t);
              if (errors.water) setErrors((prev) => ({ ...prev, water: undefined }));
            }}
            placeholder="e.g. 2000"
            keyboardType="number-pad"
            error={errors.water}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formField: {
    marginBottom: 16,
  },
  formFieldLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  formFieldInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.textSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  formFieldInputError: {
    borderColor: '#D9534F',
  },
  formFieldInput: {
    flex: 1,
    minHeight: 48,
    color: THEME.colors.textPrimary,
    fontSize: 15,
  },
  formFieldUnit: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  formFieldError: {
    color: '#D9534F',
    fontSize: 12,
    marginTop: 5,
  },
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  cancelBtn: {
    padding: 8,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  dateFieldWrapper: {
    marginBottom: 16,
  },
  dateActionBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  calendarPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 8,
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 8,
  },
  todayBtnText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});