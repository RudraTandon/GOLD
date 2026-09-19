"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Button from '@/app/components/ui/Button';
import { Package, Truck, CheckCircle2, Box, AlertCircle, Clock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface TimelineEvent {
  stage: string;
  description: string;
  location?: string | null;
  timestamp?: string | null;
  isActive: boolean;
}

interface TrackingData {
  orderNumber: string;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  destination: string;
  courierPartner: string;
  awbNumber: string;
  items: any[];
  timeline: TimelineEvent[];
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('order_id') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  const fetchTracking = async (idToTrack: string) => {
    if (!idToTrack.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/track-order?orderId=${encodeURIComponent(idToTrack.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not find order. Please verify your order number.');
      }

      setTrackingData(data);
    } catch (err: unknown) {
      console.error('Tracking fetch error:', err);
      const e = err as { message?: string };
      setError(e?.message || 'Failed to fetch tracking details.');
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderId);
  };

  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'order confirmed':
        return <CheckCircle2 size={20} />;
      case 'processing':
        return <Box size={20} />;
      case 'shipped':
        return <Truck size={20} />;
      case 'out for delivery':
        return <Package size={20} />;
      case 'delivered':
        return <CheckCircle2 size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  return (
    <div className="track-page section">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h1 className="page-title" style={{ border: 'none', marginBottom: '1rem', padding: 0 }}>
            Track Your Order
          </h1>
          <p className="text-light">Enter your Order ID (e.g. TND-849102) to check real-time shipment status.</p>
        </div>

        <div className="track-card">
          <form onSubmit={handleTrack} className="track-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. TND-123456)"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Track Order'}
            </Button>
          </form>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#fff1f0',
                border: '1px solid #ffa39e',
                color: '#cf1322',
                padding: '1rem',
                borderRadius: 'var(--radius-sm, 6px)',
                marginTop: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {trackingData && (
            <div className="tracking-result animate-fade-in" style={{ marginTop: '2rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  borderBottom: '1px solid var(--color-light-grey)',
                  paddingBottom: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>Order: {trackingData.orderNumber}</h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-grey)' }}>
                    Courier: {trackingData.courierPartner} (AWB: {trackingData.awbNumber})
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#e6f7ff',
                      color: '#096dd9',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    {trackingData.status.replace('_', ' ')}
                  </span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-grey)', marginTop: '0.25rem' }}>
                    Total: ₹{trackingData.totalAmount}
                  </div>
                </div>
              </div>

              <div className="tracking-timeline">
                {trackingData.timeline.map((event, i) => (
                  <div key={i} className={`timeline-item ${event.isActive ? 'active' : ''}`}>
                    <div className="timeline-icon">{getStageIcon(event.stage)}</div>
                    <div className="timeline-content">
                      <h4>{event.stage}</h4>
                      <p>{event.description}</p>
                      {event.timestamp && (
                        <span className="timeline-time">
                          {new Date(event.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="section container text-center">Loading tracking portal...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
