import { Route } from '@angular/router';
import { UsersComponent } from './users/users/users.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from 'app/pages/projects-detail/projects-detail.component';
import { AdminGuard } from '@core/guard/admin.guard';

//este archivo contiene las rutas de la aplicación
//las rutas son las direcciones URL que se utilizan para navegar por la aplicación
export const PAGES_ROUTE: Route[] = [
  {
    //esta es la ruta de los usuarios
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard]
  },
  /*{
    //esta es la ruta de los proyectos
    path: 'projects',
    component: ProjectsComponent
  },
  {
    //esta es la ruta de los detalles de los proyectos
    path: 'projects/detail/:id',
    component: ProjectDetailComponent
  }*/
];
