import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';

export default function RecordsScreen() {
   return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create ({
    safeArea: {
        flex: 1,
        backgroundColor: THEME.colors.surface,
    },
    container: {
        flex: 1,
        //backgroundColor: THEME.colors.background,
    },
})