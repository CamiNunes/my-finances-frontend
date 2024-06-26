import { FC, useState, useEffect } from 'react';
import { FiChevronDown, FiMenu } from 'react-icons/fi';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState<string>('Usuário');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName');
      setUserName(storedUserName ?? 'Usuário');
    }
  }, []);
  
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    // Limpa o token e o nome do usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    // Redireciona o usuário para a página de login ou homepage
    window.location.href = '/login'; // Redireciona para a página de login
    //window.location.href = '/'; // Redireciona para a homepage
  };

  return (
    <header className="bg-zinc-800 p-4 flex justify-between items-center shadow-md">
      <button onClick={toggleSidebar} className="md:hidden">
        <FiMenu size={24} />
      </button>
      <div className="text-2xl font-bold">Finanças Pessoais</div>
      <div className="relative">
        <button onClick={handleDropdownToggle} className="flex items-center space-x-2 focus:outline-none">
          <span>Olá, {userName}</span>
          <FiChevronDown />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
            <a href="#" onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
              Sair
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
