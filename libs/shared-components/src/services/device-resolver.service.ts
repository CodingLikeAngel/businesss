import { Injectable, Inject, PLATFORM_ID, inject, REQUEST } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { Request } from 'express';
import { LoadingService } from './loading-service.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceResolver implements Resolve<null> {
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(REQUEST) private request?: Request,
   
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<null> {
    this.loadingService.show();

    let resolvedDevice: string;
    if (isPlatformBrowser(this.platformId)) {
      resolvedDevice = window.innerWidth <= 768 ? 'mobile' : 'desktop';
    } else {
      const userAgent = this.request?.headers['user-agent']?.toLowerCase() || '';
      resolvedDevice = /mobile|android|iphone|ipad|tablet/i.test(userAgent) ? 'mobile' : 'desktop';
    }

    const basePath = route.routeConfig?.path || 'home';
    const currentUrl = state.url.endsWith('/') ? state.url : state.url + '/';

    if (!currentUrl.includes(`/${resolvedDevice}`)) {
      this.router.navigate([`/${basePath}/${resolvedDevice}`]);
    }

    // Ocultar loading después de un tiempo mínimo para que se vea (opcional)
    setTimeout(() => this.loadingService.hide(), 300); // 300ms

   
  if (!currentUrl.includes(`/${resolvedDevice}`)) {
    setTimeout(() => {
      this.loadingService.show();
      this.router.navigate([`/${basePath}/${resolvedDevice}`]);
    }, 0);
  } else {
    this.loadingService.hide();
  }

  return of(null);
  }

}