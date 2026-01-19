import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIAccordionComponent,
  UITitleComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Accordion Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-accordion-section',
  standalone: true,
  imports: [
    CommonModule,
    UIAccordionComponent,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-accordion-section.component.html'
})
export class EditorAccordionSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('accordionElement', { static: true }) accordionElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.accordionElement, this.section.id + '_accordion');
    if (this.titleElement) {
      this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    }
  }

  /**
   * Get configuration for the section container
   */
  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      constraints: {
        containment: 'parent',
        minDistance: { top: 10, right: 10, bottom: 10, left: 10 },
        collisionDetection: false,
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        dimensionLabels: true,
        resizeHandles: true
      },
      interactions: {
        touchEnabled: true,
        multiSelect: false,
        snapToGrid: 0,
        animationDuration: 200,
        hapticFeedback: false
      }
    });
  }

  /**
   * Get configuration for the accordion element
   */
  getAccordionConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5,
        animationDuration: 150,
        touchEnabled: this.platformInfo.isTouch,
        multiSelect: true,
        hapticFeedback: true
      },
      constraints: {
        containment: 'parent',
        collisionDetection: true,
        minDistance: { top: 5, right: 5, bottom: 5, left: 5 },
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        dimensionLabels: !this.platformInfo.isMobile,
        resizeHandles: true
      }
    });
  }

  /**
   * Get configuration for the title element
   */
  getTitleConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5,
        animationDuration: 150,
        touchEnabled: this.platformInfo.isTouch,
        multiSelect: true,
        hapticFeedback: true
      },
      constraints: {
        containment: 'parent',
        collisionDetection: true,
        minDistance: { top: 5, right: 5, bottom: 5, left: 5 },
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        dimensionLabels: !this.platformInfo.isMobile,
        resizeHandles: true
      }
    });
  }

  /**
   * Handle visual editing events
   */
  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleAccordionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_accordion');
  }

  handleTitleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_title');
  }

  /**
   * Custom event handling for accordion-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_accordion') {
      switch (event.type) {
        case 'selected':
          console.log('Accordion element selected for editing');
          break;
        case 'moved':
          this.updateAccordionPosition(event.bounds);
          break;
        case 'resized':
          break;
      }
    } else if (elementId === this.section.id + '_title') {
      switch (event.type) {
        case 'selected':
          console.log('Title element selected for editing');
          break;
        case 'moved':
          this.updateTitlePosition(event.bounds);
          break;
        case 'resized':
          break;
      }
    }
  }

  /**
   * Update accordion position in section data
   */
  private updateAccordionPosition(bounds: any): void {
    console.log('Accordion position updated:', bounds);
  }

  /**
   * Update title position in section data
   */
  private updateTitlePosition(bounds: any): void {
    console.log('Title position updated:', bounds);
  }
}
