import React from 'react';
import ProductCard from '@/app/components/ui/ProductCard';

const PRODUCTS = [
  {
    id: 'luxe-royal-gold',
    name: 'TANDO Luxe Royal Gold Watch Combo — Watch + Chain + Ring',
    shortDescription: 'Complete 3-piece men\'s accessory combo featuring a stylish fashion watch, statement chain and gold-tone ring.',
    price: 499,
    originalPrice: 1499,
    discountPercentage: 66,
    rating: 4.1,
    reviewCount: 1575,
    image: '/gold-combo.jpg' // Placeholder
  },
  {
    id: 'luxe-royal-chrono',
    name: 'TANDO Luxe Royal Chrono Watch Combo — Watch + Chain + Ring',
    shortDescription: 'Make a bold statement with a stylish chronograph-inspired watch, statement chain and classic gold-tone ring.',
    price: 499,
    originalPrice: 1499,
    discountPercentage: 66,
    rating: 4.1,
    reviewCount: 1575,
    image: '/black-combo.jpg' // Placeholder
  }
];

export default function ShopPage() {
  return (
    <div className="shop-page section animate-fade-in">
      <div className="container">
        
        <div className="shop-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="page-title" style={{ border: 'none', marginBottom: '0.5rem', padding: 0 }}>All Combos</h1>
          <p className="text-light">Discover our complete collection of men&apos;s watch and jewellery combos.</p>
        </div>

        <div className="shop-filters" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <select style={{ padding: '0.5rem', border: '1px solid var(--color-light-grey)', borderRadius: 'var(--radius-sm)' }}>
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-xl max-w-4xl mx-auto" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

      </div>
    </div>
  );
}
