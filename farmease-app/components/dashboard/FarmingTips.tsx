import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.base * 2 - spacing.md;

interface Tip {
    id: string;
    emoji: string;
    title: string;
    description: string;
    season: string;
}

const TIPS: Tip[] = [
    {
        id: '1',
        emoji: '💧',
        title: 'Water Management',
        description: 'Water crops early morning or late evening to reduce evaporation. Drip irrigation can save up to 60% water.',
        season: 'All Seasons',
    },
    {
        id: '2',
        emoji: '🌿',
        title: 'Organic Composting',
        description: 'Mix crop residues with cow dung in 3:1 ratio. Turn the pile every 15 days for nutrient-rich compost in 45 days.',
        season: 'Pre-Season',
    },
    {
        id: '3',
        emoji: '🐛',
        title: 'Natural Pest Control',
        description: 'Neem oil spray (5ml/L water) keeps aphids and whiteflies away. Apply every 10 days during flowering.',
        season: 'Kharif',
    },
    {
        id: '4',
        emoji: '🌾',
        title: 'Crop Rotation Benefits',
        description: 'Alternate legumes with cereals to naturally fix nitrogen. This can improve yield by 20-25% in the next season.',
        season: 'Rabi',
    },
    {
        id: '5',
        emoji: '🌱',
        title: 'Seed Treatment',
        description: 'Treat seeds with Trichoderma (10g/kg seed) before sowing. Protects against soil-borne diseases for 45 days.',
        season: 'Pre-Sowing',
    },
    {
        id: '6',
        emoji: '📊',
        title: 'Soil Testing',
        description: 'Get soil tested every 2 years from your nearest Krishi Vigyan Kendra. It\'s free and guides fertilizer usage.',
        season: 'All Seasons',
    },
];

export default function FarmingTips() {
    const scrollRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [userScrolling, setUserScrolling] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (userScrolling) return;
            const nextIndex = (activeIndex + 1) % TIPS.length;
            scrollRef.current?.scrollTo({ x: nextIndex * (CARD_WIDTH + spacing.md), animated: true });
            setActiveIndex(nextIndex);
        }, 4000);

        return () => clearInterval(interval);
    }, [activeIndex, userScrolling]);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + spacing.md));
        setActiveIndex(index);
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.sectionTitle}>🌾 Farming Tips</Text>

            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled={false}
                snapToInterval={CARD_WIDTH + spacing.md}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScrollBeginDrag={() => setUserScrolling(true)}
                onScrollEndDrag={() => setTimeout(() => setUserScrolling(false), 3000)}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {TIPS.map((tip) => (
                    <View key={tip.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.emoji}>{tip.emoji}</Text>
                            <View style={styles.seasonBadge}>
                                <Text style={styles.seasonText}>{tip.season}</Text>
                            </View>
                        </View>
                        <Text style={styles.tipTitle}>{tip.title}</Text>
                        <Text style={styles.tipDesc}>{tip.description}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Dot indicators */}
            <View style={styles.dots}>
                {TIPS.map((_, i) => (
                    <View
                        key={i}
                        style={[styles.dot, i === activeIndex && styles.dotActive]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: spacing.lg,
        marginBottom: spacing['2xl'],
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        color: colors.text,
        paddingHorizontal: spacing.base,
        marginBottom: spacing.md,
    },
    scrollContent: {
        paddingHorizontal: spacing.base,
        gap: spacing.md,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.base,
        borderLeftWidth: 4,
        borderLeftColor: colors.accent,
        ...shadows.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    emoji: {
        fontSize: 28,
    },
    seasonBadge: {
        backgroundColor: colors.accentLighter,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    seasonText: {
        fontSize: typography.sizes.xs,
        fontWeight: '600',
        color: colors.primaryDark,
    },
    tipTitle: {
        fontSize: typography.sizes.base,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    tipDesc: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xs,
        marginTop: spacing.md,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.border,
    },
    dotActive: {
        width: 20,
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
});
