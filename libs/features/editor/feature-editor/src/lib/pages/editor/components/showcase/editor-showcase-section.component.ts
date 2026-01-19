import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIGamingVariantsShowcaseComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Showcase Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-showcase-section',
  standalone: true,
  imports: [
    CommonModule,
    UIGamingVariantsShowcaseComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-showcase-section.component.html'
})
export class EditorShowcaseSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('showcaseElement', { static: true }) showcaseElement!: ElementRef;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.showcaseElement, this.section.id + '_showcase');
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
   * Get configuration for the showcase element
   */
  getShowcaseConfig(): VisualEditingConfig {
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

  handleShowcaseEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_showcase');
  }

  /**
   * Custom event handling for showcase-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_showcase') {
      switch (event.type) {
        case 'selected':
          console.log('Showcase element selected for editing');
          break;
        case 'moved':
          this.updateShowcasePosition(event.bounds);
          break;
        case 'resized':
          break;
      }
    }
  }

  /**
   * Update showcase position in section data
   */
  private updateShowcasePosition(bounds: any): void {
    console.log('Showcase position updated:', bounds);
  }
}
