import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  UIFooterComponent,
  UIHeaderComponent,
  UINavBarComponent,
  UITabsComponent,
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
    UITabsComponent
  ],
  templateUrl: './main-desktop-layout.component.html',
  styleUrl: './main-desktop-layout.component.scss',
})
export class MainDesktopLayoutComponent extends MainLayoutBaseComponent {

  tabsConfig: any[] = [
    { label: 'Servicios', sectionId: 'servicios', icon: '🛠️' },
    { label: 'Productos', sectionId: 'productos', icon: '🧩' },
    { label: 'Precios', sectionId: 'precios', icon: '💰' },
    { label: 'Promociones', sectionId: 'promociones', icon: '🎁' },
    { label: 'FAQ', sectionId: 'faq', icon: '❓' },
    { label: 'Galería', sectionId: 'galeria', icon: '🖼️' },
    // { label: 'Contacto', sectionId: 'contacto', icon: '📞' },
  ];
  
  openWhatsApp() {
    throw new Error('Method not implemented.');
  }

  navigateToHome() {
    throw new Error('Method not implemented.');
  }

  callNow() {
    throw new Error('Method not implemented.');
  }

  onTabSelected(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  onNavItemClick(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  returnToEditor() {
    this.variantService.setBuilderStep('editor');
  }

}