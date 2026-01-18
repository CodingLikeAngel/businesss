import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UINewsletterSectionComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-newsletter-section',
  standalone: true,
  imports: [
    CommonModule,
    UINewsletterSectionComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-newsletter-section.component.html'
})
export class EditorNewsletterSectionComponent extends BaseEditorSectionComponent {}
