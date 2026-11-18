import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CaloriesDetailScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.mainTitle}> Track Your Daily Calories </Text>
                <Text style={styles.subTitle}> Monitor calories burned and consumed </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    titleContainer: {
        paddingHorizontal: 20,
        marginTop: 16,
        marginBottom: 10,
    },
    mainTitle : {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    subTitle : {
        fontSize: 14,
        color: '#6B7280',
    },
})