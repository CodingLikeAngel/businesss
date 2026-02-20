import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective
} from '@negocio/shared-components';
import {
  UIListComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorListIsolatedModeComponent } from './editor-list-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

@Component({
  selector: 'lib-editor-list-section',
  standalone: true,
  imports: [
    CommonModule,
    UIListComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorListIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-list-section.component.html'
})
export class EditorListSectionComponent extends EnhancedBaseEditorSectionComponent {
  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_list',
      type: 'list',
      content: { ...this.section.content },
      styles: { ...this.section.styles },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 }
    };
    this.showIsolatedMode = true;
  }

  onIsolatedModeClosed(): void {
    this.showIsolatedMode = false;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: { ...this.section.content, ...config.content },
      styles: { ...this.section.styles, ...config.styles }
    });
    this.showIsolatedMode = false;
  }
}
