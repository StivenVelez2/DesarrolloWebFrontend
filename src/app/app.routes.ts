import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {

        // esta es la ruta de la página principal
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
      },
      {

        // esta es la ruta de los usuarios
        path: 'page',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PAGES_ROUTE),
      },
    ],
  },
  {
    // esta es la ruta de la página de inicio
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  },
];
