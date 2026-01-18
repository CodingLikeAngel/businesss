import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UISpinnerComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-spinner-section',
  standalone: true,
  imports: [
    CommonModule,
    UISpinnerComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-spinner-section.component.html'
})
export class EditorSpinnerSectionComponent extends BaseEditorSectionComponent {}
