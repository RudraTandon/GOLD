import React from 'react';

export default function FAQPage() {
  return (
    <div className="section static-page animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">Frequently Asked Questions</h1>
        
        <div className="faq-list">
          
          <div className="faq-item" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-light-grey)', paddingBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Do you offer Cash on Delivery?</h3>
            <p style={{ color: 'var(--color-grey)' }}>Yes, Cash on Delivery is available for eligible locations across India.</p>
          </div>

          <div className="faq-item" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-light-grey)', paddingBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Can I pay online?</h3>
            <p style={{ color: 'var(--color-grey)' }}>Yes, secure online payment options are available, including UPI, Cards, NetBanking, and Wallets.</p>
          </div>

          <div className="faq-item" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-light-grey)', paddingBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>What does the combo include?</h3>
            <p style={{ color: 'var(--color-grey)' }}>The combo includes a fashion watch, a men&apos;s fashion chain, and a fashion ring.</p>
          </div>

          <div className="faq-item" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-light-grey)', paddingBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Is the ring real gold?</h3>
            <p style={{ color: 'var(--color-grey)' }}>No. It is a gold-tone fashion accessory with a bronze base metal. It is not made of real gold and is not gold-plated.</p>
          </div>

          <div className="faq-item" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-light-grey)', paddingBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>What ring size is available?</h3>
            <p style={{ color: 'var(--color-grey)' }}>The rings in our combos are generally size 18 and feature a non-adjustable design.</p>
          </div>

          <div className="faq-item" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-light-grey)', paddingBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>How can I track my order?</h3>
            <p style={{ color: 'var(--color-grey)' }}>Use the <a href="/track" style={{ color: 'var(--color-black)', textDecoration: 'underline' }}>Track Order</a> page and enter your Order ID to see the current status of your shipment.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
