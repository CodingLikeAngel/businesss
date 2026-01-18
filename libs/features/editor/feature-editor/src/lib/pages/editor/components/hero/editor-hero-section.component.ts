import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  HeroConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UITitleComponent, 
  UICardAnimatedComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-hero-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardAnimatedComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-hero-section.component.html'
})
export class EditorHeroSectionComponent extends BaseEditorSectionComponent {
  @Input() heroConfig!: HeroConfig;
}
