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

/**
 * Enhanced Editor Image Section Component
 * Example implementation using the new EnhancedBaseEditorSectionComponent
 * and EnhancedVisualEditableDirective for standardized visual editing
 */
@Component({
  selector: 'lib-editor-image-section',
  standalone: true,
  imports: [
    CommonModule,
    UIImageComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-image-section.component.html'
})
export class EditorImageSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('imageElement', { static: true }) imageElement!: ElementRef;

  ngAfterViewInit() {
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

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleImageEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_image');
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

      // Automatically expand section height
      this.autoExpandSectionHeight(bounds);
    }
  }
}
