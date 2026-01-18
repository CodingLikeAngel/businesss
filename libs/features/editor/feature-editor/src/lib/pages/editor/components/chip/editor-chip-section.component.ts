import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UIChipComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-chip-section',
  standalone: true,
  imports: [
    CommonModule,
    UIChipComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-chip-section.component.html'
})
export class EditorChipSectionComponent extends BaseEditorSectionComponent {}
