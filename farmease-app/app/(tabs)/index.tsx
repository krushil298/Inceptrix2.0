import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { getGreeting } from '../../utils/helpers';
import Card from '../../components/ui/Card';
import WeatherWidget from '../../components/dashboard/WeatherWidget';
import CategoryGrid from '../../components/dashboard/CategoryGrid';

// Category data for horizontal scroll
const CATEGORIES = [
    { id: '1', title: 'Scan Disease', emoji: '🔬' },
    { id: '2', title: 'Crop Advice', emoji: '🌱' },
    { id: '3', title: 'Marketplace', emoji: '🛒' },
    { id: '4', title: 'Fertilizer', emoji: '🧪' },
    { id: '5', title: 'Schemes', emoji: '📚' },
    { id: '6', title: 'Soil Info', emoji: '🌍' },
];

// Quick action cards
const QUICK_ACTIONS = [
    { title: 'Disease Detection', emoji: '📸', desc: 'Scan crop leaves', route: '/(tabs)/detect', color: '#2D6A4F' },
    { title: 'Crop Recommend', emoji: '🌾', desc: 'Get best crops', route: '/crop-recommend', color: '#40916C' },
    { title: 'Marketplace', emoji: '🛒', desc: 'Buy & sell crops', route: '/(tabs)/marketplace', color: '#52B788' },
    { title: 'Rent Equipment', emoji: '🚜', desc: 'Rent from locals', route: '/rentals', color: '#D4A373' },
    { title: 'Gov Schemes', emoji: '📋', desc: 'Browse schemes', route: '/schemes', color: '#74C69D' },
];

// Farming tips
const TIPS = [
    { title: 'Seasonal Tip', text: 'Prepare soil for monsoon crops!', emoji: '🌧️' },
    { title: 'Market Alert', text: 'Tomato prices rising — list now!', emoji: '📈' },
    { title: 'Health Tip', text: 'Check wheat for rust disease', emoji: '🔍' },
];

