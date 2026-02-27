import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';
import { Product } from '../../services/marketplace';

const CARD_WIDTH = (Dimensions.get('window').width - spacing.base * 3) / 2;

interface ProductCardProps {
    product: Product;
    onPress: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(product)}
            activeOpacity={0.85}
        >
            {/* Image */}
            <View style={styles.imageWrapper}>
                {product.image_url ? (
                    <Image
                        source={{ uri: product.image_url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Text style={styles.placeholderEmoji}>🌾</Text>
                    </View>
                )}
                {/* Category Badge */}
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{product.category}</Text>
                </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {product.name}
                </Text>
                <Text style={styles.seller} numberOfLines={1}>
                    🧑‍🌾 {product.seller_name}
                </Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>
                        ₹{product.price}
                        <Text style={styles.unit}>/{product.unit}</Text>
                    </Text>
                    {onAddToCart && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => onAddToCart(product)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.md,
        ...shadows.md,
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        height: CARD_WIDTH * 0.75,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        backgroundColor: colors.accentLighter,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderEmoji: {
        fontSize: 40,
    },
    badge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    badgeText: {
        color: colors.textOnPrimary,
        fontSize: typography.sizes.xs,
        fontWeight: '600',
    },
    info: {
        padding: spacing.sm,
    },
    name: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    seller: {
        fontSize: typography.sizes.xs,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: typography.sizes.base,
        fontWeight: '700',
        color: colors.primary,
    },
    unit: {
        fontSize: typography.sizes.xs,
        fontWeight: '400',
        color: colors.textSecondary,
    },
    addButton: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.textOnPrimary,
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        lineHeight: 22,
    },
});
