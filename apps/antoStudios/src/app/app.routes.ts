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
        import('@negocio/features/feature-home-shell').then((m) => m.AntoShellRoutingMobileModule),
    },
    {
      path: 'desktop',
      loadChildren: () =>
        import('@negocio/features/feature-home-shell').then((m) => m.AntoShellRoutingDesktopModule),
    },
    {
        path: 'about',
        loadChildren: () =>
          import('@negocio/features/feature-about-shell').then((m) => m.AboutShellRoutingMobileModule),
      },
   
      {
        path: 'contact',
        loadChildren: () =>
          import('@negocio/features/feature-contact-shell').then((m) => m.ContactShellRoutingMobileModule),
      },


    { path: '**', redirectTo: '' },
  ];
  