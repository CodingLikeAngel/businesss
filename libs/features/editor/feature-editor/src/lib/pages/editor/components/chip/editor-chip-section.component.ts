import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIChipComponent
} from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorChipIsolatedModeComponent } from './editor-chip-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Chip Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-chip-section',
  standalone: true,
  imports: [
    CommonModule,
    UIChipComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorChipIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-chip-section.component.html'
})
export class EditorChipSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('chipElement', { static: true }) chipElement!: ElementRef;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.chipElement, this.section.id + '_chip');
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
   * Get configuration for the chip element
   */
  getChipConfig(): VisualEditingConfig {
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

  handleChipEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_chip');
  } 

  /**
   * Custom event handling for chip-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_chip') {
      switch (event.type) {
        case 'selected':
          console.log('Chip element selected for editing');
          break;
        case 'moved':
          // Moved handling
          break;
        case 'resized':
          break;
      }
    }
  }

  /**
   * ISOLATED MODE SUPPORT
   */
  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  openIsolatedMode(event: MouseEvent) {
    event.stopPropagation();
    const chipStyles = this.section.content['customStyles'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_chip',
      type: 'chip',
      content: { ...this.section.content },
      styles: { ...chipStyles },
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 }
    };
    this.showIsolatedMode = true;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
          content: {
             ...this.section.content,
             ...config.content
          }
      });
      this.showIsolatedMode = false;
  }
}
