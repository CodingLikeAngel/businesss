import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  TitleConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UITitleComponent 
} from '@negocio/ui-components';
import { ReservationFormComponent } from '../../../../components/reservation-form/reservation-form.component';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-contact-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    ReservationFormComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-contact-section.component.html'
})
export class EditorContactSectionComponent extends BaseEditorSectionComponent {
  @Input() titleConfig!: TitleConfig;
}
