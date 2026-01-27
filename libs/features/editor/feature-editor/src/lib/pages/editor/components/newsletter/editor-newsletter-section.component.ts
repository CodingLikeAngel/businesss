import { Component, ElementRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UINewsletterSectionComponent,
  UINewsletterMinimalComponent,
  UINewsletterModernComponent,
  UINewsletterCreativeComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Newsletter Section Component
 * Standardized for granular store sync and visual editing.
 */
@Component({
  selector: 'lib-editor-newsletter-section',
  standalone: true,
  imports: [
    CommonModule,
    UINewsletterSectionComponent,
    UINewsletterMinimalComponent,
    UINewsletterModernComponent,
    UINewsletterCreativeComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-newsletter-section.component.html'
})
export class EditorNewsletterSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('newsletterElement', { static: true }) newsletterElement!: ElementRef;

  ngDoCheck() {
    // Sincronización básica de contenido si se edita desde el panel lateral
  }

  ngAfterViewInit() {
    // Aplicar edición visual técnica
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.newsletterElement, this.section.id + '_newsletter_wrapper');
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

  getNewsletterWrapperConfig(): VisualEditingConfig {
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

  handleNewsletterWrapperEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_newsletter_wrapper');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id || elementId === this.section.id + '_newsletter_wrapper') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateNewsletterStyles(event.bounds);
      }
    }
  }

  private updateNewsletterStyles(bounds: any): void {
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

  getNewsletterSubtype(): string {
    return this.section.config?.['subtype'] || 'classic';
  }
}
