import { supabase } from './supabase';

export interface Scheme {
    id: string;
    name: string;
    category: string;
    description?: string;
    eligibility: string;
    benefits: string;
    apply_url: string;
    is_active: boolean;
    created_at: string;
}

export async function fetchSchemes(category?: string): Promise<Scheme[]> {
    try {
        let query = supabase
            .from('schemes')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data as Scheme[];
    } catch (err) {
        console.error('fetchSchemes error:', err);
        return [];
    }
}
