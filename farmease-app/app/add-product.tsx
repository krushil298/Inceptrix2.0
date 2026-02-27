import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/ui/Header';
import ProductForm from '../components/marketplace/ProductForm';
import { colors } from '../utils/theme';
import { useAuthStore } from '../store/useAuthStore';
import { createProduct, CreateProductInput } from '../services/marketplace';

export default function AddProductScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: CreateProductInput) => {
        setLoading(true);
        try {
            const sellerId = user?.id || 'demo-farmer';
            const result = await createProduct(data, sellerId);

            if (result) {
                Alert.alert(
                    '🎉 Product Listed!',
                    `"${data.name}" has been listed on the marketplace.`,
                    [{ text: 'Great!', onPress: () => router.back() }]
                );
            } else {
                // Demo mode — simulate success
                Alert.alert(
                    '🎉 Product Listed!',
                    `"${data.name}" has been listed on the marketplace.\n(Demo mode — saved locally)`,
                    [{ text: 'Great!', onPress: () => router.back() }]
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
