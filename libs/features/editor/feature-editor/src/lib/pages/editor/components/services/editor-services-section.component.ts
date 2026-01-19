import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ServiceCardsConfig,
  TitleConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective
} from '@negocio/shared-components';
import {
  UITitleComponent,
  UICardComponent,
  ServiceSectionComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-services-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardComponent,
    ServiceSectionComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-services-section.component.html'
})
export class EditorServicesSectionComponent extends EnhancedBaseEditorSectionComponent {
  @Input() serviceCardsConfig!: ServiceCardsConfig;
  @Input() titleConfig!: TitleConfig;
}
