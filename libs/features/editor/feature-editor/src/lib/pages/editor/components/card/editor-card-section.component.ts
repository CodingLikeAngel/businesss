import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Card Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-card-section',
  standalone: true,
  imports: [
    CommonModule,
    UICardComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-card-section.component.html'
})
export class EditorCardSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('cardElement', { static: true }) cardElement!: ElementRef;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.cardElement, this.section.id + '_card');
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
   * Get configuration for the card element
   */
  getCardConfig(): VisualEditingConfig {
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

  handleCardEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_card');
  }

  /**
   * Custom event handling for card-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_card') {
      switch (event.type) {
        case 'selected':
          console.log('Card element selected for editing');
          break;
        case 'moved':
        case 'resized':
          this.updateCardStyles(event.bounds);
          break;
      }
    }
  }

  /**
   * Update card position/size in section data
   */
  private updateCardStyles(bounds: any): void {
    const currentStyles = this.section.content['cardStyles'] || {};
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
          cardStyles: newStyles,
          customStyles: newStyles
        }
      });

      // Automatically expand section height
      this.autoExpandSectionHeight(bounds);
    }
  }
}
