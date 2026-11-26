
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Ionicons
                    name="heart"
                    size={55}
                    color="#10B981"
                />
            </View>
            <Text style={styles.title}> HealthMate</Text>

            <Text style={styles.subtitle}> Your Health, Your Journey </Text>

            <ActivityIndicator
                size="large"
                color="#10B981"
                style={styles.loader}
            />

            <Text style={styles.loadingText}> Preparing your health data... </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 25,
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#10B981',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
    },
    loader: {
        marginTop: 40,
    },
    loadingText: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 12,
    },
});
