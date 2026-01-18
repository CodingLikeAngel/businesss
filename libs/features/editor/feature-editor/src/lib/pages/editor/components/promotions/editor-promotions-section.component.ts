import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  PromotionsConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UICardPremiumComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-promotions-section',
  standalone: true,
  imports: [
    CommonModule,
    UICardPremiumComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-promotions-section.component.html'
})
export class EditorPromotionsSectionComponent extends BaseEditorSectionComponent {
  @Input() promotionsConfig!: PromotionsConfig;
}
