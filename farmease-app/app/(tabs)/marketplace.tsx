import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import SearchBar from '../../components/ui/SearchBar';
import CategoryPill from '../../components/ui/CategoryPill';
import { CROP_CATEGORIES } from '../../utils/constants';
import { useAuthStore } from '../../store/useAuthStore';
import { formatPrice } from '../../utils/helpers';

// Sample data — replace with Supabase queries
const SAMPLE_PRODUCTS = [
    { id: '1', name: 'Fresh Tomatoes', price: 45, unit: 'kg', category: 'Vegetables', seller: 'Rajesh Kumar', location: 'Nashik, MH', emoji: '🍅' },
    { id: '2', name: 'Organic Rice', price: 85, unit: 'kg', category: 'Grains', seller: 'Lakshmi Singh', location: 'Vijayawada, AP', emoji: '🍚' },
    { id: '3', name: 'Leafy Spinach', price: 30, unit: 'kg', category: 'Vegetables', seller: 'Anil Patel', location: 'Bhopal, MP', emoji: '🥬' },
    { id: '4', name: 'Premium Bananas', price: 55, unit: 'kg', category: 'Fruits', seller: 'Meera Reddy', location: 'Chennai, TN', emoji: '🍌' },
    { id: '5', name: 'Yellow Lentils', price: 120, unit: 'kg', category: 'Pulses', seller: 'Suresh Yadav', location: 'Kanpur, UP', emoji: '🫘' },
    { id: '6', name: 'Fresh Mangoes', price: 150, unit: 'kg', category: 'Fruits', seller: 'Kiran Patil', location: 'Ratnagiri, MH', emoji: '🥭' },
    { id: '7', name: 'Green Chillies', price: 60, unit: 'kg', category: 'Spices', seller: 'Babu Reddy', location: 'Guntur, AP', emoji: '🌶️' },
    { id: '8', name: 'Wheat Flour', price: 40, unit: 'kg', category: 'Grains', seller: 'Ramesh Jat', location: 'Indore, MP', emoji: '🌾' },
];

export default function MarketplaceScreen() {
    const router = useRouter();
    const { role } = useAuthStore();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredProducts = SAMPLE_PRODUCTS.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Marketplace</Text>
                {role === 'farmer' && (
                    <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-product' as any)}>
                        <Text style={styles.addBtnText}>+ List Crop</Text>
                    </TouchableOpacity>
                )}
            </View>

            <SearchBar value={search} onChangeText={setSearch} onFilterPress={() => { }} />
            <CategoryPill categories={CROP_CATEGORIES} selected={selectedCategory} onSelect={setSelectedCategory} />

            {/* Mandi Prices Banner */}
            <TouchableOpacity style={styles.mandiBanner}>
                <Text style={{ fontSize: 20 }}>📈</Text>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.mandiTitle}>Today's Mandi Prices</Text>
                    <Text style={styles.mandiSubtext}>Tomato ₹45/kg ↑ • Rice ₹85/kg → • Wheat ₹40/kg ↓</Text>
                </View>
                <Text style={styles.mandiArrow}>→</Text>
            </TouchableOpacity>

            {/* Product Grid */}
            <ScrollView contentContainerStyle={styles.productGrid}>
                {filteredProducts.map((product) => (
                    <TouchableOpacity
                        key={product.id}
                        style={styles.productCard}
                        onPress={() => router.push({ pathname: '/product-detail', params: product } as any)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.productImageBox}>
                            <Text style={{ fontSize: 40 }}>{product.emoji}</Text>
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                            <Text style={styles.productPrice}>{formatPrice(product.price)}/{product.unit}</Text>
                            <Text style={styles.productSeller} numberOfLines={1}>👤 {product.seller}</Text>
                            <Text style={styles.productLocation} numberOfLines={1}>📍 {product.location}</Text>
                        </View>
                        <TouchableOpacity style={styles.cartBtn}>
                            <Text style={styles.cartBtnText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: spacing.base, paddingTop: 60, paddingBottom: spacing.sm,
    },
    title: { fontSize: typography.sizes['2xl'], fontWeight: '700', color: colors.text },
    addBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.base, paddingVertical: spacing.sm, borderRadius: borderRadius.pill },
    addBtnText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textOnPrimary },
    mandiBanner: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.base,
        backgroundColor: colors.warningLight, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm,
    },
    mandiTitle: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text },
    mandiSubtext: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
    mandiArrow: { fontSize: typography.sizes.lg, color: colors.textSecondary },
    productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.base, gap: spacing.md, paddingBottom: 100 },
    productCard: {
        width: '47%', backgroundColor: colors.surface, borderRadius: borderRadius.lg,
        ...shadows.sm, overflow: 'hidden',
    },
    productImageBox: {
        height: 100, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center',
    },
    productInfo: { padding: spacing.sm },
    productName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.text },
    productPrice: { fontSize: typography.sizes.base, fontWeight: '700', color: colors.primary, marginTop: 2 },
    productSeller: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 4 },
    productLocation: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 2 },
    cartBtn: { backgroundColor: colors.primary, margin: spacing.sm, paddingVertical: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center' },
    cartBtnText: { fontSize: typography.sizes.xs, fontWeight: '600', color: colors.textOnPrimary },
});
