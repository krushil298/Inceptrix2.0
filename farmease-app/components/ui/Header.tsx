import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../utils/theme';

interface HeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

export default function Header({ title, subtitle, showBack = false, onBack, rightAction }: HeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                )}
                <View>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            </View>
            {rightAction && <View style={styles.right}>{rightAction}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    right: {},
    backButton: {
        padding: spacing.xs,
    },
    backIcon: {
        fontSize: typography.sizes['2xl'],
        color: colors.text,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: '700',
        color: colors.text,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
    },
});
