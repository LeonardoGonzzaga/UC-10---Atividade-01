import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private readonly apiUrl: string;

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_API_URL') baseApiUrl: string
  ) {
    this.apiUrl = `${baseApiUrl}/comentarios`;
  }

  public getComentariosPorJogo(jogoId: string): Observable<Comentario[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/${jogoId}`).pipe(

      map(arr => arr.map(c => ({
        ...c,
        _id: c._id || c.id,
        dataCriacao: new Date(c.dataCriacao),
        updatedAt: new Date(c.updatedAt)
      })) as Comentario[])
    );
  }

  public adicionarComentario(comentario: { jogoId: string, usuario: string, texto: string }): Observable<Comentario> {
    return this.httpClient.post<any>(this.apiUrl, comentario).pipe(
      map(c => ({
        ...c,
        _id: c._id || c.id,
        dataCriacao: new Date(c.dataCriacao),
        updatedAt: new Date(c.updatedAt)
      }) as Comentario)
    );
  }

  public atualizarComentario(id: string, novoTexto: string): Observable<Comentario> {
    const urlAtualizar = `${this.apiUrl}/update/${id}`;
    return this.httpClient.put<any>(urlAtualizar, { texto: novoTexto }).pipe(
      map(c => ({
        ...c,
        _id: c._id || c.id,
        dataCriacao: new Date(c.dataCriacao),
        updatedAt: new Date(c.updatedAt)
      }) as Comentario)
    );
  }

  public deletarComentario(id: string): Observable<any> {
    const urlExcluir = `${this.apiUrl}/${id}`;
    return this.httpClient.delete<any>(urlExcluir);
  }
}