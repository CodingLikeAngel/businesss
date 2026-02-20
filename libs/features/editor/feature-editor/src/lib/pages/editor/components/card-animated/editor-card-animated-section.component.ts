import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardAnimatedComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorCardAnimatedIsolatedModeComponent } from './editor-card-animated-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

@Component({
  selector: 'lib-editor-card-animated-section',
  standalone: true,
  imports: [
    CommonModule,
    UICardAnimatedComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorCardAnimatedIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-card-animated-section.component.html'
})
export class EditorCardAnimatedSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement') sectionElement!: ElementRef;
  @ViewChild('cardElement') cardElement!: ElementRef;

  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.cardElement, this.section.id + '_animated_card');
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', { enableDrag: false, enableResize: true });
  }

  getElementConfig(): VisualEditingConfig {
    return this.createElementConfig('element', { enableDrag: true, enableResize: true });
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_animated_card',
      type: 'card-animated',
      content: { 
        ...this.section.content,
        globalVariant: this.globalVariant
      },
      styles: { ...this.section.styles },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 500 }
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
        ...config.content
      },
      styles: config.styles
    });
    
    if (config.content['variant']) {
      this.variantService.setComponentVariant(this.section.id, config.content['variant']);
    }

    if (typeof document !== 'undefined') document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
  }
}
