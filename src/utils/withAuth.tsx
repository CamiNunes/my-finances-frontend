// src/utils/withAuth.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Função para validar o token
const validateToken = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 > Date.now(); // Verifica se o token não está expirado
  } catch (error) {
    return false;
  }
};

// Higher-Order Component para autenticação
const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token || !validateToken(token)) {
        router.push("/login"); // Redireciona para a página de login
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return AuthComponent;
};

// Helper para pegar o nome do componente
const getDisplayName = (WrappedComponent: any) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export default withAuth;