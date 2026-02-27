import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onFilterPress?: () => void;
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder = 'Search products, farmers, locations...',
    onFilterPress,
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textLight}
            />
            {onFilterPress && (
                <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
                    <Text style={styles.filterIcon}>⚙️</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        marginHorizontal: spacing.base,
        marginVertical: spacing.sm,
        ...shadows.sm,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        fontSize: typography.sizes.base,
        color: colors.text,
    },
    filterButton: {
        padding: spacing.sm,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
    },
    filterIcon: {
        fontSize: 14,
    },
});
