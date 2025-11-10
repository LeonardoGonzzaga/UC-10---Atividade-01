export class Jogos {
  constructor(
    public id: string,
    public nome: string,
    public descricao: string,
    public preco: number,
    public imagemUrl: string,
    public genero: string,
    public publisher: string,
    public desenvolvedora: string,
    public requisitosMinimos: {
      sistema: string,
      processador: string,
      memoria: string,
      placaVideo: string,
      armazenamento: string
    },
    public dataLancamento: Date,
    public idiomas: string[],
    public sobre: string,
    public avaliacoesPositivas: number = 0,
    public avaliacoesNegativas: number = 0
  ) {}
}