import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useRecordsViewModel } from '../viewmodels/useRecordsViewModel';
import { RecordCard, CUTE_COLORS } from '../components/RecordCards';

export default function RecordsScreen() {
  const {
    searchQuery,
    setSearchQuery,
    isLoading,
    deleteRecord,
    resetWithDummyData,
    refreshing,
    displayRecords,
    onRefresh,
    handleEdit,
    handleAdd,
  } = useRecordsViewModel();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Health Records</Text>
          <Text style={styles.headerSubtitle}>
            Showing {displayRecords.length} recorded entries
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color={CUTE_COLORS.calendar.icon}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by date . . ."
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
