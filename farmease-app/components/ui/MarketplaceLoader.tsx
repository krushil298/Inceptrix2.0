import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { useTranslation } from '../../hooks/useTranslation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BOUNCING_ITEMS = ['🍅', '🌾', '🥬', '🍌', '🌶️', '🥭'];
const LOADING_TEXTS = [
    'Finding fresh produce...',
    'Connecting with farmers...',
    'Loading marketplace...',
];

export default function MarketplaceLoader() {
    const { t } = useTranslation();
    const bounceAnims = useRef(BOUNCING_ITEMS.map(() => new Animated.Value(0))).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const textIndex = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in entire screen
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        // Staggered bounce for emoji items
        const bounceAnimations = bounceAnims.map((anim, index) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(index * 150),
                    Animated.timing(anim, {
                        toValue: -18,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.delay((BOUNCING_ITEMS.length - index - 1) * 150),
                ])
            )
        );
        Animated.stagger(0, bounceAnimations).start();

        // Pulse animation for the cart icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Progress bar animation
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
        }).start();
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Top decoration */}
            <View style={styles.topDecor}>
                <Text style={styles.topEmoji}>🛒</Text>
            </View>

            {/* Main cart icon with pulse */}
            <Animated.View style={[styles.cartCircle, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.cartEmoji}>🛍️</Text>
            </Animated.View>

            {/* Bouncing produce items */}
            <View style={styles.bounceRow}>
                {BOUNCING_ITEMS.map((item, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.bounceItem,
                            { transform: [{ translateY: bounceAnims[i] }] },
                        ]}
                    >
                        <Text style={styles.bounceEmoji}>{item}</Text>
                    </Animated.View>
                ))}
            </View>

            {/* Loading text */}
            <Text style={styles.loadingTitle}>{t('marketplace.loading')}</Text>
            <Text style={styles.loadingSubtext}>{t('marketplace.loadingSubtext')}</Text>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth as any }]} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    topDecor: {
        position: 'absolute',
        top: 80,
        right: 30,
        opacity: 0.12,
    },
    topEmoji: {
        fontSize: 80,
    },
    cartCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing['2xl'],
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    cartEmoji: {
        fontSize: 48,
    },
    bounceRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing['2xl'],
    },
    bounceItem: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    bounceEmoji: {
        fontSize: 22,
    },
    loadingTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    loadingSubtext: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    progressTrack: {
        width: SCREEN_WIDTH * 0.6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.border,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: colors.primary,
    },
});
