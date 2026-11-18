import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CaloriesDetailScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

      <View style={styles.titleRow}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.navigate('/');
          }
        }}
        accessibilityLabel="Go back"
        hitSlop={{ top:12, bottom:12, left:12, right:12 }}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>Track Your Daily Calories</Text>
        <Text style={styles.subTitle}>Monitor calories burned and consumed</Text>
      </View>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.infoText}>blaaaaaa</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
    marginBottom: 10,
  },
  backBtn: {
    paddingLeft: 2,
    paddingRight: 0,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 4,
    flex: 1,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  subTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  contentBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
