import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { ReservationFormComponent } from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Editor Reservation Form Section Component
 * Wrapper for visual editing of the structured reservation form.
 */
@Component({
  selector: 'lib-editor-reservation-form-section',
  standalone: true,
  imports: [
    CommonModule,
    ReservationFormComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-reservation-form-section.component.html'
})
export class EditorReservationFormSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('formElement', { static: true }) formElement!: ElementRef;

  ngDoCheck() {
    // Sincronización básica si se edita desde el panel
  }

  ngAfterViewInit() {
    // Aplicar edición visual técnica
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.formElement, this.section.id + '_form_wrapper');
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

  getFormWrapperConfig(): VisualEditingConfig {
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

  handleFormWrapperEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_form_wrapper');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_form_wrapper' || elementId === this.section.id) {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateFormStyles(event.bounds);
      }
    }
  }

  private updateFormStyles(bounds: any): void {
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
