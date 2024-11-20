"use client";
import { criarDespesa, deletarDespesa, listarCategorias, listarDespesas } from "@/api";
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
  id: string;
  descricao: string;
  valor: number;
  dataPagamento: Date | null;
  dataVencimento: Date;
  categoria: string;
  statusDespesa: string;
  tipoDespesa: 'Casa' | 'Pessoal';
  pago: boolean;
}

const Despesas = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [despesa, setDespesa] = useState<Despesa>({
    id: '',
    descricao: '',
    valor: 0,
    dataPagamento: null,
    dataVencimento: new Date(),
    categoria: '',
    statusDespesa: '',
    tipoDespesa: 'Casa',
    pago: true
  });
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredDespesas, setFilteredDespesas] = useState<Despesa[]>([]);
  const [mesPagamentoFiltro, setMesPagamentoFiltro] = useState<number | null>(null);
  const [mesVencimentoFiltro, setMesVencimentoFiltro] = useState<number | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<string>('');
  const [descricaoFiltro, setDescricaoFiltro] = useState<string>('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategorias();
    fetchDespesas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [despesas, mesVencimentoFiltro, statusFiltro, descricaoFiltro, currentPage]);

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
      id: despesa.id,
      valor: despesa.valor,
      dataPagamento: despesa.dataPagamento ? despesa.dataPagamento.toISOString() : null,
      descricao: despesa.descricao,
      categoria: despesa.categoria,
      statusReceita: despesa.statusDespesa,
      pago: despesa.pago,
      dataVencimento: despesa.dataVencimento.toISOString(),
      tipoReceita: despesa.tipoDespesa === 'Casa' ? 1 : 2
    };
  };

  const handleDeletarDespesa = async (id: string) => {
    try {
      await deletarDespesa(id);

      // Atualize o estado local removendo a despesa deletada
      setDespesas((prevDespesas) => prevDespesas.filter((despesa) => despesa.id !== id));

      // Exiba uma mensagem de sucesso
      Swal.fire({
        position: "top-end",
        icon: 'success',
        title: 'Despesa deletada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);

      // Exiba uma mensagem de erro
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'Erro ao deletar despesa',
        text: 'Ocorreu um erro ao deletar a despesa. Por favor, tente novamente mais tarde.',
        confirmButtonText: 'Ok'
      });
    }
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
        id: '',
        descricao: '',
        valor: 0,
        dataPagamento: null,
        dataVencimento: new Date(),
        categoria: '',
        statusDespesa: '',
        tipoDespesa: 'Casa',
        pago: true
      });
      setIsModalOpen(false);

      // Exiba uma mensagem de sucesso
      Swal.fire({
        position: "center",
        icon: 'success',
        iconColor: '#0e6716',
        title: 'Despesa criada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao criar despesa:', error);

      // Exiba uma mensagem de erro
      Swal.fire({
        position: "center",
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

  const applyFilters = () => {
    let filtered: Despesa[] = [];

    if (Array.isArray(despesas)) {
      filtered = despesas;

      if (mesVencimentoFiltro !== null) {
        filtered = filtered.filter(despesa => new Date(despesa.dataVencimento).getMonth() === mesVencimentoFiltro);
      }

      if (statusFiltro) {
        filtered = filtered.filter(despesa => despesa.statusDespesa.toLowerCase().includes(statusFiltro.toLowerCase()));
      }

      if (descricaoFiltro) {
        filtered = filtered.filter(despesa => despesa.descricao.toLowerCase().includes(descricaoFiltro.toLowerCase()));
      }

      // Atualize o total de páginas
      setTotalPages(Math.ceil(filtered.length / pageSize));

      // Aplica a paginação
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setFilteredDespesas(filtered.slice(startIndex, endIndex));
    } else {
      console.error('Despesas não é um array');
      setFilteredDespesas([]);
    }
  };

  // Manipuladores de navegação de página
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button onClick={() => setIsModalOpen(true)} className="bg-green-800 text-white px-4 py-2 mt-4 rounded-md w-full">Adicionar Despesa</button>
      {isModalOpen && (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-4xl">
          <form onSubmit={handleSaveDespesa} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Descrição */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-100">Descrição</label>
              <input 
                type="text" 
                id="descricao" 
                value={despesa.descricao} 
                onChange={(e) => setDespesa({ ...despesa, descricao: e.target.value })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" 
              />
            </div>
      
            {/* Valor */}
            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-gray-100">Valor</label>
              <input 
                type="number" 
                id="valor" 
                value={despesa.valor} 
                onChange={(e) => setDespesa({ ...despesa, valor: parseFloat(e.target.value) })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" 
              />
            </div>
      
            {/* Data de Vencimento */}
            <div>
              <label htmlFor="dataVencimento" className="block text-sm font-medium text-gray-100">Data de Vencimento</label>
              <input 
                type="date" 
                id="dataVencimento" 
                value={despesa.dataVencimento.toISOString().substr(0, 10)} 
                onChange={(e) => setDespesa({ ...despesa, dataVencimento: new Date(e.target.value) })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100" 
              />
            </div>
      
            {/* Data de Pagamento */}
            <div>
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
            </div>
      
            {/* Categoria */}
            <div>
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
            </div>
      
            {/* Tipo */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-100">Tipo</label>
              <select 
                id="tipo" 
                value={despesa.tipoDespesa} 
                onChange={(e) => setDespesa({ ...despesa, tipoDespesa: e.target.value as 'Casa' | 'Pessoal' })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100">
                <option value="Casa">Casa</option>
                <option value="Pessoal">Pessoal</option>
              </select>
            </div>
      
            {/* Pago */}
            <div>
              <label htmlFor="recebido" className="block text-sm font-medium text-gray-100">Pago</label>
              <select 
                id="recebido" 
                value={despesa.pago ? 'Sim' : 'Não'} 
                onChange={(e) => setDespesa({ ...despesa, pago: e.target.value === 'Sim' })} 
                className="bg-zinc-800 p-2 border border-gray-500 rounded-md w-full text-gray-100">
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
      
            {/* Botões */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={handleCancel} 
                className="flex gap-2 bg-gray-700 text-white px-4 py-2 rounded-md">
                <TiCancel size={24} /> Cancelar
              </button>
              <button 
                type="submit" 
                className="flex gap-2 bg-green-800 text-white px-4 py-2 rounded-md">
                <HiSave size={24} /> Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    
      )}

      <div className="flex gap-4 mt-4 mb-4">
        <div>
          <label htmlFor="mesFiltro" className="block text-sm font-medium text-gray-100">Filtrar por Mês de Vencimento</label>
          <select 
            id="mesFiltro" 
            value={mesVencimentoFiltro !== null ? mesVencimentoFiltro : ''} 
            onChange={(e) => setMesVencimentoFiltro(e.target.value ? parseInt(e.target.value) : null)} 
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
            <option value="Pago">Pago</option>
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
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">Valor</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase">Data de Vencimento</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase">Categoria</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase">Tipo</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredDespesas.map((despesa) => (
              <tr key={despesa.id} className='bg-zinc-800'>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase">{despesa.descricao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white text-right">R$ {despesa.valor.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white text-center">
                {despesa.dataVencimento ? new Date(despesa.dataVencimento).toLocaleDateString('pt-BR') : 'Data inválida'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase text-center">{despesa.categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase text-center">{despesa.statusDespesa}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase text-center">{despesa.tipoDespesa ? 'Casa' : 'Pessoal'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase text-center">
                  <button onClick={() => console.log('Edit feature not implemented yet')} className="px-4 py-2 mr-2 whitespace-nowrap text-xs font-medium text-white bg-slate-700 rounded-md hover:bg-slate-500"><FaEdit /></button>
                  <button onClick={() => handleDeletarDespesa(despesa.id)} className="px-4 py-2 whitespace-nowrap text-xs font-medium text-white bg-red-800 rounded-md hover:bg-red-600"><IoTrashBin /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      
      {/* Navegação de Página */}
      <div className="mt-4 flex justify-between items-center">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-blue-800 text-white px-4 py-2 rounded-md">Anterior</button>
        <span className="text-gray-100">Página {currentPage} de {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="bg-blue-800 text-white px-4 py-2 rounded-md">Próxima</button>
      </div>
    </div>
  );
};

export default withAuth(Despesas);
