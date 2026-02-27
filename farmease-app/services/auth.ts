import { supabase } from './supabase';
import { UserRole } from '../utils/constants';

export interface UserProfile {
    id: string;
    phone: string;
    name: string;
    role: UserRole;
    farm_location?: string;
    land_size?: number;
    crop_history?: string[];
    delivery_address?: string;
    avatar_url?: string;
    created_at: string;
}

import AsyncStorage from '@react-native-async-storage/async-storage';

// Send OTP to phone number
export const sendOtp = async (phone: string) => {
    // Dummy implementation: just return success
    return { user: { phone } };
};

// Verify OTP
export const verifyOtp = async (phone: string, token: string) => {
    if (token === '123456') {
        const dummyUser = {
            id: 'dummy-farmer-123',
            phone,
            name: 'Test Farmer',
            role: 'farmer' as UserRole,
            created_at: new Date().toISOString()
        };
        const session = {
            access_token: 'dummy-token',
            refresh_token: 'dummy-refresh',
            expires_in: 3600,
            token_type: 'bearer',
            user: dummyUser
        };

        // Save dummy session and profile
        await AsyncStorage.setItem('dummy_session', JSON.stringify(session));
        await AsyncStorage.setItem('dummy_profile', JSON.stringify(dummyUser));

        return { session, user: dummyUser };
    }

    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) throw error;
    return data;
};

// Create or update user profile
export const upsertProfile = async (profile: Partial<UserProfile>) => {
    // If it's the dummy user, just update local storage
    if (profile.id?.startsWith('dummy')) {
        const stored = await AsyncStorage.getItem('dummy_profile');
        const currentProfile = stored ? JSON.parse(stored) : {};
        const newProfile = { ...currentProfile, ...profile };
        await AsyncStorage.setItem('dummy_profile', JSON.stringify(newProfile));
        return newProfile as UserProfile;
    }

    const { data, error } = await supabase
        .from('users')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single();
    if (error) throw error;
    return data as UserProfile;
};

// Get user profile
export const getProfile = async (userId: string) => {
    if (userId.startsWith('dummy')) {
        const stored = await AsyncStorage.getItem('dummy_profile');
        return stored ? JSON.parse(stored) as UserProfile : null;
    }

    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as UserProfile | null;
};

// Sign out
export const signOut = async () => {
    await AsyncStorage.removeItem('dummy_session');
    await AsyncStorage.removeItem('dummy_profile');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Get current session
export const getSession = async () => {
    const dummySessionStr = await AsyncStorage.getItem('dummy_session');
    if (dummySessionStr) {
        return JSON.parse(dummySessionStr);
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
};
