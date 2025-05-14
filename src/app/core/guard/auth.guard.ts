import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

// inyectable es un decorador que marca una clase como disponible para la inyección de dependencias
@Injectable({
  providedIn: 'root',
})
// AuthGuard es una clase que implementa la lógica de protección de rutas
export class AuthGuard  {
  constructor(private readonly authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.isAuthenticated();
    if (currentUser) {
      return true;
    }

    // est
    this.authService.logout();
    return false;
  }
}
