import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardAnimatedComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-card-animated-section',
  standalone: true,
  imports: [
    CommonModule,
    UICardAnimatedComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-card-animated-section.component.html'
})
export class EditorCardAnimatedSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement') sectionElement!: ElementRef;
  @ViewChild('cardElement') cardElement!: ElementRef;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.cardElement, this.section.id + '_animated_card');
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', { enableDrag: false, enableResize: true });
  }

  getElementConfig(): VisualEditingConfig {
    return this.createElementConfig('element', { enableDrag: true, enableResize: true });
  }
}
