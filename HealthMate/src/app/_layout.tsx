import React from 'react';
import {Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HealthProvider} from '../context/HealthContext';

export default function RootLayout() {
    return (
        <HealthProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="records"/>
                <Stack.Screen name="add"/>
                <Stack.Screen name="report"/>
                <Stack.Screen name="steps-detail"/>
            </Stack>
        </HealthProvider>
    );
}
