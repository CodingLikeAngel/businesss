import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PricingConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective
} from '@negocio/shared-components';
import {
  UIPricingTableSectionComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-pricing-section',
  standalone: true,
  imports: [
    CommonModule,
    UIPricingTableSectionComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-pricing-section.component.html'
})
export class EditorPricingSectionComponent extends EnhancedBaseEditorSectionComponent {
  @Input() pricingConfig!: PricingConfig;
}
