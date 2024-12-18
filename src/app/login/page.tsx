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
      const response = await login(email, password);
  
      // Supondo que a função login retorna { token, userName }
      const { token, userName } = response;
  
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
  
        // Redireciona para a página principal
        router.push('/'); // Alterar para a rota desejada
      } else {
        // Token não recebido, exiba mensagem de erro
        setError('Erro inesperado. Tente novamente.');
      }
    } catch (error) {
      // Se a API retornar um erro, exiba a mensagem apropriada
      setError('Usuário ou senha inválidos.');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-black">Bem-vindo de volta!</h2>
        <p className="mb-6 text-center text-gray-600">Faça login para acessar sua conta.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-2">
            <label className="block mb-2 text-sm font-bold text-black">Email</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring focus:border-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-black">Senha</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring focus:border-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
