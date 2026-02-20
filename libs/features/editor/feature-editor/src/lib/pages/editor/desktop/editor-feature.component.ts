import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BaseEditorFeatureComponent } from '../base-editor-feature.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UIModalComponent } from '@negocio/ui-components';
import { VisualEditorService } from '@negocio/shared-components';
import { EditorSectionRendererComponent } from '../components/section-renderer/editor-section-renderer.component';
import { ShortcutsGuideComponent } from '../components/shortcuts-guide/shortcuts-guide.component';





@Component({
  selector: 'lib-editor-desktop-feature',
  standalone: true,
  templateUrl: './editor-feature.component.html',
  styleUrls: ['./editor-feature.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    UIModalComponent,
    EditorSectionRendererComponent,
    ShortcutsGuideComponent,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class EditorDesktopFeatureComponent extends BaseEditorFeatureComponent implements OnInit {

  override ngOnInit() {
    super.ngOnInit();
    this.editorService.updateEditorState({ isMobile: false });
  }

  get currentMode() {
    return this.visualEditorService.interactionMode;
  }

  setMode(mode: 'all' | 'move' | 'resize') {
    this.visualEditorService.setInteractionMode(mode);
  }
}
