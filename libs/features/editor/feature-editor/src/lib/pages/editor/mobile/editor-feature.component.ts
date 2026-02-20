import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BaseEditorFeatureComponent } from '../base-editor-feature.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditorSectionRendererComponent } from '../components/section-renderer/editor-section-renderer.component';

@Component({
  selector: 'lib-editor-mobile-feature',
  standalone: true,
  templateUrl: './editor-feature.component.html',
  styleUrls: ['./editor-feature.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    EditorSectionRendererComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditorMobileFeatureComponent extends BaseEditorFeatureComponent implements OnInit {
  override ngOnInit() {
    super.ngOnInit();
    this.editorService.updateEditorState({ isMobile: true });
  }
}
