"use client";
import withAuth from "@/utils/withAuth";

const Despesas = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-black">Cadastro de Despesas</h1>
      {/* Conteúdo do cadastro de despesas */}
    </div>
  );
};

export default withAuth(Despesas);
