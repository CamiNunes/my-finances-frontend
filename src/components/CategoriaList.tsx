import { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
import { deletarCategoria, listarCategorias } from '../api';

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
    <div className="overflow-x-auto mt-2">
      <table className="w-full bg-white border-collapse" style={{ borderSpacing: '0 8px' }}>
        <thead>
          <tr className="bg-gray-300">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Descrição</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categoriasList.map((categoria, index) => (
            <tr
              key={categoria.id}
              className="bg-gray-200 shadow-md transition duration-300 ease-in-out hover:bg-gray-300"
              style={{ borderRadius: '8px' }}
            >
              <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-black rounded-l-lg">{categoria.descricao}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">Editar</button>
                <button
                  onClick={() => handleDelete(categoria.id)}
                  className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
                  disabled={loading}
                >
                  {loading ? 'Excluindo...' : 'Excluir'}
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
