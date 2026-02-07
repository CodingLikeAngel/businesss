import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { ReservationFormComponent } from '@negocio/featured-components';
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
    // Initial height check
    const formStyles = this.section.content['formStyles'] || {};
    if (formStyles.top && formStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(formStyles.left) || 0,
        y: parseInt(formStyles.top),
        width: parseInt(formStyles.width) || 500,
        height: parseInt(formStyles.height) || 600
      });
    }

    if (this.formElement) {
       this.applyElementVisualEditing(this.formElement, this.section.id + '_form_wrapper');
    }
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section');
  }

  getFormWrapperConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5
      }
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleFormWrapperEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_form_wrapper');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_form_wrapper') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateFormStyles(event.bounds);
      }
    }
  }

  private updateFormStyles(bounds: any): void {
    const currentStyles = this.section.content['formStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute',
      width: bounds.width + 'px',
      height: bounds.height + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px'
    };

    if (JSON.stringify(currentStyles) !== JSON.stringify(newStyles)) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          formStyles: newStyles,
          customStyles: newStyles
        }
      });

      this.autoExpandSectionHeight(bounds);
    }
  }
}
