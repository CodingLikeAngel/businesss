import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BubbleConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  BubbleAnimationComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Bubble Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-bubble-section',
  standalone: true,
  imports: [
    CommonModule,
    BubbleAnimationComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-bubble-section.component.html'
})
export class EditorBubbleSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @Input() bubbleConfig!: BubbleConfig;
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('bubbleElement', { static: true }) bubbleElement!: ElementRef;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.bubbleElement, this.section.id + '_bubble');
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
   * Get configuration for the bubble element
   */
  getBubbleConfig(): VisualEditingConfig {
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

  handleBubbleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_bubble');
  }

  /**
   * Custom event handling for bubble-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_bubble') {
      switch (event.type) {
        case 'selected':
          console.log('Bubble element selected for editing');
          break;
        case 'moved':
          this.updateBubblePosition(event.bounds);
          break;
        case 'resized':
          break;
      }
    }
  }

  /**
   * Update bubble position in section data
   */
  private updateBubblePosition(bounds: any): void {
    console.log('Bubble position updated:', bounds);
  }
}
