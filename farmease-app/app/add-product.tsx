import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/ui/Header';
import ProductForm from '../components/marketplace/ProductForm';
import { colors } from '../utils/theme';
import { useAuthStore } from '../store/useAuthStore';
import { createProduct, CreateProductInput, uploadProductImage } from '../services/marketplace';
import { supabase } from '../services/supabase';

// Seeded demo farmer ID (matches what's in the DB)
const DEMO_SELLER_ID = 'a1b2c3d4-1111-4000-8000-000000000001';

export default function AddProductScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: CreateProductInput) => {
        setLoading(true);
        try {
            let sellerId = user?.id;
            const isDummy = !sellerId || sellerId.startsWith('dummy');

            if (isDummy) {
                sellerId = DEMO_SELLER_ID;

                // Sync the farmer's profile name to the demo user so listings show the correct name
                if (user?.name) {
                    await supabase
                        .from('users')
                        .update({
                            name: user.name,
                            phone: user.phone || null,
                            farm_location: user.farm_location || data.location || null,
                        })
                        .eq('id', DEMO_SELLER_ID);
                }
            }

            // Upload image to Supabase Storage if a local image was selected
            let imageUrl = data.image_url;
            if (imageUrl && (imageUrl.startsWith('file://') || imageUrl.startsWith('ph://') || imageUrl.startsWith('/var/'))) {
                const uploadedUrl = await uploadProductImage(imageUrl);
                imageUrl = uploadedUrl || undefined; // Don't save local paths to DB
            }

            const result = await createProduct({ ...data, image_url: imageUrl }, sellerId!);

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
