import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardComponent } from '@negocio/ui-components';
import { 
  ApplyDynamicStylesDirective, 
  VisualEditableDirective 
} from '@negocio/shared-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-card-section',
  standalone: true,
  imports: [
    CommonModule,
    UICardComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-card-section.component.html'
})
export class EditorCardSectionComponent extends BaseEditorSectionComponent {
}
