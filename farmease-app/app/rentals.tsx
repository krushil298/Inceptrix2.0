import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import Header from '../components/ui/Header';

// Mock data for equipment rentals
const DUMMY_RENTALS = [
    { id: '1', owner: 'Ramesh Patel', name: 'Mahindra Tractor 575 DI', image: '🚜', price: 800, unit: 'per day', distance: '1.2 km away', available: true },
    { id: '2', owner: 'Suresh Kumar', name: 'Heavy Duty Seed Drill', image: '🌾', price: 300, unit: 'per day', distance: '2.5 km away', available: true },
    { id: '3', owner: 'Amit Singh', name: 'Power Tiller', image: '⚙️', price: 500, unit: 'per day', distance: '3.0 km away', available: false },
    { id: '4', owner: 'Vikram Yadav', name: 'Harvester Machine', image: '🏭', price: 2000, unit: 'per day', distance: '5.1 km away', available: true },
];

export default function RentalsScreen() {
    const router = useRouter();

    const handleRequest = (itemName: string) => {
        Alert.alert(
            "Request Sent",
            `Your rental request for ${itemName} has been sent to the owner. They will contact you shortly.`,
            [{ text: "OK" }]
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Equipment Rental" showBack />
            <ScrollView style={styles.content}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Local Peer-to-Peer Rentals</Text>
                    <Text style={styles.infoText}>
                        Borrow farm equipment directly from nearby farmers. Save money on expensive machinery and help your local community.
                    </Text>
                </View>

                <View style={styles.listContainer}>
                    {DUMMY_RENTALS.map(item => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.imageContainer}>
                                    <Text style={styles.emoji}>{item.image}</Text>
                                </View>
                                <View style={styles.details}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.owner}>Listed by: {item.owner}</Text>
                                    <View style={styles.metaRow}>
                                        <Text style={styles.distance}>📍 {item.distance}</Text>
                                        <Text style={[styles.status, { color: item.available ? colors.primary : colors.error }]}>
                                            {item.available ? '• Available Now' : '• In Use'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.actionRow}>
                                <Text style={styles.price}>
                                    ₹{item.price} <Text style={styles.unit}>{item.unit}</Text>
                                </Text>
                                <TouchableOpacity
                                    style={[styles.btn, !item.available && styles.btnDisabled]}
                                    disabled={!item.available}
                                    onPress={() => handleRequest(item.name)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.btnText}>Request Rental</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={{ height: spacing['2xl'] }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.base },
    infoBox: {
        backgroundColor: colors.surface,
        padding: spacing.base,
        borderRadius: borderRadius.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    infoTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
    infoText: { fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: 20 },
    listContainer: { gap: spacing.base },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        ...shadows.md,
    },
    cardHeader: { flexDirection: 'row', gap: spacing.base },
    imageContainer: {
        width: 60, height: 60,
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        justifyContent: 'center', alignItems: 'center'
    },
    emoji: { fontSize: 32 },
    details: { flex: 1, justifyContent: 'center' },
    name: { fontSize: typography.sizes.base, fontWeight: '700', color: colors.text },
    owner: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    distance: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '500' },
    status: { fontSize: typography.sizes.xs, fontWeight: '600' },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.base },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.text },
    unit: { fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: '400' },
    btn: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.pill,
    },
    btnDisabled: { backgroundColor: colors.border },
    btnText: { color: colors.textOnPrimary, fontSize: typography.sizes.sm, fontWeight: '600' }
});
