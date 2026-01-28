import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { UIModal2Component } from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-modal-2-section',
  standalone: true,
  imports: [
    CommonModule,
    UIModal2Component,
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
           [class.is-selected]="selectedElementId === section.id + '_modal-2'"
           (click)="selectElement($event, getMergedElement(section.id, section.id + '_modal-2', section.content, 'modal-2'))"
           [enhancedVisualEditable]="getComponentConfig()"
           elementId="{{section.id + '_modal-2'}}"
           sectionId="{{section.id}}"
           (visualEvents)="handleComponentEvent($event)">
        <lib-ui-components-modal-2
          [variant]="$any(section.content['variant'] || 'secondary')"
          [rounded]="$any(section.content['rounded'] || 'md')"
          [size]="$any(section.content['size'] || 'md')"
          [dark]="section.content['dark'] || false"
          [title]="section.content['title'] || 'Modal Title'"
          [animationType]="$any(section.content['animationType'] || 'fade')"
          [resizable]="section.content['resizable'] || false"
          [content]="section.content['content'] || 'Modal Content'"
          [isOpen]="section.content['isOpen'] || false"
          [zIndex]="section.content['zIndex'] || 1000"
          [customStyles]="section.styles || {}"
          (modalOnClose)="onModalClose()"
        ></lib-ui-components-modal-2>
      </div>
    </div>
  `
})
export class EditorModal2SectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('componentElement', { static: true }) componentElement!: ElementRef;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.componentElement, this.section.id + '_modal-2');
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
    this.handleVisualEvent(event, this.section.id + '_modal-2');
  }

  onModalClose() {
    // Handle modal close event
  }
}
