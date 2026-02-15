import { Component, HostListener, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  UIFooterComponent,
  UIHeaderComponent,
} from '@negocio/ui-components';
import { VariantSelectorComponent, TemplateSelectorComponent } from '@negocio/shared-components';
import { CommonModule } from '@angular/common';
import { MainLayoutBaseComponent } from '../main-layout-base.component';

import { EditorHeaderSectionComponent } from '../../editor/components/header/editor-header-section.component';
import { EditorFooterSectionComponent } from '../../editor/components/footer/editor-footer-section.component';
import { Store } from '@ngrx/store';
import * as PageSelectors from '../../../store/selectors/page.selectors';
import { map } from 'rxjs';

@Component({
  selector: 'lib-main-desktop-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EditorHeaderSectionComponent,
    VariantSelectorComponent,
    TemplateSelectorComponent,
    EditorFooterSectionComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main-desktop-layout.component.html',
  styleUrl: './main-desktop-layout.component.scss',
})
export class MainDesktopLayoutComponent extends MainLayoutBaseComponent {
  isSidebarCollapsed = false;
  sidebarWidth = 400;
  isResizing = false;

  private store = inject(Store);
  
  backgroundColor$ = this.store.select(PageSelectors.selectCurrentPage).pipe(
    map((page: any) => page?.globalStyles?.backgroundColor || '')
  );

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    const newWidth = event.clientX;
    if (newWidth >= 360 && newWidth <= 800) {
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

  override callNow() {
    console.log('Opening contact form or call action...');
    this.scrollToSection('contacto');
  }


  override onTabSelected(sectionId: string | Event) {
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

  override ngOnInit() {
    super.ngOnInit();
    
    // Failsafe: Ensure isolated-mode-active is removed when switching to preview
    this.variantService.builderStep$.subscribe(step => {
      if (step === 'preview') {
        document.body.classList.remove('isolated-mode-active');
      }
    });
  }

  override returnToEditor() {
    this.variantService.setBuilderStep('editor');
  }

  onTemplateApplied() {
    console.log('Template applied successfully');
  }
}