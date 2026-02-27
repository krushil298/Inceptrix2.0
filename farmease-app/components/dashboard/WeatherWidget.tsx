import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';
import { WEATHER_API_KEY, WEATHER_BASE_URL } from '../../utils/constants';

interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    location: string;
    feelsLike: number;
}

const WEATHER_ICONS: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Haze: '🌫️',
    Fog: '🌫️',
    default: '🌤️',
};

const MOCK_WEATHER: WeatherData = {
    temp: 28,
    condition: 'Partly Cloudy',
    icon: '🌤️',
    humidity: 65,
    windSpeed: 12,
    location: 'Bangalore, KA',
    feelsLike: 30,
};

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeather();
    }, []);

    const fetchWeather = async () => {
        try {
            // Use demo data if API key is placeholder
            if (WEATHER_API_KEY === 'your-openweathermap-api-key') {
                setWeather(MOCK_WEATHER);
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${WEATHER_BASE_URL}/weather?q=Bangalore&appid=${WEATHER_API_KEY}&units=metric`
            );
            const data = await response.json();

            setWeather({
                temp: Math.round(data.main.temp),
                condition: data.weather[0].main,
                icon: WEATHER_ICONS[data.weather[0].main] || WEATHER_ICONS.default,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed),
                location: `${data.name}, ${data.sys.country}`,
                feelsLike: Math.round(data.main.feels_like),
            });
        } catch {
            setWeather(MOCK_WEATHER);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator color={colors.textOnPrimary} />
            </View>
        );
    }

    if (!weather) return null;

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.tempSection}>
                    <Text style={styles.icon}>{weather.icon}</Text>
                    <View>
                        <Text style={styles.temp}>{weather.temp}°C</Text>
                        <Text style={styles.condition}>{weather.condition}</Text>
                    </View>
                </View>
                <View style={styles.locationSection}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.location}>{weather.location}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>💧</Text>
                    <Text style={styles.detailLabel}>Humidity</Text>
                    <Text style={styles.detailValue}>{weather.humidity}%</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>💨</Text>
                    <Text style={styles.detailLabel}>Wind</Text>
                    <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>🌡️</Text>
                    <Text style={styles.detailLabel}>Feels Like</Text>
                    <Text style={styles.detailValue}>{weather.feelsLike}°C</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacing.base,
        marginVertical: spacing.sm,
        borderRadius: borderRadius.xl,
        padding: spacing.base,
        backgroundColor: colors.primary,
        ...shadows.lg,
    },
    loadingContainer: {
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    tempSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    icon: {
        fontSize: 44,
    },
    temp: {
        fontSize: typography.sizes['4xl'],
        fontWeight: '700',
        color: colors.textOnPrimary,
    },
    condition: {
        fontSize: typography.sizes.sm,
        color: colors.accentLighter,
        fontWeight: '500',
    },
    locationSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    locationIcon: {
        fontSize: 12,
    },
    location: {
        fontSize: typography.sizes.xs,
        color: colors.textOnPrimary,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: spacing.md,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    detailItem: {
        alignItems: 'center',
        gap: 2,
    },
    detailIcon: {
        fontSize: 18,
    },
    detailLabel: {
        fontSize: typography.sizes.xs,
        color: colors.accentLighter,
    },
    detailValue: {
        fontSize: typography.sizes.sm,
        fontWeight: '600',
        color: colors.textOnPrimary,
    },
});
