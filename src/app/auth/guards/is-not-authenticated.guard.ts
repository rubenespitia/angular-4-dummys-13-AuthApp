import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

export const isNotAuthenticateGuard: CanActivateFn = (route, state) => {


  /*const url = state.url;
  localStorage.setItem('url',url);*/

  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.authStatus() === AuthStatus.authenticated){
    router.navigateByUrl('dashboard');
    return false;
  };

  return true;
};
