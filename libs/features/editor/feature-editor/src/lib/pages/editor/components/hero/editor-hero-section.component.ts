import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HeroConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective
} from '@negocio/shared-components';
import {
  UITitleComponent,
  UICardAnimatedComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { VisualEditingConfig, VisualEditingEvent } from '../../../../../shared-components/variant-selector/enhanced-visual-editing.interfaces';

/**
 * Enhanced Editor Hero Section Component
 * Example implementation using the new EnhancedBaseEditorSectionComponent
 * and EnhancedVisualEditableDirective for standardized visual editing
 */
@Component({
  selector: 'lib-editor-hero-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardAnimatedComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-hero-section.component.html'
})
export class EditorHeroSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef;
  @ViewChild('subtitleElement', { static: true }) subtitleElement!: ElementRef;
  @ViewChild('ctaElement', { static: true }) ctaElement!: ElementRef;

  @Input() heroConfig!: HeroConfig;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    this.applyElementVisualEditing(this.subtitleElement, this.section.id + '_subtitle');
    this.applyElementVisualEditing(this.ctaElement, this.section.id + '_cta');
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
   * Get configuration for the title element
   */
  getTitleConfig(): VisualEditingConfig {
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
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile, // Disable hover on mobile
        dimensionLabels: !this.platformInfo.isMobile, // Reduce clutter on mobile
        resizeHandles: true
      }
    });
  }

  /**
   * Get configuration for the subtitle element
   */
  getSubtitleConfig(): VisualEditingConfig {
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
        selectionOutline: '2px solid #f59e0b',
        hoverEffects: !this.platformInfo.isMobile,
        dimensionLabels: !this.platformInfo.isMobile,
        resizeHandles: true
      }
    });
  }

  /**
   * Get configuration for the CTA element
   */
  getCtaConfig(): VisualEditingConfig {
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
        selectionOutline: '2px solid #ef4444',
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

  handleTitleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_title');
  }

  handleSubtitleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_subtitle');
  }

  handleCtaEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_cta');
  }

  /**
   * Custom event handling for hero-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    switch (event.type) {
      case 'selected':
        console.log(`${elementId} element selected for editing`);
        break;
      case 'moved':
        this.updateElementPosition(event.bounds, elementId);
        break;
      case 'resized':
        // Handle element resize if needed
        break;
    }
  }

  /**
   * Update element position in section data
   */
  private updateElementPosition(bounds: any, elementId: string): void {
    // This would update the section content with new position
    console.log(`${elementId} position updated:`, bounds);
  }
}
