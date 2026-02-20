import { Component, Input, ElementRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GalleryConfig,
  TitleConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { UIGallerySectionComponent } from '@negocio/featured-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorGalleryIsolatedModeComponent } from './editor-gallery-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

/**
 * Enhanced Editor Gallery Section Component
 * Modernized for granular store synchronization and visual editing.
 */
@Component({
  selector: 'lib-editor-gallery-section',
  standalone: true,
  imports: [
    CommonModule,
    UIGallerySectionComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorGalleryIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-gallery-section.component.html'
})
export class EditorGallerySectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @Input() galleryConfig?: GalleryConfig;
  @Input() titleConfig?: TitleConfig;

  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('galleryElement', { static: true }) galleryElement!: ElementRef;

  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  /** Default images so preview always shows something when no items/config. */
  private static readonly DEFAULT_IMAGES = [
    { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', alt: 'Proyecto 1' },
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', alt: 'Proyecto 2' },
    { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', alt: 'Proyecto 3' },
    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', alt: 'Proyecto 4' }
  ];

  getGalleryImages(): { src: string; alt: string; category?: string }[] {
    const items = this.section?.content?.['items'];
    if (items && Array.isArray(items) && items.length > 0) return items;
    const configImages = this.galleryConfig?.images;
    if (configImages && Array.isArray(configImages) && configImages.length > 0) return configImages;
    return EditorGallerySectionComponent.DEFAULT_IMAGES;
  }

  ngDoCheck() {
    // Sincronización de imágenes individuales si se editan desde el panel lateral
    const selected = this.uiStateService.selectedElement;
    if (selected && selected.sectionId === this.section.id && selected.isItem && selected.index !== undefined) {
       const items = this.section.content['items'];
       if (items && items[selected.index] && items[selected.index] !== selected.content) {
           const newItems = [...items];
           newItems[selected.index] = selected.content;
           
           this.variantService.updateSectionInCurrentPage(this.section.id, {
             content: {
               ...this.section.content,
               items: newItems
             }
           });
       }
    }
  }

  ngAfterViewInit() {
    // Inicializar items si no existen en el store (migración)
    if (!this.section.content['items'] && this.galleryConfig?.images) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          items: JSON.parse(JSON.stringify(this.galleryConfig.images))
        }
      });
    }

    // Aplicar edición visual técnica
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.galleryElement, this.section.id + '_gallery_wrapper');
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  getGalleryWrapperConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleGalleryWrapperEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_gallery_wrapper');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id || elementId === this.section.id + '_gallery_wrapper') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateGalleryStyles(event.bounds);
      }
    }
  }

  private updateGalleryStyles(bounds: any): void {
    const currentStyles = this.section.styles || {};
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      styles: {
        ...currentStyles,
        width: bounds.width + 'px',
        height: bounds.height + 'px',
        transform: `translate(${bounds.x}px, ${bounds.y}px)`
      }
    });
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_gallery_wrapper',
      type: 'gallery',
      content: { ...this.section.content },
      styles: { ...this.section.styles },
      position: { x: 0, y: 0 },
      size: { width: 800, height: 600 }
    };
    if (typeof document !== 'undefined') document.body.classList.add('isolated-mode-active');
    this.showIsolatedMode = true;
  }

  onIsolatedModeClosed(): void {
    if (typeof document !== 'undefined') document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: { ...this.section.content, ...config.content },
      styles: { ...this.section.styles, ...config.styles }
    });
    if (typeof document !== 'undefined') document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
  }
}
