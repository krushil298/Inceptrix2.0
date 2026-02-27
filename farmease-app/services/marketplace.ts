import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Product {
    id: string;
    created_at: string;
    seller_id: string;
    seller_name: string;
    seller_phone?: string;
    seller_location?: string;
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    unit: string; // kg, quintal, dozen, piece
    image_url?: string;
    is_available: boolean;
}

export interface CreateProductInput {
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    unit: string;
    image_url?: string;
    seller_name: string;
    seller_phone?: string;
    seller_location?: string;
}

export type SortOption = 'newest' | 'price_low' | 'price_high';

export interface ProductFilters {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: SortOption;
}

// ── Demo Data (used when Supabase is not configured) ─────────────────────────

export const DEMO_PRODUCTS: Product[] = [
    {
        id: '1',
        created_at: new Date().toISOString(),
        seller_id: 'demo-farmer-1',
        seller_name: 'Rajesh Kumar',
        seller_phone: '+91 98765 43210',
        seller_location: 'Pune, Maharashtra',
        name: 'Fresh Tomatoes',
        description: 'Organically grown fresh red tomatoes from our farm. Harvested this morning. No pesticides used.',
        category: 'Vegetables',
        price: 40,
        quantity: 500,
        unit: 'kg',
        image_url: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400',
        is_available: true,
    },
    {
        id: '2',
        created_at: new Date().toISOString(),
        seller_id: 'demo-farmer-2',
        seller_name: 'Sunita Devi',
        seller_phone: '+91 87654 32109',
        seller_location: 'Bangalore, Karnataka',
        name: 'Basmati Rice',
        description: 'Premium quality aged Basmati rice. Long grain, aromatic. Perfect for biryani and pulao.',
        category: 'Grains',
        price: 120,
        quantity: 1000,
        unit: 'kg',
        image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        is_available: true,
    },
    {
        id: '3',
        created_at: new Date().toISOString(),
        seller_id: 'demo-farmer-1',
        seller_name: 'Rajesh Kumar',
        seller_phone: '+91 98765 43210',
        seller_location: 'Pune, Maharashtra',
        name: 'Alphonso Mangoes',
        description: 'Ratnagiri Alphonso mangoes — the king of mangoes! Sweet, juicy, and naturally ripened.',
        category: 'Fruits',
        price: 600,
        quantity: 200,
        unit: 'dozen',
        image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
        is_available: true,
    },
    {
        id: '4',
        created_at: new Date().toISOString(),
        seller_id: 'demo-farmer-3',
        seller_name: 'Amit Patel',
        seller_phone: '+91 76543 21098',
        seller_location: 'Ahmedabad, Gujarat',
        name: 'Red Chilli Powder',
        description: 'Pure Guntur red chilli powder. No added colors or preservatives. Hot and flavorful.',
        category: 'Spices',
        price: 250,
        quantity: 100,
        unit: 'kg',
        image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
        is_available: true,
    },
    {
        id: '5',
        created_at: new Date().toISOString(),
        seller_id: 'demo-farmer-4',
        seller_name: 'Lakshmi Naidu',
        seller_phone: '+91 65432 10987',
        seller_location: 'Hyderabad, Telangana',
        name: 'Green Moong Dal',
        description: 'Premium quality moong dal, carefully sorted and cleaned. Rich in protein.',
        category: 'Pulses',
        price: 95,
        quantity: 300,
        unit: 'kg',
        image_url: 'https://images.unsplash.com/photo-1585996746227-c3a5f3b76e85?w=400',
        is_available: true,
    },
    {
        id: '6',
        created_at: new Date().toISOString(),
        seller_id: 'demo-farmer-5',
        seller_name: 'Priya Sharma',
        seller_phone: '+91 54321 09876',
        seller_location: 'Jaipur, Rajasthan',
        name: 'Fresh Onions',
        description: 'Nashik red onions, freshly harvested. Great shelf life. Available in bulk.',
        category: 'Vegetables',
        price: 30,
        quantity: 800,
        unit: 'kg',
        image_url: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400',
        is_available: true,
    },
    {
        id: '7',
        created_at: new Date().toISOString(),
        seller_id: 'demo-farmer-2',
        seller_name: 'Sunita Devi',
        seller_phone: '+91 87654 32109',
        seller_location: 'Bangalore, Karnataka',
        name: 'Groundnut Oil',
        description: 'Cold-pressed groundnut oil. Pure and chemical-free. Great for cooking.',
        category: 'Oilseeds',
        price: 180,
        quantity: 50,
        unit: 'litre',
        image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacdc948b6?w=400',
        is_available: true,
    },
    {
        id: '8',
        created_at: new Date().toISOString(),
        seller_id: 'demo-farmer-3',
        seller_name: 'Amit Patel',
        seller_phone: '+91 76543 21098',
        seller_location: 'Ahmedabad, Gujarat',
        name: 'Marigold Flowers',
        description: 'Fresh marigold flowers for pooja and decoration. Bright orange color.',
        category: 'Flowers',
        price: 60,
        quantity: 100,
        unit: 'kg',
        image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
        is_available: true,
    },
];

// ── Helper: apply filters to product array ───────────────────────────────────

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
    let result = [...products];

    if (filters.category && filters.category !== 'All') {
        result = result.filter((p) => p.category === filters.category);
    }
    if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.seller_name.toLowerCase().includes(q) ||
                p.seller_location?.toLowerCase().includes(q)
        );
    }
    if (filters.minPrice !== undefined) {
        result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
        result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    switch (filters.sort) {
        case 'price_low':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
        default:
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
    }

    return result;
}

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
    try {
        let query = supabase
            .from('products')
            .select('*')
            .eq('is_available', true);

        if (filters.category && filters.category !== 'All') {
            query = query.eq('category', filters.category);
        }
        if (filters.search) {
            query = query.or(
                `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,seller_name.ilike.%${filters.search}%`
            );
        }
        if (filters.minPrice !== undefined) {
            query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            query = query.lte('price', filters.maxPrice);
        }

        switch (filters.sort) {
            case 'price_low':
                query = query.order('price', { ascending: true });
                break;
            case 'price_high':
                query = query.order('price', { ascending: false });
                break;
            default:
                query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    } catch {
        // Fallback to demo data when Supabase is not configured
        return applyFilters(DEMO_PRODUCTS, filters);
    }
}

export async function fetchProductById(id: string): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    } catch {
        return DEMO_PRODUCTS.find((p) => p.id === id) || null;
    }
}

export async function createProduct(
    input: CreateProductInput,
    sellerId: string
): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert({
                ...input,
                seller_id: sellerId,
                is_available: true,
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Create product error:', err);
        return null;
    }
}

export async function updateProduct(
    id: string,
    updates: Partial<CreateProductInput>
): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Update product error:', err);
        return null;
    }
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Delete product error:', err);
        return false;
    }
}

export async function fetchMyProducts(userId: string): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch {
        return DEMO_PRODUCTS.filter((p) => p.seller_id === userId);
    }
}
