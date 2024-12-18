import { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { IoTrashBin } from 'react-icons/io5';
import { deletarFormaPagamento } from '@/api';

interface FormaPagamento {
  id: number;
  descricao: string;
}

interface FormaPagamentoListProps {
  formasPagamento: FormaPagamento[];
}

const FormaPagamentoList: React.FC<FormaPagamentoListProps> = ({ formasPagamento }) => {
  const [loading, setLoading] = useState(false);
  const [formasPagamentoList, setFormasPagamentoList] = useState<FormaPagamento[]>(formasPagamento);

  useEffect(() => {
    setFormasPagamentoList(formasPagamento);
  }, [formasPagamento]);

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deletarFormaPagamento(id);
      const updatedFormasPagamento = formasPagamentoList.filter((formaPagamento) => formaPagamento.id !== id);
      setFormasPagamentoList(updatedFormasPagamento);
    } catch (error) {
      console.error('Erro ao excluir forma de pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto w-full mt-4">
      <table className="w-full bg-white border-collapse">
        <thead>
          <tr className="bg-zinc-900">
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Descrição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {formasPagamentoList.map((formaPagamento, index) => (
            <tr key={index} className='bg-zinc-800'>
              <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-white uppercase">{formaPagamento.descricao}</td>
              <td>
              <button className="px-4 py-2 mr-2 whitespace-nowrap text-xs font-medium text-white bg-slate-700 rounded-md hover:bg-slate-500"><FaEdit size={16}/></button>
              <button
                onClick={() => handleDelete(formaPagamento.id)}
                className="px-4 py-2 whitespace-nowrap text-xs font-medium text-white bg-red-800 rounded-md hover:bg-red-600"><IoTrashBin size={16}/>
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormaPagamentoList;
