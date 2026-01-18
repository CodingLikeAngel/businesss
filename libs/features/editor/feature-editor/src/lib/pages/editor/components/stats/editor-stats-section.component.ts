import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  StatsConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import {
  UITitleComponent,
  UICardComponent,
  UIStatsLibSectionComponent
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-stats-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardComponent,
    UIStatsLibSectionComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-stats-section.component.html'
})
export class EditorStatsSectionComponent extends BaseEditorSectionComponent {
  @Input() statsConfig!: StatsConfig;
}
