import { Component, ElementRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { CTASectionComponent } from '@negocio/featured-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor CTA Section Component
 * Powered by UI library CTA and standardized editing tools.
 */
@Component({
  selector: 'lib-editor-cta-section',
  standalone: true,
  imports: [
    CommonModule,
    CTASectionComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-cta-section.component.html'
})
export class EditorCtaSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('ctaElement', { static: true }) ctaElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;
  @ViewChild('buttonElement', { static: false }) buttonElement?: ElementRef;

  ngDoCheck() {
    // Sincronización básica si se edita desde el panel lateral
  }

  ngAfterViewInit() {
    // Aplicar edición visual técnica
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.ctaElement, this.section.id + '_cta');
    
    if (this.titleElement) {
      this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    }
    if (this.buttonElement) {
      this.applyElementVisualEditing(this.buttonElement, this.section.id + '_button');
    }
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

  getCtaConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  getTitleConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  getButtonConfig(): VisualEditingConfig {
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

  handleCtaEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_cta');
  }

  handleTitleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_title');
  }

  handleButtonEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_button');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (['moved', 'resized'].includes(event.type)) {
      this.updateCtaStyles(event.bounds);
    }
  }

  private updateCtaStyles(bounds: any): void {
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
