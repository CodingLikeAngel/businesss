import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UIGamingVariantsShowcaseComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-showcase-section',
  standalone: true,
  imports: [
    CommonModule,
    UIGamingVariantsShowcaseComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-showcase-section.component.html'
})
export class EditorShowcaseSectionComponent extends BaseEditorSectionComponent {}
