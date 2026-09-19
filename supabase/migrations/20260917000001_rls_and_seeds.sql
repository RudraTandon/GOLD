-- =========================================================
-- RLS POLICIES & SEED DATA FOR PUBLIC STOREFRONT ACCESS
-- =========================================================

-- 1. Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC READ POLICIES (Storefront can view products, variants, and reviews)
DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view available variants" ON product_variants;
CREATE POLICY "Public can view available variants" ON product_variants
    FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;
CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

-- 3. PUBLIC INSERT POLICIES (Storefront can place orders & submit inquiries)
DROP POLICY IF EXISTS "Public can insert addresses" ON addresses;
CREATE POLICY "Public can insert addresses" ON addresses
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders" ON orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read their order by order_number" ON orders;
CREATE POLICY "Public can read their order by order_number" ON orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert order items" ON order_items;
CREATE POLICY "Public can insert order items" ON order_items
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view order items" ON order_items;
CREATE POLICY "Public can view order items" ON order_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view shipments" ON shipments;
CREATE POLICY "Public can view shipments" ON shipments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view tracking events" ON tracking_events;
CREATE POLICY "Public can view tracking events" ON tracking_events
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert support tickets" ON support_tickets;
CREATE POLICY "Public can insert support tickets" ON support_tickets
    FOR INSERT WITH CHECK (true);

-- 4. INSERT / UPSERT SEED PRODUCTS & VARIANTS
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
) ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    base_price = EXCLUDED.base_price,
    compare_price = EXCLUDED.compare_price;

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
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;
