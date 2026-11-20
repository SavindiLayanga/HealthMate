import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RecordsScreen() {
   const router = useRouter();

   return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search"
                        size={18}
                        color={THEME.colors.textMuted}
                        style={styles.searchIcon}
                    />
               
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>Health Records</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => router.push('/add')}
                                activeOpacity={0.8}
                            />
                        </View>
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
})