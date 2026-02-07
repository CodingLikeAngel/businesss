import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIImageComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorImageIsolatedModeComponent } from './editor-image-isolated-mode.component';

/**
 * Enhanced Editor Image Section Component
 * Standardized for visual editing and Smart Image v2 features.
 */
@Component({
  selector: 'lib-editor-image-section',
  standalone: true,
  imports: [
    CommonModule,
    UIImageComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorImageIsolatedModeComponent
  ],
  templateUrl: './editor-image-section.component.html'
})
export class EditorImageSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('imageElement', { static: true }) imageElement!: ElementRef;

  // Isolated Mode State
  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    // Apply standardized visual editing
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.imageElement, this.section.id + '_image');

    // Initial height check
    const imageStyles = this.section.content['imageStyles'] || {};
    if (imageStyles.top && imageStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(imageStyles.left) || 0,
        y: parseInt(imageStyles.top),
        width: parseInt(imageStyles.width) || 0,
        height: parseInt(imageStyles.height)
      });
    }
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section');
  }

  getImageConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5
      }
    });
  }

  handleEventStandalone(event: VisualEditingEvent, elementId: string): void {
    this.handleVisualEvent(event, elementId);
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_image') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateImageStyles(event.bounds);
      }
    }
  }

  private updateImageStyles(bounds: any): void {
    const currentStyles = this.section.content['imageStyles'] || {};
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
          imageStyles: newStyles,
          customStyles: newStyles
        }
      });

      this.autoExpandSectionHeight(bounds);
    }
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    const imageStyles = this.section.content['imageStyles'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_image',
      type: 'image',
      content: {
        src: this.section.content['src'],
        alt: this.section.content['alt']
      },
      styles: { ...imageStyles },
      position: {
        x: parseInt(imageStyles.left) || 0,
        y: parseInt(imageStyles.top) || 0
      },
      size: {
        width: parseInt(imageStyles.width) || 400,
        height: parseInt(imageStyles.height) || 300
      }
    };
    this.showIsolatedMode = true;
  }

  onIsolatedModeClosed(): void {
    this.showIsolatedMode = false;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: {
        ...this.section.content,
        src: config.content.src,
        alt: config.content.alt,
        imageStyles: config.styles,
        customStyles: config.styles
      }
    });
    this.showIsolatedMode = false;
  }
}
