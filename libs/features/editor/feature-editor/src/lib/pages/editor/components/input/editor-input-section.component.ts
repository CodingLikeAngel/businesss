import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent } from '@negocio/ui-components';
import { 
  ApplyDynamicStylesDirective, 
  VisualEditableDirective 
} from '@negocio/shared-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-input-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UIInputComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-input-section.component.html'
})
export class EditorInputSectionComponent extends BaseEditorSectionComponent {
  inputValue = '';
}
