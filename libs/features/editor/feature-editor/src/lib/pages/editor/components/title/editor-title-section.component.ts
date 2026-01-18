import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UITitleComponent } from '@negocio/ui-components';
import { 
  ApplyDynamicStylesDirective, 
  VisualEditableDirective 
} from '@negocio/shared-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-title-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-title-section.component.html'
})
export class EditorTitleSectionComponent extends BaseEditorSectionComponent {
}
