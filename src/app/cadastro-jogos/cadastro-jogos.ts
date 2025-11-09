import { Component, OnInit } from '@angular/core';
import { Jogos } from '../models/jogos.models';       
import { JogoService } from '../services/jogos.service'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-jogos',
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro-jogos.html',
  styleUrl: './cadastro-jogos.css',
})

export class CadastroJogos implements OnInit {

  public novoJogo: Jogos = new Jogos(0, '', '', 0, ''); 
  public mensagem: string = '';

  constructor(private jogoService: JogoService) { }

  ngOnInit(): void {
    this.novoJogo = new Jogos(0, '', '', 0, '');
  }

  public cadastrarJogo(): void {
    const jogoParaEnviar = { ...this.novoJogo };

    this.jogoService.cadastrarJogo(jogoParaEnviar as Jogos).subscribe({
      next: (resposta) => {
        console.log('Jogo cadastrado com sucesso:', resposta);
        this.mensagem = `Jogo "${resposta.nome}" cadastrado com sucesso! ID: ${resposta.id}`;
        
        this.novoJogo = new Jogos(0, '', '', 0, ''); 
      },
      error: (erro) => {
        console.error('Erro ao cadastrar jogo:', erro);
        this.mensagem = 'Erro ao cadastrar o jogo. Verifique o console.';
      }
    });
  }
}