"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const shipping = 0; // 100% Free Shipping
  const total = subtotal;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    if (coupon.trim().toUpperCase() === 'TANDO50') {
      setCouponMsg('Coupon TANDO50 applied! (Free express delivery active)');
    } else {
      setCouponMsg('Invalid coupon code. Special launch pricing (₹499) already active.');
    }
  };

  return (
    <div className="cart-page animate-fade-in section">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="empty-cart text-center" style={{ padding: '4rem 1rem' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(197, 160, 89, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'var(--color-gold, #c5a059)',
              }}
            >
              <ShoppingBag size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
            <p className="text-light" style={{ marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
              Looks like you haven&apos;t added any luxury combos yet. Discover our signature watch and jewelry sets!
            </p>
            <Button href="/shop" variant="gold">
              Explore Collection
            </Button>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-header hidden-mobile">
                <div className="col-product">Product</div>
                <div className="col-price">Price</div>
                <div className="col-quantity">Quantity</div>
                <div className="col-total">Total</div>
              </div>

              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="col-product item-product">
                      <div className="item-image">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="90px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="item-details">
                        <Link href={`/product/${item.id}`} className="item-name">
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="item-remove-mobile"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="col-price item-price">₹{item.price}</div>

                    <div className="col-quantity item-quantity">
                      <div className="quantity-selector">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="col-total item-total">
                      ₹{item.price * item.quantity}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="item-remove-desktop"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-actions-bottom">
                <Button variant="outline" href="/shop">
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary-section">
              <div className="summary-box">
                <h2>Order Summary</h2>

                <div className="summary-row">
                  <span>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="gold-text font-bold">FREE</span>
                </div>

                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <form onSubmit={handleApplyCoupon} className="coupon-section">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. TANDO50)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="coupon-input"
                  />
                  <button type="submit" className="coupon-btn">
                    Apply
                  </button>
                </form>

                {couponMsg && (
                  <p style={{ fontSize: '0.75rem', color: '#10b981', margin: '0 0 1rem 0' }}>
                    {couponMsg}
                  </p>
                )}

                <Button
                  variant="primary"
                  isFullWidth
                  href="/checkout?from=cart"
                  className="checkout-btn"
                >
                  Proceed to Checkout (₹{total})
                </Button>

                <div className="checkout-trust">
                  <p>
                    <ShieldCheck size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                    100% Encrypted UPI & COD Available
                  </p>
                  <p>
                    <Truck size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                    Fast Express Delivery (4-7 Days)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
