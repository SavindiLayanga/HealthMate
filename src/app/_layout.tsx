
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HealthProvider, useHealth } from '../context/HealthContext';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/appHeader';
import { SplashScreen } from '../components/splashScreen';

// NEW: Import PanResponder and View
import { PanResponder, View } from 'react-native';

function AppNavigation() {

    const router = useRouter();

    const { isInitializing } = useHealth() as ReturnType<typeof useHealth> & {
        isInitializing: boolean;
    };

    // NEW: Handle swipe navigation
    const currentScreen = useRef(0);

    // NEW: Detect left and right swipe gestures
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dx) > 40 &&
                Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5,

            onPanResponderRelease: (_, gestureState) => {

                // NEW: Swipe left - Next screen
                if (gestureState.dx < -60) {
                    if (currentScreen.current < 2) {
                        currentScreen.current += 1;

                        const screens = ['/','/records','/add'];
                        router.navigate(screens[currentScreen.current] as any);
                    }
                }

                // NEW: Swipe right - Previous screen
                else if (gestureState.dx > 60) {
                    if (currentScreen.current > 0) {
                        currentScreen.current -= 1;

                        const screens = ['/','/records','/add'];
                        router.navigate(screens[currentScreen.current] as any);
                    }
                }
            },
        })
    ).current;

    // Existing: Show splash screen during initialization
    if (isInitializing) {
        return <SplashScreen />;
    }

    return (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
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

                {/* Dashboard tab */}
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Dashboard',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="grid-outline" size={size} color={color as string} />
                        ),
                    }}
                />

                {/* Record tab */}
                <Tabs.Screen
                    name="records"
                    options={{
                        title: 'Record',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="list-outline" size={size} color={color as string} />
                        ),
                    }}
                />

                {/* Add Entry tab */}
                <Tabs.Screen
                    name="add"
                    options={{
                        title: 'Add Entry',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="add-circle" size={size} color={color as string} />
                        ),
                    }}
                />

            </Tabs>
        </View>
    );
}

export default function RootLayout() {
    return (
        <HealthProvider>
            <AppNavigation />
        </HealthProvider>
    );
}
