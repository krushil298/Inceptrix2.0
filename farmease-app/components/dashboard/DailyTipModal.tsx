import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DailyTip {
    emoji: string;
    title: string;
    description: string;
    category: string;
    categoryColor: string;
}

const ALL_TIPS: DailyTip[] = [
    {
        emoji: '💧',
        title: 'Water Management',
        description: 'Water crops early morning or late evening to reduce evaporation. Drip irrigation can save up to 60% water compared to flood irrigation.',
        category: 'Seasonal Tip',
        categoryColor: '#2D6A4F',
    },
    {
        emoji: '📈',
        title: 'Market Alert',
        description: 'Tomato prices are rising across major mandis. If you have stock ready, consider listing on the marketplace now for best returns!',
        category: 'Market Alert',
        categoryColor: '#F59E0B',
    },
    {
        emoji: '🔍',
        title: 'Crop Health Check',
        description: 'Inspect wheat crops for yellow rust — brown streaks on leaves are early signs. Use the Disease Detection scanner for instant diagnosis.',
        category: 'Health Tip',
        categoryColor: '#E63946',
    },
    {
        emoji: '🌿',
        title: 'Organic Composting',
        description: 'Mix crop residues with cow dung in 3:1 ratio. Turn the pile every 15 days for nutrient-rich compost ready in 45 days.',
        category: 'Seasonal Tip',
        categoryColor: '#2D6A4F',
    },
    {
        emoji: '🐛',
        title: 'Natural Pest Control',
        description: 'Neem oil spray (5ml/L water) keeps aphids and whiteflies away. Apply every 10 days during flowering for chemical-free protection.',
        category: 'Health Tip',
        categoryColor: '#E63946',
    },
    {
        emoji: '🌾',
        title: 'Crop Rotation Benefits',
        description: 'Alternate legumes with cereals to naturally fix nitrogen in soil. This can improve yield by 20-25% in the next season.',
        category: 'Seasonal Tip',
        categoryColor: '#2D6A4F',
    },
    {
        emoji: '📊',
        title: 'Soil Testing Reminder',
        description: 'Get soil tested every 2 years from your nearest Krishi Vigyan Kendra — it\'s free! Proper testing guides optimal fertilizer usage.',
        category: 'Health Tip',
        categoryColor: '#E63946',
    },
    {
        emoji: '💰',
        title: 'Subsidy Alert',
        description: 'PM-KISAN next installment is expected soon. Ensure your bank details and Aadhaar are linked to receive ₹2,000 directly.',
        category: 'Market Alert',
        categoryColor: '#F59E0B',
    },
    {
        emoji: '🛒',
        title: 'Price Opportunity',
        description: 'Onion prices are expected to surge next month. Consider storing current harvest in ventilated structures for better returns.',
        category: 'Market Alert',
        categoryColor: '#F59E0B',
    },
];

const STORAGE_KEY = 'farmease_daily_tip';

function getTipOfDay(): DailyTip {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return ALL_TIPS[dayOfYear % ALL_TIPS.length];
}

async function shouldShowTip(): Promise<boolean> {
    try {
        const lastShown = await AsyncStorage.getItem(STORAGE_KEY);
        const today = new Date().toDateString();
        return lastShown !== today;
    } catch {
        return true;
    }
}

async function markTipShown(): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, new Date().toDateString());
    } catch {}
}

interface DailyTipModalProps {
    visible: boolean;
    onClose: () => void;
    tip?: DailyTip | null;
}

export function DailyTipModal({ visible, onClose, tip }: DailyTipModalProps) {
    if (!visible) return null;

    const displayTip = tip || getTipOfDay();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Category badge */}
                    <View style={[styles.categoryBadge, { backgroundColor: displayTip.categoryColor + '18' }]}>
                        <View style={[styles.categoryDot, { backgroundColor: displayTip.categoryColor }]} />
                        <Text style={[styles.categoryText, { color: displayTip.categoryColor }]}>
                            {displayTip.category}
                        </Text>
                    </View>

                    {/* Emoji */}
                    <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>{displayTip.emoji}</Text>
                    </View>

                    {/* Content */}
                    <Text style={styles.title}>{displayTip.title}</Text>
                    <Text style={styles.description}>{displayTip.description}</Text>

                    {/* Daily tag */}
                    <View style={styles.dailyTag}>
                        <Text style={styles.dailyTagText}>🌤️ Tip of the Day</Text>
                    </View>

                    {/* Close button */}
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
                        <Text style={styles.closeBtnText}>Got it!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export function useDailyTip() {
    const [showTip, setShowTip] = useState(false);

    useEffect(() => {
        shouldShowTip().then((should) => {
            if (should) {
                // Small delay so the dashboard renders first
                setTimeout(() => setShowTip(true), 800);
            }
        });
    }, []);

    const dismissTip = () => {
        setShowTip(false);
        markTipShown();
    };

    return { showTip, dismissTip, tip: getTipOfDay() };
}

export { getTipOfDay, ALL_TIPS };
export type { DailyTip };

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modal: {
        width: SCREEN_WIDTH - spacing.xl * 2,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.lg,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.pill,
        alignSelf: 'flex-start',
        gap: spacing.xs,
        marginBottom: spacing.base,
    },
    categoryDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    categoryText: {
        fontSize: typography.sizes.xs,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emojiContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.accentLighter,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.base,
    },
    emoji: {
        fontSize: 36,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: typography.sizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.lg,
    },
    dailyTag: {
        backgroundColor: colors.warningLight,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.pill,
        marginBottom: spacing.lg,
    },
    dailyTagText: {
        fontSize: typography.sizes.xs,
        fontWeight: '600',
        color: colors.warning,
    },
    closeBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing['3xl'],
        paddingVertical: spacing.md,
        borderRadius: borderRadius.pill,
        width: '100%',
        alignItems: 'center',
    },
    closeBtnText: {
        color: colors.textOnPrimary,
        fontSize: typography.sizes.base,
        fontWeight: '700',
    },
});
