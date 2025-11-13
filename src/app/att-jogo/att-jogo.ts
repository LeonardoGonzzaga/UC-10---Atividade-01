import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Jogos } from '../models/jogos.models';
import { JogoService } from '../services/jogos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-att-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './att-jogo.html',
  styleUrl: './att-jogo.css',
})
export class AttJogo implements OnInit {

  public listaJogos: Jogos[] = [];
  public isLoading: boolean = true;
  public mensagem: string = '';

  // Lista de idiomas possíveis para seleção na edição
  public idiomasDisponiveis: string[] = [
    'Português (Brasil)', 'Inglês', 'Espanhol', 'Japonês', 'Francês', 'Alemão', 'Italiano', 'Russo', 'Chinês (Simplificado)', 'Chinês (Tradicional)', 'Coreano'
  ];

  // Idiomas selecionados enquanto edita
  public idiomasSelecionados: string[] = [];

  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  // Campo auxiliar para data (formato yyyy-MM-dd usado pelo input type="date")
  public editDataLancamento: string = '';

  // --- Propriedades para Edição ---
  // O objeto é inicializado usando a função helper.
  public jogoParaEditar: Jogos;
  // Controla se estamos no modo "Lista" ou "Edição"
  public estaEditando: boolean = false;


  constructor(
    private jogoService: JogoService,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa jogoParaEditar usando o novo método no construtor.
    this.jogoParaEditar = this.criarNovoJogoVazio();
  }

  ngOnInit(): void {
    this.carregarJogos();
  }

  /**
   * Cria e retorna um novo objeto Jogos com valores vazios.
   * Isso centraliza a lógica de inicialização do objeto no início.
   */
  private criarNovoJogoVazio(): Jogos {
    return new Jogos(
      '', // id
      '', // nome
      '', // descricao
      0,  // preco
      '', // imagemUrl
      '', // genero
      '', // publisher
      '', // desenvolvedora
      { // requisitosMinimos
        sistema: '',
        processador: '',
        memoria: '',
        placaVideo: '',
        armazenamento: ''
      },
      new Date(), // dataLancamento
      [], // idiomas
      '', // sobre
      0,  // avaliacoesPositivas
      0 // avaliacoesNegativas
    );
  }


  ngAfterViewInit(): void {
    // nothing immediate; editor content is set when iniciarEdicao is called
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Busca a lista completa de jogos do serviço.
   */
  public carregarJogos(): void {
    this.isLoading = true;
    this.mensagem = '';

    this.jogoService.getJogos().subscribe({
      next: (jogos: Jogos[]) => {
        // Ordena por nome para manter uma ordem previsível
        this.listaJogos = jogos.sort((a, b) => a.nome.localeCompare(b.nome));
        this.isLoading = false;
      },
      error: (erro) => {
        this.mensagem = 'Erro ao carregar a lista de jogos. Verifique o console e o json-server.';
        this.isLoading = false;
        console.error(erro);
      }
    });
  }

  /**
   * Implementa a lógica de exclusão de um jogo.
   */
  public excluirJogo(jogo: Jogos): void {
    const nomeDoJogo = jogo.nome;
    const idDoJogo = jogo.id;

    if (!confirm(`Tem certeza que deseja excluir o jogo "${nomeDoJogo}" (ID: ${idDoJogo})?`)) {
      return;
    }

    this.jogoService.excluirJogo(idDoJogo).subscribe({
      next: () => {
        // A mensagem de sucesso também usa o nome
        this.mensagem = `Jogo "${nomeDoJogo}" excluído com sucesso!`;
        // Remove o jogo da lista local
        this.listaJogos = this.listaJogos.filter(j => j.id !== idDoJogo);
      },
      error: (erro) => {
        this.mensagem = `Erro ao excluir o jogo "${nomeDoJogo}".`;
        console.error(erro);
      }
    });
  }

  public iniciarEdicao(jogo: Jogos): void {
    this.jogoParaEditar = { ...jogo };

    // Prepara seleção de idiomas
    this.idiomasSelecionados = Array.isArray(jogo.idiomas) ? [...jogo.idiomas] : [];

    // Prepara campo de data no formato yyyy-MM-dd
    this.editDataLancamento = jogo.dataLancamento ? new Date(jogo.dataLancamento).toISOString().slice(0, 10) : '';

    this.estaEditando = true;
    this.mensagem = `Editando: ${jogo.nome} (ID: ${jogo.id})`;

    setTimeout(() => {
      if (this.editor && this.editor.nativeElement) {
        this.editor.nativeElement.innerHTML = this.jogoParaEditar.sobre || '';
      }
    }, 0);
  }

  public cancelarEdicao(): void {
    this.estaEditando = false;
    this.mensagem = '';
    this.jogoParaEditar = this.criarNovoJogoVazio();
    this.idiomasSelecionados = [];
    this.editDataLancamento = '';

    setTimeout(() => {
      if (this.editor && this.editor.nativeElement) {
        this.editor.nativeElement.innerHTML = '';
      }
    }, 0);
  }

  public toggleIdioma(idioma: string): void {
    const idx = this.idiomasSelecionados.indexOf(idioma);
    if (idx === -1) {
      this.idiomasSelecionados.push(idioma);
    } else {
      this.idiomasSelecionados.splice(idx, 1);
    }
    this.jogoParaEditar.idiomas = [...this.idiomasSelecionados];
  }

  /**
   * Acionado pelo botão "Salvar" no formulário de edição.
   * Envia os dados atualizados para o serviço.
   */
  public salvarAtualizacao(): void {
    if (!this.jogoParaEditar || !this.jogoParaEditar.id) {
      this.mensagem = 'Erro: Jogo inválido para atualização.';
      return;
    }

    // Atualiza idiomas e data antes de enviar
    this.jogoParaEditar.idiomas = [...this.idiomasSelecionados];
    this.jogoParaEditar.dataLancamento = this.editDataLancamento ? new Date(this.editDataLancamento) : this.jogoParaEditar.dataLancamento;

    if (this.editor && this.editor.nativeElement) {
      this.jogoParaEditar.sobre = this.editor.nativeElement.innerHTML || '';
    }

    this.jogoService.atualizarJogo(this.jogoParaEditar.id, this.jogoParaEditar).subscribe({
      next: (jogoAtualizado) => {
        // 1. Atualiza a lista local (Front-end)
        const index = this.listaJogos.findIndex(j => j.id === jogoAtualizado.id);
        if (index !== -1) {
          this.listaJogos[index] = jogoAtualizado;
        }

        this.mensagem = `Jogo "${jogoAtualizado.nome}" atualizado com sucesso!`;

        // 2. Volta para a lista
        this.cancelarEdicao();
      },
      error: (erro) => {
        this.mensagem = 'Erro ao atualizar o jogo.';
        console.error(erro);
      }
    });
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
    if (url && this.editor) {
      this.applyFormat('createLink', url);
    }
  }
}