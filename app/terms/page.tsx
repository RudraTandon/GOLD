import React from 'react';

export default function TermsPage() {
  return (
    <div className="section static-page animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">Terms & Conditions</h1>
        
        <div className="content-prose">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h3>1. Introduction</h3>
          <p>Welcome to TANDO. By accessing our website and purchasing our products, you agree to be bound by these Terms and Conditions.</p>

          <h3>2. Product Information & Disclaimers</h3>
          <p>TANDO sells fashion accessories. Please note the following regarding our products:</p>
          <ul>
            <li>Our rings and chains are fashion jewellery. They are NOT made of real gold, silver, or precious metals unless explicitly stated.</li>
            <li>The &quot;gold&quot; colour refers only to the visual tone of the item. Our standard rings are made from a bronze base metal.</li>
            <li>Ring sizes are generally fixed (e.g., Size 18) and are non-adjustable.</li>
            <li>The watches are fashion watches intended for everyday style.</li>
          </ul>

          <h3>3. Pricing & Payments</h3>
          <p>All prices are in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to change prices at any time. We offer Cash on Delivery (COD) and secure online payment options.</p>

          <h3>4. Order Cancellation</h3>
          <p>We reserve the right to refuse or cancel any order for any reason, including but not limited to product unavailability, errors in product or pricing information, or suspected fraud.</p>

          <h3>5. Intellectual Property</h3>
          <p>All content on this website, including images, text, logos, and designs, is the property of TANDO and protected by copyright laws.</p>
        </div>
      </div>
    </div>
  );
}
