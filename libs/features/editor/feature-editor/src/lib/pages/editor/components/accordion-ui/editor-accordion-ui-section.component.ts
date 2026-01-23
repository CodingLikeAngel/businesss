import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import {
  EnhancedVisualEditableDirective,
  VisualEditingConfig
} from '@negocio/shared-components';
import {
  UIAccordionComponent
} from '@negocio/ui-components';

@Component({
  selector: 'lib-editor-accordion-ui-section',
  standalone: true,
  imports: [
    CommonModule,
    EnhancedVisualEditableDirective,
    UIAccordionComponent
  ],
  template: `
    <section
      #sectionElement
      class="editor-accordion-ui-section relative w-full overflow-hidden"
      [class.selected]="isActive"
      [style]="getSectionStyles()"
      [enhancedVisualEditable]="getSectionConfig()"
      [elementId]="section.id"
      [sectionId]="section.id"
      (visualEvents)="handleSectionEvent($event)">

      <lib-ui-components-accordion
        [items]="section.content['items'] || [{ title: 'Accordion Item 1', content: 'Content 1' }, { title: 'Accordion Item 2', content: 'Content 2' }]"
        [variant]="section.content['variant'] || 'default'"
        [customStyles]="section.content['accordionStyles'] || {}"
      >
      </lib-ui-components-accordion>

    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .editor-accordion-ui-section {
      min-height: 200px;
    }
  `]
})
export class EditorAccordionUiSectionComponent extends EnhancedBaseEditorSectionComponent {
  get isActive(): boolean {
    return false;
  }

  getSectionStyles(): any {
    return {
      'position': 'relative',
      'min-height': '300px',
      ...this.section.styles,
      ...(this.section.customStyles || {})
    };
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      enableDrag: false,
      enableResize: true,
      constraints: {
        containment: 'parent',
        minDistance: { top: 0, right: 0, bottom: 0, left: 0 },
        collisionDetection: false,
        safeZones: []
      },
      styling: {
        selectionOutline: '2px dashed #6366f1',
        hoverEffects: true,
        dimensionLabels: true,
        resizeHandles: true
      }
    });
  }

  handleSectionEvent(event: any) {
    this.handleVisualEvent(event, this.section.id);
  }
}