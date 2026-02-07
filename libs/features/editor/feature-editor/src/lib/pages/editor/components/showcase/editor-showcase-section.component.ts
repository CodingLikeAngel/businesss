import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIShowcaseAtomComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { EditorShowcaseIsolatedModeComponent, IsolatedModeConfig } from './editor-showcase-isolated-mode.component';

/**
 * Enhanced Editor Showcase Section Component
 * Standardized for icon+text patterns with pro features.
 */
@Component({
  selector: 'lib-editor-showcase-section',
  standalone: true,
  imports: [
    CommonModule,
    UIShowcaseAtomComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorShowcaseIsolatedModeComponent
  ],
  templateUrl: './editor-showcase-section.component.html'
})
export class EditorShowcaseSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('showcaseElement', { static: false }) showcaseElement?: ElementRef;

  // Isolated Mode State
  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    if (this.showcaseElement) {
       this.applyElementVisualEditing(this.showcaseElement, this.section.id + '_showcase');
    }

    // Initial height check
    const showcaseStyles = this.section.content['showcaseStyles'] || {};
    if (showcaseStyles.top && showcaseStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(showcaseStyles.left) || 0,
        y: parseInt(showcaseStyles.top),
        width: parseInt(showcaseStyles.width) || 300,
        height: parseInt(showcaseStyles.height) || 200
      });
    }
  }

  /**
   * Get configuration for the section container
   */
  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section');
  }

  /**
   * Get configuration for the showcase element
   */
  getShowcaseConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5
      }
    });
  }

  /**
   * Handle visual editing events
   */
  handleEventStandalone(event: VisualEditingEvent, elementId: string): void {
    this.handleVisualEvent(event, elementId);
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_showcase') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateShowcaseStyles(event.bounds);
      }
    }
  }

  private updateShowcaseStyles(bounds: any): void {
    const currentStyles = this.section.content['showcaseStyles'] || {};
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
          showcaseStyles: newStyles,
          customStyles: newStyles
        }
      });

      this.autoExpandSectionHeight(bounds);
    }
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    const showcaseStyles = this.section.content['showcaseStyles'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_showcase',
      type: 'showcase',
      content: {
        icon: this.section.content['icon'],
        title: this.section.content['title'],
        text: this.section.content['text'],
        layout: this.section.content['layout'],
        variant: this.section.content['variant']
      },
      styles: { ...showcaseStyles },
      position: {
        x: parseInt(showcaseStyles.left) || 0,
        y: parseInt(showcaseStyles.top) || 0
      },
      size: {
        width: parseInt(showcaseStyles.width) || 300,
        height: parseInt(showcaseStyles.minHeight || showcaseStyles.height) || 150
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
        icon: config.content.icon,
        title: config.content.title,
        text: config.content.text,
        layout: config.content.layout,
        variant: config.content.variant,
        showcaseStyles: config.styles,
        customStyles: config.styles
      }
    });
    this.showIsolatedMode = false;
  }
}
