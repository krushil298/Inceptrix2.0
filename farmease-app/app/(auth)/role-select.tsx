import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../utils/constants';
import { useTranslation } from '../../hooks/useTranslation';

export default function RoleSelectScreen() {
    const router = useRouter();
    const { setRole } = useAuthStore();
    const { t } = useTranslation();

    const handleRoleSelect = (role: UserRole) => {
        setRole(role);
        if (role === 'farmer') {
            router.push('/(auth)/register-farmer');
        } else {
            router.push('/(auth)/register-buyer');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('roleSelect.title')}</Text>
            <Text style={styles.subtitle}>{t('roleSelect.subtitle')}</Text>

            <View style={styles.cardsContainer}>
                <TouchableOpacity
                    style={[styles.roleCard, { backgroundColor: colors.primary }]}
                    onPress={() => handleRoleSelect('farmer')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.roleEmoji}>👨‍🌾</Text>
                    <Text style={styles.roleTitle}>{t('roleSelect.farmerTitle')}</Text>
                    <Text style={styles.roleDescription}>{t('roleSelect.farmerDesc')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.roleCard, { backgroundColor: colors.primaryLight }]}
                    onPress={() => handleRoleSelect('buyer')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.roleEmoji}>🛒</Text>
                    <Text style={styles.roleTitle}>{t('roleSelect.buyerTitle')}</Text>
                    <Text style={styles.roleDescription}>{t('roleSelect.buyerDesc')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 80 },
    title: { fontSize: typography.sizes['3xl'], fontWeight: '700', color: colors.text, textAlign: 'center' },
    subtitle: { fontSize: typography.sizes.base, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing['2xl'] },
    cardsContainer: { gap: spacing.xl },
    roleCard: { padding: spacing['2xl'], borderRadius: borderRadius.xl, alignItems: 'center', ...shadows.lg },
    roleEmoji: { fontSize: 60, marginBottom: spacing.md },
    roleTitle: { fontSize: typography.sizes['2xl'], fontWeight: '700', color: colors.textOnPrimary, marginBottom: spacing.sm },
    roleDescription: { fontSize: typography.sizes.sm, color: colors.accentLighter, textAlign: 'center', lineHeight: 20 },
});
