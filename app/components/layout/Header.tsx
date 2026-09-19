"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-container">
        
        {/* Mobile Hamburger */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>

        {/* Icons */}
        <div className="header-icons">
          <button className="icon-btn" aria-label="Search">
            <Search size={22} />
          </button>
          <Link href="/about" className="icon-btn desktop-only" aria-label="Account">
            <User size={22} />
          </Link>
          <Link href="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingBag size={22} />
            <span className="cart-count">2</span>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="mobile-nav-drawer">
          <ul className="mobile-nav-links">
            <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
            <li><Link href="/shop" onClick={() => setIsMenuOpen(false)}>Collections</Link></li>
            <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
