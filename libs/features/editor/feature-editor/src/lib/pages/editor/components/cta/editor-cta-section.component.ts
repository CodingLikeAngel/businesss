import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIButtonComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor CTA Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-cta-section',
  standalone: true,
  imports: [
    CommonModule,
    UIButtonComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-cta-section.component.html'
})
export class EditorCtaSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('ctaElement', { static: true }) ctaElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;
  @ViewChild('buttonElement', { static: false }) buttonElement?: ElementRef;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.ctaElement, this.section.id + '_cta');
    if (this.titleElement) {
      this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    }
    if (this.buttonElement) {
      this.applyElementVisualEditing(this.buttonElement, this.section.id + '_button');
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
   * Get configuration for the CTA element
   */
  getCtaConfig(): VisualEditingConfig {
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
   * Get configuration for the button element
   */
  getButtonConfig(): VisualEditingConfig {
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

  handleCtaEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_cta');
  }

  handleTitleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_title');
  }

  handleButtonEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_button');
  }

  /**
   * Custom event handling for CTA-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_cta') {
      switch (event.type) {
        case 'selected':
          console.log('CTA element selected for editing');
          break;
        case 'moved':
          this.updateCtaPosition(event.bounds);
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
    } else if (elementId === this.section.id + '_button') {
      switch (event.type) {
        case 'selected':
          console.log('Button element selected for editing');
          break;
        case 'moved':
          this.updateButtonPosition(event.bounds);
          break;
        case 'resized':
          break;
      }
    }
  }

  /**
   * Update CTA position in section data
   */
  private updateCtaPosition(bounds: any): void {
    console.log('CTA position updated:', bounds);
  }

  /**
   * Update title position in section data
   */
  private updateTitlePosition(bounds: any): void {
    console.log('Title position updated:', bounds);
  }

  /**
   * Update button position in section data
   */
  private updateButtonPosition(bounds: any): void {
    console.log('Button position updated:', bounds);
  }
}
