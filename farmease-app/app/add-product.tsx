import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/ui/Header';
import ProductForm from '../components/marketplace/ProductForm';
import { colors } from '../utils/theme';
import { useAuthStore } from '../store/useAuthStore';
import { createProduct, CreateProductInput } from '../services/marketplace';
import { supabase } from '../services/supabase';

// Seeded demo farmer IDs (match what's in the DB)
const DEMO_SELLER_ID = 'a1b2c3d4-1111-4000-8000-000000000001';
const DEMO_SELLER_EMAIL = 'rajesh@farmease.demo';
const DEMO_SELLER_PASSWORD = 'demo12345';

export default function AddProductScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: CreateProductInput) => {
        setLoading(true);
        try {
            let sellerId = user?.id;
            const isDummy = !sellerId || sellerId.startsWith('dummy');

            // If using dummy auth, sign in as a real demo farmer so RLS works
            if (isDummy) {
                const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
                    email: DEMO_SELLER_EMAIL,
                    password: DEMO_SELLER_PASSWORD,
                });
                if (authErr || !authData.user) {
                    console.error('Demo sign-in failed:', authErr);
                    sellerId = DEMO_SELLER_ID;
                } else {
                    sellerId = authData.user.id;
                }
            }

            const result = await createProduct(data, sellerId!);

            if (result) {
                Alert.alert(
                    '🎉 Product Listed!',
                    `"${data.name}" has been listed on the marketplace.`,
                    [{ text: 'Great!', onPress: () => router.back() }]
                );
            } else {
                Alert.alert(
                    'Oops',
                    'Could not list the product. Please try again.',
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header
                title="List Your Crop"
                subtitle="Sell directly to buyers"
                showBack
                onBack={() => router.back()}
            />
            <ProductForm onSubmit={handleSubmit} loading={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});
