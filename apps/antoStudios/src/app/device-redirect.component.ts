import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID, REQUEST } from '@angular/core';
import { Router } from '@angular/router';

import { UISpinnerComponent } from '@negocio/ui-components';

@Component({
  standalone: true,
  imports: [UISpinnerComponent],
  template: `<lib-ui-spinner></lib-ui-spinner>`,
})
export class DeviceRedirectComponent implements OnInit {
  private router = inject(Router);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(REQUEST) private request?: any // Inyecta el request para SSR (opcional, solo en servidor)
  ) {}

  ngOnInit(): void {
    const base = this.router.url.split('/')[1] || 'home'; // home, about, etc.
    let isMobile = false;

    if (isPlatformBrowser(this.platformId)) {
      // En el cliente, usa window.innerWidth
      isMobile = window.innerWidth <= 768;
    } else if (isPlatformServer(this.platformId) && this.request) {
      // En el servidor, usa user-agent
      const userAgent = this.request.headers['user-agent'] || '';
      isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    }

    // Redirige a la ruta correcta
    this.router.navigate([`/${base}/${isMobile ? 'mobile' : 'desktop'}`]);
  }
}