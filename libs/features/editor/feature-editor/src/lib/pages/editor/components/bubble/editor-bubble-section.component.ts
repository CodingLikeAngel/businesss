import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  BubbleConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  BubbleAnimationComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-bubble-section',
  standalone: true,
  imports: [
    CommonModule,
    BubbleAnimationComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-bubble-section.component.html'
})
export class EditorBubbleSectionComponent extends BaseEditorSectionComponent {
  @Input() bubbleConfig!: BubbleConfig;
}
