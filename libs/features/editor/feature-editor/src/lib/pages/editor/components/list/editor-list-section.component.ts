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

@Component({
  selector: 'lib-editor-list-section',
  standalone: true,
  imports: [
    CommonModule,
    UIListComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-list-section.component.html'
})
export class EditorListSectionComponent extends EnhancedBaseEditorSectionComponent {}
