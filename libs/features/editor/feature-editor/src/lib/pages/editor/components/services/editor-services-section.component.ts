import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ServiceCardsConfig,
  TitleConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import {
  UITitleComponent,
  UICardComponent,
  ServiceSectionComponent
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-services-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardComponent,
    ServiceSectionComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-services-section.component.html'
})
export class EditorServicesSectionComponent extends BaseEditorSectionComponent {
  @Input() serviceCardsConfig!: ServiceCardsConfig;
  @Input() titleConfig!: TitleConfig;
}
