import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../utils/theme';
import { WEATHER_API_KEY, WEATHER_BASE_URL } from '../../utils/constants';
import { useTranslation } from '../../hooks/useTranslation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.base * 2;

interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    location: string;
    feelsLike: number;
    high: number;
    low: number;
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
    high: 34,
    low: 22,
};

// Forecast data for bottom bar
const FORECAST = [
    { day: 'TUE', icon: '☀️' },
    { day: 'WED', icon: '🌧️' },
    { day: 'THU', icon: '🌧️' },
    { day: 'FRI', icon: '☀️' },
];

function getCurrentTime() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
}

function getCurrentDate() {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const now = new Date();
    const day = days[now.getDay()];
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    return `${day} ${month}-${date}`;
}

export default function WeatherWidget() {
    const { t } = useTranslation();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState(getCurrentTime());

    useEffect(() => {
        fetchWeather();
        const timer = setInterval(() => setTime(getCurrentTime()), 30000);
        return () => clearInterval(timer);
    }, []);

    const fetchWeather = async () => {
        try {
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
                high: Math.round(data.main.temp_max),
                low: Math.round(data.main.temp_min),
            });
        } catch {
            setWeather(MOCK_WEATHER);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.card, styles.loadingContainer]}>
                <ActivityIndicator color="#fff" size="large" />
                <Text style={styles.loadingText}>{t('weather.loading')}</Text>
            </View>
        );
    }

    if (!weather) return null;

    return (
        <View style={styles.card}>
            {/* ---- Top Info Section ---- */}
            <View style={styles.infoSection}>
                {/* Decorative background circles */}
                <View style={styles.bgDesign}>
                    <View style={[styles.circle, styles.circle1]} />
                    <View style={[styles.circle, styles.circle2]} />
                    <View style={[styles.circle, styles.circle3]} />
                </View>

                {/* Left side — weather + temp */}
                <View style={styles.leftSide}>
                    <View style={styles.weatherRow}>
                        <Text style={styles.weatherIcon}>{weather.icon}</Text>
                        <Text style={styles.conditionText}>{weather.condition}</Text>
                    </View>
                    <Text style={styles.temperature}>{weather.temp}°</Text>
                    <Text style={styles.range}>{weather.high}°/{weather.low}°</Text>
                </View>

                {/* Right side — time + city */}
                <View style={styles.rightSide}>
                    <View style={styles.timeBlock}>
                        <Text style={styles.hour}>{time}</Text>
                        <Text style={styles.date}>{getCurrentDate()}</Text>
                    </View>
                    <Text style={styles.city}>📍 {weather.location}</Text>
                </View>
            </View>

            {/* ---- Bottom Forecast Section ---- */}
            <View style={styles.daysSection}>
                {FORECAST.map((item, i) => (
                    <TouchableOpacity key={i} style={styles.dayBtn} activeOpacity={0.7}>
                        <Text style={styles.dayLabel}>{item.day}</Text>
                        <Text style={styles.dayIcon}>{item.icon}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: spacing.base,
        marginVertical: spacing.sm,
        borderRadius: 25,
        overflow: 'hidden',
        ...shadows.lg,
        height: 180,
    },
    loadingContainer: {
        backgroundColor: '#ec7263',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: typography.sizes.sm,
        marginTop: spacing.sm,
        opacity: 0.8,
    },

    // ---- Info Section (top 75%) ----
    infoSection: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bgDesign: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#ec7263',
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        backgroundColor: '#efc745',
        borderRadius: 999,
    },
    circle1: {
        top: '-80%',
        right: '-30%',
        width: 220,
        height: 220,
        opacity: 0.4,
    },
    circle2: {
        top: '-60%',
        right: '-15%',
        width: 160,
        height: 160,
        opacity: 0.4,
    },
    circle3: {
        top: '-20%',
        right: '2%',
        width: 70,
        height: 70,
        opacity: 1,
    },

    leftSide: {
        flex: 1,
        justifyContent: 'space-around',
        height: '100%',
        paddingLeft: 18,
        paddingVertical: 12,
        zIndex: 1,
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    weatherIcon: {
        fontSize: 22,
    },
    conditionText: {
        fontSize: typography.sizes.sm,
        color: '#fff',
        fontWeight: '500',
    },
    temperature: {
        fontSize: 42,
        fontWeight: '500',
        color: '#fff',
        lineHeight: 48,
    },
    range: {
        fontSize: typography.sizes.sm,
        color: 'rgba(255,255,255,0.75)',
        fontWeight: '400',
    },

    rightSide: {
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: '100%',
        paddingRight: 18,
        paddingVertical: 12,
        zIndex: 1,
    },
    timeBlock: {
        alignItems: 'flex-end',
    },
    hour: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '500',
        lineHeight: 28,
    },
    date: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '400',
    },
    city: {
        fontSize: typography.sizes.sm,
        color: '#fff',
        fontWeight: '500',
    },

    // ---- Days Section (bottom 25%) ----
    daysSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#974859',
        gap: 2,
    },
    dayBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#a75265',
        gap: 5,
    },
    dayLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.7)',
    },
    dayIcon: {
        fontSize: 16,
    },
});
