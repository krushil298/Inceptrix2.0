import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';
import { CROP_CATEGORIES } from '../../utils/constants';
import { CreateProductInput } from '../../services/marketplace';

const UNITS = ['kg', 'quintal', 'dozen', 'piece', 'litre', 'ton'] as const;

interface ProductFormProps {
    initialValues?: Partial<CreateProductInput>;
    onSubmit: (data: CreateProductInput) => void;
    loading?: boolean;
    submitLabel?: string;
}

export default function ProductForm({
    initialValues,
    onSubmit,
    loading = false,
    submitLabel = 'List Product',
}: ProductFormProps) {
    const [name, setName] = useState(initialValues?.name || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [category, setCategory] = useState(initialValues?.category || 'Vegetables');
    const [price, setPrice] = useState(initialValues?.price?.toString() || '');
    const [quantity, setQuantity] = useState(initialValues?.quantity?.toString() || '');
    const [unit, setUnit] = useState(initialValues?.unit || 'kg');
    const [sellerName, setSellerName] = useState(initialValues?.seller_name || '');
    const [sellerPhone, setSellerPhone] = useState(initialValues?.seller_phone || '');
    const [sellerLocation, setSellerLocation] = useState(initialValues?.seller_location || '');
    const [imageUri, setImageUri] = useState(initialValues?.image_url || '');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'Product name is required';
        if (!price.trim() || parseFloat(price) <= 0) newErrors.price = 'Enter a valid price';
        if (!quantity.trim() || parseFloat(quantity) <= 0) newErrors.quantity = 'Enter a valid quantity';
        if (!sellerName.trim()) newErrors.sellerName = 'Seller name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'We need access to your photos to upload product images.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onSubmit({
            name: name.trim(),
            description: description.trim(),
            category,
            price: parseFloat(price),
            quantity: parseFloat(quantity),
            unit,
            image_url: imageUri || undefined,
            seller_name: sellerName.trim(),
            seller_phone: sellerPhone.trim() || undefined,
            seller_location: sellerLocation.trim() || undefined,
        });
    };

    // Categories without the "All" option
    const formCategories = CROP_CATEGORIES.filter((c) => c !== 'All');

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Image Picker */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.7}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imageIcon}>📷</Text>
                        <Text style={styles.imageLabel}>Tap to add photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Product Info */}
            <Input
                label="Product Name *"
                placeholder="e.g. Fresh Tomatoes"
                value={name}
                onChangeText={setName}
                error={errors.name}
            />

            <Input
                label="Description"
                placeholder="Describe your product..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
            />

            {/* Category Selector */}
            <Text style={styles.label}>Category</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
            >
                {formCategories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.chip, category === cat && styles.chipActive]}
                        onPress={() => setCategory(cat)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Price & Quantity */}
            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <Input
                        label="Price (₹) *"
                        placeholder="0"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        error={errors.price}
                    />
                </View>
                <View style={styles.halfInput}>
                    <Input
                        label="Quantity *"
                        placeholder="0"
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                        error={errors.quantity}
                    />
                </View>
            </View>

            {/* Unit Selector */}
            <Text style={styles.label}>Unit</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
            >
                {UNITS.map((u) => (
                    <TouchableOpacity
                        key={u}
                        style={[styles.chip, unit === u && styles.chipActive]}
                        onPress={() => setUnit(u)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.chipText, unit === u && styles.chipTextActive]}>{u}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Seller Info */}
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <Input
                label="Your Name *"
                placeholder="Enter your name"
                value={sellerName}
                onChangeText={setSellerName}
                error={errors.sellerName}
            />
            <Input
                label="Phone Number"
                placeholder="+91 XXXXX XXXXX"
                value={sellerPhone}
                onChangeText={setSellerPhone}
                keyboardType="phone-pad"
            />
            <Input
                label="Location"
                placeholder="e.g. Pune, Maharashtra"
                value={sellerLocation}
                onChangeText={setSellerLocation}
            />

            {/* Submit */}
            <Button
                title={submitLabel}
                onPress={handleSubmit}
                loading={loading}
                fullWidth
                size="lg"
                style={styles.submitButton}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.base,
        paddingBottom: spacing['3xl'],
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        flex: 1,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: borderRadius.lg,
    },
    imageIcon: {
        fontSize: 40,
        marginBottom: spacing.sm,
    },
    imageLabel: {
        fontSize: typography.sizes.md,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: '500',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    chipsRow: {
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        marginBottom: spacing.md,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius['2xl'],
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: typography.sizes.sm,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    chipTextActive: {
        color: colors.textOnPrimary,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    halfInput: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '600',
        color: colors.text,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    submitButton: {
        marginTop: spacing.xl,
    },
});
