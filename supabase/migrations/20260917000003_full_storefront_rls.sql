-- Full proper RLS policies for e-commerce tables
-- Enable both SELECT and INSERT so .select() works on inserts

-- 1. addresses
DROP POLICY IF EXISTS "Public can view addresses" ON addresses;
CREATE POLICY "Public can view addresses" ON addresses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert addresses" ON addresses;
CREATE POLICY "Public can insert addresses" ON addresses FOR INSERT WITH CHECK (true);

-- 2. orders
DROP POLICY IF EXISTS "Public can view orders" ON orders;
CREATE POLICY "Public can view orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update orders" ON orders;
CREATE POLICY "Public can update orders" ON orders FOR UPDATE USING (true);

-- 3. order_items
DROP POLICY IF EXISTS "Public can view order items" ON order_items;
CREATE POLICY "Public can view order items" ON order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert order items" ON order_items;
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- 4. payments
DROP POLICY IF EXISTS "Public can view payments" ON payments;
CREATE POLICY "Public can view payments" ON payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert payments" ON payments;
CREATE POLICY "Public can insert payments" ON payments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update payments" ON payments;
CREATE POLICY "Public can update payments" ON payments FOR UPDATE USING (true);

-- 5. shipments
DROP POLICY IF EXISTS "Public can view shipments" ON shipments;
CREATE POLICY "Public can view shipments" ON shipments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert shipments" ON shipments;
CREATE POLICY "Public can insert shipments" ON shipments FOR INSERT WITH CHECK (true);

-- 6. tracking_events
DROP POLICY IF EXISTS "Public can view tracking events" ON tracking_events;
CREATE POLICY "Public can view tracking events" ON tracking_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert tracking events" ON tracking_events;
CREATE POLICY "Public can insert tracking events" ON tracking_events FOR INSERT WITH CHECK (true);

-- 7. support_tickets
DROP POLICY IF EXISTS "Public can view support tickets" ON support_tickets;
CREATE POLICY "Public can view support tickets" ON support_tickets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert support tickets" ON support_tickets;
CREATE POLICY "Public can insert support tickets" ON support_tickets FOR INSERT WITH CHECK (true);
