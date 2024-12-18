"use client";
import { useState, useEffect } from 'react';
import { listarFormasPagamento, criarFormaPagamento } from '@/api';
import Swal from 'sweetalert2';
import withAuth from '@/utils/withAuth';
import FormaPagamentoForm from '@/components/FormaPagamentoForm';
import FormaPagamentoList from '@/components/FormaPagamentoList';

interface FormaPagamento {
  id: number;
  descricao: string;
}

const FormaPagamento = () => {
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFormasPagamento = async () => {
    const formaPagamentoData = await listarFormasPagamento();
    setFormasPagamento(formaPagamentoData);
  };

  useEffect(() => {
    fetchFormasPagamento();
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

  const handleSaveFormaPagamento = async (descricao: string) => {
    try {
      const novaFormaPagamento = await criarFormaPagamento(descricao);
      setFormasPagamento((prevFormasPagamento) => [...prevFormasPagamento, novaFormaPagamento]);
      setIsModalOpen(false);

      // Mostrar SweetAlert de sucesso
      Swal.fire({
        position: "center",
        icon: 'success',
        iconColor: '#0e6716',
        title: 'Forma de Pagamento criada com sucesso!',
        showConfirmButton: false,
        timer: 1500 // Fecha automaticamente após 1.5 segundos
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);

      // Mostrar SweetAlert de erro
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'Erro ao criar froma de pagamento',
        text: 'Ocorreu um erro ao criar a forma de pagamento. Por favor, tente novamente mais tarde.',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="bg-green-800 text-white px-4 py-2 mt-4 rounded-md w-full">Adicionar Forma de Pagamento</button>
      <FormaPagamentoList formasPagamento={formasPagamento} />
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-700 p-4 rounded-lg">
            <FormaPagamentoForm onSave={handleSaveFormaPagamento} onCancel={handleCancel} />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(FormaPagamento);
