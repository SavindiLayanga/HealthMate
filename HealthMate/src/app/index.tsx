import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header with Heart Logo & HealthMate Title */}
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

        <View style={styles.subTopicContainer}>
         <Text style={styles.subTopicTitle}>
          Track Your Daily Health Activities
         </Text>
        </View>
         <Text style={styles.placeholderText}>
          Helloooo saviii 
         </Text>
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
});
