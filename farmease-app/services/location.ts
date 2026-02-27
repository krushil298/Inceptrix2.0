import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '../utils/constants';

export interface LocationCoords {
    lat: number;
    lng: number;
}

export interface LocationResult {
    coords: LocationCoords;
    address: string;
}

// Default fallback location (Bangalore)
const FALLBACK_LOCATION: LocationResult = {
    coords: { lat: 12.9716, lng: 77.5946 },
    address: 'Bangalore, Karnataka',
};

/**
 * Request location permissions and get current GPS coordinates.
 * Falls back to a default location if permission is denied.
 */
export async function getCurrentLocation(): Promise<LocationResult> {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.warn('Location permission denied, using fallback');
            return FALLBACK_LOCATION;
        }

        const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

        const coords: LocationCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        // Try to get a readable address
        const address = await reverseGeocode(coords.lat, coords.lng);

        return { coords, address };
    } catch (error) {
        console.error('Error getting location:', error);
        return FALLBACK_LOCATION;
    }
}

/**
 * Reverse geocode lat/lng to a human-readable address.
 * Uses Google Maps Geocoding API if key is available, falls back to expo-location.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        // Try Google Maps Geocoding API first
        if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your-google-maps-api-key') {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                // Try to get a concise address (city, state level)
                const cityResult = data.results.find((r: any) =>
                    r.types.includes('locality') || r.types.includes('administrative_area_level_2')
                );
                if (cityResult) {
                    return cityResult.formatted_address;
                }
                return data.results[0].formatted_address;
            }
        }

        // Fallback to expo-location reverse geocoding
        const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        if (results && results.length > 0) {
            const place = results[0];
            const parts = [place.city || place.subregion, place.region].filter(Boolean);
            return parts.join(', ') || 'Unknown Location';
        }

        return 'Unknown Location';
    } catch (error) {
        console.error('Reverse geocode error:', error);

        // Last resort fallback with expo-location
        try {
            const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            if (results && results.length > 0) {
                const place = results[0];
                const parts = [place.city || place.subregion, place.region].filter(Boolean);
                return parts.join(', ') || 'Unknown Location';
            }
        } catch {
            // ignore
        }

        return 'Unknown Location';
    }
}
