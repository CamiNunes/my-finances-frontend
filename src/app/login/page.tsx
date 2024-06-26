// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/api';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { token, userName } = await login(email, password);

      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);

      router.push('/');
    } catch (error) {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-3xl font-bold text-center text-black">Bem-vindo de volta!</h2>
        <p className="mb-8 text-center text-gray-600">Faça login para acessar sua conta.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-black">Email</label>
            <input type="text" className="w-full px-3 py-2 border rounded text-black" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-black">Senha</label>
            <input type="password" className="w-full px-3 py-2 border rounded text-black" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
