import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { UIButton2Component } from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-button-2-section',
  standalone: true,
  imports: [
    CommonModule,
    UIButton2Component,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  template: `
    <div #sectionElement
      class="editor-section cursor-pointer py-4 transition-all"
      [class.is-selected]="selectedSectionId === section.id"
      (click)="selectSection($event, section)"
      [applyDynamicStyles]="section.styles"
      [enhancedVisualEditable]="getSectionConfig()"
      sectionId="{{section.id}}"
      (visualEvents)="handleSectionEvent($event)">

      <div #componentElement class="editor-element"
           [class.is-selected]="selectedElementId === section.id + '_button-2'"
           (click)="selectElement($event, getMergedElement(section.id, section.id + '_button-2', section.content, 'button-2'))"
           [enhancedVisualEditable]="getComponentConfig()"
           elementId="{{section.id + '_button-2'}}"
           sectionId="{{section.id}}"
           (visualEvents)="handleComponentEvent($event)">
        <lib-ui-components-button-2
          [variant]="$any(section.content['variant'] || getVariant(section.id))"
          [leadingIcon]="section.content['leadingIcon']"
          [trailingIcon]="section.content['trailingIcon']"
          [ariaLabel]="section.content['ariaLabel']"
          [disabled]="section.content['disabled']"
          [customStyles]="section.styles || {}"
          [loading]="section.content['loading']"
          [expanded]="section.content['expanded']"
          [pressed]="section.content['pressed']"
          [soundUrl]="section.content['soundUrl']"
          [haptic]="section.content['haptic']"
        >
          <ng-content>{{ section.content['text'] || 'Button' }}</ng-content>
        </lib-ui-components-button-2>
      </div>
    </div>
  `
})
export class EditorButton2SectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('componentElement', { static: true }) componentElement!: ElementRef;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.componentElement, this.section.id + '_button-2');
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  getComponentConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleComponentEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_button-2');
  }
}
