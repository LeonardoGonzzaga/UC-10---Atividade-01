import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly apiUrl: string = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) { }

  public cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  public buscarUsuarioPorCredenciais(email: string, senha: string): Observable<Usuario[]> {
    const url = `${this.apiUrl}?email=${email}&senha=${senha}`;
    return this.http.get<Usuario[]>(url);
  }

  public buscarUsuarioPorEmail(email: string): Observable<Usuario[]> {
    const url = `${this.apiUrl}?email=${email}`;
    return this.http.get<Usuario[]>(url);
  }
}
  
