import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows, typography } from '../../utils/theme';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
    style?: ViewStyle;
    padding?: number;
}

export default function Card({
    children,
    title,
    subtitle,
    variant = 'default',
    style,
    padding = spacing.base,
}: CardProps) {
    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'elevated':
                return { ...shadows.lg, backgroundColor: colors.surface };
            case 'outlined':
                return { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface };
            case 'gradient':
                return { backgroundColor: colors.primary };
            default:
                return { ...shadows.md, backgroundColor: colors.surface };
        }
    };

    return (
        <View style={[styles.base, getVariantStyles(), { padding }, style]}>
            {title && (
                <View style={styles.header}>
                    <Text style={[styles.title, variant === 'gradient' && { color: colors.textOnPrimary }]}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={[styles.subtitle, variant === 'gradient' && { color: colors.accentLighter }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            )}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    header: {
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: '600',
        color: colors.text,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
});
