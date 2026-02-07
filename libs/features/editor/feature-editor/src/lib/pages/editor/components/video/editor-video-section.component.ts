import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIVideoComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-video-section',
  standalone: true,
  imports: [
    CommonModule,
    UIVideoComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-video-section.component.html'
})
export class EditorVideoSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('videoElement', { static: false }) videoElement?: ElementRef;

  ngAfterViewInit() {
    // Initial height check
    const videoStyles = this.section.content['videoStyles'] || {};
    if (videoStyles.top && videoStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(videoStyles.left) || 0,
        y: parseInt(videoStyles.top),
        width: parseInt(videoStyles.width) || 300,
        height: parseInt(videoStyles.height) || 200
      });
    }

    if (this.videoElement) {
       this.applyElementVisualEditing(this.videoElement, this.section.id + '_video');
    }
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section');
  }

  getVideoConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5
      }
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleVideoEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_video');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_video') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateVideoStyles(event.bounds);
      }
    }
  }

  private updateVideoStyles(bounds: any): void {
    const currentStyles = this.section.content['videoStyles'] || {};
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
          videoStyles: newStyles,
          customStyles: newStyles
        }
      });

      this.autoExpandSectionHeight(bounds);
    }
  }
}
