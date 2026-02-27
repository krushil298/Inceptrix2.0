import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../utils/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import { useAuthStore } from '../../store/useAuthStore';
import { upsertProfile } from '../../services/auth';

export default function RegisterBuyerScreen() {
    const router = useRouter();
    const { session, setUser, setOnboarded } = useAuthStore();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const profile = await upsertProfile({
                id: session?.user?.id,
                phone: session?.user?.phone || '',
                name,
                role: 'buyer',
                delivery_address: address,
            });
            setUser(profile);
            setOnboarded(true);
            router.replace('/(tabs)/buyer-home');
        } catch (err) {
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Header title="Buyer Registration" showBack onBack={() => router.back()} />

            <Text style={styles.emoji}>🛒</Text>
            <Text style={styles.subtitle}>Set up your buyer profile</Text>

            <Input label="Full Name" placeholder="Enter your name" value={name} onChangeText={setName} />
            <Input label="Delivery Address" placeholder="Full address for deliveries" value={address} onChangeText={setAddress} multiline numberOfLines={3} />

            <Button title="Complete Registration" onPress={handleSubmit} loading={loading} fullWidth size="lg" style={{ marginTop: spacing.xl }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.xl },
    emoji: { fontSize: 50, textAlign: 'center', marginVertical: spacing.lg },
    subtitle: { fontSize: typography.sizes.base, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
});
