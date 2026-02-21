import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
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
  templateUrl: '../editor-feature-shared.component.html',
  styleUrls: ['./editor-feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  /** 5.3 Unified template: desktop shows toolbar, modal, shortcuts. */
  override isMobile = false;

  override ngOnInit() {
    super.ngOnInit();
    this.editorService.updateEditorState({ isMobile: false });
  }

  override get currentMode(): 'all' | 'move' | 'resize' {
    const mode = this.visualEditorService.interactionMode;
    return mode === 'move' || mode === 'resize' ? mode : 'all';
  }

  override setMode(mode: 'all' | 'move' | 'resize') {
    this.visualEditorService.setInteractionMode(mode);
  }
}
