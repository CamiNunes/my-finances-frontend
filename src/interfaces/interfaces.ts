export interface ReceitaBackend {
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
  valor: number;
  dataPagamento: string | null;
  descricao: string;
  categoria: string;
  statusReceita: string;
  recebido: boolean;
  dataVencimento: string;
  tipoReceita: number;
}