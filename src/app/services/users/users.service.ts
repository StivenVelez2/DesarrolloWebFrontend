import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '@core/models/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// UsersService es una clase que representa el servicio de gestión de usuarios
// Este servicio se encarga de realizar operaciones relacionadas con los usuarios en la aplicación
@Injectable()
export class UsersService {
  urlBaseServices: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) {}

  // Método para crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/create`;
    return this.http.post<any>(endpoint, userData);
  }

  // Método para actualizar un usuario existente
  updateUser(userId: number, userData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/update/${userId}`;
    return this.http.put<any>(endpoint, userData);
  }

  // Método para eliminar un usuario existente
  deleteUser(userId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/delete/${userId}`;
    return this.http.delete<any>(endpoint);
  }

  // Método para obtener todos los usuarios administrados por un administrador
  getAllUsersByAdministrator(filters?: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users`;
    const params = new HttpParams({ fromObject: {
      nombre: filters?.name || '',
      email: filters?.email || ''
    }});
    return this.http.get<any>(endpoint, { params });
  }

  // Método para obtener todos los usuarios con rol de administrador
  getAllAdministrator(): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/rol/1`;
    return this.http.get<any>(endpoint);
  }
  
  // Método para obtener todos los usuarios con rol de usuario
  getAllUsers(): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/rol/2`;
    return this.http.get<any>(endpoint);
  }
}
