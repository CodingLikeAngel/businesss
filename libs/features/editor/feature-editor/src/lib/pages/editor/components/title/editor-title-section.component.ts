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
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorTitleIsolatedModeComponent } from './editor-title-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

@Component({
  selector: 'lib-editor-title-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorTitleIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-title-section.component.html'
})
export class EditorTitleSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;

  // Isolated Mode State
  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    // Apply visual editing to section and title elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    if (this.titleElement) {
      this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    }

    // Initial height check for absolute titles
    const titleStyles = this.section.content['titleStyles'] || {};
    if (titleStyles.top && titleStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(titleStyles.left) || 0,
        y: parseInt(titleStyles.top),
        width: parseInt(titleStyles.width) || 300,
        height: parseInt(titleStyles.height) || 50
      });
    }
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section');
  }

  getTitleConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5
      }
    });
  }

  handleVisualEventStandalone(event: VisualEditingEvent, elementId: string): void {
    this.handleVisualEvent(event, elementId);
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_title') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateTitleStyles(event.bounds);
      }
    }
  }

  private updateTitleStyles(bounds: any): void {
    const currentStyles = this.section.content['titleStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute',
      width: bounds.width + 'px',
      minHeight: bounds.height + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px'
    };

    if (JSON.stringify(currentStyles) !== JSON.stringify(newStyles)) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          titleStyles: newStyles,
          customStyles: newStyles
        }
      });

      this.autoExpandSectionHeight(bounds);
    }
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    const titleStyles = this.section.content['titleStyles'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_title',
      type: 'title',
      content: {
        text: this.section.content['text'],
        level: this.section.content['level'],
        variant: this.section.content['variant'],
        animation: this.section.content['animation'],
        align: this.section.content['align']
      },
      styles: { ...titleStyles },
      position: {
        x: parseInt(titleStyles.left) || 0,
        y: parseInt(titleStyles.top) || 0
      },
      size: {
        width: parseInt(titleStyles.width) || 400,
        height: parseInt(titleStyles.minHeight || titleStyles.height) || 50
      }
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
      content: {
        ...this.section.content,
        text: config.content.text,
        level: config.content.level,
        variant: config.content.variant,
        animation: config.content.animation,
        align: config.content.align,
        titleStyles: config.styles,
        customStyles: config.styles
      }
    });
    if (typeof document !== 'undefined') document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
  }
}
