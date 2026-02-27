import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../utils/theme';

interface CategoryPillProps {
    categories: readonly string[];
    selected: string;
    onSelect: (category: string) => void;
}

export default function CategoryPill({ categories, selected, onSelect }: CategoryPillProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {categories.map((cat) => (
                <TouchableOpacity
                    key={cat}
                    onPress={() => onSelect(cat)}
                    style={[styles.pill, selected === cat && styles.pillActive]}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.pillText, selected === cat && styles.pillTextActive]}>{cat}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    pill: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius['2xl'],
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    pillActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    pillText: {
        fontSize: typography.sizes.sm,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    pillTextActive: {
        color: colors.textOnPrimary,
    },
});
