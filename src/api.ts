// src/api.ts
import axios from 'axios';
import { DespesaBackend, ReceitaBackend } from './interfaces/interfaces';

const api = axios.create({
  baseURL: 'https://localhost:7192',
});

// Interceptor para adicionar o token a cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface Receita {
  descricao: string;
  valor: number;
  dataLancamento: Date;
  dataRecebimento: Date;
  categoria: string;
  tipo: 'Casa' | 'Pessoal';
  recebido: 'Sim' | 'Não';
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/Auth/login', { email, password });
    const { token, userName } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);

    return { token, userName };
  } catch (error) {
    throw error;
  }
};

export const listarCategorias = async () => {
  try {
    const response = await api.get('/api/Categorias/listar-categorias');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
};

export const criarCategoria = async (descricao: string) => {
  try {
    const response = await api.post('/api/Categorias/categoria', { descricao });
    return response.data; 
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error; 
  }
};

export const deletarCategoria = async (id: number) => {
  try {
    const response = await api.delete(`/api/Categorias/${id}`);
    console.log(`Categoria com ID ${id} deletada com sucesso.`);
    return response.data; 
  } catch (error) {
    console.error(`Erro ao deletar categoria com ID ${id}:`, error);
    throw error;
  }
};

export const listarReceitas = async () => {
  try {
    const response = await api.get('/api/Receitas/listar-receitas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return [];
  }
};

export const criarReceita = async (novaReceita: ReceitaBackend) => {
  try {
    const response = await api.post('/api/Receitas/receita', novaReceita);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    throw error;
  }
};

export const listarDespesas = async () => {
  try {
    const response = await api.get('/api/Despesas/listar-despesas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return [];
  }
};

export const criarDespesa = async (novaDespesa: DespesaBackend) => {
  try {
    const response = await api.post('/api/Despesas/despesa', novaDespesa);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    throw error;
  }
};
