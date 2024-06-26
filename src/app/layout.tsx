"use client";

import './globals.css';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const isLoginPage = pathname === '/login';

  return (
    <html lang="pt-BR">
      <head>
        <title>Finanças Pessoais</title>
        <meta name="description" content="Gerenciamento de finanças pessoais" />
      </head>
      <body className="flex h-screen">
        {!isLoginPage && <Sidebar isOpen={isSidebarOpen} />}
        <div className="flex flex-col flex-grow">
          {!isLoginPage && <Header toggleSidebar={toggleSidebar} />}
          <main className="flex-grow p-4">{children}</main>
          {!isLoginPage && <Footer />}
        </div>
      </body>
    </html>
  );
}
