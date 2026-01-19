import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UITitleComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-title-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-title-section.component.html'
})
export class EditorTitleSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef;

  ngAfterViewInit() {
    // Apply visual editing to section and title elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
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
      }
    });
  }

  /**
   * Get configuration for the title element
   */
  getTitleConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        touchEnabled: true,
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
      }
    });
  }

  /**
   * Handle visual editing events
   */
  override handleVisualEvent(event: VisualEditingEvent, elementId: string): void {
    super.handleVisualEvent(event, elementId);
  }
}
