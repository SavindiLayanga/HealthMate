import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function StepsDetailScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
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
      >
        <Ionicons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}> Track Your Daily Steps</Text>
        <Text style={styles.subTitle}> Keep moving to reach your daily goal</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 12,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827'
  },
  subTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});