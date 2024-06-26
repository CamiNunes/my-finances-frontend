export interface ReceitaBackend {
  valor: number;
  dataLancamento: string;
  descricao: string;
  categoria: string;
  recebido: boolean;
  dataRecebimento: string;
  tipoReceita: number;
}