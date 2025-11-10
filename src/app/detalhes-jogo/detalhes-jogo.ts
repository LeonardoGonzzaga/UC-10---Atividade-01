import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JogoService } from '../services/jogos.service';
import { Jogos } from '../models/jogos.models';

@Component({
  selector: 'app-detalhes-jogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalhes-jogo.html',
  styleUrls: ['./detalhes-jogo.css']
})
export class DetalhesJogo implements OnInit {
  jogo?: Jogos;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private jogoService: JogoService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarJogo(id);
    } else {
      this.error = 'ID do jogo não fornecido';
      this.loading = false;
    }
  }

  private carregarJogo(id: string): void {
    this.jogoService.getJogo(id).subscribe({
      next: (jogo) => {
        this.jogo = jogo;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar jogo:', error);
        this.error = 'Erro ao carregar informações do jogo';
        this.loading = false;
      }
    });
  }

  // Formata o preço para exibição em reais
  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }
}