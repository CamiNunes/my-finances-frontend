"use client";
import { useState, useEffect } from 'react';
import CategoriaList from '../../../components/CategoriaList';
import CategoriaForm from '../../../components/CategoriaForm';
import { listarCategorias, criarCategoria } from '@/api';
import Swal from 'sweetalert2';
import withAuth from '@/utils/withAuth';

interface Categoria {
  id: number;
  descricao: string;
}

const Categorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategorias = async () => {
    const categoriasData = await listarCategorias();
    setCategorias(categoriasData);
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // const handleSaveCategoria = async (descricao: string) => {
  //   try {
  //     const novaCategoria = await criarCategoria(descricao);
  //     setCategorias((prevCategorias) => [...prevCategorias, novaCategoria]);
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error('Erro ao criar categoria:', error);
  //   }
  // };

  const handleSaveCategoria = async (descricao: string) => {
    try {
      const novaCategoria = await criarCategoria(descricao);
      setCategorias((prevCategorias) => [...prevCategorias, novaCategoria]);
      setIsModalOpen(false);

      // Mostrar SweetAlert de sucesso
      Swal.fire({
        position: "top-end",
        icon: 'success',
        title: 'Categoria criada com sucesso!',
        showConfirmButton: false,
        timer: 1500 // Fecha automaticamente após 1.5 segundos
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);

      // Mostrar SweetAlert de erro
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'Erro ao criar categoria',
        text: 'Ocorreu um erro ao criar a categoria. Por favor, tente novamente mais tarde.',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="bg-green-800 text-white px-4 py-2 mt-4 rounded-md w-full">Adicionar Categoria</button>
      <CategoriaList categorias={categorias} />
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <CategoriaForm onSave={handleSaveCategoria} onCancel={handleCancel} />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Categorias);
