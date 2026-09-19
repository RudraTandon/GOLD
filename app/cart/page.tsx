"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import { Minus, Plus, Trash2 } from 'lucide-react';

const MOCK_CART_ITEMS = [
  {
    id: 'luxe-royal-gold',
    name: 'TANDO Luxe Royal Gold Watch Combo',
    price: 499,
    quantity: 1,
    image: '/gold-combo.jpg'
  },
  {
    id: 'luxe-royal-chrono',
    name: 'TANDO Luxe Royal Chrono Watch Combo',
    price: 499,
    quantity: 1,
    image: '/black-combo.jpg'
  }
];

export default function CartPage() {
  const [items, setItems] = useState(MOCK_CART_ITEMS);
  const [coupon, setCoupon] = useState('');

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 0 : 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="cart-page animate-fade-in section">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="empty-cart text-center">
            <p className="text-light" style={{ marginBottom: '2rem' }}>Your cart is currently empty.</p>
            <Button href="/shop" variant="gold">Continue Shopping</Button>
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
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="col-product item-product">
                      <div className="item-image">
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="item-details">
                        <Link href={`/product/${item.id}`} className="item-name">{item.name}</Link>
                        <button onClick={() => removeItem(item.id)} className="item-remove-mobile">
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-price item-price">
                      ₹{item.price}
                    </div>
                    
                    <div className="col-quantity item-quantity">
                      <div className="quantity-selector">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="col-total item-total">
                      ₹{item.price * item.quantity}
                    </div>
                    
                    <button onClick={() => removeItem(item.id)} className="item-remove-desktop">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-actions-bottom">
                <Button variant="outline" href="/shop">Continue Shopping</Button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary-section">
              <div className="summary-box">
                <h2>Order Summary</h2>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                
                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                
                <div className="coupon-section">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="coupon-input"
                  />
                  <button className="coupon-btn">Apply</button>
                </div>
                
                <Button variant="primary" isFullWidth href="/checkout" className="checkout-btn">
                  Proceed to Checkout
                </Button>
                
                <div className="checkout-trust">
                  <p>🔒 Secure Checkout</p>
                  <p>💳 COD Available</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
