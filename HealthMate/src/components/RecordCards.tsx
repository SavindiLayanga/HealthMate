import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { HealthRecord } from '../types';
import { formatDisplayDate } from '../utils/validation';

type RecordCardProps = {
  record: HealthRecord;
  onEdit: (record: HealthRecord) => void;
  onDelete: (id: number) => void;
};
function RecordCard({ record, onEdit, onDelete }: RecordCardProps) {
  const handleDeletePress = () => {
    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete the record for ${record.date}?`,
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
      {/* Date Header at top */}
      <View style={styles.cardHeader}>
        <Ionicons name="calendar-outline" size={16} color={THEME.colors.primary} />
        <Text style={styles.dateText}>{formatDisplayDate(record.date)}</Text>
      </View>
      {/* Main Row: Left Metrics + Right Buttons */}
      <View style={styles.cardBody}>
        {/* Left Side: Steps, Calories, Water Intake */}
        <View style={styles.metricsColumn}>
          {/* Steps */}
          <View style={styles.metricBox}>
            <Ionicons name="walk" size={16} color={THEME.colors.steps} />
            <Text style={styles.metricText}>
              Steps: <Text style={styles.metricValue}>{record.steps.toLocaleString()}</Text>
            </Text>
          </View>
          {/* Calories */}
          <View style={styles.metricBox}>
            <Ionicons name="flame" size={16} color={THEME.colors.calories} />
            <Text style={styles.metricText}>
              Calories: <Text style={styles.metricValue}>{record.calories.toLocaleString()} kcal</Text>
            </Text>
          </View>
          {/* Water Intake */}
          <View style={styles.metricBox}>
            <Ionicons name="water" size={16} color={THEME.colors.water} />
            <Text style={styles.metricText}>
              Water Intake: <Text style={styles.metricValue}>{record.water.toLocaleString()} ml</Text>
            </Text>
          </View>
        </View>
        {/* Right Side: EDIT and DELETE Buttons */}
        <View style={styles.buttonsColumn}>
          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit(record)}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={15} color="#FFFFFF" />
            <Text style={styles.editBtnText}>EDIT</Text>
          </TouchableOpacity>
          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDeletePress}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={15} color="#FFFFFF" />
            <Text style={styles.deleteBtnText}>DELETE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function RecordsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Health Records</Text>
          <Text style={styles.headerSubtitle}>Manage your daily activity records</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color={THEME.colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search / filter by date (e.g. 2026-08)..."
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
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
  addButton: {
    backgroundColor: THEME.colors.primary,
    width: 38,
    height: 38,
    borderRadius: THEME.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  clearButton: {
    padding: 4,
  },
   card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.elevation.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceVariant,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricsColumn: {
    flex: 1,
    gap: 8,
  },
  metricBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceVariant,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 8,
  },
  metricText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  buttonsColumn: {
    width: 95,
    gap: 10,
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: THEME.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 5,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    backgroundColor: THEME.colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 5,
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});