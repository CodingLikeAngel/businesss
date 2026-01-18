import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UIStepsSectionComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-steps-section',
  standalone: true,
  imports: [
    CommonModule,
    UIStepsSectionComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-steps-section.component.html'
})
export class EditorStepsSectionComponent extends BaseEditorSectionComponent {}
