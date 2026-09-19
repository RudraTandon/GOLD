import React from 'react';
import Button from './components/ui/Button';
import ProductCard from './components/ui/ProductCard';
import FeatureCard from './components/ui/FeatureCard';
import { ShieldCheck, Truck, Clock, Gem } from 'lucide-react';

// Mock data for the two required products
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

export default function Home() {
  return (
    <div className="animate-fade-in">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">STYLE THAT SPEAKS FOR YOU.</h1>
          <p className="hero-subtitle">
            Discover premium-inspired men&apos;s watch & jewellery combos designed to elevate your everyday look.
          </p>
          <div className="hero-actions">
            <Button variant="gold" href="/shop">SHOP COLLECTION</Button>
            <Button variant="outline" href="/shop" style={{ borderColor: 'white', color: 'white' }}>EXPLORE COMBOS</Button>
          </div>
          
          <div className="hero-trust">
            <span>✓ COD Available</span>
            <span>✓ Secure Payments</span>
            <span>✓ Easy Returns</span>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="section-header text-center">
            <h2>THE TANDO COLLECTION</h2>
            <p className="text-light">Complete your look with our signature men&apos;s accessory combos.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-xl max-w-4xl mx-auto" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Tando Section */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
            <h2>WHY CHOOSE TANDO?</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-lg">
            <FeatureCard 
              icon={<Gem size={32} />}
              title="PREMIUM STYLE"
              description="Modern accessories designed to elevate your look."
            />
            <FeatureCard 
              icon={<ShieldCheck size={32} />}
              title="COMPLETE COMBOS"
              description="Watch + chain + ring in one coordinated set."
            />
            <FeatureCard 
              icon={<Truck size={32} />}
              title="COD AVAILABLE"
              description="Convenient Cash on Delivery across eligible locations."
            />
            <FeatureCard 
              icon={<Clock size={32} />}
              title="SECURE CHECKOUT"
              description="Safe and convenient online payment options."
            />
          </div>
        </div>
      </section>

      {/* Offer Banner Section */}
      <section className="offer-banner">
        <div className="container text-center">
          <h2 className="offer-title">COMPLETE YOUR LOOK.</h2>
          <p className="offer-text">Get the TANDO watch + chain + ring combo and upgrade your everyday style.</p>
          <Button variant="gold" href="/shop">SHOP NOW</Button>
        </div>
      </section>

    </div>
  );
}
