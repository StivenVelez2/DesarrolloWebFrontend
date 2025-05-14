import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_SERVICIOS } from '@core/models/config';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private urlBaseServices: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) {}

  // Crear un nuevo proyecto
  createProject(projectData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/create`;
    return this.http.post<any>(endpoint, projectData);
  }

  // Actualizar un proyecto existente
  updateProject(projectId: number, projectData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/update/${projectId}`;
    return this.http.put<any>(endpoint, projectData);
  }

  // Obtener todos los proyectos
  getAllProjects(): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects`;
    return this.http.get<any>(endpoint);
  }

  // Eliminar un proyecto
  deleteProject(projectId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/delete/${projectId}`;
    return this.http.delete<any>(endpoint);
  }

  // Obtener administradores para asignar a proyectos
  getAllAdministrators(): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/rol/1`;
    return this.http.get<any>(endpoint);
  }

  // Obtener detalles de un proyecto por su ID
  getProjectById(projectId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}`;
    return this.http.get<any>(endpoint);
  }

  // Obtener usuarios asignados a un proyecto
  getUsersByProject(projectId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}/users`;
    return this.http.get<any>(endpoint);
  }

  // Asignar un usuario a un proyecto
  assignUserToProject(projectId: number, userId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}/assign-user`;
    return this.http.post<any>(endpoint, { userId });
  }

  // Eliminar un usuario de un proyecto
  removeUserFromProject(projectId: number, userId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}/remove-user/${userId}`;
    return this.http.delete<any>(endpoint);
  }
}
