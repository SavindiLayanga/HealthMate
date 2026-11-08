import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. Top Header with Heart Logo & HealthMate Title */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.heartIconWrapper}>
            <Ionicons name="heart" size={24} color="#EF4444" />
          </View>
          <View>
            <Text style={styles.logoText}>HealthMate</Text>
            <Text style={styles.logoTagline}>Personal Health & Wellness</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
          {/* 2. sub topic */}
        <View style={styles.subTopicContainer}>
         <Text style={styles.subTopicTitle}>
          Track Your Daily Health Activities
         </Text>
        </View>
         
        {/* 3. Today date box */}
        <View style={styles.dateCard}>
          <View style={styles.dateCardLeft}>
            <View style={styles.calenderBadge}>
              <Ionicons name="calendar" size={16} color="#10B981" />
              <Text style={styles.dateText}> Sunday, Nov 08 2026</Text>
            </View>
          </View>
        </View>

         {/* 3. Water Button */}
         <TouchableOpacity
           style={styles.quickWaterBtn}
           onPress={() => alert("Water added!")}
            activeOpacity={0.8}
         >
          <Ionicons name="water" size={16} color="#FFFFFF" />
          <Text style={styles.quickWaterBtnText}> +250 ml</Text>
         </TouchableOpacity>
     </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    justifyContent: 'space-between',
    ...THEME.elevation.card,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heartIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FEE2E2', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  logoTagline: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 15,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  subTopicContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom:12,
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
    lineHeight:18
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
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
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
});
