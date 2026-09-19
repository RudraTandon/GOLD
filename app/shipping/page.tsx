import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="section static-page animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">Shipping Policy</h1>
        
        <div className="content-prose">
          <h3>1. Processing Time</h3>
          <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>

          <h3>2. Shipping Rates & Delivery Estimates</h3>
          <p>We currently offer <strong>FREE Shipping</strong> on all prepaid orders across India. For Cash on Delivery (COD) orders, a nominal handling fee may apply.</p>
          <p>Standard delivery time is 4-7 business days depending on your location. Metro cities generally receive deliveries faster (3-5 days).</p>

          <h3>3. Shipment Confirmation & Order Tracking</h3>
          <p>You will receive a Shipment Confirmation email/SMS once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

          <h3>4. Cash on Delivery (COD)</h3>
          <p>COD is available for most pin codes. Our courier partner will collect the invoice amount in cash when delivering the package.</p>

          <h3>5. Damages</h3>
          <p>If you received your order damaged, please contact us immediately at support@tando.in with photos of the damaged item and packaging so we can resolve the issue.</p>
        </div>
      </div>
    </div>
  );
}
