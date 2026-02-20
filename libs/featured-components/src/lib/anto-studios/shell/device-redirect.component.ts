import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UISpinnerComponent } from '@negocio/ui-components';

@Component({
    imports : [UISpinnerComponent],
  selector: 'lib-device-redirect',
  standalone: true,
  template: `<lib-ui-components-spinner></lib-ui-components-spinner>`,
})
export class DeviceRedirectComponent implements OnInit {
  private router = inject(Router);



  constructor(@Inject(PLATFORM_ID) private platformId: object) {

}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    const isMobile = window.innerWidth <= 768;
    const base = this.router.url.split('/')[1] || 'home'; // home, contact, about...
    this.router.navigate([`/${base}/${isMobile ? 'mobile' : 'desktop'}`]);
  }
}
}