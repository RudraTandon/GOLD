"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Button from './Button';
import { useCart } from '@/lib/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  shortDescription,
  price,
  originalPrice,
  discountPercentage,
  rating,
  reviewCount,
  image,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      quantity: 1,
    });
  };

  return (
    <div className="product-card">
      <Link href={`/product/${id}`} className="product-image-wrapper">
        <div className="product-image">
          <div style={{ position: 'relative', backgroundColor: '#f1f1f1', width: '100%', aspectRatio: '4/5' }}>
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              className="product-img"
            />
          </div>
        </div>
        {discountPercentage > 0 && (
          <div className="product-badge">-{discountPercentage}%</div>
        )}
      </Link>

      <div className="product-info">
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
                fill={i < Math.floor(rating) ? '#c5a059' : 'none'}
                color={i < Math.floor(rating) ? '#c5a059' : '#e5e5e5'}
              />
            ))}
          </div>
          <span className="review-count">({reviewCount})</span>
        </div>

        <Link href={`/product/${id}`}>
          <h3 className="product-title">{name}</h3>
        </Link>
        <p className="product-desc">{shortDescription}</p>

        <div className="product-price-row">
          <span className="price">₹{price}</span>
          {originalPrice > price && (
            <span className="price-original">₹{originalPrice}</span>
          )}
        </div>

        <div className="product-features">
          <span className="feature-pill">✓ COD Available</span>
        </div>

        <div className="product-actions">
          <Button variant="outline" isFullWidth onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button variant="primary" isFullWidth href={`/checkout?product=${id}`}>
            Buy at ₹499
          </Button>
        </div>
      </div>
    </div>
  );
}
