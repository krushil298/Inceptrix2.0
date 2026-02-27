import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import Button from '../../components/ui/Button';
import { ONBOARDING_SLIDES } from '../../utils/constants';

const { width } = Dimensions.get('window');

const icons: Record<string, string> = { camera: '📸', leaf: '🌱', cart: '🛒' };

export default function OnboardingScreen() {
    const router = useRouter();
    const [current, setCurrent] = useState(0);

    const slide = ONBOARDING_SLIDES[current];

    const handleNext = () => {
        if (current < ONBOARDING_SLIDES.length - 1) {
            setCurrent(current + 1);
        } else {
            router.replace('/(auth)/login');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.slideContainer}>
                <Text style={styles.icon}>{icons[slide.icon]}</Text>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
            </View>

            {/* Dots indicator */}
            <View style={styles.dots}>
                {ONBOARDING_SLIDES.map((_, i) => (
                    <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
                ))}
            </View>

            <View style={styles.buttons}>
                <Button
                    title={current === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    onPress={handleNext}
                    fullWidth
                    size="lg"
                />
                {current < ONBOARDING_SLIDES.length - 1 && (
                    <Button title="Skip" onPress={() => router.replace('/(auth)/login')} variant="ghost" />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: spacing.xl },
    slideContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
    icon: { fontSize: 80, marginBottom: spacing['2xl'] },
    title: { fontSize: typography.sizes['3xl'], fontWeight: '700', color: colors.text, marginBottom: spacing.md, textAlign: 'center' },
    description: { fontSize: typography.sizes.base, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, paddingHorizontal: spacing.xl },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing['2xl'] },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
    dotActive: { width: 24, backgroundColor: colors.primary },
    buttons: { gap: spacing.md, paddingBottom: spacing['2xl'] },
});
