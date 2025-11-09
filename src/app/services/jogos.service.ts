import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Jogos } from '../models/jogos.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JogoService { 
  
  private readonly apiUrl: string = `${environment.apiUrl}/jogos`;
  
  constructor(private httpClient: HttpClient) { }

  public getJogos(): Observable<Jogos[]> {
    // O backend retorna documentos MongoDB com _id; mapeamos para 'id' para manter compatibilidade com o front
    return this.httpClient.get<any[]>(this.apiUrl).pipe(
      map(arr => arr.map(j => ({ ...j, id: j._id || j.id })) as Jogos[])
    );
  }

  public cadastrarJogo(jogo: Jogos): Observable<Jogos> {
    return this.httpClient.post<any>(this.apiUrl, jogo).pipe(
      map(j => ({ ...j, id: j._id || j.id } as Jogos))
    );
  }

  public getJogo(id: string): Observable<Jogos> {
    const urlListarUm = `${this.apiUrl}/${id}`;
    return this.httpClient.get<any>(urlListarUm).pipe(
      map(j => ({ ...j, id: j._id || j.id } as Jogos))
    );
  }
  
  public atualizarJogo(id: string, jogo: Jogos): Observable<Jogos> {
    const urlAtualizar = `${this.apiUrl}/${id}`;
    return this.httpClient.put<any>(urlAtualizar, jogo).pipe(
      map(j => ({ ...j, id: j._id || j.id } as Jogos))
    );
  }

  public excluirJogo(id: string): Observable<any> {
    const urlExcluir = `${this.apiUrl}/${id}`;
    return this.httpClient.delete<any>(urlExcluir);
  }
}