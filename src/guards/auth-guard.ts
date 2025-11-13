import { CanActivateFn } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true; // Usuário logado: permite acesso à rota
  } else {
    // Usuário não logado: redireciona para a página de login
    alert('Você precisa estar logado para acessar esta página.');
    return router.createUrlTree(['login']); 
  }
};
