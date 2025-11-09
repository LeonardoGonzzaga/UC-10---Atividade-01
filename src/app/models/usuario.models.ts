export class Usuario {
    id?: number; 
    nome: string;
    email: string;
    senha: string; 

    constructor(nome: string, email: string, senha: string, id?: number) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.id = id;
    }
}