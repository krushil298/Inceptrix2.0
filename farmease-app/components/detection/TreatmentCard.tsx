import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';

interface TreatmentCardProps {
    step: number;
    title: string;
    description: string;
    type: 'chemical' | 'organic' | 'cultural';
    product?: string;
    onProductPress?: () => void;
}

const TYPE_CONFIG = {
    chemical: { emoji: '🧪', label: 'Chemical', bg: '#FFF3E0', border: '#F57C00' },
    organic: { emoji: '🌿', label: 'Organic', bg: '#E8F5E9', border: '#2E7D32' },
    cultural: { emoji: '🌾', label: 'Cultural', bg: '#E3F2FD', border: '#1565C0' },
};

export default function TreatmentCard({
    step,
    title,
    description,
    type,
    product,
    onProductPress,
}: TreatmentCardProps) {
    const config = TYPE_CONFIG[type];

    return (
        <View style={[styles.container, { borderLeftColor: config.border }]}>
            <View style={styles.header}>
                <View style={styles.stepBadge}>
                    <Text style={styles.stepText}>{step}</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
                    <Text style={styles.typeEmoji}>{config.emoji}</Text>
                    <Text style={[styles.typeLabel, { color: config.border }]}>{config.label}</Text>
                </View>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            {product && (
                <TouchableOpacity
                    style={styles.productLink}
                    onPress={onProductPress}
                    activeOpacity={0.7}
                >
                    <Text style={styles.productIcon}>🛒</Text>
                    <Text style={styles.productText}>Buy {product} →</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        marginHorizontal: spacing.base,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        ...shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    stepBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepText: {
        color: colors.textOnPrimary,
        fontSize: typography.sizes.sm,
        fontWeight: '700',
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    typeEmoji: {
        fontSize: 12,
    },
    typeLabel: {
        fontSize: typography.sizes.xs,
        fontWeight: '600',
    },
    title: {
        fontSize: typography.sizes.base,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    productLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.md,
        backgroundColor: colors.accentLighter,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        alignSelf: 'flex-start',
    },
    productIcon: {
        fontSize: 14,
    },
    productText: {
        fontSize: typography.sizes.sm,
        fontWeight: '600',
        color: colors.primaryDark,
    },
});
