-- Additional policies for payments, order updates, and shipment creation
DROP POLICY IF EXISTS "Public can insert payments" ON payments;
CREATE POLICY "Public can insert payments" ON payments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view payments" ON payments;
CREATE POLICY "Public can view payments" ON payments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update payments" ON payments;
CREATE POLICY "Public can update payments" ON payments
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can update orders" ON orders;
CREATE POLICY "Public can update orders" ON orders
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can insert shipments" ON shipments;
CREATE POLICY "Public can insert shipments" ON shipments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert tracking events" ON tracking_events;
CREATE POLICY "Public can insert tracking events" ON tracking_events
    FOR INSERT WITH CHECK (true);
