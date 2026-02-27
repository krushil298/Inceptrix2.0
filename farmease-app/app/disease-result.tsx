import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import ResultCard from '../components/detection/ResultCard';
import TreatmentCard from '../components/detection/TreatmentCard';

const MOCK_TREATMENTS = [
    {
        step: 1,
        title: 'Apply Fungicide Spray',
        description: 'Spray Mancozeb (2.5g/L) or Chlorothalonil at 7-day intervals. Cover both upper and lower leaf surfaces.',
        type: 'chemical' as const,
        product: 'Mancozeb 75% WP',
    },
    {
        step: 2,
        title: 'Neem Oil Treatment',
        description: 'Mix 5ml neem oil per litre of water. Spray in early morning or late evening for best results. Repeat every 10 days.',
        type: 'organic' as const,
        product: 'Organic Neem Oil',
    },
    {
        step: 3,
        title: 'Remove Infected Leaves',
        description: 'Carefully prune and destroy infected leaves. Do not compost them — burn or dispose away from the field.',
        type: 'cultural' as const,
    },
    {
        step: 4,
        title: 'Crop Rotation',
        description: 'Practice 2-3 year rotation. Avoid planting Solanaceous crops (tomato, potato, pepper) in the same plot consecutively.',
        type: 'cultural' as const,
    },
];

const DISEASE_DESCRIPTIONS: Record<string, string> = {
    'Early Blight': 'A common fungal disease caused by Alternaria solani. Appears as dark brown concentric rings on lower leaves, spreading upward. Can reduce yield by 20-50% if untreated.',
    'Late Blight': 'Caused by Phytophthora infestans. Shows water-soaked lesions that turn brown. Highly destructive and spreads rapidly in cool, humid conditions.',
    'Leaf Curl': 'Viral disease spread by whiteflies. Causes upward leaf curling, stunted growth, and reduced fruit production.',
    default: 'A plant disease detected in the scanned leaf. Follow the treatment recommendations below to manage and prevent further spread.',
};

export default function DiseaseResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ imageUri: string; disease: string; confidence: string; crop: string }>();

    const confidence = parseInt(params.confidence || '0');
    const diseaseName = params.disease || 'Unknown Disease';
    const severity = confidence >= 80 ? 'High' : confidence >= 50 ? 'Medium' : 'Low';
    const description = DISEASE_DESCRIPTIONS[diseaseName] || DISEASE_DESCRIPTIONS.default;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Header title="Scan Results" showBack onBack={() => router.back()} />

            {/* Scanned Image */}
            {params.imageUri && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: params.imageUri }} style={styles.image} />
                    <View style={styles.imageOverlay}>
                        <Text style={styles.imageLabel}>🔬 Scanned Image</Text>
                    </View>
                </View>
            )}

            {/* Disease Result Card */}
            <View style={styles.resultSection}>
                <ResultCard
                    diseaseName={diseaseName}
                    confidence={confidence}
                    severity={severity}
                    cropName={params.crop || 'Unknown'}
                    description={description}
                />
            </View>

            {/* Treatment Recommendations */}
            <Text style={styles.sectionTitle}>💊 Treatment Plan</Text>
            <Text style={styles.sectionSubtitle}>Follow these steps to manage the disease</Text>

            {MOCK_TREATMENTS.map((treatment) => (
                <TreatmentCard
                    key={treatment.step}
                    step={treatment.step}
                    title={treatment.title}
                    description={treatment.description}
                    type={treatment.type}
                    product={treatment.product}
                    onProductPress={() => router.push('/(tabs)/marketplace' as any)}
                />
            ))}

            {/* Actions */}
            <View style={styles.actions}>
                <Button title="Save to History" onPress={() => router.back()} fullWidth variant="primary" />
                <Button title="Scan Again" onPress={() => router.back()} fullWidth variant="outline" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    imageContainer: {
        margin: spacing.base,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.md,
    },
    image: { width: '100%', height: 220, resizeMode: 'cover' },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    imageLabel: {
        color: '#fff',
        fontSize: typography.sizes.sm,
        fontWeight: '500',
    },
    resultSection: {
        marginTop: spacing.sm,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        color: colors.text,
        paddingHorizontal: spacing.base,
        marginTop: spacing.md,
    },
    sectionSubtitle: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
        paddingHorizontal: spacing.base,
        marginBottom: spacing.md,
    },
    actions: { padding: spacing.xl, gap: spacing.md, marginBottom: spacing.base },
});
