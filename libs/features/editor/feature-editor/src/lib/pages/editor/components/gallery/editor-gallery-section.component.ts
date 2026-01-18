import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  GalleryConfig,
  TitleConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UIImageComponent,
  UITitleComponent 
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-gallery-section',
  standalone: true,
  imports: [
    CommonModule,
    UIImageComponent,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-gallery-section.component.html'
})
export class EditorGallerySectionComponent extends BaseEditorSectionComponent {
  @Input() galleryConfig!: GalleryConfig;
  @Input() titleConfig!: TitleConfig;
}
