import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../utils/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import { useAuthStore } from '../../store/useAuthStore';
import { upsertProfile } from '../../services/auth';
import { SOIL_TYPES } from '../../utils/constants';

export default function RegisterFarmerScreen() {
    const router = useRouter();
    const { session, setUser, setOnboarded } = useAuthStore();
    const [name, setName] = useState('');
    const [farmLocation, setFarmLocation] = useState('');
    const [landSize, setLandSize] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const profile = await upsertProfile({
                id: session?.user?.id,
                phone: session?.user?.phone || '',
                name,
                role: 'farmer',
                farm_location: farmLocation,
                land_size: parseFloat(landSize) || 0,
            });
            setUser(profile);
            setOnboarded(true);
            router.replace('/(tabs)');
        } catch (err) {
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Header title="Farmer Registration" showBack onBack={() => router.back()} />

            <Text style={styles.emoji}>👨‍🌾</Text>
            <Text style={styles.subtitle}>Tell us about your farm</Text>

            <Input label="Full Name" placeholder="Enter your name" value={name} onChangeText={setName} />
            <Input label="Farm Location" placeholder="Village, District, State" value={farmLocation} onChangeText={setFarmLocation} />
            <Input label="Land Size (acres)" placeholder="e.g. 5" value={landSize} onChangeText={setLandSize} keyboardType="numeric" />

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
