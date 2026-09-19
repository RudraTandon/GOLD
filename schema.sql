-- =========================================================
-- TANDO E-COMMERCE - PRODUCTION POSTGRESQL SCHEMA & SEED
-- =========================================================

-- Enable pgcrypto extension for UUID generation if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing types if needed for clean re-runs
DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM ('ONLINE_RAZORPAY', 'CASH_ON_DELIVERY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM (
        'DRAFT', 'PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 
        'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RTO_RETURNED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE shipment_status_enum AS ENUM (
        'MANIFESTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 
        'DELIVERED', 'FAILED_ATTEMPT', 'RTO_INITIATED', 'RTO_DELIVERED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =========================================================
-- 1. PRODUCTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    compare_price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    whats_included JSONB NOT NULL DEFAULT '[]',
    highlights JSONB NOT NULL DEFAULT '[]',
    specifications JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. PRODUCT VARIANTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    sku VARCHAR(64) UNIQUE NOT NULL,
    variant_name VARCHAR(128) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 100,
    images JSONB NOT NULL DEFAULT '[]',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 3. USERS / CUSTOMERS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    full_name VARCHAR(128),
    role VARCHAR(32) DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 4. SHIPPING ADDRESSES
-- =========================================================
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(128) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address_line TEXT NOT NULL,
    landmark VARCHAR(128),
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_serviceable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 5. ORDERS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    shipping_address_id UUID NOT NULL REFERENCES addresses(id),
    status order_status_enum NOT NULL DEFAULT 'PENDING_PAYMENT',
    payment_method payment_method_enum NOT NULL,
    subtotal_amount NUMERIC(10, 2) NOT NULL,
    cod_fee_amount NUMERIC(10, 2) DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    coupon_code VARCHAR(32),
    idempotency_key VARCHAR(128) UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 6. ORDER LINE ITEMS
-- =========================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id VARCHAR(64) NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 7. PAYMENTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method payment_method_enum NOT NULL,
    gateway VARCHAR(32) NOT NULL,
    gateway_order_id VARCHAR(128) UNIQUE,
    gateway_payment_id VARCHAR(128) UNIQUE,
    gateway_signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'INR',
    status payment_status_enum NOT NULL DEFAULT 'PENDING',
    raw_payload JSONB,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 8. SHIPMENTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    courier_partner VARCHAR(64),
    awb_number VARCHAR(64) UNIQUE,
    status shipment_status_enum NOT NULL DEFAULT 'MANIFESTED',
    estimated_delivery_date DATE,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 9. SHIPMENT TRACKING EVENTS
-- =========================================================
CREATE TABLE IF NOT EXISTS tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    stage VARCHAR(64) NOT NULL,
    location VARCHAR(128),
    activity_description TEXT NOT NULL,
    event_timestamp TIMESTAMPTZ NOT NULL,
    is_completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 10. REVIEWS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(128) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    is_verified_buyer BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 11. SUPPORT INQUIRIES
-- =========================================================
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    order_number VARCHAR(32),
    message TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_order_id ON payments(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_payment_id ON payments(gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_shipments_awb_number ON shipments(awb_number);
CREATE INDEX IF NOT EXISTS idx_tracking_shipment_id ON tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =========================================================
-- SEED DATA (INITIAL PRODUCTS & VARIANTS)
-- =========================================================
INSERT INTO products (
    id, name, short_name, slug, description, base_price, compare_price, 
    whats_included, highlights, specifications
) VALUES (
    'tando-luxe-combo',
    'TANDO Luxe Royal Watch Combo — Watch + Chain + Ring',
    'Luxe Royal Watch Combo',
    'luxe-royal-combo',
    'Elevate your everyday style with the TANDO Luxe Royal Watch Combo — a stylish men''s accessory set combining a sophisticated fashion watch, statement chain and elegant gold-tone ring.',
    499.00,
    1499.00,
    '["1 Fashion Watch", "1 Men''s Fashion Chain", "1 Men''s Fashion Ring"]'::jsonb,
    '["Complete 3-piece men''s accessory combo", "Stylish fashion watch", "Statement chain", "Gold-tone fashion ring", "Great gifting option"]'::jsonb,
    '[{"label": "Base Metal", "value": "Bronze"}, {"label": "Ring Size", "value": "18"}, {"label": "Plating", "value": "Fashion Gold Finish"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_variants (
    id, product_id, sku, variant_name, price, stock_quantity, images
) VALUES 
(
    'luxe-royal-gold',
    'tando-luxe-combo',
    'TND-WCR-GOLD-01',
    'Luxe Royal Gold Combo',
    499.00,
    250,
    '["/gold-combo.jpg", "/black-combo.jpg"]'::jsonb
),
(
    'luxe-royal-chrono',
    'tando-luxe-combo',
    'TND-WCR-CHRONO-02',
    'Luxe Royal Chrono Combo',
    499.00,
    250,
    '["/black-combo.jpg", "/gold-combo.jpg"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
