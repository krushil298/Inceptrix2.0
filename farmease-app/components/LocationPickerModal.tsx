import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../utils/theme';
import { getCurrentLocation, LocationCoords } from '../services/location';

interface LocationPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (coords: LocationCoords, address: string) => void;
    initialCoords?: LocationCoords | null;
}

export default function LocationPickerModal({
    visible,
    onClose,
    onConfirm,
}: LocationPickerModalProps) {
    const [loading, setLoading] = useState(false);

    const handleUseMyLocation = async () => {
        setLoading(true);
        try {
            const result = await getCurrentLocation();
            onConfirm(result.coords, result.address);
        } catch {
            // fallback
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeText}>✕ Close</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Pick Location</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.icon}>🗺️</Text>
                    <Text style={styles.info}>Map view is available on mobile devices.</Text>
                    <TouchableOpacity style={styles.btn} onPress={handleUseMyLocation} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>📍 Use My Location</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: spacing.xl, paddingTop: 60, flexDirection: 'row', alignItems: 'center', gap: spacing.base },
    closeText: { fontSize: typography.sizes.base, color: colors.primary, fontWeight: '600' },
    title: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.text },
    body: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg },
    icon: { fontSize: 64 },
    info: { fontSize: typography.sizes.base, color: colors.textSecondary },
    btn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg },
    btnText: { fontSize: typography.sizes.base, color: '#fff', fontWeight: '600' },
});
