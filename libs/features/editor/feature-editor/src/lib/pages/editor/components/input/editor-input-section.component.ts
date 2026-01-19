import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Input Section Component
 * Example implementation using the new EnhancedBaseEditorSectionComponent
 * and EnhancedVisualEditableDirective for standardized visual editing
 */
@Component({
  selector: 'lib-editor-input-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UIInputComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-input-section.component.html'
})
export class EditorInputSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef;

  inputValue = '';

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.inputElement, this.section.id + '_input');
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
      }
    });
  }

  /**
   * Get configuration for the input element
   */
  getInputConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        touchEnabled: this.platformInfo.isTouch,
        multiSelect: true,
        snapToGrid: 5,
        animationDuration: 150,
        hapticFeedback: true
      },
      constraints: {
        containment: 'parent',
        collisionDetection: true,
        minDistance: { top: 5, right: 5, bottom: 5, left: 5 },
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #7c3aed',
        hoverEffects: !this.platformInfo.isMobile, // Disable hover on mobile
        dimensionLabels: !this.platformInfo.isMobile, // Reduce clutter on mobile
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

  handleInputEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_input');
  }

  /**
   * Custom event handling for input-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_input') {
      // Input-specific visual event handling
      switch (event.type) {
        case 'selected':
          console.log('Input element selected for editing');
          break;
        case 'moved':
          this.updateInputPosition(event.bounds);
          break;
        case 'resized':
          // Handle input resize if needed
          break;
      }
    }
  }

  /**
   * Update input position in section data
   */
  private updateInputPosition(bounds: any): void {
    // This would update the section content with new position
    console.log('Input position updated:', bounds);
  }
}
