import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        <div className="footer-brand">
          <h2 className="footer-logo">TANDO</h2>
          <p className="footer-tagline">&quot;Define Your Style.&quot;</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/track">Track Order</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Customer Support</h3>
            <ul>
              <li><Link href="/shipping">Shipping Policy</Link></li>
              <li><Link href="/refund">Return & Refund Policy</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Payment</h3>
            <ul>
              <li>COD (Cash on Delivery)</li>
              <li>Secure Online Payment</li>
            </ul>
            
            <h3 className="social-heading">Social</h3>
            <ul className="social-links">
              <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 TANDO. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
