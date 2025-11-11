import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JogoService } from '../services/jogos.service';
import { Jogos } from '../models/jogos.models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-detalhes-jogo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhes-jogo.html',
  styleUrls: ['./detalhes-jogo.css']
})
export class DetalhesJogo implements OnInit {
  jogo?: Jogos;
  loading = true;
  error = '';
  trustedSobre?: SafeHtml;

  constructor(
    private route: ActivatedRoute,
    private jogoService: JogoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Ao invés de usar o snapshot (que lê o ID apenas na inicialização),
    // assinamos as mudanças nos parâmetros da URL.
    this.route.params.pipe(
      // 1. Usa o switchMap para cancelar a requisição anterior e iniciar uma nova
      // quando o parâmetro 'id' mudar (navegação de X para Y).
      switchMap(params => {
        const id = params['id'];
        
        if (id) {
          this.loading = true; // Define o loading como true para o novo carregamento
          this.error = ''; // Limpa o erro
          return this.jogoService.getJogo(id);
        } else {
          this.error = 'ID do jogo não fornecido';
          this.loading = false;
          return of(undefined); // Retorna um Observable vazio para encerrar
        }
      })
    ).subscribe({
      next: (jogo) => {
        if (jogo) {
          this.jogo = jogo;
          // Sanitiza o HTML para exibição
          this.trustedSobre = this.sanitizer.bypassSecurityTrustHtml(jogo.sobre || '');
        } else {
          this.jogo = undefined;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar jogo:', error);
        this.error = 'Erro ao carregar informações do jogo';
        this.loading = false;
      }
    });
  }

  // Seus métodos de formatação e avaliação permanecem inalterados
  
  // Formata o preço para exibição em reais
  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }

  avaliarJogo(positiva: boolean): void {
    if (!this.jogo || !this.jogo.id) return;

    this.loading = true;
    this.jogoService.avaliarJogo(this.jogo.id, positiva).subscribe({
      next: (jogoAtualizado) => {
        this.jogo = jogoAtualizado;
        this.trustedSobre = this.sanitizer.bypassSecurityTrustHtml(this.jogo.sobre || '');
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao avaliar jogo:', error);
        this.error = 'Erro ao registrar avaliação';
        this.loading = false;
      }
    });
  }
}