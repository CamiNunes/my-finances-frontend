"use client";

import './globals.css';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { jwtDecode } from 'jwt-decode';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const validateToken = (token: string) => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return !isExpired;
    } catch (error) {
      return false;
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token || !validateToken(token)) {
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [pathname, router]);

  const isLoginPage = pathname === '/login';

  return (
    <html lang="pt-BR">
      <head>
        <title>Finanças Pessoais</title>
        <meta name="description" content="Gerenciamento de finanças pessoais" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex h-screen text-foreground bg-background">
        {!isLoginPage && <Sidebar isOpen={isSidebarOpen} />}
        <div className="flex flex-col flex-grow">
          {!isLoginPage && <Header toggleSidebar={toggleSidebar} />}
          <main className="flex-grow">{children}</main>
          {!isLoginPage && <Footer />}
        </div>
      </body>
    </html>
  );
}
