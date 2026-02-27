import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';
import { SortOption } from '../../services/marketplace';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: {
        minPrice?: number;
        maxPrice?: number;
        sort: SortOption;
    }) => void;
    currentSort?: SortOption;
    currentMinPrice?: number;
    currentMaxPrice?: number;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: '🆕  Newest First', value: 'newest' },
    { label: '💰  Price: Low → High', value: 'price_low' },
    { label: '💎  Price: High → Low', value: 'price_high' },
];

export default function FilterModal({
    visible,
    onClose,
    onApply,
    currentSort = 'newest',
    currentMinPrice,
    currentMaxPrice,
}: FilterModalProps) {
    const [sort, setSort] = useState<SortOption>(currentSort);
    const [minPrice, setMinPrice] = useState(currentMinPrice?.toString() || '');
    const [maxPrice, setMaxPrice] = useState(currentMaxPrice?.toString() || '');

    const handleApply = () => {
        onApply({
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            sort,
        });
        onClose();
    };

    const handleReset = () => {
        setSort('newest');
        setMinPrice('');
        setMaxPrice('');
        onApply({ sort: 'newest' });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => { }}>
                    {/* Handle Indicator */}
                    <View style={styles.handle} />

                    <Text style={styles.title}>Filters & Sort</Text>

                    {/* Sort Options */}
                    <Text style={styles.sectionLabel}>Sort By</Text>
                    {SORT_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.sortOption,
                                sort === option.value && styles.sortOptionActive,
                            ]}
                            onPress={() => setSort(option.value)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.sortOptionText,
                                    sort === option.value && styles.sortOptionTextActive,
                                ]}
                            >
                                {option.label}
                            </Text>
                            {sort === option.value && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </TouchableOpacity>
                    ))}

                    {/* Price Range */}
                    <Text style={styles.sectionLabel}>Price Range (₹)</Text>
                    <View style={styles.priceRow}>
                        <View style={styles.priceInput}>
                            <Input
                                placeholder="Min"
                                value={minPrice}
                                onChangeText={setMinPrice}
                                keyboardType="numeric"
                            />
                        </View>
                        <Text style={styles.priceDash}>—</Text>
                        <View style={styles.priceInput}>
                            <Input
                                placeholder="Max"
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <Button
                            title="Reset"
                            onPress={handleReset}
                            variant="outline"
                            style={styles.actionButton}
                        />
                        <Button
                            title="Apply Filters"
                            onPress={handleApply}
                            style={styles.actionButton}
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.xl,
        paddingBottom: spacing['3xl'],
        ...shadows.lg,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border,
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.lg,
    },
    sectionLabel: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.xs,
    },
    sortOptionActive: {
        backgroundColor: colors.accentLighter,
    },
    sortOptionText: {
        fontSize: typography.sizes.base,
        color: colors.textSecondary,
    },
    sortOptionTextActive: {
        color: colors.primary,
        fontWeight: '600',
    },
    checkmark: {
        color: colors.primary,
        fontSize: typography.sizes.lg,
        fontWeight: '700',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    priceInput: {
        flex: 1,
    },
    priceDash: {
        fontSize: typography.sizes.lg,
        color: colors.textLight,
        marginBottom: spacing.base, // align with Input marginBottom
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    actionButton: {
        flex: 1,
    },
});
