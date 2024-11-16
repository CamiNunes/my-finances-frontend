"use client";

import "./globals.css";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Dashboard from "@/components/Dashboard";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const validateToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 > Date.now(); // Verifica se não expirou
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !validateToken(token)) {
      if (pathname !== "/login") {
        router.push("/login"); // Redireciona para login
      }
    }
  }, [pathname, router]);

  const isLoginPage = pathname === "/login";

  return (
    <html lang="pt-BR">
      <head>
        <title>Finanças Pessoais</title>
        <meta name="description" content="Gerenciamento de finanças pessoais" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {isLoginPage ? (
          <main className="h-screen">{children}</main>
        ) : (
          <Dashboard>{children}</Dashboard>
        )}
      </body>
    </html>
  );
}
