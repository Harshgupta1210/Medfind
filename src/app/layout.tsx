import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter instead of Geist for better compatibility potentially
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MediFind - Find Your Doctor',
  description: 'Search and filter doctors based on specialization, location, and availability. Clone created for demo purposes.',
  keywords: ['doctor', 'find doctor', 'specialist', 'physician', 'internal medicine', 'healthcare'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
