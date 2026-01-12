import { Route } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export function getPlatformRoutes(): Route[] {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return isMobile
      ? [
          {
            path: '',
            loadChildren: () =>
              import('@negocio/features/feature-editor-shell').then((m) => m.AntoShellRoutingMobileModule),
          },
          { path: '**', redirectTo: '' },
        ]
      : [
          {
            path: '',
            loadChildren: () =>
              import('@negocio/features/feature-editor-shell').then((m) => m.AntoShellRoutingDesktopModule),
          },
          { path: '**', redirectTo: '' },
        ];
  }

  // En SSR devuelve por defecto desktop o lo que quieras
  return [
    {
      path: '',
      loadChildren: () =>
        import('@negocio/features/feature-editor-shell').then((m) => m.AntoShellRoutingDesktopModule),
    },
    { path: '**', redirectTo: '' },
  ];
}
