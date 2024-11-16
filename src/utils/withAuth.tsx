import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

function withAuth<T extends object>(WrappedComponent: ComponentType<T>) {
  const AuthComponent = (props: T) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Estado de autenticação
    const router = useRouter();

    const validateToken = (token: string): boolean => {
      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        return decoded.exp * 1000 > Date.now(); // Verifica se o token expirou
      } catch {
        return false;
      }
    };

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (token && validateToken(token)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/login");
      }
    }, [router]);

    // Enquanto a autenticação está sendo verificada
    if (isAuthenticated === null) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="mt-4 text-lg text-gray-600">Carregando...</p>
          </div>
        </div>
      );
    }

    // Se não está autenticado, evita renderizar o componente
    if (!isAuthenticated) {
      return null;
    }

    // Renderiza o componente encapsulado se autenticado
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthComponent;
}

export default withAuth;
