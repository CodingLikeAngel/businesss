import { Component, ElementRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIFooterComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Footer Section Component
 * Modernized for visual editing persistence and standardized store sync.
 */
@Component({
  selector: 'lib-editor-footer-section',
  standalone: true,
  imports: [
    CommonModule,
    UIFooterComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-footer-section.component.html'
})
export class EditorFooterSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('footerElement', { static: true }) footerElement!: ElementRef;

  ngDoCheck() {
    // Sincronización básica del elemento footer si se edita desde el panel
    const selected = this.uiStateService.selectedElement;
    if (selected && selected.sectionId === this.section.id && selected.id === this.section.id + '_footer') {
       // El ContentEditorComponent ya actualiza el objeto content via binding
       // pero aquí podríamos forzar actualizaciones de propiedades anidadas si fuera necesario.
    }
  }

  ngAfterViewInit() {
    // Aplicar edición visual técnica
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.footerElement, this.section.id + '_footer');
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        resizeHandles: true,
        dimensionLabels: true
      }
    });
  }

  getFooterConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      }
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleFooterEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_footer');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_footer' || elementId === this.section.id) {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateFooterStyles(event.bounds);
      }
    }
  }

  private updateFooterStyles(bounds: any): void {
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
