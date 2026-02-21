import { Component, HostListener, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  UIFooterComponent,
  UIHeaderComponent,
} from '@negocio/ui-components';
import { VariantSelectorComponent, TemplateSelectorComponent, ExporterService, DownloadService } from '@negocio/shared-components';
import { CommonModule } from '@angular/common';
import { MainLayoutBaseComponent } from '../main-layout-base.component';

import { EditorHeaderSectionComponent } from '../../editor/components/header/editor-header-section.component';
import { EditorFooterSectionComponent } from '../../editor/components/footer/editor-footer-section.component';
import { SUPPORTED_SECTION_TYPES } from '../../editor/components/section-renderer/section-type-registry';
import { AICopilotComponent } from '../../../components/ai-copilot/ai-copilot.component';
import { LayoutComponentPickerModalComponent } from '../../editor/components/layout-section/layout-component-picker-modal.component';
import { Store } from '@ngrx/store';
import * as PageActions from '../../../store/actions/page.actions';
import * as PageSelectors from '../../../store/selectors/page.selectors';
import { map, delay } from 'rxjs';

@Component({
  selector: 'lib-main-desktop-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EditorHeaderSectionComponent,
    VariantSelectorComponent,
    TemplateSelectorComponent,
    EditorFooterSectionComponent,
    AICopilotComponent,
    LayoutComponentPickerModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main-desktop-layout.component.html',
  styleUrl: './main-desktop-layout.component.scss',
})
export class MainDesktopLayoutComponent extends MainLayoutBaseComponent {
  isSidebarCollapsed = false;
  sidebarWidth = 400;
  isResizing = false;

  /** For 3.3: types with dedicated editor view, passed to Bloques so non-supported show "Vista genérica". */
  supportedSectionTypes = Array.from(SUPPORTED_SECTION_TYPES);

  private store = inject(Store);
  private exporter = inject(ExporterService);
  private downloadService = inject(DownloadService);

  saving$ = this.store.select(PageSelectors.selectPageSaving).pipe(delay(0));
  hasUnsavedChanges$ = this.store.select(PageSelectors.selectHasUnsavedChanges).pipe(delay(0));
  lastSaved$ = this.store.select(PageSelectors.selectLastSaved).pipe(delay(0));
  
  exportGlobalStyles$ = this.store.select(PageSelectors.selectCurrentPage).pipe(
    map((page: any) => page?.globalStyles || {})
  );

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (this.builderStep === 'editor') {
        this.store.dispatch(PageActions.savePage());
      }
    }
  }

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
    this.publishProject();
  }

  /** Genera ZIP (HTML/CSS/Assets) y descarga. Flujo "Publicar" del plan de mejoras. */
  async publishProject() {
    try {
      const config = this.variantService.getFullConfig();
      const blob = await this.exporter.exportProject(config);
      const name = `antostudios-${new Date().toISOString().slice(0, 10)}.zip`;
      this.downloadService.download(blob, name);
    } catch (e) {
      console.error('Error al publicar:', e);
    }
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
      if (step === 'preview' && typeof document !== 'undefined') {
        document.body.classList.remove('isolated-mode-active');
      }
    });

    // Fix NG0100: Set background properties via CSS variables
    this.exportGlobalStyles$.subscribe((styles: any) => {
      if (typeof document === 'undefined') return;
      
      const root = document.documentElement;
      
      // Base Background
      root.style.setProperty('--page-bg', styles.backgroundColor || '#0a0a0b');
      
      // Image
      if (styles.backgroundImage) {
        root.style.setProperty('--page-bg-image', styles.backgroundImage.startsWith('url') ? styles.backgroundImage : `url(${styles.backgroundImage})`);
        root.style.setProperty('--page-bg-size', styles.backgroundSize || 'cover');
        root.style.setProperty('--page-bg-attachment', styles.backgroundAttachment || 'scroll');
      } else {
        root.style.setProperty('--page-bg-image', 'none');
      }

      // Pattern
      const patternType = styles.patternType || 'none';
      root.style.setProperty('--pattern-opacity', styles.patternOpacity || '0.05');
      
      let patternImage = 'none';
      let patternSize = 'auto';

      if (patternType === 'stripes') {
        patternImage = 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,1) 10px, rgba(255,255,255,1) 11px)';
      } else if (patternType === 'dots') {
        patternImage = 'radial-gradient(rgba(255,255,255,1) 1px, transparent 0)';
        patternSize = '24px 24px';
      } else if (patternType === 'grid') {
        patternImage = 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)';
        patternSize = '40px 40px';
      }

      root.style.setProperty('--pattern-image', patternImage);
      root.style.setProperty('--pattern-size', patternSize);
    });
  }

  override returnToEditor() {
    this.variantService.setBuilderStep('editor');
  }

  onTemplateApplied() {
    console.log('Template applied successfully');
  }
}