import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { THEME } from '../constants/theme';

interface AppHeaderPropos {
    showBack?: boolean;
    onBackPress?: () => void;
    rightElement?: React.ReactNode;
}

export function AppHeader ({ showBack = false, onBackPress, rightElement }: AppHeaderPropos ) {
    const insets = useSafeAreaInsets();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else if ( router.canGoBack()) {
            router.back();
        } else {
            router.navigate ('/');
        }
    };

    return (
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 12)}]}>
            <View style={styles.innerRow}>
                <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity
                    style={styles.backBtn}
                    onPress={handleBack}
                    accessibilityLabel="Go back"
                    activeOpacity={0.7}
                    >
                        <Ionicons name='arrow-back' size={24} color={THEME.colors.textPrimary} />
                    </TouchableOpacity>
                )}

                <View style={styles.logoContainer}>
                    <View style={styles.heartIconWrapper}>
                        <Ionicons name="heart" size={22} color="#EF4444"/>
                    </View>
                </View>
                <View>
                    <Text style={styles.logoText}>HealthMate</Text>
                    <Text style={styles.logoTagLine}> Personal Health & Welness</Text>
                </View>
            </View>
        </View>
        {rightElement ? <View style={styles.rightContainer}>{rightElement}</View> : null}
    </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: THEME.colors.surface,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: THEME.colors.border,...THEME.elevation.card,
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    backBtn: {
        padding: 6,
        marginRight: 2,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    heartIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 10,
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
    logoTagLine: {
        fontSize: 12,
        fontWeight: '500',
        color: THEME.colors.textSecondary,
        marginTop: 1,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});