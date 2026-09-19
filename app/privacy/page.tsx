import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="section static-page animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">Privacy Policy</h1>
        
        <div className="content-prose">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>At TANDO, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website.</p>

          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as your name, email address, shipping address, phone number, and payment information when you make a purchase.</p>

          <h3>2. How We Use Your Information</h3>
          <p>We use your information to process orders, communicate with you about your order, provide customer support, and improve our website and services.</p>

          <h3>3. Information Sharing</h3>
          <p>We do not sell your personal information. We may share your information with trusted third-party service providers (like shipping partners and payment gateways) strictly for the purpose of fulfilling your order.</p>

          <h3>4. Security</h3>
          <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

          <h3>5. Cookies</h3>
          <p>We use cookies to enhance your browsing experience, analyze site traffic, and understand where our audience comes from.</p>

          <h3>6. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at support@tando.in.</p>
        </div>
      </div>
    </div>
  );
}
