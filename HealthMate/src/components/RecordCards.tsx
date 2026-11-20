import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useHealth } from '../context/HealthContext';
import { HealthRecord } from '../types';
import { formatDisplayDate, getTodayDateString } from '../utils/validation';
import { getInitialSampleData } from '../database/database';

// Cute theme colors matching Dashboard
const CUTE_COLORS = {
  steps: {
    icon: '#b910a5',
    bg: '#FDF2F8',
    iconBg: '#efd3eb',
    border: '#FBCFE8',
    text: '#9D174D',
  },
  calories: {
    icon: '#F59E0B',
    bg: '#FFFBEB',
    iconBg: '#FEF3C7',
    border: '#FDE68A',
    text: '#B45309',
  },
  water: {
    icon: '#0EA5E9',
    bg: '#F0F9FF',
    iconBg: '#E0F2FE',
    border: '#BAE6FD',
    text: '#0369A1',
  },
  calendar: {
    icon: '#10B981',
    bg: '#ECFDF5',
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
      {/* Date Header Badge */}
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

      {/* Main Row: Left Metrics + Right Buttons */}
      <View style={styles.cardBody}>
        {/* Left Side: Steps, Calories, Water with cute pastel boxes */}
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

        {/* Right Side: Cute EDIT and DELETE Buttons */}
        <View style={styles.buttonsColumn}>
          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit(record)}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={14} color="#FFFFFF" />
            <Text style={styles.editBtnText}>EDIT</Text>
          </TouchableOpacity>

          {/* Delete Button */}
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

export default function RecordsScreen() {
  const router = useRouter();

  const {
    records,
    filteredRecords,
    searchQuery,
    setSearchQuery,
    isLoading,
    refreshRecords,
    deleteRecord,
    setSelectedRecord,
    resetWithDummyData,
  } = useHealth();

  const [refreshing, setRefreshing] = useState(false);

  // Fallback to sample records if database is empty
  const displayRecords =
    searchQuery.trim().length > 0
      ? filteredRecords
      : records.length > 0
      ? records
      : getInitialSampleData();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRecords();
    setRefreshing(false);
  };

  const handleEdit = (record: HealthRecord) => {
    setSelectedRecord(record);
    router.push('/add');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Section Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Health Records</Text>
          <Text style={styles.headerSubtitle}>
            Showing {displayRecords.length} recorded entries
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedRecord(null);
            router.push('/add');
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Search & Filter Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color={CUTE_COLORS.calendar.icon}
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
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={THEME.colors.textMuted}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Records FlatList */}
        <FlatList
          data={displayRecords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecordCard
              record={item}
              onEdit={handleEdit}
              onDelete={deleteRecord}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isLoading}
              onRefresh={onRefresh}
              tintColor={CUTE_COLORS.calendar.icon}
              colors={[CUTE_COLORS.calendar.icon]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="calendar-outline"
                  size={36}
                  color={CUTE_COLORS.calendar.icon}
                />
              </View>
              <Text style={styles.emptyTitle}>No Records Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No health entries match "${searchQuery}". Try another date.`
                  : 'No records yet! Tap below to load sample records or tap + to add one.'}
              </Text>

              {searchQuery ? (
                <TouchableOpacity
                  style={styles.resetSearchBtn}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.resetSearchText}>Clear Date Filter</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.loadSampleBtn}
                  onPress={() => resetWithDummyData()}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh" size={16} color="#FFFFFF" />
                  <Text style={styles.loadSampleText}>Load Sample Records</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: CUTE_COLORS.calendar.icon,
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: CUTE_COLORS.calendar.icon,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  listContent: {
    padding: 16,
    paddingBottom: 36,
  },

  // --- Cute Record Card Styles (Matching Dashboard) ---
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
    color: '#15803D',
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

  // --- Empty List Styles ---
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: CUTE_COLORS.calendar.bg,
    borderWidth: 1,
    borderColor: CUTE_COLORS.calendar.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetSearchBtn: {
    marginTop: 14,
    backgroundColor: CUTE_COLORS.calendar.bg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CUTE_COLORS.calendar.border,
  },
  resetSearchText: {
    color: CUTE_COLORS.calendar.text,
    fontWeight: '700',
    fontSize: 13,
  },
  loadSampleBtn: {
    marginTop: 16,
    backgroundColor: CUTE_COLORS.calendar.icon,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: CUTE_COLORS.calendar.icon,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  loadSampleText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
