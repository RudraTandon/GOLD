"use client";

import React, { useState } from 'react';
import Button from '@/app/components/ui/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit your message. Please try again.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', orderId: '', message: '' });
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMessage(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section static-page animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title text-center">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-xl" style={{ marginTop: '3rem' }}>
          <div className="contact-info">
            <h3 style={{ marginBottom: '1rem' }}>Get in Touch</h3>
            <p style={{ color: 'var(--color-grey)', marginBottom: '2rem' }}>
              Have a question about our combos, your order, or just want to say hi? We&apos;re here to help.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Email:</strong>
              <p style={{ color: 'var(--color-grey)' }}>support@tando.in</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Phone:</strong>
              <p style={{ color: 'var(--color-grey)' }}>+91 98765 43210</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                (Mon-Sat, 10 AM to 6 PM)
              </p>
            </div>

            <div>
              <strong>Address:</strong>
              <p style={{ color: 'var(--color-grey)' }}>
                TANDO Fashion
                <br />
                123 Style Avenue, Phase 1
                <br />
                New Delhi, 110001
              </p>
            </div>
          </div>

          <div className="contact-form">
            <h3 style={{ marginBottom: '1rem' }}>Send a Message</h3>

            {submitted ? (
              <div
                style={{
                  backgroundColor: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={36} color="#52c41a" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#135200' }}>Message Sent!</h4>
                <p style={{ fontSize: '0.9rem', color: '#389e0d', margin: 0 }}>
                  Thank you for reaching out. We have logged your request in our support system and will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-gold)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {errorMessage && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#fff1f0',
                      border: '1px solid #ffa39e',
                      color: '#cf1322',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm, 6px)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <AlertCircle size={18} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <input
                    type="text"
                    placeholder="Order ID (Optional, e.g. TND-849102)"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <textarea
                    placeholder="Your Message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                <Button type="submit" variant="primary" isFullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
