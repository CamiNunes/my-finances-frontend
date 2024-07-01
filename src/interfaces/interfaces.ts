export interface ReceitaBackend {
  id: string;
  valor: number;
  dataLancamento: string;
  descricao: string;
  categoria: string;
  statusReceita: string;
  recebido: boolean;
  dataRecebimento: string;
  tipoReceita: number;
}

export interface DespesaBackend {
  id: string;
  valor: number;
  dataPagamento: string | null;
  descricao: string;
  categoria: string;
  statusReceita: string;
  pago: boolean;
  dataVencimento: string;
  tipoReceita: number;
}