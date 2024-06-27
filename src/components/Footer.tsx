// src/components/Footer.tsx
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-zinc-900 text-slate-200 p-4 flex justify-between items-center shadow-inner">
      <span>Desenvolvido por: Camila Nunes</span>
      <span>{new Date().getFullYear()}</span>
    </footer>
  );
};

export default Footer;
