export class Comentario {
  constructor(
    public _id: string, 
    public jogoId: string, 
    public usuario: string, 
    public texto: string, 
    public dataCriacao: Date,
    public updatedAt: Date 
  ) {}
}