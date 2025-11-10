import { Component, OnInit } from '@angular/core';
import { Jogos } from '../models/jogos.models';       
import { JogoService } from '../services/jogos.service'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-jogos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro-jogos.html',
  styleUrl: './cadastro-jogos.css',
})

export class CadastroJogos implements OnInit {
  public novoJogo: Jogos = this.criarNovoJogo();
  public mensagem: string = '';
  public erro: boolean = false;
  
  public idiomasDisponiveis: string[] = [
    'Português (Brasil)',
    'Inglês',
    'Espanhol',
    'Japonês',
    'Francês',
    'Alemão',
    'Italiano',
    'Russo',
    'Chinês (Simplificado)',
    'Chinês (Tradicional)',
    'Coreano'
  ];
  
  public idiomasSelecionados: string[] = [];

  constructor(private jogoService: JogoService) { }

  ngOnInit(): void {
    this.resetarFormulario();
  }

  private criarNovoJogo(): Jogos {
    return new Jogos(
      '',      // id
      '',      // nome
      '',      // descricao
      0,       // preco
      '',      // imagemUrl
      '',      // genero
      '',      // publisher
      '',      // desenvolvedora
      {        // requisitosMinimos
        sistema: '',
        processador: '',
        memoria: '',
        placaVideo: '',
        armazenamento: ''
      },
      new Date(), // dataLancamento
      [],      // idiomas
      0,       // avaliacoesPositivas
      0        // avaliacoesNegativas
    );
  }

  public toggleIdioma(idioma: string): void {
    const index = this.idiomasSelecionados.indexOf(idioma);
    if (index === -1) {
      this.idiomasSelecionados.push(idioma);
    } else {
      this.idiomasSelecionados.splice(index, 1);
    }
    this.novoJogo.idiomas = [...this.idiomasSelecionados];
  }

  private resetarFormulario(): void {
    this.novoJogo = this.criarNovoJogo();
    this.idiomasSelecionados = [];
    this.mensagem = '';
    this.erro = false;
  }

  public cadastrarJogo(): void {
    const jogoParaEnviar = { 
      ...this.novoJogo,
      idiomas: this.idiomasSelecionados
    };

    this.jogoService.cadastrarJogo(jogoParaEnviar as Jogos).subscribe({
      next: (resposta) => {
        console.log('Jogo cadastrado com sucesso:', resposta);
        this.mensagem = `Jogo "${resposta.nome}" cadastrado com sucesso!`;
        this.erro = false;
        this.resetarFormulario();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar jogo:', erro);
        this.mensagem = 'Erro ao cadastrar o jogo. Por favor, tente novamente.';
        this.erro = true;
      }
    });
  }
}