"use client"

import React, { useState } from 'react';
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";
import { TbCalendarDown } from "react-icons/tb";
import { GiWallet } from "react-icons/gi";

const Home = () => {
  const [mesFiltro, setMesFiltro] = useState<number | null>(null);

  // Função para lidar com a mudança no filtro de mês
  const handleChangeMesFiltro = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value !== '' ? parseInt(event.target.value) : null;
    setMesFiltro(selectedMonth);
  };

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
            <option key={month} value={month}>{new Date(0, month).toLocaleString('pt-BR', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      {/* Quadros de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quadro de Despesas do Mês */}
        <div className="bg-gray-200 py-10 px-6 rounded-lg">
          <h2 className="flex gap-4 text-lg font-bold text-slate-950 mb-2"><FaRegArrowAltCircleDown size={30}/>Despesas do Mês</h2>
          {/* Lógica para calcular e exibir o valor total das despesas do mês selecionado */}
          {/* Substitua com a lógica apropriada baseada nos seus dados */}
          <p className="text-slate-950">Valor Total: R$ 1.200,00</p>
        </div>

        {/* Quadro de Despesas Próximas a Vencer */}
        <div className="bg-gray-200 py-10 px-6 rounded-lg">
          <h2 className="flex gap-4 text-lg font-bold text-slate-950 mb-2"><TbCalendarDown size={30}/>Despesas Próximas a Vencer</h2>
          {/* Lógica para calcular e exibir a quantidade de despesas próximas a vencer */}
          {/* Substitua com a lógica apropriada baseada nos seus dados */}
          <p className="text-slate-950">Quantidade: 5 despesas</p>
        </div>

        {/* Quadro de Receitas do Mês */}
        <div className="bg-gray-200 py-10 px-6 rounded-lg">
          <h2 className="flex gap-4 text-lg font-bold text-slate-950 mb-2"><FaRegArrowAltCircleUp size={30}/>Receitas do Mês</h2>
          {/* Lógica para calcular e exibir o valor total das receitas do mês selecionado */}
          {/* Substitua com a lógica apropriada baseada nos seus dados */}
          <p className="text-slate-950">Valor Total: R$ 1.500,00</p>
        </div>

        {/* Quadro de Diferença entre Receitas e Despesas */}
        <div className="bg-gray-200 py-10 px-6 rounded-lg">
          <h2 className="flex gap-4 text-lg font-bold text-slate-950 mb-2"><GiWallet  size={30}/>Diferença entre Receitas e Despesas</h2>
          {/* Lógica para calcular e exibir a diferença entre receitas e despesas do mês selecionado */}
          {/* Substitua com a lógica apropriada baseada nos seus dados */}
          <p className="text-slate-950">Diferença: R$ 300,00</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
