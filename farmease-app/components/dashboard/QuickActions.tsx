import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';
import { useTranslation } from '../../hooks/useTranslation';

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
            bgColor: '#E8F5E9',
            iconBg: '#C8E6C9',
        },
        {
            id: 'crop',
            icon: '🌱',
            label: t('dashboard.cropRecommend'),
            subtitle: t('dashboard.cropRecommendDesc'),
            route: '/crop-recommend',
            bgColor: '#FFF3E0',
            iconBg: '#FFE0B2',
        },
        {
            id: 'market',
            icon: '🛒',
            label: t('dashboard.marketplace'),
            subtitle: t('dashboard.marketplaceDesc'),
            route: '/(tabs)/marketplace',
            bgColor: '#E3F2FD',
            iconBg: '#BBDEFB',
        },
        {
            id: 'schemes',
            icon: '📋',
            label: t('dashboard.govSchemes'),
            subtitle: t('dashboard.govSchemesDesc'),
            route: '/schemes',
            bgColor: '#F3E5F5',
            iconBg: '#E1BEE7',
        },
        {
            id: 'rent',
            icon: '🚜',
            label: t('dashboard.rentEquipment'),
            subtitle: t('dashboard.rentEquipmentDesc'),
            route: '/rentals',
            bgColor: '#FFF8E1',
            iconBg: '#FFECB3',
        },
    ];

    return (
        <View style={styles.wrapper}>
            <Text style={styles.sectionTitle}>{t('dashboard.quickActions')}</Text>
            <View style={styles.grid}>
                {ACTIONS.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        style={[styles.card, { backgroundColor: action.bgColor }]}
                        onPress={() => router.push(action.route as any)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconWrapper, { backgroundColor: action.iconBg }]}>
                            <Text style={styles.icon}>{action.icon}</Text>
                        </View>
                        <Text style={styles.label}>{action.label}</Text>
                        <Text style={styles.subtitle}>{action.subtitle}</Text>
                    </TouchableOpacity>
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
    card: {
        width: '47%',
        borderRadius: borderRadius.xl,
        padding: spacing.base,
        ...shadows.sm,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    icon: {
        fontSize: 24,
    },
    label: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.text,
    },
    subtitle: {
        fontSize: typography.sizes.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
});
