"use client"

import React, { useState, useEffect } from 'react';
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";
import { TbCalendarDown } from "react-icons/tb";
import { GiWallet } from "react-icons/gi";
import { DespesasAVencerNoMes, DespesasEmAbertoDoMes, DespesasDoMes, ReceitasDoMes, SaldoDoMes } from '@/api';
import withAuth from '@/utils/withAuth';

const Home = () => {
  const [mesFiltro, setMesFiltro] = useState<number | null>(null);
  const [despesasMes, setDespesasMes] = useState<number>(0);
  const [despesasEmAbertoMes, setDespesasEmAbertoMes] = useState<number>(0);
  const [receitasMes, setReceitasMes] = useState<number>(0);
  const [diferenca, setDiferenca] = useState<number>(0);
  const [despesasProximasVencimento, setDespesasProximasVencimento] = useState<number>(0);
  const emailUsuario = "cvn.camila@gmail.com"; // Substitua pelo email do usuário autenticado

  // Função para lidar com a mudança no filtro de mês
  const handleChangeMesFiltro = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value !== '' ? parseInt(event.target.value) : null;
    setMesFiltro(selectedMonth);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (mesFiltro !== null) {
        const despesas = await DespesasDoMes(mesFiltro);
        const receitas = await ReceitasDoMes(mesFiltro);
        const diferenca = await SaldoDoMes(mesFiltro);
        const proximasDespesas = await DespesasAVencerNoMes(mesFiltro);
        const despesasEmAberto = await DespesasEmAbertoDoMes(mesFiltro);
        
        setDespesasMes(despesas);
        setReceitasMes(receitas);
        setDiferenca(diferenca);
        setDespesasProximasVencimento(proximasDespesas);
        setDespesasEmAbertoMes(despesasEmAberto);
      }
    };

    fetchData();
  }, [mesFiltro, emailUsuario]);

  return (
    <div className="p-4">
      {/* Filtro por mês */}
      <div className="mb-4">
        <label htmlFor="mesFiltro" className="text-white block mb-2">Filtrar por mês:</label>
        <select 
          id="mesFiltro" 
          value={mesFiltro !== null ? mesFiltro : ''} 
          onChange={handleChangeMesFiltro} 
          className="p-2 border border-gray-500 rounded-md text-gray-100 bg-zinc-800">
          <option value="">Todos os meses</option>
          {Array.from(Array(12), (_, month) => (
            <option key={month} value={month + 1}>{new Date(0, month).toLocaleString('pt-BR', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      {/* Quadros de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Quadro de Despesas do Mês */}
        <div className="bg-gray-200 py-10 px-6 rounded-lg">
          <h2 className="flex gap-4 text-lg font-bold text-slate-950 mb-2"><FaRegArrowAltCircleDown size={30}/>Despesas Pagas do Mês</h2>
          <p className="text-slate-950">Valor Total: R$ {despesasMes.toFixed(2)}</p>
        </div>
        
        {/* Quadro de Despesas do Mês */}
        <div className="bg-gray-200 py-10 px-6 rounded-lg">
          <h2 className="flex gap-4 text-lg font-bold text-slate-950 mb-2"><FaRegArrowAltCircleDown size={30}/>Despesas Em Aberto do Mês</h2>
          <p className="text-slate-950">Valor Total: R$ {despesasEmAbertoMes.toFixed(2)}</p>
        </div>
          

        {/* Quadro de Despesas Próximas a Vencer */}
        <div className="bg-gray-200 py-10 px-6 rounded-lg">
          <h2 className="flex gap-4 text-lg font-bold text-slate-950 mb-2"><TbCalendarDown size={30}/>Despesas Próximas a Vencer</h2>
          <p className="text-slate-950">Quantidade: {despesasProximasVencimento} despesas</p>
        </div>

        {/* Quadro de Receitas do Mês */}
        <div className="bg-gray-200 py-10 px-6 rounded-lg">
          <h2 className="flex gap-4 text-lg font-bold text-slate-950 mb-2"><FaRegArrowAltCircleUp size={30}/>Receitas do Mês</h2>
          <p className="text-slate-950">Valor Total: R$ {receitasMes.toFixed(2)}</p>
        </div>

        {/* Quadro de Diferença entre Receitas e Despesas */}
        <div className="bg-gray-200 py-10 px-6 rounded-lg">
          <h2 className="flex gap-4 text-lg font-bold text-slate-950 mb-2"><GiWallet  size={30}/>Saldo</h2>
          <p className="text-slate-950">Diferença: R$ {diferenca.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Home);
