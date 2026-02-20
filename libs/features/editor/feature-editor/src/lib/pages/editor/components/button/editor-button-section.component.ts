import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIButtonComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { EditorButtonIsolatedModeComponent, IsolatedModeConfig } from './editor-button-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';
import { HostListener } from '@angular/core';

/**
 * Enhanced Editor Button Section Component
 * Implements standard visual editing and Premium Isolated Mode
 */
@Component({
  selector: 'lib-editor-button-section',
  standalone: true,
  imports: [
    CommonModule,
    UIButtonComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorButtonIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-button-section.component.html'
})
export class EditorButtonSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('buttonElement', { static: false }) buttonElement?: ElementRef;

  // Isolated Mode State
  showIsolatedMode = false;
  isolatedConfig: IsolatedModeConfig | null = null;

  ngAfterViewInit() {
    // Initial height check to ensure section contains the button
    const buttonStyles = this.section.content['buttonStyles'] || {};
    if (buttonStyles.top && buttonStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(buttonStyles.left) || 0,
        y: parseInt(buttonStyles.top),
        width: parseInt(buttonStyles.width) || 0,
        height: parseInt(buttonStyles.height)
      });
    }

    if (this.buttonElement) {
      this.applyElementVisualEditing(this.buttonElement, this.section.id + '_button');
    }
  }

  /**
   * Configuration for the button element
   */
  getButtonConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5,
        touchEnabled: this.platformInfo.isTouch
      },
      constraints: {
        containment: 'parent'
      },
      styling: {
        selectionOutline: '2px solid #6366f1',
        resizeHandles: true
      }
    });
  }

  handleButtonEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_button');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_button') {
      if (event.type === 'moved' || event.type === 'resized') {
        this.updateButtonStyles(event.bounds);
      }
    }
  }

  private updateButtonStyles(bounds: any): void {
    const currentStyles = this.section.content['buttonStyles'] || {};
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
          buttonStyles: newStyles,
          customStyles: newStyles // Keep sync for UI components that use customStyles
        }
      });

      // Automatically expand section height
      this.autoExpandSectionHeight(bounds);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if ((event.key === 'i' || event.key === 'I') && !event.ctrlKey && !event.metaKey) {
      if (this.selectedElementId === this.section.id + '_button') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
          this.openIsolatedMode();
        }
      }
    }
  }

  openIsolatedMode(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    const buttonStyles = this.section.content['buttonStyles'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_button',
      variant: this.section.content['variant'] || 'primary',
      globalVariant: this.getVariant(this.section.id),
      content: { ...this.section.content },
      styles: { ...buttonStyles },
      position: { 
        x: parseInt(buttonStyles.left) || 100, 
        y: parseInt(buttonStyles.top) || 100 
      },
      size: { 
        width: parseInt(buttonStyles.width) || 200, 
        height: parseInt(buttonStyles.height) || 50 
      }
    };

    document.body.classList.add('isolated-mode-active');
    this.showIsolatedMode = true;
  }

  closeIsolatedMode() {
    document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
    this.isolatedConfig = null;
  }

  applyIsolatedChanges(config: IsolatedModeConfig) {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: {
        ...this.section.content,
        label: config.content.label,
        variant: config.content.variant,
        rounded: config.content.rounded,
        size: config.content.size,
        dark: config.content.dark,
        leadingIcon: config.content.leadingIcon,
        trailingIcon: config.content.trailingIcon,
        haptic: config.content.haptic,
        soundUrl: config.content.soundUrl,
        buttonStyles: config.styles,
        customStyles: config.styles
      }
    });

    this.closeIsolatedMode();
  }
}
