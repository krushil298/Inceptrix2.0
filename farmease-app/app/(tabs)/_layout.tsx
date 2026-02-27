import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { colors, typography } from '../../utils/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
    return (
        <View style={[styles.iconContainer, focused && styles.iconFocused]}>
            <Text style={styles.emoji}>{emoji}</Text>
        </View>
    );
}

export default function TabLayout() {
    const { isAuthenticated, isOnboarded, role } = useAuthStore();

    if (!isAuthenticated || !isOnboarded) {
        return <Redirect href="/(auth)/login" />;
    }

    const isBuyer = role === 'buyer';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textLight,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            {/* Farmer Home — hidden for buyers */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
                    href: isBuyer ? null : '/(tabs)',
                }}
            />

            {/* Buyer Home — hidden for farmers */}
            <Tabs.Screen
                name="buyer-home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
                    href: isBuyer ? '/(tabs)/buyer-home' : null,
                }}
            />

            {/* Scan — farmer only */}
            <Tabs.Screen
                name="detect"
                options={{
                    title: 'Scan',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🔬" focused={focused} />,
                    href: isBuyer ? null : '/(tabs)/detect',
                }}
            />

            {/* Marketplace — always visible */}
            <Tabs.Screen
                name="marketplace"
                options={{
                    title: 'Market',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🛒" focused={focused} />,
                }}
            />

            {/* Profile — always visible */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.surface,
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        height: 70,
        paddingBottom: 10,
        paddingTop: 5,
    },
    tabLabel: {
        fontSize: typography.sizes.xs,
        fontWeight: '600',
    },
    iconContainer: {
        padding: 4,
        borderRadius: 12,
    },
    iconFocused: {
        backgroundColor: colors.accentLighter,
    },
    emoji: {
        fontSize: 22,
    },
});
