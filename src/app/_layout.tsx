import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { HealthProvider, useHealth} from '../context/HealthContext';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/appHeader';
import { SplashScreen } from '../components/splashScreen';

function AppNavigation () {
    const { isInitializing } = useHealth() as ReturnType<typeof useHealth> & {
        isInitializing: boolean;
    };
    if (isInitializing){
        return <SplashScreen />
    }
    return (
        <>
            <StatusBar style="dark" />
            <Tabs
             screenOptions={{
                headerShown: true,
                header: () => <AppHeader />,
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

            <Tabs.Screen
                name='index'
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size}) => (
                        <Ionicons name="grid-outline" size={size} color={color as string}/>
                    ),
                }}
            />

            <Tabs.Screen
                name='records'
                options={{
                    title: 'Record',
                    tabBarIcon: ({ color, size}) => (
                        <Ionicons name="list-outline" size={size} color={color as string}/>
                    ),
                }}
            />

            <Tabs.Screen
                name='add'
                options={{
                    title: 'Add Entry',
                    tabBarIcon: ({ color, size}) => (
                        <Ionicons name="add-circle" size={size} color={color as string}/>
                    ),
                }}
            />
    
            </Tabs>
            
        </>

    );
}

export default function RootLayout (){
     return (
        <HealthProvider>
            <AppNavigation/>
        </HealthProvider>
    )
}