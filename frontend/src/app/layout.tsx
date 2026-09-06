import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WebBricks-task | Collaborative Kanban Board',
  description: 'Production-grade collaborative Kanban board with drag-and-drop workflow management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" theme="dark" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
