import React from 'react';
import {Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HealthMate } from '../context/HealthContext';

export default function RootLayout() {
    return (
        <HealthMate>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
        </HealthMate>
    );
}
