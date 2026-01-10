// device.guard.ts
import { Injectable, Inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Request } from 'express';

@Injectable({
  providedIn: 'root',
})
export class DeviceGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(REQUEST) private request?: Request
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let resolvedDevice: 'mobile' | 'desktop';

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
      return false;
    }

    return true;
  }
}
