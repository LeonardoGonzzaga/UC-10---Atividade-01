import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Jogos } from '../models/jogos.models';

@Injectable({
  providedIn: 'root',
})
export class JogoService { 
  
  private readonly apiUrl: string;
  
  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_API_URL') baseApiUrl: string
  ) {
    this.apiUrl = `${baseApiUrl}/jogos`;
  }

  public getJogos(): Observable<Jogos[]> {
    // O backend retorna documentos MongoDB com _id; mapeamos para 'id' para manter compatibilidade com o front
    return this.httpClient.get<any[]>(this.apiUrl).pipe(
      map(arr => arr.map(j => ({ ...j, id: j._id || j.id })) as Jogos[])
    );
  }

  // NOVO MÉTODO: Chama o endpoint de busca da API
  public searchJogos(query: string): Observable<Jogos[]> {
    if (!query || query.trim() === '') {
        return new Observable(observer => {
            observer.next([]); // Retorna array vazio se a query for vazia
            observer.complete();
        });
    }

    const urlSearch = `${this.apiUrl}/search`;
    const params = new HttpParams().set('q', query.trim()); // Adiciona q=termo na URL
    
    return this.httpClient.get<any[]>(urlSearch, { params }).pipe(
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

  public avaliarJogo(id: string, positiva: boolean): Observable<Jogos> {
    const urlAvaliar = `${this.apiUrl}/${id}/avaliacao`;
    return this.httpClient.post<any>(urlAvaliar, { positiva }).pipe(
      map(j => ({ ...j, id: j._id || j.id } as Jogos))
    );
  }
}