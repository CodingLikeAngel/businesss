import { Component, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  UIFooterComponent,
  UIHeaderComponent,
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
    UIFooterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main-desktop-layout.component.html',
  styleUrl: './main-desktop-layout.component.scss',
})
export class MainDesktopLayoutComponent extends MainLayoutBaseComponent {
  isSidebarCollapsed = false;
  sidebarWidth = 450;
  isResizing = false;

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    const newWidth = event.clientX;
    if (newWidth >= 300 && newWidth <= 800) {
      this.sidebarWidth = newWidth;
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isResizing = false;
    document.body.style.cursor = 'default';
    document.body.classList.remove('is-resizing-active');
  }

  startResizing(event: MouseEvent) {
    event.preventDefault();
    this.isResizing = true;
    document.body.style.cursor = 'col-resize';
    document.body.classList.add('is-resizing-active');
  }

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
    console.log('Opening contact form or call action...');
    this.scrollToSection('contacto');
  }

  onWorkspaceClick(event: MouseEvent) {
    // This could be used to deselect current item in the future
    console.log('Workspace clicked');
  }

  onTabSelected(sectionId: string | Event) {
    const id = typeof sectionId === 'string' ? sectionId : (sectionId as any).target?.value || sectionId;
    if (typeof id === 'string') {
      this.scrollToSection(id);
    }
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