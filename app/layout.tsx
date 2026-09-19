import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { CartProvider } from '@/lib/CartContext';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'TANDO — Men\'s Watches & Fashion Accessories',
  description: 'Shop stylish men\'s watch, chain and ring combos from TANDO. Discover modern fashion accessories with COD and secure online payment options.',
  keywords: ['men\'s watch combo', 'watch chain ring combo', 'men\'s fashion accessories', 'men\'s jewellery combo', 'stylish men\'s watch', 'men\'s gift set', 'watch and ring combo']
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main style={{ minHeight: '80vh' }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
