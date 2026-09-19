"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Clock,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  amount?: number;
  upiId?: string;
  payeeName?: string;
  qrImageSrc?: string;
  onSuccess: (orderNumber: string, paymentRef: string) => void;
  onSwitchToCod?: () => void;
}

export default function UpiPaymentModal({
  isOpen,
  onClose,
  orderNumber,
  amount = 499,
  upiId = 'rudratandon2007@oksbi',
  payeeName = 'Rudra Tandon',
  qrImageSrc = '/upi-qr.jpg',
  onSuccess,
  onSwitchToCod,
}: UpiPaymentModalProps) {
  const TOTAL_DURATION = 300; // 5 minutes (300 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_DURATION);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Play luxury sound chime via Web Audio API on success
  const playSuccessChime = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Luxury major chord arpeggio)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.85);
      });
    } catch (e) {
      // Audio playback is non-blocking
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || paymentSuccess) return;

    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, paymentSuccess]);

  // Reset timer when reopening
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(TOTAL_DURATION);
      setIsExpired(false);
      setPaymentSuccess(false);
      setErrorMessage(null);
      setCopied(false);
    }
  }, [isOpen, orderNumber]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
  const progressPercent = (timeLeft / TOTAL_DURATION) * 100;

  // Handle Retry
  const handleRetry = () => {
    setTimeLeft(TOTAL_DURATION);
    setIsExpired(false);
    setErrorMessage(null);
    setUtrNumber('');
  };

  // Copy UPI ID
  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Confirm payment
  const handleConfirmPayment = async () => {
    setIsConfirming(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/confirm-upi-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_number: orderNumber,
          utr_number: utrNumber,
          amount: amount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to confirm payment. Please check your transaction.');
      }

      // Success animation trigger
      setPaymentSuccess(true);
      playSuccessChime();

      // Redirect after animation plays
      setTimeout(() => {
        onSuccess(orderNumber, data.payment_ref || utrNumber || 'UPI-SUCCESS');
      }, 3400);
    } catch (err: unknown) {
      console.error('Confirmation error:', err);
      const errorObj = err as { message?: string };
      setErrorMessage(errorObj?.message || 'Verification failed. Please retry.');
      setIsConfirming(false);
    }
  };

  // UPI Deep Link for mobile devices
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderNumber}`)}`;

  return (
    <div className="upi-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="upi-modal-card">
        {/* SUCCESS CELEBRATION VIEW */}
        {paymentSuccess ? (
          <div className="upi-success-view animate-fade-in">
            {/* Confetti particles */}
            <div className="celebration-particles" aria-hidden="true">
              {[...Array(24)].map((_, i) => (
                <span
                  key={i}
                  className={`particle particle-${i % 6}`}
                  style={{
                    left: `${(i * 17) % 95}%`,
                    animationDelay: `${(i * 0.08).toFixed(2)}s`,
                  }}
                />
              ))}
            </div>

            {/* Glowing Golden Circle with animated checkmark */}
            <div className="success-checkmark-wrapper">
              <div className="success-pulse-ring ring-1" />
              <div className="success-pulse-ring ring-2" />
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="24" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>

            <div className="success-header">
              <span className="success-badge">
                <Sparkles size={14} /> PAYMENT RECEIVED
              </span>
              <h2 className="success-heading">Payment Successful!</h2>
              <p className="success-subheading">
                ₹{amount}.00 received via UPI. Your luxury watch combo order is officially confirmed!
              </p>
            </div>

            <div className="success-order-box">
              <div className="success-order-row">
                <span>Order Reference</span>
                <span className="gold-text font-bold">{orderNumber}</span>
              </div>
              <div className="success-order-row">
                <span>Amount Paid</span>
                <span className="font-bold">₹{amount}.00</span>
              </div>
              <div className="success-order-row">
                <span>Status</span>
                <span className="status-confirmed-pill">CONFIRMED & MANIFESTED</span>
              </div>
            </div>

            <p className="redirect-hint">
              Redirecting you to your receipt & live tracking in a moment...
            </p>
          </div>
        ) : isExpired ? (
          /* EXPIRED / RETRY VIEW */
          <div className="upi-expired-view animate-fade-in">
            <div className="expired-icon-wrapper">
              <AlertTriangle size={48} className="expired-icon" />
            </div>

            <h2 className="expired-heading">Payment Window Expired</h2>
            <p className="expired-desc">
              The 5-minute UPI payment session for order <strong>{orderNumber}</strong> has timed
              out. Don&apos;t worry, your cart and shipping details are safe!
            </p>

            <div className="expired-actions">
              <button onClick={handleRetry} className="btn-primary-gold retry-btn">
                <RotateCcw size={18} /> Retry Payment (New 5 Min Window)
              </button>

              {onSwitchToCod && (
                <button onClick={onSwitchToCod} className="btn-outline-gold cod-switch-btn">
                  Switch to Cash on Delivery (₹{amount + 50})
                </button>
              )}

              <button onClick={onClose} className="btn-text-cancel">
                Cancel & Edit Details
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE QR PAYMENT VIEW */
          <div className="upi-active-view">
            {/* Modal Header */}
            <div className="upi-modal-header">
              <div>
                <span className="brand-tag">TANDO LUXURY STORE</span>
                <h2 className="modal-title">Scan & Pay with UPI</h2>
              </div>
              <button
                onClick={onClose}
                className="close-btn"
                aria-label="Close payment modal"
                disabled={isConfirming}
              >
                ✕
              </button>
            </div>

            {/* Countdown Timer Bar */}
            <div className="upi-timer-box">
              <div className="timer-info">
                <span className="timer-label">
                  <Clock size={16} className="timer-icon" /> Payment window closes in:
                </span>
                <span className={`timer-digits ${timeLeft < 60 ? 'timer-urgent' : ''}`}>
                  {formattedTime}
                </span>
              </div>
              <div className="timer-progress-track">
                <div
                  className={`timer-progress-bar ${timeLeft < 60 ? 'bar-urgent' : ''}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* QR Code Container */}
            <div className="upi-qr-card">
              <div className="qr-image-wrapper">
                <Image
                  src={qrImageSrc}
                  alt="Scan UPI QR Code to pay ₹499"
                  width={290}
                  height={380}
                  priority
                  className="upi-qr-image"
                />
              </div>

              {/* Amount & Payee Badge */}
              <div className="upi-summary-badge">
                <span className="amount-label">Amount to Pay</span>
                <span className="amount-value">₹{amount}.00</span>
              </div>
            </div>

            {/* Mobile UPI App Direct Link */}
            <div className="mobile-upi-launch md:hidden">
              <a href={upiDeepLink} className="btn-upi-app">
                <ExternalLink size={16} /> Tap to Pay in UPI App (GPay, PhonePe, Paytm)
              </a>
            </div>

            {/* UPI ID Details with Copy Button */}
            <div className="upi-id-row">
              <div className="upi-id-info">
                <span className="upi-id-label">Payee: {payeeName}</span>
                <span className="upi-id-val">{upiId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className={`copy-btn ${copied ? 'copied' : ''}`}
              >
                {copied ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy UPI ID
                  </>
                )}
              </button>
            </div>

            {/* Optional UTR / Reference ID Field */}
            <div className="utr-input-group">
              <label htmlFor="utr-input" className="utr-label">
                UPI Reference / UTR Number (Optional)
              </label>
              <input
                id="utr-input"
                type="text"
                placeholder="12-digit UPI Ref / UTR number from your app"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="utr-input"
                maxLength={20}
              />
              <span className="utr-hint">
                💡 Check your UPI app transaction history for the 12-digit UTR number.
              </span>
            </div>

            {errorMessage && (
              <div className="upi-error-alert" role="alert">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Action Confirmation Button */}
            <div className="upi-actions">
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isConfirming}
                className="btn-primary-gold confirm-payment-btn"
              >
                {isConfirming ? (
                  <>
                    <span className="spinner-sm" /> Verifying Payment...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} /> I Have Made The Payment <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Security Guarantee */}
            <div className="upi-footer-trust">
              <span>🔒 100% Secure UPI Payment</span>
              <span>⚡ Instant Dispatch Verification</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
