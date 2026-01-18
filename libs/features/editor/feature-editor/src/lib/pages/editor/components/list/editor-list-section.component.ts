import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UIListComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-list-section',
  standalone: true,
  imports: [
    CommonModule,
    UIListComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-list-section.component.html'
})
export class EditorListSectionComponent extends BaseEditorSectionComponent {}
