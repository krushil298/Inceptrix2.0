import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { sendOtp, verifyOtp } from '../../services/auth';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setSession } = useAuthStore();

    const handleSendOtp = async () => {
        if (phone.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await sendOtp(`+91${phone}`);
            setOtpSent(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await verifyOtp(`+91${phone}`, otp);
            setSession(data.session);
            router.replace('/(auth)/role-select');
        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Hero illustration area */}
            <View style={styles.heroSection}>
                <Image source={require('../../assets/farm_hero_banner.png')} style={styles.heroImage} />
                <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>FarmEase</Text>
                    <Text style={styles.heroSubtitle}>From Soil to Sale</Text>
                </View>
            </View>

            {/* Login form */}
            <View style={styles.formSection}>
                <Text style={styles.formTitle}>
                    {otpSent ? 'Enter OTP (Try 123456)' : 'Login / Sign Up'}
                </Text>

                {!otpSent ? (
                    <>
                        <Input
                            label="Phone Number"
                            placeholder="Enter 10-digit number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            maxLength={10}
                            leftIcon={<Text style={styles.countryCode}>+91</Text>}
                            error={error}
                        />
                        <Button
                            title="Send OTP"
                            onPress={handleSendOtp}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </>
                ) : (
                    <>
                        <Input
                            label="OTP"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                            error={error}
                        />
                        <Button
                            title="Verify OTP"
                            onPress={handleVerifyOtp}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                        <Button
                            title="Resend OTP"
                            onPress={handleSendOtp}
                            variant="ghost"
                            style={{ marginTop: spacing.sm }}
                        />
                    </>
                )}

                <Text style={styles.termsText}>
                    By continuing, you agree to our Terms of Service
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    heroSection: {
        flex: 0.4,
        position: 'relative',
        backgroundColor: colors.primary,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.8,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    heroTitle: {
        fontSize: typography.sizes['4xl'],
        fontWeight: '700',
        color: colors.textOnPrimary,
    },
    heroSubtitle: {
        fontSize: typography.sizes.base,
        color: colors.textOnPrimary,
        marginTop: spacing.xs,
        fontWeight: '500',
    },
    formSection: {
        flex: 0.6,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing['2xl'],
    },
    formTitle: {
        fontSize: typography.sizes['2xl'],
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.xl,
    },
    countryCode: {
        fontSize: typography.sizes.base,
        color: colors.text,
        fontWeight: '600',
    },
    termsText: {
        fontSize: typography.sizes.xs,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.xl,
    },
});
