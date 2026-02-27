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

// Send OTP to phone number
export const sendOtp = async (phone: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    return data;
};

// Verify OTP
export const verifyOtp = async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
    });
    if (error) throw error;
    return data;
};

// Create or update user profile
export const upsertProfile = async (profile: Partial<UserProfile>) => {
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
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as UserProfile | null;
};

// Sign out
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Get current session
export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
};
