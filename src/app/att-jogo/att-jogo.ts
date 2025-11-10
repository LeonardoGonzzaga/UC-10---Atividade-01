import { Component, OnInit } from '@angular/core';
import { Jogos } from '../models/jogos.models';       
import { JogoService } from '../services/jogos.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-att-jogo',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './att-jogo.html',
  styleUrl: './att-jogo.css',
})
export class AttJogo implements OnInit {

  public listaJogos: Jogos[] = [];
  public isLoading: boolean = true;
  public mensagem: string = '';

  // --- Propriedades para Edição ---
  // Objeto que será vinculado ao formulário de edição
    public jogoParaEditar: Jogos = new Jogos(
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
  // Controla se estamos no modo "Lista" ou "Edição"
  public estaEditando: boolean = false;


  constructor(
    private jogoService: JogoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarJogos();
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
        // Ordena por nome para manter uma ordem previsível (ids do Mongo são strings)
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

    // A MENSAGEM DE CONFIRMAÇÃO AGORA USA O NOME DO JOGO
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
    
    this.estaEditando = true; 
    this.mensagem = `Editando: ${jogo.nome} (ID: ${jogo.id})`;
  }

  /**
   * Acionado pelo botão "Cancelar" no formulário de edição.
   * Volta para a tela da lista.
   */
  public cancelarEdicao(): void {
    this.estaEditando = false;
    this.mensagem = '';
    // Limpa o objeto do formulário
    this.jogoParaEditar = new Jogos(
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

  /**
   * Acionado pelo botão "Salvar" no formulário de edição.
   * Envia os dados atualizados (PUT) para o serviço.
   */
  public salvarAtualizacao(): void {
    if (!this.jogoParaEditar || !this.jogoParaEditar.id) {
      this.mensagem = 'Erro: Jogo inválido para atualização.';
      return;
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
}