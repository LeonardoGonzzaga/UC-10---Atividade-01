import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router'; // Adicionado
import { ComentarioService } from '../services/comentario.service'; 
import { Comentario } from '../models/comentario.models';
import { AdicionarComentarioComponent } from '../adicionar-comentario/adicionar-comentario';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators'; 

@Component({
  selector: 'app-comentarios-jogos',
  imports: [AdicionarComentarioComponent, CommonModule],
  templateUrl: './comentarios-jogos.html',
  styleUrl: './comentarios-jogos.css',
})
export class ComentariosJogosComponent implements OnInit {

  // O jogoId agora é uma propriedade interna, lida diretamente da URL
  jogoId: string = ''; 
  
  comentarios: Comentario[] = [];
  
  constructor(
    private comentarioService: ComentarioService,
    private route: ActivatedRoute // Injeção do ActivatedRoute para ler o ID da URL
  ) {}

  ngOnInit(): void {
    // Usa o paramMap para observar mudanças nos parâmetros da rota (ex: ao navegar para /jogo/id1 -> /jogo/id2)
    this.route.paramMap.pipe(
      // switchMap cancela a requisição anterior se uma nova for iniciada (ótimo para navegação rápida)
      switchMap(params => {
        // Extrai o ID da URL (espera-se que a rota seja '/jogo/:id')
        this.jogoId = params.get('id') || ''; 
        
        // Se o ID existe, carrega os comentários
        if (this.jogoId) {
          return this.comentarioService.getComentariosPorJogo(this.jogoId);
        } else {
          // Se não houver ID, limpa a lista e retorna um Observable vazio
          this.comentarios = [];
          // O 'of([])' não é necessário aqui, mas manter o fluxo do Observable vazio é mais limpo.
          return [];
        }
      })
    ).subscribe({
      next: (data) => {
        this.comentarios = data;
      },
      error: (err) => {
        console.error('Erro ao carregar ou buscar ID da rota:', err);
      }
    });
  }
  
  deletarComentario(comentarioId: string): void {
      // TODO: Substituir o 'confirm()' por um modal/diálogo customizado,
      // pois o confirm() nativo do navegador é bloqueado ou não funciona em iframes.
      console.log(`Tentativa de deletar comentário com ID: ${comentarioId}. Confirmando exclusão...`);
      
      this.comentarioService.deletarComentario(comentarioId)
          .subscribe({
              next: () => {
                  console.log('Comentário deletado com sucesso.');
                  // Recarrega a lista após a exclusão
                  this.carregarComentarios(); 
              },
              error: (err) => {
                  console.error('Erro ao deletar comentário:', err);
              }
          });
  }

  // O componente de Adicionar Comentário emitirá um evento que chamará este método.
  handleComentarioAdicionado(): void {
    // Recarrega os comentários para mostrar o novo
    this.carregarComentarios();
  }
  
  // Método para recarregar a lista de comentários, usado pelo ngOnInit e pelo handleComentarioAdicionado
  carregarComentarios(): void {
     if (this.jogoId) {
      this.comentarioService.getComentariosPorJogo(this.jogoId)
        .subscribe({
          next: (data) => {
            this.comentarios = data;
          },
          error: (err) => {
            console.error('Erro ao carregar comentários:', err);
          }
    });
   }
 }
}