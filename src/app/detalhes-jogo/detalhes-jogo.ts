import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JogoService } from '../services/jogos.service';
import { Jogos } from '../models/jogos.models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ComentariosJogosComponent } from '../comentarios-jogos/comentarios-jogos';


@Component({
  selector: 'app-detalhes-jogo',
  standalone: true,
  imports: [CommonModule, RouterModule, ComentariosJogosComponent],
  templateUrl: './detalhes-jogo.html',
  styleUrls: ['./detalhes-jogo.css']
})
export class DetalhesJogo implements OnInit {
  jogo?: Jogos;
  loading = true;
  error = '';
  trustedSobre?: SafeHtml;

  jogoId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private jogoService: JogoService,
    private sanitizer: DomSanitizer
  ) { }

 ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        // 1. EXTRAÇÃO E ARMAZENAMENTO: Extrai o ID da URL e armazena
        this.jogoId = params.get('id'); 
        
        if (this.jogoId) {
          // 2. Chama o serviço para buscar os detalhes
          return this.jogoService.getJogo(this.jogoId);
        }
        this.loading = false;
        return of(undefined);
      })
    ).subscribe({
      next: (jogo) => {
        if (jogo) {
          this.jogo = jogo;
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