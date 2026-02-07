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
import { EditorVideoIsolatedModeComponent, IsolatedModeConfig } from './editor-video-isolated-mode.component';

@Component({
  selector: 'lib-editor-video-section',
  standalone: true,
  imports: [
    CommonModule,
    UIVideoComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorVideoIsolatedModeComponent
  ],
  templateUrl: './editor-video-section.component.html'
})
export class EditorVideoSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('videoElement', { static: false }) videoElement?: ElementRef;

  // Isolated Mode State
  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

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

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    const videoStyles = this.section.content['videoStyles'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_video',
      type: 'video',
      content: {
        videoUrl: this.section.content['videoUrl'],
        autoplay: this.section.content['autoplay'],
        loop: this.section.content['loop']
      },
      styles: { ...videoStyles },
      position: {
        x: parseInt(videoStyles.left) || 0,
        y: parseInt(videoStyles.top) || 0
      },
      size: {
        width: parseInt(videoStyles.width) || 300,
        height: parseInt(videoStyles.height) || 200
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
        videoUrl: config.content.videoUrl,
        autoplay: config.content.autoplay,
        loop: config.content.loop,
        videoStyles: config.styles,
        customStyles: config.styles
      }
    });
    this.showIsolatedMode = false;
  }
}
