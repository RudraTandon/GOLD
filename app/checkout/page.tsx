"use client";

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Button from '@/app/components/ui/Button';
import UpiPaymentModal from '@/app/components/ui/UpiPaymentModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart, CartItem } from '@/lib/CartContext';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCart = searchParams.get('from') === 'cart';
  const paramVariantId = searchParams.get('product') || 'luxe-royal-gold';

  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCart();

  // Determine items to checkout
  const checkoutItems: CartItem[] =
    fromCart && cartItems.length > 0
      ? cartItems
      : [
          {
            id: paramVariantId,
            name:
              paramVariantId === 'luxe-royal-chrono'
                ? 'TANDO Luxe Royal Chrono Watch Combo'
                : 'TANDO Luxe Royal Gold Watch Combo',
            price: 499,
            quantity: 1,
            image:
              paramVariantId === 'luxe-royal-chrono'
                ? '/black-combo.jpg'
                : '/gold-combo.jpg',
          },
        ];

  const subtotal = checkoutItems.reduce(
    (acc, it) => acc + it.price * it.quantity,
    0
  );

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UPI QR Modal State
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('');
  const [activeOrderAmount, setActiveOrderAmount] = useState<number>(subtotal);

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

  const handleOnlineUpiPayment = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // 1. Call backend to create Order in Supabase
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
          items: checkoutItems,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.order_number) {
        throw new Error(orderData.error || 'Failed to initialize order.');
      }

      // 2. Open UPI QR Modal with generated Order Number and dynamic amount
      setActiveOrderNumber(orderData.order_number);
      setActiveOrderAmount(orderData.amount || subtotal);
      setShowUpiModal(true);
      setIsProcessing(false);
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
          items: checkoutItems,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.order_number) {
        throw new Error(orderData.error || 'Failed to place COD order.');
      }

      clearCart();
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
      await handleOnlineUpiPayment();
    } else {
      await handleCodOrder();
    }
  };

  const handlePaymentSuccess = (orderNumber: string, paymentRef: string) => {
    setShowUpiModal(false);
    clearCart();
    router.push(
      `/success?order_id=${encodeURIComponent(orderNumber)}&payment_id=${encodeURIComponent(
        paymentRef
      )}&method=online`
    );
  };

  const codFee = paymentMethod === 'cod' ? 50 : 0;
  const totalAmount = subtotal + codFee;

  return (
    <>
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
                  <div className="flex items-center gap-xs">
                    <span className="payment-title">Instant UPI QR Payment</span>
                    <span className="badge-online-save">FREE DELIVERY</span>
                  </div>
                  <span className="payment-desc">
                    Scan with Google Pay, PhonePe, Paytm, BHIM or any UPI app
                  </span>
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
                  <span className="payment-desc">Pay ₹{subtotal + 50} cash upon delivery</span>
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
              {checkoutItems.map((it) => (
                <div key={it.id} className="checkout-item-compact">
                  <div
                    className="checkout-item-img"
                    style={{
                      backgroundImage: `url(${it.image})`,
                    }}
                  >
                    <span className="checkout-item-qty">{it.quantity}</span>
                  </div>
                  <div className="checkout-item-info">
                    <div className="checkout-item-name">{it.name}</div>
                    <div className="checkout-item-price">₹{it.price * it.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="gold-text font-bold">FREE</span>
            </div>
            {paymentMethod === 'cod' && (
              <div className="summary-row" style={{ color: '#ff4d4f' }}>
                <span>COD Convenience Fee</span>
                <span>+₹50</span>
              </div>
            )}
            <div className="summary-total">
              <span>Total to Pay</span>
              <span>₹{totalAmount}</span>
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
                ? 'Preparing Payment...'
                : paymentMethod === 'online'
                ? `Proceed to Pay ₹${subtotal}`
                : `Place Order (₹${totalAmount})`}
            </Button>

            <div className="checkout-trust">
              <p>🔒 100% Encrypted & Safe UPI Transactions</p>
              <p>✓ 7-Day Hassle-Free Returns</p>
              <p>🚚 Priority Express Shipping Included</p>
            </div>
          </div>
        </div>
      </form>

      {/* 5-Minute UPI QR Payment Modal */}
      {showUpiModal && (
        <UpiPaymentModal
          isOpen={showUpiModal}
          onClose={() => setShowUpiModal(false)}
          orderNumber={activeOrderNumber}
          amount={activeOrderAmount}
          upiId="rudratandon2007@oksbi"
          payeeName="Rudra Tandon"
          qrImageSrc="/upi-qr.jpg"
          onSuccess={handlePaymentSuccess}
          onSwitchToCod={() => {
            setShowUpiModal(false);
            setPaymentMethod('cod');
          }}
        />
      )}
    </>
  );
}

export default function CheckoutPage() {
  return (
    <div className="checkout-page animate-fade-in section">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <Suspense fallback={<div>Loading checkout...</div>}>
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  );
}
