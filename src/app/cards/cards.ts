import { Component, OnInit } from '@angular/core';
import { Jogos } from '../models/jogos.models';       
import { JogoService } from '../services/jogos.service'; 
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, RouterModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})

export class Cards implements OnInit {

  public listaJogos: Jogos[] = []; 
  
  constructor(private jogoService: JogoService) { }

  ngOnInit(): void {
    this.carregarJogos();
  }

  carregarJogos(): void {
    this.jogoService.getJogos().subscribe({
      next: (jogos) => {
        // Quando os dados chegarem, armazenamos no array local
        this.listaJogos = jogos;
        console.log('Dados dos jogos carregados:', this.listaJogos);
      },
      error: (erro) => {
        console.error('Erro ao carregar jogos:', erro);
        // Implemente uma lógica de erro, como mostrar uma mensagem para o usuário
      }
    });
  }
}