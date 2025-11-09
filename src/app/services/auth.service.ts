import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSubject.next(loggedIn);
  }

  public login(): void {
    localStorage.setItem('isLoggedIn', 'true');
    this.isAuthenticatedSubject.next(true);
  }

  public logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isAuthenticatedSubject.next(false);
  }

  public isUserAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}