// App constants

export const APP_NAME = 'FarmEase';
export const APP_TAGLINE = 'From Soil to Sale';

// Supabase config — replace with your actual values
export const SUPABASE_URL = 'https://your-project.supabase.co';
export const SUPABASE_ANON_KEY = 'your-anon-key';

// API endpoints
export const FASTAPI_BASE_URL = 'http://localhost:8000';

// OpenWeatherMap
export const WEATHER_API_KEY = 'your-openweathermap-api-key';
export const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// User roles
export type UserRole = 'farmer' | 'buyer';

// Crop categories for marketplace
export const CROP_CATEGORIES = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Spices',
    'Pulses',
    'Oilseeds',
    'Flowers',
] as const;

// Soil types for crop recommendation
export const SOIL_TYPES = [
    'Loam',
    'Clay',
    'Sandy',
    'Silt',
    'Peat',
    'Chalk',
    'Red Soil',
    'Black Soil',
    'Alluvial',
    'Laterite',
] as const;

// Government scheme categories
export const SCHEME_CATEGORIES = [
    'Subsidy',
    'Insurance',
    'Loan',
    'Training',
    'Equipment',
    'Irrigation',
] as const;

export const ONBOARDING_SLIDES = [
    {
        title: 'Scan & Detect',
        description: 'AI-powered disease detection from a single photo of your crop leaf',
        icon: 'camera' as const,
    },
    {
        title: 'Smart Farming',
        description: 'Get personalized crop & fertilizer recommendations based on your soil',
        icon: 'leaf' as const,
    },
    {
        title: 'Sell Directly',
        description: 'List your crops on the marketplace and connect with buyers directly',
        icon: 'cart' as const,
    },
];
