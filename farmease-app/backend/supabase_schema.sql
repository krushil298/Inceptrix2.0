-- ============================================================
-- FarmEase — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)
-- ============================================================

-- ── 1. Users ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT UNIQUE,
    name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer')) DEFAULT 'farmer',
    farm_location TEXT,
    land_size NUMERIC,
    crop_history TEXT[],
    delivery_address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: users can read all profiles, but only update their own
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);


-- ── 2. Products (Marketplace) ────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price NUMERIC NOT NULL CHECK (price > 0),
    unit TEXT NOT NULL DEFAULT 'kg',
    quantity NUMERIC NOT NULL CHECK (quantity >= 0),
    category TEXT NOT NULL,
    image_url TEXT,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for search/filter performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);

-- RLS: anyone can browse; only owner can modify
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Farmers can insert own products"
    ON products FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Farmers can update own products"
    ON products FOR UPDATE
    USING (auth.uid() = seller_id);

CREATE POLICY "Farmers can delete own products"
    ON products FOR DELETE
    USING (auth.uid() = seller_id);


-- ── 3. Orders ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    total_price NUMERIC NOT NULL CHECK (total_price > 0),
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    delivery_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Order participants can update"
    ON orders FOR UPDATE
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);


-- ── 4. Disease Detection Logs ────────────────────────────────
CREATE TABLE IF NOT EXISTS disease_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT,
    predicted_class TEXT NOT NULL,
    disease_name TEXT NOT NULL,
    confidence NUMERIC NOT NULL,
    is_healthy BOOLEAN NOT NULL DEFAULT false,
    treatment JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE disease_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own disease logs"
    ON disease_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease logs"
    ON disease_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- ── 5. Crop Recommendations Log ─────────────────────────────
CREATE TABLE IF NOT EXISTS crop_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    input_params JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE crop_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own crop logs"
    ON crop_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crop logs"
    ON crop_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- ── 6. Government Schemes (static data) ─────────────────────
CREATE TABLE IF NOT EXISTS schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    eligibility TEXT,
    benefits TEXT,
    apply_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Schemes are public read-only (admin inserts via dashboard)
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schemes are viewable by everyone"
    ON schemes FOR SELECT
    USING (true);


-- ── Helper: auto-update updated_at ──────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
