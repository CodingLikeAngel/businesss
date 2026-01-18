import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIImageComponent } from '@negocio/ui-components';
import { 
  ApplyDynamicStylesDirective, 
  VisualEditableDirective 
} from '@negocio/shared-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-image-section',
  standalone: true,
  imports: [
    CommonModule,
    UIImageComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-image-section.component.html'
})
export class EditorImageSectionComponent extends BaseEditorSectionComponent {
}
