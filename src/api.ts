// src/api.ts
import axios from 'axios';
import { DespesaBackend, ReceitaBackend } from './interfaces/interfaces';

const api = axios.create({
  baseURL: 'https://localhost:7192',
  //baseURL: 'http://camilanunes-001-site2.ctempurl.com/',
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

interface ListarDespesasParams {
  pageNumber: number;
  pageSize: number;
  mes?: number | null;
  status?: string | null;
  descricao?: string | null;
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

export const deletarReceita = async (id: string) => {
  try {
    const response = await api.delete(`/api/Receitas/receitas/${id}`);
    console.log(`Receita com ID ${id} deletada com sucesso.`);
    return response.data; 
  } catch (error) {
    console.error(`Erro ao deletar receita com ID ${id}:`, error);
    throw error;
  }
};

export const listarDespesas = async (
  pageNumber = 1,
  pageSize = 10,
  mes: number | null = null,
  status: string | null = null,
  descricao: string | null = null
) => {
  try {
    const params: ListarDespesasParams = {
      pageNumber,
      pageSize,
    };

    if (mes !== null) {
      params.mes = mes;
    }

    if (status !== null) {
      params.status = status;
    }

    if (descricao !== null) {
      params.descricao = descricao;
    }

    const response = await api.get('/api/Despesas/listar-despesas', { params });
    return response.data.items;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return { items: [], totalCount: 0, pageNumber, pageSize }; // Estrutura padrão de dados
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

export const deletarDespesa = async (id: string) => {
  try {
    const response = await api.delete(`/api/Despesas/despesas/${id}`);
    console.log(`Despesa com ID ${id} deletada com sucesso.`);
    return response.data; 
  } catch (error) {
    console.error(`Erro ao deletar despesa com ID ${id}:`, error);
    throw error;
  }
};

export const DespesasDoMes = async (mes: number) => {
  try {
    const response = await api.get(`/api/Dashboard/soma-despesas-mes?mes=${mes}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return 0; // Retorna 0 em caso de erro para manter a consistência do tipo
  }
};

export const DespesasEmAbertoDoMes = async (mes: number) => {
  try {
    const response = await api.get(`/api/Dashboard/soma-despesas-em-aberto-mes?mes=${mes}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return 0; // Retorna 0 em caso de erro para manter a consistência do tipo
  }
};

export const ReceitasDoMes = async (mes: number) => {
  try {
    const response = await api.get(`/api/Dashboard/soma-receitas-mes?mes=${mes}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return 0; // Retorna 0 em caso de erro para manter a consistência do tipo
  }
};

export const DespesasAVencerNoMes = async (mes: number) => {
  try {
    const response = await api.get(`/api/Dashboard/despesas-a-vencer-mes?mes=${mes}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return 0; // Retorna 0 em caso de erro para manter a consistência do tipo
  }
};

export const SaldoDoMes = async (mes: number) => {
  try {
    const response = await api.get(`/api/Dashboard/saldo-mes?mes=${mes}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return 0; // Retorna 0 em caso de erro para manter a consistência do tipo
  }
};

export const ListarDespesasAbertasDoMes = async (mes: number) => {
  try {
    const response = await api.get(`/api/Dashboard/listar-despesas-abertas-mes?mes=${mes}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return 0; // Retorna 0 em caso de erro para manter a consistência do tipo
  }
};