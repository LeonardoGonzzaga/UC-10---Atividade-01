import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  constructor(private jogoService: JogoService) { }

  ngOnInit(): void {
    this.resetarFormulario();
  }

  ngAfterViewInit(): void {
    if (this.editor) {
      this.editor.nativeElement.innerHTML = this.novoJogo.sobre || '';
    }
  }

  public applyFormat(command: string, value?: string) {
    try {
      document.execCommand(command, false, value ?? undefined);
      if (this.editor && this.editor.nativeElement) {
        this.editor.nativeElement.focus();
      }
    } catch (e) {
    }
  }

  public createLink(): void {
    const url = window.prompt('Insira a URL:');
    if (url) {
      this.applyFormat('createLink', url);
    }
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
      '',      // sobre
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
    this.erro = false;
    setTimeout(() => {
      if (this.editor && this.editor.nativeElement) {
        this.editor.nativeElement.innerHTML = this.novoJogo.sobre || '';
      }
    }, 0);
  }

  public cadastrarJogo(): void {
  if (this.editor && this.editor.nativeElement) {
    this.novoJogo.sobre = this.editor.nativeElement.innerHTML || '';
  }

  const jogoParaEnviar = { 
    ...this.novoJogo,
    idiomas: this.idiomasSelecionados
  };

  this.jogoService.cadastrarJogo(jogoParaEnviar as Jogos).subscribe({
    next: (resposta) => {
      // 1. Define a mensagem de sucesso
      this.mensagem = `Jogo "${resposta.nome}" cadastrado com sucesso! ID "${resposta.id}"`;
      this.erro = false;
      this.resetarFormulario(); 
      // 2. Limpa a mensagem após 5 segundos para que o usuário possa ler
      setTimeout(() => {
        this.mensagem = '';
      }, 5000); 

    },
    error: (erro) => {
      console.error('Erro ao cadastrar jogo:', erro);
      this.mensagem = 'Erro ao cadastrar o jogo. Por favor, tente novamente.';
      this.erro = true;
    }
  });
}
}