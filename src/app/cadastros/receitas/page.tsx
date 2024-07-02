// src/app/receitas/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { listarCategorias, listarReceitas, criarReceita, deletarReceita } from '@/api';
import Swal from 'sweetalert2';
import { ReceitaBackend } from '@/interfaces/interfaces';
import withAuth from '@/utils/withAuth';
import { FaEdit } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { HiSave } from "react-icons/hi";
import { TiCancel } from "react-icons/ti";

interface Categoria {
  descricao: string;
}
interface Receita {
  id: string;
  descricao: string;
  valor: number;
  dataLancamento: Date;
  dataRecebimento: Date;
  categoria: string;
  statusReceita: string;
  tipoReceita: 'Casa' | 'Pessoal';
  recebido: boolean;
}

const Receitas = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [receita, setReceita] = useState<Receita>({
    id: '',
    descricao: '',
    valor: 0,
    dataLancamento: new Date(),
    dataRecebimento: new Date(),
    categoria: '',
    statusReceita: '',
    tipoReceita: 'Casa',
    recebido: true
  });
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [filteredReceitas, setFilteredReceitas] = useState<Receita[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mesFiltro, setMesFiltro] = useState<number | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<string>('');
  const [descricaoFiltro, setDescricaoFiltro] = useState<string>('');

  useEffect(() => {
    fetchCategorias();
    fetchReceitas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [receitas, mesFiltro, statusFiltro, descricaoFiltro]);

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

  const applyFilters = () => {
    let filtered = receitas;

    if (mesFiltro !== null) {
      filtered = filtered.filter(receita => new Date(receita.dataLancamento).getMonth() === mesFiltro);
    }

    if (statusFiltro) {
      filtered = filtered.filter(receita => receita.statusReceita.toLowerCase().includes(statusFiltro.toLowerCase()));
    }

    if (descricaoFiltro) {
      filtered = filtered.filter(receita => receita.descricao.toLowerCase().includes(descricaoFiltro.toLowerCase()));
    }

    setFilteredReceitas(filtered);
  };

  const mapReceitaToBackend = (receita: Receita): ReceitaBackend => {
    return {
      id: receita.id,
      valor: receita.valor,
      dataLancamento: receita.dataLancamento.toISOString(),
      descricao: receita.descricao,
      categoria: receita.categoria,
      statusReceita: receita.statusReceita,
      recebido: receita.recebido,
      dataRecebimento: receita.dataRecebimento.toISOString(),
      tipoReceita: receita.tipoReceita === 'Casa' ? 1 : 2
    };
  };

  const handleDeletarReceita = async (id: string) => {
    try {
      await deletarReceita(id);

      // Atualize o estado local removendo a despesa deletada
      setReceitas((prevReceitas) => prevReceitas.filter((receita) => receita.id !== id));

      // Exiba uma mensagem de sucesso
      Swal.fire({
        position: "top-end",
        icon: 'success',
        title: 'Receita deletada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao deletar Receita:', error);

      // Exiba uma mensagem de erro
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'Erro ao deletar receita',
        text: 'Ocorreu um erro ao deletar a receita. Por favor, tente novamente mais tarde.',
        confirmButtonText: 'Ok'
      });
    }
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
        id: '',
        descricao: '',
        valor: 0,
        dataLancamento: new Date(),
        dataRecebimento: new Date(),
        categoria: '',
        statusReceita: '',
        tipoReceita: 'Casa',
        recebido: true
      });
      setIsModalOpen(false);

      // Exiba uma mensagem de sucesso
      Swal.fire({
        position: "center",
        icon: 'success',
        iconColor: '#0e6716',
        title: 'Receita criada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao criar receita:', error);

      // Exiba uma mensagem de erro
      Swal.fire({
        position: "center",
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
      <button onClick={() => setIsModalOpen(true)} className="bg-green-800 text-white px-4 py-2 mt-4 rounded-md w-full">Adicionar Receita</button>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-zinc-800 p-4 rounded-lg w-full max-w-lg">
            <form onSubmit={handleSaveReceita} className="w-full">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-100">Descrição</label>
              <input type="text" id="descricao" value={receita.descricao} onChange={(e) => setReceita({ ...receita, descricao: e.target.value })} className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" />
              
              <label htmlFor="valor" className="block text-sm font-medium text-gray-100">Valor</label>
              <input type="number" id="valor" value={receita.valor} onChange={(e) => setReceita({ ...receita, valor: parseFloat(e.target.value) })} className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" />
              
              <label htmlFor="dataLancamento" className="block text-sm font-medium text-gray-100">Data de Lançamento</label>
              <input type="date" id="dataLancamento" value={receita.dataLancamento.toISOString().substr(0, 10)} onChange={(e) => setReceita({ ...receita, dataLancamento: new Date(e.target.value) })} className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" />
              
              <label htmlFor="dataRecebimento" className="block text-sm font-medium text-gray-100">Data de Recebimento</label>
              <input type="date" id="dataRecebimento" value={receita.dataRecebimento.toISOString().substr(0, 10)} onChange={(e) => setReceita({ ...receita, dataRecebimento: new Date(e.target.value) })} className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" />
              
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-100">Categoria</label>
              <select 
                id="categoria" 
                value={receita.categoria} 
                onChange={(e) => setReceita({ ...receita, categoria: e.target.value })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100">
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria.descricao}>{categoria.descricao}</option>
                ))}
              </select>
              
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-100">Tipo</label>
              <select 
                id="tipo" 
                value={receita.tipoReceita} 
                onChange={(e) => setReceita({ ...receita, tipoReceita: e.target.value as 'Casa' | 'Pessoal' })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100">
                <option value="Casa">Casa</option>
                <option value="Pessoal">Pessoal</option>
              </select>
              
              <label htmlFor="recebido" className="block text-sm font-medium text-gray-100">Recebido</label>
              <select 
                id="recebido" 
                value={receita.recebido ? 'Sim' : 'Não'} 
                onChange={(e) => setReceita({ ...receita, recebido: e.target.value === 'Sim' })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100">
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              
              <div className="flex justify-end mt-4">
                <button type="button" onClick={handleCancel} className="flex gap-2 bg-gray-700 text-white px-4 py-2 mr-2 rounded-md"><TiCancel size={24}/> Cancelar</button>
                <button type="submit" className="flex gap-2 bg-green-800 text-white px-4 py-2 rounded-md"><HiSave size={24}/> Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex gap-4 mt-4">
        <div>
          <label htmlFor="mesFiltro" className="block text-sm font-medium text-gray-100">Filtrar por Mês</label>
          <select 
            id="mesFiltro" 
            value={mesFiltro !== null ? mesFiltro : ''} 
            onChange={(e) => setMesFiltro(e.target.value ? parseInt(e.target.value) : null)} 
            className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100">
            <option value="">Todos</option>
            {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map((mes, index) => (
              <option key={index} value={index}>{mes}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="statusFiltro" className="block text-sm font-medium text-gray-100">Filtrar por Status</label>
          <select 
            id="statusFiltro" 
            value={statusFiltro} 
            onChange={(e) => setStatusFiltro(e.target.value)} 
            className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100">
            <option value="">Todos</option>
            <option value="Aberto">Aberto</option>
            <option value="Recebido">Recebido</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>
        <div>
          <label htmlFor="descricaoFiltro" className="block text-sm font-medium text-gray-100">Filtrar por Descrição</label>
          <input 
            type="text" 
            id="descricaoFiltro" 
            value={descricaoFiltro} 
            onChange={(e) => setDescricaoFiltro(e.target.value)} 
            className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" />
        </div>
      </div>
      <div className="overflow-x-auto w-full mt-4">
        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="bg-zinc-900">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Data de Lançamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Data de Recebimento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredReceitas.map((receita, index) => (
              <tr key={index} className='bg-zinc-800'>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase">{receita.descricao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receita.valor)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white">{receita.dataLancamento ? new Date(receita.dataLancamento).toLocaleDateString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white">{receita.dataRecebimento ? new Date(receita.dataRecebimento).toLocaleDateString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase">{receita.categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase">{receita.tipoReceita ? 'Casa' : 'Pessoal'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase">{receita.statusReceita}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">{receita.recebido ? 'Sim' : 'Não'}</td> */}
                <td>
                  <button className="px-4 py-2 mr-2 whitespace-nowrap text-xs font-medium text-white bg-slate-700 rounded-md hover:bg-slate-500"><FaEdit size={16}/></button>
                  <button 
                    onClick={() => handleDeletarReceita(receita.id!)} 
                    className="px-4 py-2 whitespace-nowrap text-xs font-medium text-white bg-red-800 rounded-md hover:bg-red-600">
                    <IoTrashBin size={16}/>
                  </button>
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
