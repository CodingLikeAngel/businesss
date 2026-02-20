import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { UIStepsSectionComponent } from '@negocio/featured-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorStepsIsolatedModeComponent } from './editor-steps-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

/**
 * Enhanced Editor Steps Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-steps-section',
  standalone: true,
  imports: [
    CommonModule,
    UIStepsSectionComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorStepsIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-steps-section.component.html'
})
export class EditorStepsSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('stepsElement', { static: true }) stepsElement!: ElementRef;

  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.stepsElement, this.section.id + '_steps');
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
   * Get configuration for the steps element
   */
  getStepsConfig(): VisualEditingConfig {
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

  handleStepsEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_steps');
  }

  /**
   * Custom event handling for steps-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_steps') {
      switch (event.type) {
        case 'selected':
          console.log('Steps element selected for editing');
          break;
        case 'moved':
          this.updateStepsPosition(event.bounds);
          break;
        case 'resized':
          break;
      }
    }
  }

  /**
   * Update steps position in section data
   */
  private updateStepsPosition(bounds: any): void {
    console.log('Steps position updated:', bounds);
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_steps',
      type: 'steps',
      content: { ...this.section.content },
      styles: { ...this.section.styles },
      position: { x: 0, y: 0 },
      size: { width: 800, height: 400 }
    };
    if (typeof document !== 'undefined') document.body.classList.add('isolated-mode-active');
    this.showIsolatedMode = true;
  }

  onIsolatedModeClosed(): void {
    if (typeof document !== 'undefined') document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: { ...this.section.content, ...config.content },
      styles: { ...this.section.styles, ...config.styles }
    });
    if (typeof document !== 'undefined') document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
  }
}