export default function DashboardScreen() {
    const router = useRouter();
    const { user, role } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);

    const categoryRoutes: Record<string, string> = {
        '1': '/(tabs)/detect',
        '2': '/crop-recommend',
        '3': '/(tabs)/marketplace',
        '4': '/fertilizer',
        '5': '/schemes',
        '6': '/crop-recommend',
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
            {/* Greeting + Weather */}
            <View style={styles.greetingSection}>
                <View>
                    <Text style={styles.greeting}>{getGreeting()}, {user?.name || (role === 'farmer' ? 'Farmer' : 'Buyer')}!</Text>
                    <Text style={styles.location}>📍 {user?.farm_location || 'Set your location'}</Text>
                </View>
            </View>

            {/* Weather Widget */}
            <WeatherWidget />

            {/* Category Grid (AI Images) */}
            <CategoryGrid />

            {/* Farming Tips Carousel */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tipsRow}>
                {TIPS.map((tip, i) => (
                    <View key={i} style={styles.tipCard}>
                        <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                        <View>
                            <Text style={styles.tipTitle}>{tip.title}</Text>
                            <Text style={styles.tipText}>{tip.text}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Quick Actions Grid */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
                {QUICK_ACTIONS.map((action, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.actionCard, { backgroundColor: action.color }]}
                        onPress={() => router.push(action.route as any)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionEmoji}>{action.emoji}</Text>
                        <Text style={styles.actionTitle}>{action.title}</Text>
                        <Text style={styles.actionDesc}>{action.desc}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Farmer-only: Soil Intelligence */}
            {role === 'farmer' && (
                <>
                    <Text style={styles.sectionTitle}>Soil Intelligence</Text>
                    <TouchableOpacity
                        style={styles.soilCard}
                        onPress={() => router.push('/crop-recommend' as any)}
                    >
                        <View style={styles.soilLeft}>
                            <Text style={{ fontSize: 40 }}>🌍</Text>
                        </View>
                        <View style={styles.soilRight}>
                            <Text style={styles.soilTitle}>Analyze Your Soil</Text>
                            <Text style={styles.soilDesc}>Enter your soil details to get personalized crop & fertilizer recommendations</Text>
                            <Text style={styles.soilCta}>Get Started →</Text>
                        </View>
                    </TouchableOpacity>
                </>
            )}

            {/* Farmer-only: Crop Planning */}
            {role === 'farmer' && (
                <>
                    <Text style={styles.sectionTitle}>Crop Planning</Text>
                    <View style={styles.planningRow}>
                        <TouchableOpacity style={styles.planCard} onPress={() => router.push('/crop-recommend' as any)}>
                            <Text style={{ fontSize: 30 }}>🌱</Text>
                            <Text style={styles.planTitle}>What to Grow</Text>
                            <Text style={styles.planDesc}>AI-based suggestions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.planCard} onPress={() => router.push('/fertilizer' as any)}>
                            <Text style={{ fontSize: 30 }}>🧪</Text>
                            <Text style={styles.planTitle}>Fertilizer Guide</Text>
                            <Text style={styles.planDesc}>Optimal nutrients</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <View style={{ height: spacing['2xl'] }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    greetingSection: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: spacing.base, paddingTop: 60, paddingBottom: spacing.base,
        backgroundColor: colors.primary, borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    },
    greeting: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.textOnPrimary },
    location: { fontSize: typography.sizes.sm, color: colors.accentLighter, marginTop: 4 },
    weatherBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm, borderRadius: borderRadius.pill,
    },
    weatherText: { fontSize: typography.sizes.sm, color: colors.textOnPrimary, fontWeight: '600' },

    categoryRow: { paddingHorizontal: spacing.base, paddingVertical: spacing.base, gap: spacing.base },
    categoryItem: { alignItems: 'center', width: 70 },
    categoryIcon: {
        width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface,
        justifyContent: 'center', alignItems: 'center', ...shadows.sm,
    },
    categoryLabel: { fontSize: typography.sizes.xs, color: colors.text, marginTop: 6, textAlign: 'center', fontWeight: '500' },

    tipsRow: { paddingHorizontal: spacing.base, gap: spacing.md, paddingBottom: spacing.base },
    tipCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight,
        paddingHorizontal: spacing.base, paddingVertical: spacing.md, borderRadius: borderRadius.lg,
        width: 260, gap: spacing.md,
    },
    tipEmoji: { fontSize: 30 },
    tipTitle: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textOnPrimary },
    tipText: { fontSize: typography.sizes.xs, color: colors.accentLighter, marginTop: 2 },

    sectionTitle: {
        fontSize: typography.sizes.lg, fontWeight: '700', color: colors.text,
        paddingHorizontal: spacing.base, marginTop: spacing.lg, marginBottom: spacing.md,
    },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.base, gap: spacing.md },
    actionCard: {
        width: '47%', padding: spacing.base, borderRadius: borderRadius.lg,
        ...shadows.md, minHeight: 110,
    },
    actionEmoji: { fontSize: 28, marginBottom: spacing.sm },
    actionTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.textOnPrimary },
    actionDesc: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

    soilCard: {
        flexDirection: 'row', marginHorizontal: spacing.base, backgroundColor: colors.surface,
        borderRadius: borderRadius.lg, ...shadows.md, overflow: 'hidden',
    },
    soilLeft: { backgroundColor: colors.accentLighter, padding: spacing.xl, justifyContent: 'center' },
    soilRight: { flex: 1, padding: spacing.base },
    soilTitle: { fontSize: typography.sizes.base, fontWeight: '700', color: colors.text },
    soilDesc: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
    soilCta: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.primary, marginTop: spacing.sm },

    planningRow: { flexDirection: 'row', paddingHorizontal: spacing.base, gap: spacing.md },
    planCard: {
        flex: 1, backgroundColor: colors.surface, padding: spacing.base,
        borderRadius: borderRadius.lg, ...shadows.sm, alignItems: 'center',
    },
    planTitle: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text, marginTop: spacing.sm },
    planDesc: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
});
