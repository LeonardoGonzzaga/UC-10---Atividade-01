import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Jogos } from '../models/jogos.models'; 

@Injectable({
  providedIn: 'root',
})
export class JogoService { 
  
  private readonly apiUrl: string = 'http://localhost:3000/jogos'; 
  
  constructor(private httpClient: HttpClient) { }

  public getJogos(): Observable<Jogos[]> {
    return this.httpClient.get<Jogos[]>(this.apiUrl);
  }

  public cadastrarJogo(jogo: Jogos): Observable<Jogos> {
    return this.httpClient.post<Jogos>(this.apiUrl, jogo); 
  }

  public getJogo(id: number): Observable<Jogos[]> { 
    const urlListarUm = `${this.apiUrl}?id=${id}`;
    return this.httpClient.get<Jogos[]>(urlListarUm);
  }
  
  public atualizarJogo(id: number, jogo: Jogos): Observable<Jogos> { 
    const urlAtualizar = `${this.apiUrl}/${id}`;
    return this.httpClient.put<Jogos>(urlAtualizar, jogo); 
  }

  public excluirJogo(id: number): Observable<any> { 
    const urlExcluir = `${this.apiUrl}/${id}`;
    return this.httpClient.delete<any>(urlExcluir);
  }
}