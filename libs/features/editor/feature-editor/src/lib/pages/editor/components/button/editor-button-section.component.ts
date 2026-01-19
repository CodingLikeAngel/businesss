import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIButtonComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-button-section',
  standalone: true,
  imports: [
    CommonModule,
    UIButtonComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-button-section.component.html'
})
export class EditorButtonSectionComponent extends EnhancedBaseEditorSectionComponent {
}
