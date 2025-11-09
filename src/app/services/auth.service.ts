import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string>('');
  public userName$: Observable<string> = this.userNameSubject.asObservable();

  constructor() {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSubject.next(loggedIn);
    if (loggedIn) {
      const userName = localStorage.getItem('userName') || '';
      const firstName = this.getFirstName(userName);
      this.userNameSubject.next(firstName);
    }
  }

  private getFirstName(fullName: string): string {
    return fullName.split(' ')[0];
  }

  public login(userName: string): void {
    const firstName = this.getFirstName(userName);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', firstName);
    this.isAuthenticatedSubject.next(true);
    this.userNameSubject.next(firstName);
  }

  public logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    this.isAuthenticatedSubject.next(false);
    this.userNameSubject.next('');
  }

  public isUserAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}