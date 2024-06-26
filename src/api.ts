// src/api.ts
import axios from 'axios';
import { ReceitaBackend } from './interfaces/interfaces';

const api = axios.create({
  baseURL: 'https://localhost:7192',
});
interface Receita {
  descricao: string;
  valor: number;
  dataLancamento: Date;
  dataRecebimento: Date;
  categoria: string;
  tipo: 'Casa' | 'Pessoal';
  recebido: 'Sim' | 'Não';
}

// export const login = async (email: string, password: string) => {
//   try {
//     const response = await api.post('/api/Auth/login', { email, password });
//     return response.data; // Assume que a resposta contém o token
//   } catch (error) {
//     console.error('Erro ao fazer login:', error);
//     throw error;
//   }
// };

// No arquivo api.ts
export const login = async (email: string, password: string) => {
  try {
    // Chame a API de login e obtenha o token e outras informações, como o nome do usuário
    const response = await api.post('/api/Auth/login', { email, password });
    const { token, userName } = response.data;
    
    // Armazene o token no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);

    // Retorne o token e o nome do usuário
    return { token, userName: userName };
  } catch (error) {
    throw error;
  }
};

export const listarCategorias = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Adicione o token ao cabeçalho da requisição
    const response = await api.get('/api/Categorias/listar-categorias', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
};


// export const listarCategorias = async () => {
//   try {
//     const response = await api.get('/api/Categorias/listar-categorias');
//     return response.data;
//   } catch (error) {
//     console.error('Erro ao buscar categorias:', error);
//     return [];
//   }
// };

export const criarCategoria = async (descricao: string) => {
  try {
    const response = await api.post('/api/Categorias/categoria', { descricao });
    return response.data; // Retorna a nova categoria criada
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error; // Lança o erro novamente para que possa ser tratado pelo componente que está chamando a função
  }
};

export const deletarCategoria = async (id: number) => {
  try {
    const response = await api.delete(`/api/Categorias/${id}`);
    console.log(`Categoria com ID ${id} deletada com sucesso.`);
    return response.data; // Pode retornar algo útil, se necessário
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
    return response.data; // Retorna a nova receita criada
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    throw error; // Lança o erro novamente para que possa ser tratado pelo componente que está chamando a função
  }
};