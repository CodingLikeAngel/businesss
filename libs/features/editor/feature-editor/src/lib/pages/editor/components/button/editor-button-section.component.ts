import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIButtonComponent } from '@negocio/ui-components';
import { 
  ApplyDynamicStylesDirective, 
  VisualEditableDirective 
} from '@negocio/shared-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-button-section',
  standalone: true,
  imports: [
    CommonModule,
    UIButtonComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-button-section.component.html'
})
export class EditorButtonSectionComponent extends BaseEditorSectionComponent {
}
