import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FaqConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UIAccordionComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-faq-section',
  standalone: true,
  imports: [
    CommonModule,
    UIAccordionComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-faq-section.component.html'
})
export class EditorFaqSectionComponent extends BaseEditorSectionComponent {
  @Input() faqConfig!: FaqConfig;
}
