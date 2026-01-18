import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UITableComponent,
  UITitleComponent
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-table-section',
  standalone: true,
  imports: [
    CommonModule,
    UITableComponent,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-table-section.component.html'
})
export class EditorTableSectionComponent extends BaseEditorSectionComponent {}
