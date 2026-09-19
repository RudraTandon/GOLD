"use client";

import React, { useState, Suspense } from 'react';
import Script from 'next/script';
import Button from '@/app/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variantId = searchParams.get('product') || 'luxe-royal-gold';
  const isChrono = variantId === 'luxe-royal-chrono';

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    landmark: '',
    pinCode: '',
    city: '',
    state: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRazorpayPayment = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        throw new Error('Razorpay Public Key is not configured.');
      }

      // 1. Call backend to create Order in Supabase and get Razorpay Order ID
      const createOrderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            fullName: formData.fullName,
            mobile: formData.mobile,
            email: formData.email,
          },
          shippingAddress: {
            address: formData.address,
            landmark: formData.landmark,
            pinCode: formData.pinCode,
            city: formData.city,
            state: formData.state,
          },
          paymentMethod: 'online',
          variantId: variantId,
          quantity: 1,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      // 2. Configure Razorpay Standard Checkout options
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TANDO',
        description: isChrono
          ? 'TANDO Luxe Royal Chrono Watch Combo'
          : 'TANDO Luxe Royal Gold Watch Combo',
        image: isChrono ? '/black-combo.jpg' : '/gold-combo.jpg',
        order_id: orderData.order_id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobile,
        },
        notes: {
          order_number: orderData.order_number,
          address: `${formData.address}, ${formData.city} - ${formData.pinCode}`,
        },
        theme: {
          color: '#c5a059',
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // 3. Verify payment signature on backend & update Supabase
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              router.push(
                `/success?order_id=${orderData.order_number}&payment_id=${response.razorpay_payment_id}&method=online`
              );
            } else {
              setErrorMessage(
                verifyData.error || 'Payment verification failed. Please contact support.'
              );
              setIsProcessing(false);
            }
          } catch (verifyError: unknown) {
            console.error('Error during signature verification:', verifyError);
            setErrorMessage('Unable to verify payment. Please check your bank or contact support.');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setErrorMessage('Payment cancelled. You can complete checkout whenever you are ready.');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (failureResponse: any) {
        setIsProcessing(false);
        const reason =
          failureResponse?.error?.description ||
          'Transaction failed. Please try another payment method or try again.';
        setErrorMessage(reason);
      });

      razorpayInstance.open();
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const errorObj = err as { message?: string };
      setErrorMessage(errorObj?.message || 'Something went wrong while initiating checkout.');
      setIsProcessing(false);
    }
  };

  const handleCodOrder = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const createOrderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            fullName: formData.fullName,
            mobile: formData.mobile,
            email: formData.email,
          },
          shippingAddress: {
            address: formData.address,
            landmark: formData.landmark,
            pinCode: formData.pinCode,
            city: formData.city,
            state: formData.state,
          },
          paymentMethod: 'cod',
          variantId: variantId,
          quantity: 1,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.order_number) {
        throw new Error(orderData.error || 'Failed to place COD order.');
      }

      router.push(`/success?order_id=${orderData.order_number}&method=cod`);
    } catch (err: unknown) {
      console.error('COD placement error:', err);
      const errorObj = err as { message?: string };
      setErrorMessage(errorObj?.message || 'Failed to place Cash on Delivery order.');
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'online') {
      await handleRazorpayPayment();
    } else {
      await handleCodOrder();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-grid">
      {/* Left: Customer & Shipping Info */}
      <div className="checkout-form-section">
        <div className="form-group-section">
          <h2>Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-md">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                required
                placeholder="+91 9876543210"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            <div className="input-group md:col-span-2">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group-section">
          <h2>Shipping Address</h2>
          <div className="grid md:grid-cols-2 gap-md">
            <div className="input-group md:col-span-2">
              <label>Complete Address</label>
              <textarea
                name="address"
                required
                placeholder="House/Flat No., Building Name, Street"
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                placeholder="Near Apollo Hospital"
                value={formData.landmark}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>PIN Code</label>
              <input
                type="text"
                name="pinCode"
                required
                placeholder="110001"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                required
                placeholder="New Delhi"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>State</label>
              <select
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Telangana">Telangana</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group-section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <label className={`payment-option ${paymentMethod === 'online' ? 'active' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
              />
              <div className="payment-details">
                <span className="payment-title">Secure Online Payment (Razorpay)</span>
                <span className="payment-desc">Pay via UPI (GPay, PhonePe, Paytm), Cards, NetBanking</span>
              </div>
            </label>

            <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <div className="payment-details">
                <span className="payment-title">Cash on Delivery (COD)</span>
                <span className="payment-desc">Pay ₹549 cash when your order arrives</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="checkout-summary-section">
        <div className="summary-box sticky-summary">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            <div className="checkout-item-compact">
              <div
                className="checkout-item-img"
                style={{
                  backgroundImage: `url(${isChrono ? '/black-combo.jpg' : '/gold-combo.jpg'})`,
                }}
              >
                <span className="checkout-item-qty">1</span>
              </div>
              <div className="checkout-item-info">
                <div className="checkout-item-name">
                  {isChrono
                    ? 'TANDO Luxe Royal Chrono Watch Combo'
                    : 'TANDO Luxe Royal Gold Watch Combo'}
                </div>
                <div className="checkout-item-price">₹499</div>
              </div>
            </div>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹499</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          {paymentMethod === 'cod' && (
            <div className="summary-row" style={{ color: '#ff4d4f' }}>
              <span>COD Fee</span>
              <span>+₹50</span>
            </div>
          )}
          <div className="summary-total">
            <span>Total to Pay</span>
            <span>{paymentMethod === 'cod' ? '₹549' : '₹499'}</span>
          </div>

          {errorMessage && (
            <div
              style={{
                backgroundColor: '#fff1f0',
                border: '1px solid #ffa39e',
                color: '#cf1322',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm, 6px)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                lineHeight: '1.4',
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            isFullWidth
            className="checkout-btn"
            disabled={isProcessing}
          >
            {isProcessing
              ? 'Processing...'
              : paymentMethod === 'online'
              ? 'Pay Now ₹499'
              : 'Place Order (₹549)'}
          </Button>

          <div className="checkout-trust">
            <p>🔒 Razorpay Secure 256-bit Encrypted</p>
            <p>✓ 7-Day Easy Returns</p>
            <p>🚚 Fast Express Delivery</p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <div className="checkout-page animate-fade-in section">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <Suspense fallback={<div>Loading checkout...</div>}>
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  );
}
