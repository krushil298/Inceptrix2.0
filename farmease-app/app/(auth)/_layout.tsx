import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';

export default function AuthLayout() {
    const { isAuthenticated, isOnboarded } = useAuthStore();

    // If user is fully authenticated and onboarded, redirect to tabs
    if (isAuthenticated && isOnboarded) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="role-select" />
            <Stack.Screen name="register-farmer" />
            <Stack.Screen name="register-buyer" />
            <Stack.Screen name="onboarding" />
        </Stack>
    );
}
