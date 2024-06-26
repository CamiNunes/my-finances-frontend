// src/app/receitas/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { listarCategorias, listarReceitas, criarReceita } from '@/api';
import Swal from 'sweetalert2';
import { ReceitaBackend } from '@/interfaces/interfaces';
import withAuth from '@/utils/withAuth';

interface Categoria {
  descricao: string;
}

interface Receita {
  descricao: string;
  valor: number;
  dataLancamento: Date;
  dataRecebimento: Date;
  categoria: string;
  tipoReceita: 'Casa' | 'Pessoal';
  recebido: boolean;
}

const Receitas = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [receita, setReceita] = useState<Receita>({
    descricao: '',
    valor: 0,
    dataLancamento: new Date(),
    dataRecebimento: new Date(),
    categoria: '',
    tipoReceita: 'Casa',
    recebido: true
  });
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategorias();
    fetchReceitas();
  }, []);

  const fetchCategorias = async () => {
    const categoriasData = await listarCategorias();
    setCategorias(categoriasData);
    console.log(categoriasData);
  };

  const fetchReceitas = async () => {
    const receitasData = await listarReceitas();
    setReceitas(receitasData);
    console.log(receitasData);
  };

  const mapReceitaToBackend = (receita: Receita): ReceitaBackend => {
    return {
      valor: receita.valor,
      dataLancamento: receita.dataLancamento.toISOString(),
      descricao: receita.descricao,
      categoria: receita.categoria,
      recebido: receita.recebido,
      dataRecebimento: receita.dataRecebimento.toISOString(),
      tipoReceita: receita.tipoReceita === 'Casa' ? 1 : 2
    };
  };

  const handleSaveReceita = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário
    try {
      const receitaBackend = mapReceitaToBackend(receita);

      // Chame a função apropriada para criar a receita na API
      const novaReceita = await criarReceita(receitaBackend);

      // Atualize o estado local com a nova receita
      setReceitas((prevReceitas) => [...prevReceitas, novaReceita]);

      // Limpe os campos do formulário e feche o modal
      setReceita({
        descricao: '',
        valor: 0,
        dataLancamento: new Date(),
        dataRecebimento: new Date(),
        categoria: '',
        tipoReceita: 'Casa',
        recebido: true
      });
      setIsModalOpen(false);

      // Exiba uma mensagem de sucesso
      Swal.fire({
        position: "top-end",
        icon: 'success',
        title: 'Receita criada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao criar receita:', error);

      // Exiba uma mensagem de erro
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'Erro ao criar receita',
        text: 'Ocorreu um erro ao criar a receita. Por favor, tente novamente mais tarde.',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md w-full">Adicionar Receita</button>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg">
            <form onSubmit={handleSaveReceita} className="w-full">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <input type="text" id="descricao" value={receita.descricao} onChange={(e) => setReceita({ ...receita, descricao: e.target.value })} className="p-2 border border-gray-300 rounded-md w-full text-gray-900" />
              
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700">Valor</label>
              <input type="number" id="valor" value={receita.valor} onChange={(e) => setReceita({ ...receita, valor: parseFloat(e.target.value) })} className="p-2 border border-gray-300 rounded-md w-full text-gray-900" />
              
              <label htmlFor="dataLancamento" className="block text-sm font-medium text-gray-700">Data de Lançamento</label>
              <input type="date" id="dataLancamento" value={receita.dataLancamento.toISOString().substr(0, 10)} onChange={(e) => setReceita({ ...receita, dataLancamento: new Date(e.target.value) })} className="p-2 border border-gray-300 rounded-md w-full text-gray-900" />
              
              <label htmlFor="dataRecebimento" className="block text-sm font-medium text-gray-700">Data de Recebimento</label>
              <input type="date" id="dataRecebimento" value={receita.dataRecebimento.toISOString().substr(0, 10)} onChange={(e) => setReceita({ ...receita, dataRecebimento: new Date(e.target.value) })} className="p-2 border border-gray-300 rounded-md w-full text-gray-900" />
              
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoria</label>
              <select 
                id="categoria" 
                value={receita.categoria} 
                onChange={(e) => setReceita({ ...receita, categoria: e.target.value })} 
                className="p-2 border border-gray-300 rounded-md w-full text-gray-900">
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria.descricao}>{categoria.descricao}</option>
                ))}
              </select>
              
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
              <select 
                id="tipo" 
                value={receita.tipoReceita} 
                onChange={(e) => setReceita({ ...receita, tipoReceita: e.target.value as 'Casa' | 'Pessoal' })} 
                className="p-2 border border-gray-300 rounded-md w-full text-gray-900">
                <option value="Casa">Casa</option>
                <option value="Pessoal">Pessoal</option>
              </select>
              
              <label htmlFor="recebido" className="block text-sm font-medium text-gray-700">Recebido</label>
              <select 
                id="recebido" 
                value={receita.recebido ? 'Sim' : 'Não'} 
                onChange={(e) => setReceita({ ...receita, recebido: e.target.value === 'Sim' })} 
                className="p-2 border border-gray-300 rounded-md w-full text-gray-900">
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              
              <div className="flex justify-end mt-4">
                <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 mr-2 rounded-md">Cancelar</button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="overflow-x-auto w-full mt-4">
        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Data de Lançamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Data de Recebimento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Recebido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {receitas.map((receita, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-black">{receita.descricao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-black">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receita.valor)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-black">{receita.dataLancamento ? new Date(receita.dataLancamento).toLocaleDateString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-black">{receita.dataRecebimento ? new Date(receita.dataRecebimento).toLocaleDateString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-black">{receita.categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-black">{receita.tipoReceita ? 'Casa' : 'Pessoal'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-black">{receita.recebido ? 'Sim' : 'Não'}</td>
                <td>
                  <button className="px-6 py-2 mr-2 whitespace-nowrap text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">Editar</button>
                  <button className="px-6 py-2 whitespace-nowrap text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(Receitas);
