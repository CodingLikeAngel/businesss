import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  UIFooterComponent,
  UIHeaderComponent,
  UINavBarComponent,
} from '@negocio/ui-components';
import { VariantSelectorComponent } from '@negocio/shared-components';
import { CommonModule } from '@angular/common';
import { MainLayoutBaseComponent } from '../main-layout-base.component';

@Component({
  selector: 'lib-main-desktop-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UIHeaderComponent,
    VariantSelectorComponent,
    UIFooterComponent,
    UINavBarComponent,
  ],
  templateUrl: './main-desktop-layout.component.html',
  styleUrl: './main-desktop-layout.component.scss',
})
export class MainDesktopLayoutComponent extends MainLayoutBaseComponent {
  isLandingPage: any;

  openWhatsApp() {
    throw new Error('Method not implemented.');
  }

  navigateToHome() {
    throw new Error('Method not implemented.');
  }

  callNow() {
    throw new Error('Method not implemented.');
  }

  scrollToSection($event: string) {
    console.warn(`Scroll to section ${$event} not implemented`);
  }
}