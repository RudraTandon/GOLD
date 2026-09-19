"use client";

import React, { Suspense } from 'react';
import Button from '@/app/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function SuccessDetails() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || 'TND-984712';
  const paymentId = searchParams.get('payment_id');
  const method = searchParams.get('method');
  const isOnline = method === 'online' || Boolean(paymentId);

  return (
    <>
      <div className="order-details-card">
        <div className="order-row">
          <span className="order-label">Order ID</span>
          <span className="order-value" style={{ fontWeight: 700 }}>{orderId}</span>
        </div>
        {paymentId && (
          <div className="order-row">
            <span className="order-label">UPI Reference / Ref</span>
            <span className="order-value" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{paymentId}</span>
          </div>
        )}
        <div className="order-row">
          <span className="order-label">Total Amount</span>
          <span className="order-value">{isOnline ? '₹499' : '₹549'}</span>
        </div>
        <div className="order-row">
          <span className="order-label">Payment Method</span>
          <span className="order-value">
            {isOnline ? 'Instant UPI Payment (Direct QR)' : 'Cash on Delivery (COD)'}
          </span>
        </div>
        <div className="order-row">
          <span className="order-label">Delivery Estimate</span>
          <span className="order-value">4-7 Business Days</span>
        </div>
      </div>

      <div className="success-actions flex flex-col gap-md" style={{ marginTop: '2rem' }}>
        <Button variant="primary" isFullWidth href={`/track?order_id=${encodeURIComponent(orderId)}`}>
          Track Order
        </Button>
        <Button variant="outline" isFullWidth href="/">
          Continue Shopping
        </Button>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <div className="success-page animate-fade-in section text-center">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="success-icon-wrapper">
          <CheckCircle2 size={64} className="success-icon" />
        </div>

        <h1 className="success-title">ORDER CONFIRMED!</h1>
        <p className="success-subtitle">Thank you for shopping with TANDO.</p>

        <Suspense fallback={<div className="order-details-card"><p>Loading order details...</p></div>}>
          <SuccessDetails />
        </Suspense>

        <p className="success-message" style={{ marginTop: '1.5rem' }}>
          We&apos;ve received your order and stored it securely in our fulfillment system.
          You can track your shipment status anytime using your Order ID.
        </p>
      </div>
    </div>
  );
}
