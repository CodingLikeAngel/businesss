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
  UITitleComponent,
  UIGalleryComponent
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-gallery-section',
  standalone: true,
  imports: [
    CommonModule,
    UIImageComponent,
    UITitleComponent,
    UIGalleryComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-gallery-section.component.html'
})
export class EditorGallerySectionComponent extends BaseEditorSectionComponent {
  @Input() galleryConfig!: GalleryConfig;
  @Input() titleConfig!: TitleConfig;
}
