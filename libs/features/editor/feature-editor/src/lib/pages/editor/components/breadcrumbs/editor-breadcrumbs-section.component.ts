import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UIBreadcrumbsComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-breadcrumbs-section',
  standalone: true,
  imports: [
    CommonModule,
    UIBreadcrumbsComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-breadcrumbs-section.component.html'
})
export class EditorBreadcrumbsSectionComponent extends BaseEditorSectionComponent {}
