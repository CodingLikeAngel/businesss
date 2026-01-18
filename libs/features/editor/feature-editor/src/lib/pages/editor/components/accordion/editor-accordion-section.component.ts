import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UIAccordionComponent,
  UITitleComponent
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-accordion-section',
  standalone: true,
  imports: [
    CommonModule,
    UIAccordionComponent,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-accordion-section.component.html'
})
export class EditorAccordionSectionComponent extends BaseEditorSectionComponent {}
