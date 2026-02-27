import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────────────────────

/** Raw row from `products` joined with `users` via seller_id */
interface ProductRow {
    id: string;
    created_at: string;
    seller_id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    unit: string;
    image_url?: string;
    location?: string;
    is_available: boolean;
    seller: {
        name: string;
        phone?: string;
        farm_location?: string;
    } | null;
}

/** App-level product type used throughout the UI */
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
    unit: string; // kg, quintal, dozen, piece, litre
    image_url?: string;
    location?: string;
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
    location?: string;
}

export type SortOption = 'newest' | 'price_low' | 'price_high';

export interface ProductFilters {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: SortOption;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Normalize seller — PostgREST can return it as array or object */
function normalizeSeller(raw: any): { name: string; phone?: string; farm_location?: string } | null {
    if (!raw) return null;
    if (Array.isArray(raw)) return raw[0] || null;
    return raw;
}

/** Transform a joined DB row into the app-level Product type */
function rowToProduct(row: any): Product {
    const seller = normalizeSeller(row.seller);
    return {
        id: row.id,
        created_at: row.created_at,
        seller_id: row.seller_id,
        seller_name: seller?.name || 'Unknown Seller',
        seller_phone: seller?.phone || undefined,
        seller_location: seller?.farm_location || row.location || undefined,
        name: row.name,
        description: row.description || '',
        category: row.category,
        price: Number(row.price),
        quantity: Number(row.quantity),
        unit: row.unit,
        image_url: row.image_url || undefined,
        location: row.location || undefined,
        is_available: row.is_available,
    };
}

// ── Supabase select string (join seller info from users table) ───────────────

const PRODUCT_SELECT = `
    id, created_at, seller_id, name, description, category,
    price, quantity, unit, image_url, location, is_available,
    seller:users!seller_id ( name, phone, farm_location )
`;

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
    try {
        let query = supabase
            .from('products')
            .select(PRODUCT_SELECT)
            .eq('is_available', true);

        if (filters.category && filters.category !== 'All') {
            query = query.eq('category', filters.category);
        }
        if (filters.search) {
            query = query.or(
                `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
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
        console.log('[fetchProducts] raw data count:', data?.length, 'error:', error);
        if (error) throw error;
        return (data as any[]).map(rowToProduct);
    } catch (err) {
        console.error('[fetchProducts] error:', err);
        return [];
    }
}

export async function fetchProductById(id: string): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(PRODUCT_SELECT)
            .eq('id', id)
            .single();
        if (error) throw error;
        return rowToProduct(data as unknown as ProductRow);
    } catch (err) {
        console.error('fetchProductById error:', err);
        return null;
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
                name: input.name,
                description: input.description,
                category: input.category,
                price: input.price,
                quantity: input.quantity,
                unit: input.unit,
                image_url: input.image_url || null,
                location: input.location || null,
                seller_id: sellerId,
                is_available: true,
            })
            .select(PRODUCT_SELECT)
            .single();
        if (error) throw error;
        return rowToProduct(data as unknown as ProductRow);
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
            .select(PRODUCT_SELECT)
            .single();
        if (error) throw error;
        return rowToProduct(data as unknown as ProductRow);
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
            .select(PRODUCT_SELECT)
            .eq('seller_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data as unknown as ProductRow[]).map(rowToProduct);
    } catch {
        return [];
    }
}
