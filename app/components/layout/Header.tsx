"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

const SEARCH_ITEMS = [
  {
    id: 'luxe-royal-gold',
    name: 'TANDO Luxe Royal Gold Watch Combo',
    price: 499,
    image: '/gold-combo.jpg',
    url: '/product/luxe-royal-gold',
    tag: 'Best Seller',
  },
  {
    id: 'luxe-royal-chrono',
    name: 'TANDO Luxe Royal Chrono Watch Combo',
    price: 499,
    image: '/black-combo.jpg',
    url: '/product/luxe-royal-chrono',
    tag: 'Trending',
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();

  const filteredItems = SEARCH_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="header">
        <div className="container header-container">
          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="logo">
            TANDO
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/shop">Collections</Link></li>
              <li><Link href="/track">Track Order</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

          {/* Icons */}
          <div className="header-icons">
            <button
              className="icon-btn"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={22} />
            </button>
            <Link href="/track" className="icon-btn desktop-only" aria-label="Order Tracking">
              <User size={22} />
            </Link>
            <Link href="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="mobile-nav-drawer animate-fade-in">
            <ul className="mobile-nav-links">
              <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
              <li><Link href="/shop" onClick={() => setIsMenuOpen(false)}>Collections</Link></li>
              <li><Link href="/track" onClick={() => setIsMenuOpen(false)}>Track Order</Link></li>
              <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>
          </div>
        )}
      </header>

      {/* Interactive Search Overlay Modal */}
      {isSearchOpen && (
        <div className="search-overlay animate-fade-in" role="dialog" aria-modal="true">
          <div className="search-modal-card">
            <div className="search-modal-header">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon-inside" />
                <input
                  type="text"
                  placeholder="Search combos (e.g. Gold, Chrono, Chain, Ring)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="search-main-input"
                />
              </div>
              <button
                className="search-close-btn"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            <div className="search-results-section">
              <span className="search-results-title">
                {searchQuery ? `Results for "${searchQuery}"` : 'Popular Combos'}
              </span>

              <div className="search-items-list">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      onClick={() => setIsSearchOpen(false)}
                      className="search-result-item"
                    >
                      <div className="search-item-img">
                        <Image src={item.image} alt={item.name} width={52} height={52} />
                      </div>
                      <div className="search-item-info">
                        <span className="search-item-name">{item.name}</span>
                        <div className="search-item-meta">
                          <span className="search-item-price">₹{item.price}</span>
                          <span className="search-item-tag">{item.tag}</span>
                        </div>
                      </div>
                      <ArrowRight size={16} className="search-arrow" />
                    </Link>
                  ))
                ) : (
                  <p className="no-search-results">No combos found matching &quot;{searchQuery}&quot;</p>
                )}
              </div>

              <div className="search-quick-links">
                <span>Looking for something else?</span>
                <Link href="/track" onClick={() => setIsSearchOpen(false)}>Track an Order →</Link>
                <Link href="/shop" onClick={() => setIsSearchOpen(false)}>Browse Catalog →</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
