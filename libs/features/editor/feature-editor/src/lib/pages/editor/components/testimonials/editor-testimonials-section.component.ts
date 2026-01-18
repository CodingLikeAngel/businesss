import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  TestimonialsConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UiTestimonialsCardComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-testimonials-section',
  standalone: true,
  imports: [
    CommonModule,
    UiTestimonialsCardComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-testimonials-section.component.html'
})
export class EditorTestimonialsSectionComponent extends BaseEditorSectionComponent {
  @Input() testimonialsConfig!: TestimonialsConfig;
}
