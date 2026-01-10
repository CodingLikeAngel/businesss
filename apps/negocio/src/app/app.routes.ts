import { Route } from '@angular/router';

export const appRoutes: Route[] = [

  {
    path: '',
    loadChildren: () =>
      import('@negocio/featured-components').then((m) => m.ShellRoutingModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];