"use client"

import './globals.css';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="pt-BR">
      <head>
        <title>Finanças Pessoais</title>
        <meta name="description" content="Gerenciamento de finanças pessoais" />
      </head>
      <body className="flex h-screen">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-grow">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-grow p-4">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
