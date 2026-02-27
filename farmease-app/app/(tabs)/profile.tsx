import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import LanguagePicker from '../../components/ui/LanguagePicker';
import { usePreloadTranslations } from '../../hooks/useTranslation';
import { getLanguageByCode } from '../../utils/languages';
import { useLanguageStore } from '../../store/useLanguageStore';

const STRINGS = [
    'My Orders', 'Disease History', 'My Listings', 'Saved Schemes',
    'Language', 'Help & Support', 'About FarmEase', 'Sign Out',
    'Farmer', 'Buyer',
];

export default function ProfileScreen() {
    const router = useRouter();
    const { user, role, logout } = useAuthStore();
    const { language } = useLanguageStore();
    const [langPickerVisible, setLangPickerVisible] = useState(false);
    const { t } = usePreloadTranslations(STRINGS);

    const currentLang = getLanguageByCode(language);

    const menuItems = [
        { title: 'My Orders', emoji: '📦', route: '' },
        { title: 'Disease History', emoji: '🔬', route: '' },
        { title: 'My Listings', emoji: '📋', route: '', farmerOnly: true },
        { title: 'Saved Schemes', emoji: '⭐', route: '' },
        {
            title: 'Language',
            emoji: '🌐',
            route: '',
            onPress: () => setLangPickerVisible(true),
            subtitle: `${currentLang.flag} ${currentLang.nativeName}`,
        },
        { title: 'Help & Support', emoji: '❓', route: '' },
        { title: 'About FarmEase', emoji: 'ℹ️', route: '' },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={{ fontSize: 40 }}>{role === 'farmer' ? '👨‍🌾' : '🛒'}</Text>
                </View>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.role}>{t(role === 'farmer' ? 'Farmer' : 'Buyer')}</Text>
                <Text style={styles.phone}>📱 {user?.phone || 'Not set'}</Text>
                {user?.farm_location && <Text style={styles.location}>📍 {user.farm_location}</Text>}
            </View>

            {/* Menu Items */}
            <View style={styles.menu}>
                {menuItems
                    .filter((item) => !item.farmerOnly || role === 'farmer')
                    .map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.menuItem}
                            onPress={item.onPress}
                        >
                            <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                            <View style={{ flex: 1, marginLeft: spacing.md }}>
                                <Text style={styles.menuText}>{t(item.title)}</Text>
                                {item.subtitle && (
                                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                )}
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>
                    ))}
            </View>

            {/* Logout */}
            <View style={styles.logoutSection}>
                <Button
                    title={t('Sign Out')}
                    onPress={async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    }}
                    variant="outline"
                    fullWidth
                />
            </View>

            <Text style={styles.version}>FarmEase v1.0.0</Text>

            {/* Language Picker Modal */}
            <LanguagePicker
                visible={langPickerVisible}
                onClose={() => setLangPickerVisible(false)}
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
    menuText: { fontSize: typography.sizes.base, color: colors.text, fontWeight: '500' },
    menuSubtitle: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
    menuArrow: { fontSize: typography.sizes.xl, color: colors.textLight },
    logoutSection: { padding: spacing.xl },
    version: { textAlign: 'center', fontSize: typography.sizes.xs, color: colors.textLight, paddingBottom: spacing['2xl'] },
});
