import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIChartComponent,
  UITitleComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Chart Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-chart-section',
  standalone: true,
  imports: [
    CommonModule,
    UIChartComponent,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-chart-section.component.html'
})
export class EditorChartSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @Input() chartConfig!: any;
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('chartElement', { static: true }) chartElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.chartElement, this.section.id + '_chart');
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
   * Get configuration for the chart element
   */
  getChartConfig(): VisualEditingConfig {
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

  handleChartEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_chart');
  }

  handleTitleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_title');
  }

  /**
   * Custom event handling for chart-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_chart') {
      switch (event.type) {
        case 'selected':
          console.log('Chart element selected for editing');
          break;
        case 'moved':
          this.updateChartPosition(event.bounds);
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
   * Update chart position in section data
   */
  private updateChartPosition(bounds: any): void {
    console.log('Chart position updated:', bounds);
  }

  /**
   * Update title position in section data
   */
  private updateTitlePosition(bounds: any): void {
    console.log('Title position updated:', bounds);
  }
}
