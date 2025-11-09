import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly apiUrl: string = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  public cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, usuario);
  }

  public buscarUsuarioPorCredenciais(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, senha });
  }

  public buscarUsuarioPorEmail(email: string): Observable<Usuario[]> {
   return this.http.post<Usuario[]>(`${this.apiUrl}/check-email`, { email });
  }
}
  
