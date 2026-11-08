import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { HealthProvider} from '../context/HealthContext';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
    return (
        <HealthProvider>
            <StatusBar style="dark" />
            <Tabs
             screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#10B981',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
             }}
            >
            {/*bottom nav bar - 1. Dashboard tab*/}
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size}) => (
                        <Ionicons name="grid-outline" size={size} color={color as string}/>
                    ),
                }}
            />

            {/*bottom nav bar - 2. Record tab*/}
            <Tabs.Screen
                name='records'
                options={{
                    title: 'Record',
                    tabBarIcon: ({ color, size}) => (
                        <Ionicons name="list-outline" size={size} color={color as string}/>
                    ),
                }}
            />

            {/*bottom nav bar - 3. Add Entry tab*/}
            <Tabs.Screen
                name='add'
                options={{
                    title: 'Add Entry',
                    tabBarIcon: ({ color, size}) => (
                        <Ionicons name="add-circle" size={size} color={color as string}/>
                    ),
                }}
            />

            {/*bottom nav bar - 4. Report tab*/}
            <Tabs.Screen
                name='report'
                options={{
                    title: 'Report',
                    tabBarIcon: ({ color, size}) => (
                        <Ionicons name="bar-chart-outline" size={size} color={color as string}/>
                    ),
                }}
            />
            </Tabs>
        </HealthProvider>
    );
}
