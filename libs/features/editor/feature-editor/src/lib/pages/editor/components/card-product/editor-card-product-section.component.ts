import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardProductsComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorCardProductIsolatedModeComponent } from './editor-card-product-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

@Component({
  selector: 'lib-editor-card-product-section',
  standalone: true,
  imports: [
    CommonModule,
    UiCardProductsComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorCardProductIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-card-product-section.component.html'
})
export class EditorCardProductSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement') sectionElement!: ElementRef;
  @ViewChild('cardElement') cardElement!: ElementRef;

  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.cardElement, this.section.id + '_product_card');
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
      elementId: this.section.id + '_product_card',
      type: 'card-product',
      content: { 
        ...this.section.content,
        globalVariant: this.globalVariant
      },
      styles: { ...this.section.styles },
      position: { x: 0, y: 0 },
      size: { width: 350, height: 550 }
    };
    this.showIsolatedMode = true;
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

    this.showIsolatedMode = false;
  }
}
