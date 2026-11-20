import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';

export default function RecordsScreen() {
   return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}> Health Reords</Text>
                    </View>
                </View>
            </View>
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