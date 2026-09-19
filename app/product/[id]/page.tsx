"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/app/components/ui/Button';
import ReviewCard from '@/app/components/ui/ReviewCard';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  ratingCount: number;
  images: string[];
  whatsIncluded: string[];
  highlights: string[];
  specifications: { label: string; value: string }[];
  reviews: { name: string; rating: number; date: string; text: string }[];
}

const PRODUCTS: Record<string, ProductItem> = {
  'luxe-royal-gold': {
    id: 'luxe-royal-gold',
    name: 'TANDO Luxe Royal Gold Watch Combo — Watch + Chain + Ring',
    shortName: 'Luxe Royal Gold Watch Combo',
    description: "Elevate your everyday style with the TANDO Luxe Royal Gold Watch Combo — a stylish men's accessory set combining a sophisticated fashion watch, statement chain and elegant gold-tone ring. Designed for men who want a complete, coordinated look, this combo is perfect for casual outfits, parties, festive occasions, celebrations and special events.",
    price: 499,
    originalPrice: 1499,
    discountPercentage: 66,
    rating: 4.1,
    reviewCount: 434,
    ratingCount: 1575,
    images: [
      '/gold-combo.jpg',
      '/black-combo.jpg',
    ],
    whatsIncluded: [
      '1 Fashion Watch',
      '1 Men\'s Fashion Chain',
      '1 Men\'s Fashion Ring'
    ],
    highlights: [
      'Complete 3-piece men\'s accessory combo',
      'Stylish fashion watch',
      'Statement chain',
      'Gold-tone fashion ring',
      'Modern and versatile styling',
      'Suitable for casual and ethnic outfits',
      'Ideal for parties and special occasions',
      'Great gifting option'
    ],
    specifications: [
      { label: 'Base Metal', value: 'Bronze' },
      { label: 'Color', value: 'Gold' },
      { label: 'Ring Size', value: '18' },
      { label: 'Sizing', value: 'Non-adjustable' },
      { label: 'Plating', value: 'No plating' }
    ],
    reviews: [
      { name: 'Rahul S.', rating: 5, date: '12 Sep 2026', text: 'Amazing combo! Looks very premium for the price. The watch is stylish and the ring fits perfectly.' },
      { name: 'Amit K.', rating: 4, date: '05 Sep 2026', text: 'Good quality. The chain is a bit thick but overall I like the look.' },
      { name: 'Vikram M.', rating: 5, date: '28 Aug 2026', text: 'Best gift I bought for my brother. He loved it.' },
    ]
  },
  'luxe-royal-chrono': {
    id: 'luxe-royal-chrono',
    name: 'TANDO Luxe Royal Chrono Watch Combo — Watch + Chain + Ring',
    shortName: 'Luxe Royal Chrono Watch Combo',
    description: "Make a bold statement with the TANDO Luxe Royal Chrono Watch Combo. Featuring a stylish chronograph-inspired black dial watch, statement chain and classic gold-tone ring, it's designed for the modern man who commands attention.",
    price: 499,
    originalPrice: 1499,
    discountPercentage: 66,
    rating: 4.1,
    reviewCount: 434,
    ratingCount: 1575,
    images: [
      '/black-combo.jpg',
      '/gold-combo.jpg',
    ],
    whatsIncluded: [
      '1 Fashion Watch (Chronograph Style)',
      '1 Men\'s Fashion Chain',
      '1 Men\'s Fashion Ring'
    ],
    highlights: [
      'Complete 3-piece men\'s accessory combo',
      'Bold black dial watch',
      'Statement chain',
      'Gold-tone fashion ring',
      'Modern and versatile styling',
      'Suitable for casual and ethnic outfits',
      'Great gifting option'
    ],
    specifications: [
      { label: 'Base Metal', value: 'Bronze' },
      { label: 'Color', value: 'Black & Gold' },
      { label: 'Ring Size', value: '18' },
      { label: 'Sizing', value: 'Non-adjustable' },
      { label: 'Plating', value: 'No plating' }
    ],
    reviews: [
      { name: 'Rahul S.', rating: 5, date: '12 Sep 2026', text: 'Amazing combo! Looks very premium for the price. The watch is stylish and the ring fits perfectly.' },
      { name: 'Amit K.', rating: 4, date: '05 Sep 2026', text: 'Good quality. The chain is a bit thick but overall I like the look.' },
      { name: 'Vikram M.', rating: 5, date: '28 Aug 2026', text: 'Best gift I bought for my brother. He loved it.' },
    ]
  }
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const PRODUCT = PRODUCTS[id] || PRODUCTS['luxe-royal-gold'];
  
  // Define which product ID each image corresponds to
  const getVariantId = (index: number) => {
    if (id === 'luxe-royal-chrono') {
      return index === 0 ? 'luxe-royal-chrono' : 'luxe-royal-gold';
    }
    return index === 0 ? 'luxe-royal-gold' : 'luxe-royal-chrono';
  };
  
  return (
    <div className="product-page animate-fade-in">
      <div className="container">
        
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">Home</Link> &gt; <Link href="/shop">Shop</Link> &gt; <span>{PRODUCT.shortName}</span>
        </div>

        <div className="product-main-grid">
          {/* Left: Images */}
          <div className="product-gallery">
            <div className="main-image">
              <Image 
                src={PRODUCT.images[0]} 
                alt={PRODUCT.name} 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="thumbnail-list">
              {PRODUCT.images.map((img: string, i: number) => (
                <div 
                  key={i} 
                  className={`thumbnail ${i === 0 ? 'active' : ''}`}
                  onClick={() => {
                    const variantId = getVariantId(i);
                    if (variantId !== id) {
                      router.push(`/product/${variantId}`);
                    }
                  }}
                >
                  <Image 
                    src={img} 
                    alt={`${PRODUCT.name} view ${i+1}`} 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="product-details">
            <div className="brand-tag">TANDO</div>
            <h1 className="product-title-large">{PRODUCT.name}</h1>
            
            <div className="product-rating-large">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.floor(PRODUCT.rating) ? '#c5a059' : 'none'}
                    color={i < Math.floor(PRODUCT.rating) ? '#c5a059' : '#e5e5e5'}
                  />
                ))}
              </div>
              <span className="rating-score">{PRODUCT.rating}/5</span>
              <span className="rating-count">{PRODUCT.ratingCount} Ratings • {PRODUCT.reviewCount} Reviews</span>
            </div>

            <div className="product-price-large">
              <span className="price">₹{PRODUCT.price}</span>
              <span className="price-original">₹{PRODUCT.originalPrice}</span>
              <span className="discount-badge">-{PRODUCT.discountPercentage}%</span>
            </div>

            <div className="trust-badges">
              <div className="trust-badge">
                <Truck size={20} />
                <span>COD Available</span>
              </div>
              <div className="trust-badge">
                <ShieldCheck size={20} />
                <span>Secure Online Payment</span>
              </div>
              <div className="trust-badge">
                <RotateCcw size={20} />
                <span>7-Day Easy Returns</span>
              </div>
            </div>

            <div className="product-actions-large">
              <Button variant="outline" isFullWidth className="pdp-btn">Add to Cart</Button>
              <Button variant="primary" isFullWidth href={`/checkout?product=${PRODUCT.id}`} className="pdp-btn">Buy at ₹499</Button>
            </div>
          </div>
        </div>

        {/* Product Information Sections */}
        <div className="product-info-sections">
          
          <div className="info-section">
            <h2>Product Description</h2>
            <p>{PRODUCT.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-xl">
            <div className="info-section">
              <h2>What&apos;s Included</h2>
              <ul className="bullet-list">
                {PRODUCT.whatsIncluded.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="info-section">
              <h2>Highlights</h2>
              <ul className="bullet-list">
                {PRODUCT.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="info-section">
            <h2>Specifications</h2>
            <div className="specs-table">
              {PRODUCT.specifications.map((spec, i) => (
                <div key={i} className="spec-row">
                  <div className="spec-label">{spec.label}</div>
                  <div className="spec-value">{spec.value}</div>
                </div>
              ))}
            </div>
            <p className="spec-note">* Please note: The ring is a gold-tone fashion accessory with a bronze base metal. It is not real gold or gold-plated.</p>
          </div>

          {/* Customer Reviews */}
          <div className="info-section reviews-section">
            <h2>Customer Reviews</h2>
            <div className="reviews-summary">
              <div className="stars-large">
                <Star size={24} fill="#c5a059" color="#c5a059" />
                <Star size={24} fill="#c5a059" color="#c5a059" />
                <Star size={24} fill="#c5a059" color="#c5a059" />
                <Star size={24} fill="#c5a059" color="#c5a059" />
                <Star size={24} color="#e5e5e5" />
              </div>
              <div className="summary-text">
                <span className="score">4.1/5</span>
                <span className="count">({PRODUCT.ratingCount} Ratings • {PRODUCT.reviewCount} Reviews)</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-md">
              {PRODUCT.reviews.map((review, i) => (
                <ReviewCard key={i} {...review} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
