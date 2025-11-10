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
    // Ensure editor content reflects the model after view init
    if (this.editor) {
      this.editor.nativeElement.innerHTML = this.novoJogo.sobre || '';
    }
  }

  public applyFormat(command: string, value?: string) {
    try {
      document.execCommand(command, false, value ?? undefined);
      // Keep focus on editor after applying format
      if (this.editor && this.editor.nativeElement) {
        this.editor.nativeElement.focus();
      }
    } catch (e) {
      // Silently ignore unsupported format
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
    this.mensagem = '';
    this.erro = false;
    // Clear editor if present (use setTimeout so it runs after change detection)
    setTimeout(() => {
      if (this.editor && this.editor.nativeElement) {
        this.editor.nativeElement.innerHTML = this.novoJogo.sobre || '';
      }
    }, 0);
  }

  public cadastrarJogo(): void {
    // Capture formatted HTML from editor into the model
    if (this.editor && this.editor.nativeElement) {
      this.novoJogo.sobre = this.editor.nativeElement.innerHTML || '';
    }

    const jogoParaEnviar = { 
      ...this.novoJogo,
      idiomas: this.idiomasSelecionados
    };

    this.jogoService.cadastrarJogo(jogoParaEnviar as Jogos).subscribe({
      next: (resposta) => {
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