import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UITableComponent,
  UITitleComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Table Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-table-section',
  standalone: true,
  imports: [
    CommonModule,
    UITableComponent,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-table-section.component.html'
})
export class EditorTableSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('tableElement', { static: true }) tableElement!: ElementRef;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.tableElement, this.section.id + '_table');
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
   * Get configuration for the table element
   */
  getTableConfig(): VisualEditingConfig {
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

  handleTableEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_table');
  }

  /**
   * Custom event handling for table-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_table') {
      switch (event.type) {
        case 'selected':
          console.log('Table element selected for editing');
          break;
        case 'moved':
          this.updateTablePosition(event.bounds);
          break;
        case 'resized':
          break;
      }
    }
  }

  /**
   * Update table position in section data
   */
  private updateTablePosition(bounds: any): void {
    console.log('Table position updated:', bounds);
  }
}
