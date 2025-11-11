import { Component, signal } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE para [ngModel]
import { JogoService } from '../services/jogos.service'; // <-- Serviço de Jogo
import { Jogos } from '../models/jogos.models'; // <-- Modelo de Jogo

@Component({
  selector: 'app-header',
  imports: [
    RouterLink, 
    CommonModule, 
    FormsModule // <-- ADICIONADO AQUI
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true
})
export class Header {
  isAuthenticated$;
  userName$;
  
  // Variável para armazenar o termo de busca do usuário
  termoBusca = signal('');
  
  // Signal para armazenar os resultados da busca
  resultadosBusca = signal<Jogos[]>([]);
  
  // Controla se a caixa de sugestões de busca está visível
  buscaAtiva = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private jogoService: JogoService // Injeção do serviço
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.userName$ = this.authService.userName$;
  }

  onLoginClick() {
    if (this.authService.isUserAuthenticated()) {
      this.router.navigate(['/attJogo']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  // Lógica de Busca em tempo real (Auto-Sugestão)
  onSearchChange() {
    const termo = this.termoBusca().trim();
    if (termo.length > 2) { // Pesquisa apenas se tiver 3 ou mais caracteres
      this.jogoService.searchJogos(termo).subscribe({
        next: (jogos) => {
          this.resultadosBusca.set(jogos);
          this.buscaAtiva.set(jogos.length > 0);
        },
        error: (err) => {
          console.error('Erro na busca de jogos:', err);
          this.resultadosBusca.set([]);
          this.buscaAtiva.set(false);
        }
      });
    } else {
      this.resultadosBusca.set([]);
      this.buscaAtiva.set(false);
    }
  }

  // Navega para a página de detalhes de um jogo selecionado
  goToGameDetails(jogoId: string) {
    this.router.navigate(['/jogo', jogoId]);
    this.buscaAtiva.set(false); // Esconde a caixa de sugestões
    this.termoBusca.set('');
  }

  // Lida com a tecla Enter ou clique em um botão de busca
  onEnterPress() {
    const termo = this.termoBusca().trim();
    if (termo) {
      // (Opcional) Navegar para uma página de resultados gerais
      // Exemplo: this.router.navigate(['/search-results'], { queryParams: { q: termo } });
      this.buscaAtiva.set(false); // Esconde as sugestões ao pressionar Enter
    }
  }

  // Ocultar a busca quando o foco sai do campo
  onBlurSearch() {
    // Adiciona um pequeno delay para que o clique (mousedown) em um resultado seja processado
    setTimeout(() => {
        this.buscaAtiva.set(false);
    }, 200);
  }

  // Mostrar a busca se tiver resultados
  onFocusSearch() {
    if (this.resultadosBusca().length > 0) {
        this.buscaAtiva.set(true);
    }
  }
}