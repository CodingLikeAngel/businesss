import { Route } from '@angular/router';
import { ShellRedirectComponent } from './shell-redirect.component';

export const appRoutes: Route[] = [
    {
      path: '',
      component: ShellRedirectComponent, // lógica de redirección aquí
    },
    {
      path: 'mobile',
      loadChildren: () =>
        import('@negocio/features/feature-editor-shell').then((m) => m.AntoShellRoutingMobileModule),
    },
    {
      path: 'desktop',
      loadChildren: () =>
        import('@negocio/features/feature-editor-shell').then((m) => m.AntoShellRoutingDesktopModule),
    },
    {
        path: 'about',
        loadChildren: () =>
          import('@negocio/featured-components').then((m) => m.AboutShellRoutingMobileModule),
      },
   
      {
        path: 'contact',
        loadChildren: () =>
          import('@negocio/featured-components').then((m) => m.ContactShellRoutingMobileModule),
      },


    { path: '**', redirectTo: '' },
  ];
  