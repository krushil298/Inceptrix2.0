import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { sendOtp, verifyOtp } from '../../services/auth';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useTranslation } from '../../hooks/useTranslation';
import type { Language } from '../../utils/i18n';

export default function LoginScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showLangDrop, setShowLangDrop] = useState(false);
    const { setSession } = useAuthStore();
    const { language, setLanguage } = useLanguageStore();
    const { t } = useTranslation();

    const handleSendOtp = async () => {
        if (phone.length < 10) {
            setError(t('login.phoneError'));
            return;
        }
        setLoading(true);
        setError('');
        try {
            await sendOtp(`+91${phone}`);
            setOtpSent(true);
        } catch (err: any) {
            setError(err.message || t('login.otpFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 6) {
            setError(t('login.otpError'));
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await verifyOtp(`+91${phone}`, otp);
            setSession(data.session);
            router.replace('/(auth)/role-select');
        } catch (err: any) {
            setError(err.message || t('login.invalidOtp'));
        } finally {
            setLoading(false);
        }
    };

    const LANGUAGES: { code: Language; label: string; flag: string }[] = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    ];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Hero illustration area */}
            <View style={styles.heroSection}>
                <Image source={require('../../assets/farm_hero_banner.png')} style={styles.heroImage} />
                <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>{t('common.appName')}</Text>
                    <Text style={styles.heroSubtitle}>{t('common.tagline')}</Text>
                </View>
            </View>

            {/* Login form */}
            <View style={styles.formSection}>
                {/* Language Selector */}
                <View style={styles.langRow}>
                    <Text style={styles.langLabel}>{t('login.languageLabel')}:</Text>
                    <TouchableOpacity
                        style={styles.langSelector}
                        onPress={() => setShowLangDrop(!showLangDrop)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.langSelectorText}>
                            {LANGUAGES.find(l => l.code === language)?.flag}{' '}
                            {LANGUAGES.find(l => l.code === language)?.label}
                        </Text>
                        <Text style={styles.langChevron}>{showLangDrop ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {showLangDrop && (
                        <View style={styles.langDropdown}>
                            {LANGUAGES.map(lang => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[styles.langOption, language === lang.code && styles.langOptionActive]}
                                    onPress={() => {
                                        setLanguage(lang.code);
                                        setShowLangDrop(false);
                                    }}
                                >
                                    <Text style={styles.langOptionText}>{lang.flag} {lang.label}</Text>
                                    {language === lang.code && <Text style={styles.langCheck}>✓</Text>}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <Text style={styles.formTitle}>
                    {otpSent ? t('login.otpTitle') : t('login.title')}
                </Text>

                {!otpSent ? (
                    <>
                        <Input
                            label={t('login.phoneLabel')}
                            placeholder={t('login.phonePlaceholder')}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            maxLength={10}
                            leftIcon={<Text style={styles.countryCode}>+91</Text>}
                            error={error}
                        />
                        <Button
                            title={t('login.sendOtp')}
                            onPress={handleSendOtp}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </>
                ) : (
                    <>
                        <Input
                            label={t('login.otpLabel')}
                            placeholder={t('login.otpPlaceholder')}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                            error={error}
                        />
                        <Button
                            title={t('login.verifyOtp')}
                            onPress={handleVerifyOtp}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                        <Button
                            title={t('login.resendOtp')}
                            onPress={handleSendOtp}
                            variant="ghost"
                            style={{ marginTop: spacing.sm }}
                        />
                    </>
                )}

                <Text style={styles.termsText}>{t('login.terms')}</Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    heroSection: {
        flex: 0.4, position: 'relative',
        backgroundColor: colors.primary,
        borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden',
    },
    heroImage: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    heroTitle: { fontSize: typography.sizes['4xl'], fontWeight: '700', color: colors.textOnPrimary },
    heroSubtitle: { fontSize: typography.sizes.base, color: colors.textOnPrimary, marginTop: spacing.xs, fontWeight: '500' },
    formSection: { flex: 0.6, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

    // Language selector
    langRow: { marginBottom: spacing.md, zIndex: 10 },
    langLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: 4 },
    langSelector: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
    },
    langSelectorText: { fontSize: typography.sizes.sm, color: colors.text, fontWeight: '500' },
    langChevron: { fontSize: 10, color: colors.textLight },
    langDropdown: {
        position: 'absolute', top: 64, left: 0, right: 0,
        backgroundColor: colors.surface,
        borderWidth: 1, borderColor: colors.border,
        borderRadius: borderRadius.md,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 8, elevation: 8,
        zIndex: 100,
    },
    langOption: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    },
    langOptionActive: { backgroundColor: colors.accentLighter },
    langOptionText: { fontSize: typography.sizes.base, color: colors.text },
    langCheck: { fontSize: typography.sizes.base, color: colors.primary, fontWeight: '700' },

    formTitle: { fontSize: typography.sizes['2xl'], fontWeight: '700', color: colors.text, marginBottom: spacing.xl },
    countryCode: { fontSize: typography.sizes.base, color: colors.text, fontWeight: '600' },
    termsText: { fontSize: typography.sizes.xs, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
