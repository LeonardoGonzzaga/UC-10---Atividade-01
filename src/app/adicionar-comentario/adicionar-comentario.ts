import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ComentarioService } from '../services/comentario.service'; 
import { NgForm } from '@angular/forms';
import { Comentario } from '../models/comentario.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-adicionar-comentario',
  imports: [CommonModule, FormsModule],
  templateUrl: './adicionar-comentario.html',
  styleUrl: './adicionar-comentario.css',
})
export class AdicionarComentarioComponent {
  
  @Input() jogoId!: string;
  
  // Emite um evento quando o comentário é postado com sucesso para que o pai recarregue a lista
  @Output() comentarioAdicionado = new EventEmitter<void>();
  
  // Modelo para o formulário (o jogoId será adicionado na submissão)
  novoComentario = { usuario: '', texto: '' }; 

  constructor(private comentarioService: ComentarioService) { }

  onSubmit(form: NgForm): void {
    console.log('jogoId recebido:', this.jogoId);
    // 1. Reúne os dados, incluindo o jogoId do @Input()
    const comentarioParaEnviar = {
      jogoId: this.jogoId,
      usuario: this.novoComentario.usuario.trim(), // Limpa o nome
      texto: this.novoComentario.texto.trim()
    };

    // Verifique os dados que serão enviados
    console.log('Dados enviados:', comentarioParaEnviar); 
    
    // Se algum dos campos essenciais estiver vazio, o Angular pode estar enviando, mas o Backend rejeita.
    if (!comentarioParaEnviar.jogoId || !comentarioParaEnviar.usuario || !comentarioParaEnviar.texto) {
        console.error("ERRO: Um ou mais campos obrigatórios estão faltando!");
        // Não chame o serviço para evitar o erro 400 se o Angular não impediu o submit
        return; 
    }

    // 2. Chama o serviço para postar
    this.comentarioService.adicionarComentario(comentarioParaEnviar)
      .subscribe({
        next: () => {
          // 3. Sucesso: Limpa o texto, mantém o nome (opcional)
          const usuarioSalvo = this.novoComentario.usuario;
          form.resetForm({ 
            usuario: usuarioSalvo, 
            texto: '' 
          }); 
          
          // 4. Notifica o componente pai para recarregar a lista
          this.comentarioAdicionado.emit(); 
        },
        error: (error) => {
          console.error('Erro ao adicionar comentário:', error);
          // Adicionar lógica de feedback de erro para o usuário
        }
      });
  }
}