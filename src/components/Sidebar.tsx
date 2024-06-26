import { FC } from 'react';
import Link from 'next/link';
import { FiHome, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { TbCategoryPlus } from "react-icons/tb";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div className={`h-full bg-zinc-900 text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0`}>
      <div className="p-4 text-xl font-bold">Menu</div>
      <ul>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/" className="flex items-center">
            <FiHome className="mr-2" />Início
          </Link>
        </li>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/cadastros/categorias" className="flex items-center">
            <TbCategoryPlus className="mr-2" />Categorias
          </Link>
        </li>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/cadastros/despesas" className="flex items-center">
            <FiDollarSign className="mr-2" />Despesas
          </Link>
        </li>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/cadastros/receitas" className="flex items-center">
            <FiTrendingUp className="mr-2" />Receitas
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
