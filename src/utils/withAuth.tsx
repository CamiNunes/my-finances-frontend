"use client"

// src/utils/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation'

const withAuth = (WrappedComponent: any) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      if (typeof window !== 'undefined') { // Certifique-se de que está no cliente
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
        }
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return AuthComponent;
};

const getDisplayName = (WrappedComponent: any) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default withAuth;
