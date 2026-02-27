import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';
import { useTranslation } from '../../hooks/useTranslation';

function GlassCard({ icon, label, subtitle, onPress }: { icon: string; label: string; subtitle: string; onPress: () => void }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
    };

    return ( 
        <Animated.View style={[styles.cardOuter, { transform: [{ scale }] }]}>        
            <TouchableOpacity
                style={styles.card}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                <View style={styles.iconWrapper}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function QuickActions() {
    const router = useRouter();
    const { t } = useTranslation();

    const ACTIONS = [
        {
            id: 'detect',
            icon: '🔬',
            label: t('dashboard.diseaseDetection'),
            subtitle: t('dashboard.diseaseDetectionDesc'),
            route: '/(tabs)/detect',
        },
        {
            id: 'crop',
            icon: '🌱',
            label: t('dashboard.cropRecommend'),
            subtitle: t('dashboard.cropRecommendDesc'),
            route: '/crop-recommend',
        },
        {
            id: 'market',
            icon: '🛒',
            label: t('dashboard.marketplace'),
            subtitle: t('dashboard.marketplaceDesc'),
            route: '/(tabs)/marketplace',
        },
        {
            id: 'schemes',
            icon: '📋',
            label: t('dashboard.govSchemes'),
            subtitle: t('dashboard.govSchemesDesc'),
            route: '/schemes',
        },
        {
            id: 'rent',
            icon: '🚜',
            label: t('dashboard.rentEquipment'),
            subtitle: t('dashboard.rentEquipmentDesc'),
            route: '/rentals',
        },
    ];

    return (
        <View style={styles.wrapper}>
            <Text style={styles.sectionTitle}>{t('dashboard.quickActions')}</Text>
            <View style={styles.grid}>
                {ACTIONS.map((action) => (
                    <GlassCard
                        key={action.id}
                        icon={action.icon}
                        label={action.label}
                        subtitle={action.subtitle}
                        onPress={() => router.push(action.route as any)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: spacing.base,
        marginTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    cardOuter: {
        width: '47%',
    },
    card: {
        backgroundColor: 'rgba(217, 217, 217, 0.58)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 17,
        padding: spacing.base,
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 8,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    icon: {
        fontSize: 24,
    },
    label: {
        fontSize: typography.sizes.md,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: typography.sizes.xs,
        color: '#555',
        marginTop: 2,
    },
});
