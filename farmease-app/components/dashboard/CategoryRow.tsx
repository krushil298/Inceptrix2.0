import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CategoryPill from '../ui/CategoryPill';
import { CROP_CATEGORIES } from '../../utils/constants';
import { colors, spacing, typography } from '../../utils/theme';

interface CategoryRowProps {
    onCategorySelect?: (category: string) => void;
}

export default function CategoryRow({ onCategorySelect }: CategoryRowProps) {
    const [selected, setSelected] = useState('All');

    const handleSelect = (category: string) => {
        setSelected(category);
        onCategorySelect?.(category);
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <CategoryPill
                categories={CROP_CATEGORIES}
                selected={selected}
                onSelect={handleSelect}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        color: colors.text,
        paddingHorizontal: spacing.base,
        marginBottom: spacing.xs,
    },
});
