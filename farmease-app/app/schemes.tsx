import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import Header from '../components/ui/Header';
import CategoryPill from '../components/ui/CategoryPill';
import { SCHEME_CATEGORIES } from '../utils/constants';
import { usePreloadTranslations } from '../hooks/useTranslation';

const SCHEMES = [
    { id: '1', name: 'PM-KISAN', category: 'Subsidy', amount: '₹6,000/year', description: 'Direct income support of ₹6,000 per year to farmer families', eligibility: 'All land-holding farmer families', deadline: 'Open', emoji: '💰' },
    { id: '2', name: 'PMFBY', category: 'Insurance', amount: 'Varies', description: 'Crop insurance at 1.5-5% premium; covers natural calamities', eligibility: 'All farmers growing notified crops', deadline: 'Seasonal', emoji: '🛡️' },
    { id: '3', name: 'KCC (Kisan Credit Card)', category: 'Loan', amount: 'Up to ₹3 lakhs', description: 'Short-term crop loans at 4% interest rate', eligibility: 'All farmers, sharecroppers, tenants', deadline: 'Open', emoji: '💳' },
    { id: '4', name: 'Soil Health Card', category: 'Training', amount: 'Free', description: 'Free soil testing and nutrient-based recommendations', eligibility: 'All farmers', deadline: 'Open', emoji: '🌍' },
    { id: '5', name: 'Sub-Mission on Agri Mechanization', category: 'Equipment', amount: '40-50% subsidy', description: 'Subsidized farm equipment and machinery', eligibility: 'Small & marginal farmers', deadline: 'March 2026', emoji: '🚜' },
    { id: '6', name: 'PMKSY', category: 'Irrigation', amount: '55-75% subsidy', description: 'Subsidy on micro-irrigation (drip & sprinkler)', eligibility: 'All farmers', deadline: 'Open', emoji: '💧' },
];

export default function SchemesScreen() {
    const router = useRouter();
    const { t } = usePreloadTranslations([
        'schemes.title',
        'schemes.subtitle',
        'schemes.description',
        'schemes.eligibility',
        'schemes.deadline',
        'schemes.checkEligibility',
    ]);
    const [selected, setSelected] = useState('All');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const allCategories = ['All', ...SCHEME_CATEGORIES] as unknown as readonly string[];
    const filtered = selected === 'All' ? SCHEMES : SCHEMES.filter((s) => s.category === selected);

    return (
        <ScrollView style={styles.container}>
            <Header title={t('schemes.title')} showBack onBack={() => router.back()} />
            <Text style={styles.subtitle}>{t('schemes.subtitle')}</Text>

            <CategoryPill categories={allCategories} selected={selected} onSelect={setSelected} />

            {filtered.map((scheme) => (
                <TouchableOpacity
                    key={scheme.id}
                    style={styles.schemeCard}
                    onPress={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                    activeOpacity={0.8}
                >
                    <View style={styles.schemeHeader}>
                        <Text style={{ fontSize: 28 }}>{scheme.emoji}</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.schemeName}>{scheme.name}</Text>
                            <Text style={styles.schemeCategory}>{scheme.category} • {scheme.amount}</Text>
                        </View>
                        <Text style={styles.chevron}>{expandedId === scheme.id ? '▲' : '▼'}</Text>
                    </View>

                    {expandedId === scheme.id && (
                        <View style={styles.schemeDetails}>
                            <Text style={styles.detailLabel}>{t('schemes.description')}</Text>
                            <Text style={styles.detailText}>{scheme.description}</Text>
                            <Text style={styles.detailLabel}>{t('schemes.eligibility')}</Text>
                            <Text style={styles.detailText}>{scheme.eligibility}</Text>
                            <Text style={styles.detailLabel}>{t('schemes.deadline')}</Text>
                            <Text style={styles.detailText}>{scheme.deadline}</Text>
                            <TouchableOpacity style={styles.applyBtn}>
                                <Text style={styles.applyBtnText}>{t('schemes.checkEligibility')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            ))}

            <View style={{ height: spacing['2xl'] }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    subtitle: { fontSize: typography.sizes.base, color: colors.textSecondary, paddingHorizontal: spacing.base, marginBottom: spacing.sm },
    schemeCard: {
        marginHorizontal: spacing.base, marginBottom: spacing.md, backgroundColor: colors.surface,
        borderRadius: borderRadius.lg, ...shadows.sm, overflow: 'hidden',
    },
    schemeHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.base },
    schemeName: { fontSize: typography.sizes.base, fontWeight: '700', color: colors.text },
    schemeCategory: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 2 },
    chevron: { fontSize: 12, color: colors.textLight },
    schemeDetails: { padding: spacing.base, paddingTop: 0, borderTopWidth: 1, borderTopColor: colors.divider },
    detailLabel: { fontSize: typography.sizes.xs, fontWeight: '600', color: colors.primary, marginTop: spacing.md, textTransform: 'uppercase' },
    detailText: { fontSize: typography.sizes.sm, color: colors.text, marginTop: 2 },
    applyBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.lg },
    applyBtnText: { color: colors.textOnPrimary, fontWeight: '600', fontSize: typography.sizes.sm },
});
