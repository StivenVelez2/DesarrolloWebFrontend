import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '@core/models/config';
import { User } from '@core/models/user';
import * as jwt from "jwt-decode";
import { BehaviorSubject, Observable } from 'rxjs';

// inyectable es un decorador que marca una clase como disponible para la inyección de dependencias
@Injectable({
  providedIn: 'root',
})
// AuthService es una clase que implementa la lógica de autenticación y autorización de usuarios
export class AuthService {

  urlBaseServices: string = URL_SERVICIOS;

  public get currentUserValue(): User{
    return this.currentUserSubject.value;
  }

  private readonly currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  // El constructor de la clase AuthService inyecta HttpClient y Router para realizar solicitudes HTTP y navegar entre rutas respectivamente.
  constructor(private readonly http: HttpClient, private readonly router: Router) {
  this.currentUserSubject = new BehaviorSubject<User>({} as User); // o null, dependiendo del tipo
  this.currentUser = this.currentUserSubject.asObservable();
}

  
  // Este método se encarga de autenticar al usuario mediante una solicitud HTTP POST a un endpoint específico.
  login(email: string, password: string): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/auth/login`;
    return this.http.post<any>(endpoint, { email, password });
  }

  // Este método se encarga de verificar si el usuario está autenticado o no.
  isAuthenticated(): boolean {
    const accessToken = sessionStorage.getItem('accessToken');
    return accessToken !== null;
  }

  // Este método se encarga de obtener el token de acceso almacenado en el sessionStorage y decodificarlo para obtener la información del usuario.
  getAuthFromSessionStorage(): any {
    try {
      const lsValue = sessionStorage.getItem('accessToken');
      if (!lsValue) {
        return undefined;
      }
      const decodedToken: any = jwt.jwtDecode(lsValue);

      return decodedToken;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // Este método se encarga de obtener el token de acceso almacenado en el sessionStorage.
  setToken(token: string): void {
  sessionStorage.setItem('accessToken', token);
}

  logout(): void {
  sessionStorage.removeItem('accessToken');
  this.router.navigate(['/authentication/signin']);
}


  getRoleInfoByToken(): { roleId: number, roleName: string } | undefined { // Es el nombre del método. Su objetivo es devolver información del rol del usuario (ID y nombre) que ha sido autenticado.
    // Indica que el método devolverá un objeto con dos propiedades (roleId y roleName) o undefined si ocurre algún problema (como error o rol no reconocido).
        try {
          const decodedToken: any = this.getAuthFromSessionStorage(); // Llama al método getAuthFromSessionStorage() que probablemente obtiene y decodifica el token de sesión del usuario (como un JWT o un objeto de datos). El resultado se guarda en decodedToken.
          const roleId = decodedToken.rol_id; // Extrae el rol_id desde el token decodificado y lo asigna a la variable roleId.
          let roleName = '';  // Declara una variable para almacenar el nombre del rol que se asignará dependiendo del roleId.
    
          if (roleId === 1) {  // Evalúa el roleId: Si es 1, se considera Administrador. Si es 2, se considera Usuario. Si no es ninguno de esos dos, retorna undefined porque no reconoce el rol.
            roleName = 'Administrador';
          } else if (roleId === 2) {
            roleName = 'Usuario';
          } else {
            return undefined;
          }
    
          return { roleId, roleName }; //Si el roleId fue válido (1 o 2), devuelve un objeto con roleId y roleName.
        } catch (error) { // Si algo sale mal (por ejemplo, el token no existe o no se puede decodificar), se captura el error. Se imprime el error en la consola y el método retorna undefined.
          console.error(error);
          return undefined;
        }
      }

}
