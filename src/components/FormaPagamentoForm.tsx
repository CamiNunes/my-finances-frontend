import { useState } from 'react';

interface FormaPagamentoFormProps {
  onSave: (descricao: string) => void;
  onCancel: () => void;
}

const FormaPagamentoForm: React.FC<FormaPagamentoFormProps> = ({ onSave, onCancel }) => {
  const [descricao, setDescricao] = useState('');

  const handleSave = () => {
    const descricaoTrimmed = descricao.trim();
    if (descricaoTrimmed !== '') {
      onSave(descricaoTrimmed);
      setDescricao('');
    } else {
      console.log('Descrição está vazia.');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-gray-300 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-black">Adicionar Forma de Pagamento</h2>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          className="border border-gray-400 p-2 mb-4 w-full text-gray-900"
        />
        <div className="flex justify-end">
          <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 mr-2 rounded-md">Cancelar</button>
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default FormaPagamentoForm;
