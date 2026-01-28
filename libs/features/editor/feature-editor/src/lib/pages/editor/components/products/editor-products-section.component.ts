import { Component, Input, ElementRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ProductsConfig,
  TitleConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  ProductsSectionComponent
} from '@negocio/featured-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Products Section Component
 * Modernized for granular store synchronization and visual editing persistence.
 */
@Component({
  selector: 'lib-editor-products-section',
  standalone: true,
  imports: [
    CommonModule,
    ProductsSectionComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-products-section.component.html'
})
export class EditorProductsSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @Input() productsConfig!: ProductsConfig;
  @Input() titleConfig!: TitleConfig;

  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('productsElement', { static: true }) productsElement!: ElementRef;

  ngDoCheck() {
    // Sincronización de items individuales (productos) si se editan desde el panel lateral
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
    // Inicializar items si no existen en el store
    if (!this.section.content['items'] && this.productsConfig?.items) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          items: JSON.parse(JSON.stringify(this.productsConfig.items))
        }
      });
    }

    // Aplicar edición visual técnica
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.productsElement, this.section.id + '_products_wrapper');
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

  getProductsWrapperConfig(): VisualEditingConfig {
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

  handleProductsWrapperEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_products_wrapper');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id || elementId === this.section.id + '_products_wrapper') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateProductsStyles(event.bounds);
      }
    }
  }

  private updateProductsStyles(bounds: any): void {
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
}
