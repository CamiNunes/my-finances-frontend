"use client";
import { criarDespesa, listarCategorias, listarDespesas } from "@/api";
import { DespesaBackend } from "@/interfaces/interfaces";
import withAuth from "@/utils/withAuth";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { HiSave } from "react-icons/hi";
import { IoTrashBin } from "react-icons/io5";
import { TiCancel } from "react-icons/ti";
import Swal from "sweetalert2";

interface Categoria {
  descricao: string;
}

interface Despesa {
  descricao: string;
  valor: number;
  dataPagamento: Date | null;
  dataVencimento: Date;
  categoria: string;
  statusDespesa: string;
  tipoDespesa: 'Casa' | 'Pessoal';
  recebido: boolean;
}

const Despesas = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [despesa, setDespesa] = useState<Despesa>({
    descricao: '',
    valor: 0,
    dataPagamento: null,
    dataVencimento: new Date(),
    categoria: '',
    statusDespesa: '',
    tipoDespesa: 'Casa',
    recebido: true
  });
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategorias();
    fetchDespesas();
  }, []);

  const fetchCategorias = async () => {
    const categoriasData = await listarCategorias();
    setCategorias(categoriasData);
    console.log(categoriasData);
  };

  const fetchDespesas = async () => {
    const despesasData = await listarDespesas();
    setDespesas(despesasData);
    console.log(despesasData);
  };

  const mapDespesaToBackend = (despesa: Despesa): DespesaBackend => {
    return {
      valor: despesa.valor,
      dataPagamento: despesa.dataPagamento ? despesa.dataPagamento.toISOString() : null,
      descricao: despesa.descricao,
      categoria: despesa.categoria,
      statusReceita: despesa.statusDespesa,
      recebido: despesa.recebido,
      dataVencimento: despesa.dataVencimento.toISOString(),
      tipoReceita: despesa.tipoDespesa === 'Casa' ? 1 : 2
    };
  };

  const handleSaveDespesa = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário
    try {
      const despesaBackend = mapDespesaToBackend(despesa);

      // Chame a função apropriada para criar a receita na API
      const novaDespesa = await criarDespesa(despesaBackend);

      // Atualize o estado local com a nova receita
      setDespesas((prevDespesas) => [...prevDespesas, novaDespesa]);

      // Limpe os campos do formulário e feche o modal
      setDespesa({
        descricao: '',
        valor: 0,
        dataPagamento: null,
        dataVencimento: new Date(),
        categoria: '',
        statusDespesa: '',
        tipoDespesa: 'Casa',
        recebido: true
      });
      setIsModalOpen(false);

      // Exiba uma mensagem de sucesso
      Swal.fire({
        position: "top-end",
        icon: 'success',
        title: 'Despesa criada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao criar despesa:', error);

      // Exiba uma mensagem de erro
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'Erro ao criar despesa',
        text: 'Ocorreu um erro ao criar a despesa. Por favor, tente novamente mais tarde.',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button onClick={() => setIsModalOpen(true)} className="bg-green-800 text-white px-4 py-2 mt-4 rounded-md w-full">Adicionar Despesa</button>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-zinc-800 p-4 rounded-lg w-full max-w-lg">
            <form onSubmit={handleSaveDespesa} className="w-full">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-100">Descrição</label>
              <input type="text" id="descricao" value={despesa.descricao} onChange={(e) => setDespesa({ ...despesa, descricao: e.target.value })} className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" />
              
              <label htmlFor="valor" className="block text-sm font-medium text-gray-100">Valor</label>
              <input type="number" id="valor" value={despesa.valor} onChange={(e) => setDespesa({ ...despesa, valor: parseFloat(e.target.value) })} className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" />
              
              <label htmlFor="dataVencimento" className="block text-sm font-medium text-gray-100">Data de Vencimento</label>
              <input type="date" id="dataVencimento" value={despesa.dataVencimento.toISOString().substr(0, 10)} onChange={(e) => setDespesa({ ...despesa, dataVencimento: new Date(e.target.value) })} className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" />
              
              <label htmlFor="dataPagamento" className="block text-sm font-medium text-gray-100">Data de Pagamento</label>
              <input
                type="date"
                id="dataPagamento"
                value={despesa.dataPagamento ? despesa.dataPagamento.toISOString().substr(0, 10) : ''}
                onChange={(e) => {
                  const newValue = e.target.value ? new Date(e.target.value) : null;
                  setDespesa({ ...despesa, dataPagamento: newValue });
                }}
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100"
              />
              
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-100">Categoria</label>
              <select 
                id="categoria" 
                value={despesa.categoria} 
                onChange={(e) => setDespesa({ ...despesa, categoria: e.target.value })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100">
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria.descricao}>{categoria.descricao}</option>
                ))}
              </select>
              
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-100">Tipo</label>
              <select 
                id="tipo" 
                value={despesa.tipoDespesa} 
                onChange={(e) => setDespesa({ ...despesa, tipoDespesa: e.target.value as 'Casa' | 'Pessoal' })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100">
                <option value="Casa">Casa</option>
                <option value="Pessoal">Pessoal</option>
              </select>
              
              <label htmlFor="recebido" className="block text-sm font-medium text-gray-100">Recebido</label>
              <select 
                id="recebido" 
                value={despesa.recebido ? 'Sim' : 'Não'} 
                onChange={(e) => setDespesa({ ...despesa, recebido: e.target.value === 'Sim' })} 
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
      <div className="overflow-x-auto w-full mt-4">
        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="bg-zinc-900">
              <th className="px-6 py-3 text-left text-md font-medium text-slate-300 uppercase">Descrição</th>
              <th className="px-6 py-3 text-left text-md font-medium text-slate-300 uppercase">Valor</th>
              <th className="px-6 py-3 text-left text-md font-medium text-slate-300 uppercase">Data de Vencimento</th>
              <th className="px-6 py-3 text-left text-md font-medium text-slate-300 uppercase">Data de Pagamento</th>
              <th className="px-6 py-3 text-left text-md font-medium text-slate-300 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-md font-medium text-slate-300 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-md font-medium text-slate-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-md font-medium text-slate-300 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {despesas.map((despesa, index) => (
              <tr key={index} className='bg-zinc-800'>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">{despesa.descricao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(despesa.valor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">{despesa.dataVencimento ? new Date(despesa.dataVencimento).toLocaleDateString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">{despesa.dataPagamento ? new Date(despesa.dataPagamento).toLocaleDateString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">{despesa.categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">{despesa.tipoDespesa ? 'Casa' : 'Pessoal'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">{despesa.statusDespesa}</td>
                <td>
                  <button className="px-4 py-2 mr-2 whitespace-nowrap text-xs font-medium text-white bg-slate-700 rounded-md hover:bg-slate-500"><FaEdit size={16}/></button>
                  <button className="px-4 py-2 whitespace-nowrap text-xs font-medium text-white bg-red-800 rounded-md hover:bg-red-600"><IoTrashBin size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(Despesas);
