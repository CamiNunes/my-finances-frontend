import { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
import { deletarCategoria, listarCategorias } from '../api';
import { FaEdit } from 'react-icons/fa';
import { IoTrashBin } from 'react-icons/io5';

interface Categoria {
  id: number;
  descricao: string;
}

interface CategoriaListProps {
  categorias: Categoria[];
}

const CategoriaList: React.FC<CategoriaListProps> = ({ categorias }) => {
  const [loading, setLoading] = useState(false);
  const [categoriasList, setCategoriasList] = useState<Categoria[]>(categorias);

  useEffect(() => {
    setCategoriasList(categorias);
  }, [categorias]);

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deletarCategoria(id);
      const updatedCategorias = categoriasList.filter((categoria) => categoria.id !== id);
      setCategoriasList(updatedCategorias);
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
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
          {categoriasList.map((categoria, index) => (
            <tr key={index} className='bg-zinc-800'>
              <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">{categoria.descricao}</td>
              <td>
              <button className="px-4 py-2 mr-2 whitespace-nowrap text-xs font-medium text-white bg-slate-700 rounded-md hover:bg-slate-500"><FaEdit size={16}/></button>
              <button
                onClick={() => handleDelete(categoria.id)}
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

export default CategoriaList;
