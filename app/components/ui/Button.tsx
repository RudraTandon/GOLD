import React, { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline';
  isFullWidth?: boolean;
  href?: string;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  isFullWidth = false, 
  href,
  children,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = `btn btn-${variant} ${isFullWidth ? 'btn-block' : ''} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
}
