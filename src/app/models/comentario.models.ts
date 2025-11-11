export class Comentario {
  constructor(
    // 1. Corrigido: O ID gerado pelo MongoDB (_id)
    public _id: string, 
    // 4. Corrigido: O ID do jogo, que foi usado corretamente no componente
    public jogoId: string, 
    // 2. Corrigido: Nome do usuário que fez o comentário
    public usuario: string, 
    // Conteúdo do comentário
    public texto: string, 
    // A data em que o comentário foi criado
    public dataCriacao: Date,
    // 3. Corrigido: A data da última atualização (adicionado devido ao Mongoose timestamps)
    public updatedAt: Date 
  ) {}
}