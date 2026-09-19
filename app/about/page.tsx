import React from 'react';

export default function AboutPage() {
  return (
    <div className="section static-page animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title text-center">STYLE. CONFIDENCE. TANDO.</h1>
        
        <div className="content-prose">
          <p className="lead" style={{ fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--color-grey)' }}>
            TANDO is a modern men&apos;s fashion accessories brand focused on bringing stylish, affordable and easy-to-wear accessories to the modern Indian customer.
          </p>

          <p>
            We believe that great style doesn&apos;t have to be complicated or extremely expensive. Our mission is to provide men with carefully curated, premium-inspired accessory combos that instantly elevate any outfit.
          </p>
          
          <p>
            Whether you&apos;re dressing up for a festive celebration, attending a party, or simply looking to add a touch of sophistication to your daily wear, our signature Watch + Chain + Ring combos are designed to give you a complete, coordinated look with zero effort.
          </p>

          <h3 style={{ marginTop: '2rem' }}>Our Promise</h3>
          <ul className="bullet-list" style={{ marginTop: '1rem' }}>
            <li><strong>Style:</strong> Modern, versatile designs that stand out.</li>
            <li><strong>Value:</strong> Complete 3-piece combos at an accessible price point.</li>
            <li><strong>Convenience:</strong> Easy ordering, secure payments, and Cash on Delivery across eligible locations.</li>
          </ul>

          <p style={{ marginTop: '2rem' }}>
            From everyday looks to special occasions, TANDO helps you complete your style with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
