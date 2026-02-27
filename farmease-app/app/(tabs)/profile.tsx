import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import Button from '../../components/ui/Button';
import { usePreloadTranslations } from '../../hooks/useTranslation';
import { ActivityIndicator } from 'react-native';
import LanguagePicker from '../../components/ui/LanguagePicker';
import { LanguageCode } from '../../store/useLanguageStore';
import { getLanguageByCode } from '../../utils/languages';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, role, logout } = useAuthStore();
    const { language, setLanguage } = useLanguageStore();
    const { t, isTranslating } = usePreloadTranslations([
        'profile.title',
        'profile.farmer',
        'profile.buyer',
        'profile.myOrders',
        'profile.diseaseHistory',
        'profile.myListings',
        'profile.savedSchemes',
        'profile.language',
        'profile.helpSupport',
        'profile.about',
        'profile.signOut',
        'common.version',
    ]);
    const [showLangModal, setShowLangModal] = useState(false);

    const currentLang = getLanguageByCode(language);

    const menuItems = [
        { title: t('profile.myOrders'), emoji: '📦', route: '', action: undefined },
        { title: t('profile.diseaseHistory'), emoji: '🔬', route: '', action: undefined },
        { title: t('profile.myListings'), emoji: '📋', route: '', farmerOnly: true, action: undefined },
        { title: t('profile.savedSchemes'), emoji: '⭐', route: '', action: undefined },
        {
            title: t('profile.language'),
            emoji: '🌐',
            route: '',
            action: () => setShowLangModal(true),
            badge: currentLang.nativeName
        },
        { title: t('profile.helpSupport'), emoji: '❓', route: '', action: undefined },
        { title: t('profile.about'), emoji: 'ℹ️', route: '', action: undefined },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                {isTranslating && (
                    <View style={styles.translatingBadge}>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.translatingText}>Translating...</Text>
                    </View>
                )}
                <View style={styles.avatar}>
                    <Text style={{ fontSize: 40 }}>{role === 'farmer' ? '👨‍🌾' : '🛒'}</Text>
                </View>
                <Text style={styles.name}>{user?.name || t('common.user')}</Text>
                <Text style={styles.role}>{role === 'farmer' ? t('profile.farmer') : t('profile.buyer')}</Text>
                <Text style={styles.phone}>📱 {user?.phone || t('common.notSet')}</Text>
                {user?.farm_location && <Text style={styles.location}>📍 {user.farm_location}</Text>}
            </View>

            {/* Menu Items */}
            <View style={styles.menu}>
                {menuItems
                    .filter((item) => !item.farmerOnly || role === 'farmer')
                    .map((item, i) => (
                        <TouchableOpacity key={i} style={styles.menuItem} onPress={item.action} activeOpacity={0.7}>
                            <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                            <Text style={styles.menuText}>{item.title}</Text>
                            {item.badge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>
                    ))}
            </View>

            {/* Logout */}
            <View style={styles.logoutSection}>
                <Button
                    title={t('profile.signOut')}
                    onPress={async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    }}
                    variant="outline"
                    fullWidth
                />
            </View>

            <Text style={styles.version}>{t('common.version')}</Text>

            <LanguagePicker
                visible={showLangModal}
                onClose={() => setShowLangModal(false)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        alignItems: 'center', paddingTop: 60, paddingBottom: spacing.xl,
        backgroundColor: colors.primary, borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    name: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.textOnPrimary, marginTop: spacing.md },
    role: { fontSize: typography.sizes.sm, color: colors.accentLighter, fontWeight: '500', textTransform: 'capitalize' },
    phone: { fontSize: typography.sizes.sm, color: colors.accentLighter, marginTop: spacing.xs },
    location: { fontSize: typography.sizes.sm, color: colors.accentLighter, marginTop: 2 },
    menu: { marginTop: spacing.lg, marginHorizontal: spacing.base },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
        padding: spacing.base, borderRadius: borderRadius.lg, marginBottom: spacing.sm, ...shadows.sm,
    },
    menuText: { flex: 1, fontSize: typography.sizes.base, color: colors.text, marginLeft: spacing.md, fontWeight: '500' },
    menuArrow: { fontSize: typography.sizes.xl, color: colors.textLight },
    badge: {
        backgroundColor: colors.accentLighter, paddingHorizontal: spacing.sm, paddingVertical: 2,
        borderRadius: borderRadius.pill, marginRight: spacing.sm,
    },
    badgeText: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '600' },
    logoutSection: { padding: spacing.xl },
    version: { textAlign: 'center', fontSize: typography.sizes.xs, color: colors.textLight, paddingBottom: spacing['2xl'] },

    // Language Modal
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.surface, borderRadius: borderRadius.xl,
        padding: spacing.xl, width: '80%', ...shadows.lg,
    },
    modalTitle: {
        fontSize: typography.sizes.lg, fontWeight: '700', color: colors.text,
        textAlign: 'center', marginBottom: spacing.lg,
    },
    langOption: {
        flexDirection: 'row', alignItems: 'center', padding: spacing.base,
        borderRadius: borderRadius.lg, marginBottom: spacing.sm,
        backgroundColor: colors.background,
    },
    langOptionActive: {
        backgroundColor: colors.accentLighter, borderWidth: 2, borderColor: colors.primary,
    },
    langFlag: { fontSize: 24, marginRight: spacing.md },
    langLabel: { flex: 1, fontSize: typography.sizes.base, fontWeight: '500', color: colors.text },
    langLabelActive: { color: colors.primary, fontWeight: '700' },
    langCheck: { fontSize: typography.sizes.lg, color: colors.primary, fontWeight: '700' },
    translatingBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: borderRadius.pill,
        marginBottom: spacing.md, gap: spacing.sm,
    },
    translatingText: { fontSize: typography.sizes.xs, color: '#fff', fontWeight: '600' },
});
