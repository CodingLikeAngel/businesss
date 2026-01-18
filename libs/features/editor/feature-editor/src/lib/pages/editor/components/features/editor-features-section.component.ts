import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FeaturesConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UITitleComponent, 
  UICardAnimatedComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-features-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardAnimatedComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-features-section.component.html'
})
export class EditorFeaturesSectionComponent extends BaseEditorSectionComponent {
  @Input() featuresConfig!: FeaturesConfig;
}
