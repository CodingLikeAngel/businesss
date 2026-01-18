import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  PricingConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UIPricingTableSectionComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-pricing-section',
  standalone: true,
  imports: [
    CommonModule,
    UIPricingTableSectionComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-pricing-section.component.html'
})
export class EditorPricingSectionComponent extends BaseEditorSectionComponent {
  @Input() pricingConfig!: PricingConfig;
}
