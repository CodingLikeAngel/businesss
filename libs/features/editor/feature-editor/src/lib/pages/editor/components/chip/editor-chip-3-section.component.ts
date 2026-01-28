import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { UIChip3Component } from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-chip-3-section',
  standalone: true,
  imports: [
    CommonModule,
    UIChip3Component,
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
           [class.is-selected]="selectedElementId === section.id + '_chip-3'"
           (click)="selectElement($event, getMergedElement(section.id, section.id + '_chip-3', section.content, 'chip-3'))"
           [enhancedVisualEditable]="getComponentConfig()"
           elementId="{{section.id + '_chip-3'}}"
           sectionId="{{section.id}}"
           (visualEvents)="handleComponentEvent($event)">
        <lib-ui-components-chip-3
          [variant]="$any(section.content['variant'] || getVariant(section.id))"
          [rounded]="$any(section.content['rounded'] || 'full')"
          [size]="$any(section.content['size'] || 'md')"
          [dark]="$any(section.content['dark'] || false)"
          [removable]="$any(section.content['removable'] || false)"
          [selected]="$any(section.content['selected'] || false)"
          [disabled]="$any(section.content['disabled'] || false)"
          [interactive]="$any(section.content['interactive'] !== false)"
          [avatarSrc]="$any(section.content['avatarSrc'] || '')"
          [iconName]="$any(section.content['iconName'] || '')"
          [variantSystem]="$any(section.content['variantSystem'] || 'filled')"
          [multiSelected]="$any(section.content['multiSelected'] || false)"
          [customStyles]="section.styles || {}"
        >
          <ng-content>{{ section.content['text'] || 'Chip' }}</ng-content>
        </lib-ui-components-chip-3>
      </div>
    </div>
  `
})
export class EditorChip3SectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('componentElement', { static: true }) componentElement!: ElementRef;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.componentElement, this.section.id + '_chip-3');
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
    this.handleVisualEvent(event, this.section.id + '_chip-3');
  }
}
