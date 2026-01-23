import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseEditorFeatureComponent } from '../../base-editor-feature.component';
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
      class="editor-accordion-ui-section cursor-pointer py-12"
      [class.is-selected]="selectedSectionId === section.id"
      (click)="selectSection($event, section)"
      [enhancedVisualEditable]="getSectionConfig()"
      sectionId="{{section.id}}"
      (visualEvents)="handleSectionEvent($event)">

      <div class="container mx-auto px-6 max-w-3xl relative">
        <lib-ui-components-accordion #accordionElement
          [items]="section.content['items'] || [{ title: 'Accordion Item 1', content: 'Content 1' }, { title: 'Accordion Item 2', content: 'Content 2' }]"
          [variant]="section.content['variant'] || getVariant(section.id)"
          [customStyles]="section.content['accordionStyles'] || {}"
          class="editor-element"
          [class.is-selected]="selectedElementId === section.id + '_accordion'"
          (click)="selectElement($event, getMergedElement(section.id, section.id + '_accordion', { content: section.content, styles: section.content['accordionStyles'] }, 'accordion'))"
          [enhancedVisualEditable]="getAccordionConfig()"
          elementId="{{section.id + '_accordion'}}"
          sectionId="{{section.id}}"
          (visualEvents)="handleAccordionEvent($event)">
        </lib-ui-components-accordion>
      </div>

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
export class EditorAccordionUiSectionComponent extends BaseEditorFeatureComponent implements OnInit {
  @Input() section: any;
  @ViewChildren(EnhancedVisualEditableDirective) visualDirectives!: QueryList<EnhancedVisualEditableDirective>;
  @ViewChildren('sectionElement') sectionRef!: QueryList<ElementRef>;

  override ngOnInit() {
    // Initialize component
  }

  get selectedSectionId() {
    return this.uiStateService.selectedSection?.id;
  }

  get selectedElementId() {
    return this.uiStateService.selectedElement?.id;
  }

  override selectSection(event: Event, section: any) {
    event.stopPropagation();
    console.log('Selecting accordion UI section:', section.id);

    const sectionCopy = {
      ...section,
      content: { ...(section.content || {}) },
      styles: { ...(section.styles || {}) }
    };

    this.uiStateService.selectSection(sectionCopy);
  }

  override selectElement(event: Event, element: any) {
    event.stopPropagation();

    console.log('Selecting accordion element:', element);
    this.uiStateService.selectElement(element);
  }

  getMergedElement(sectionId: string, elementId: string, element: any, type: string) {
    return {
      id: elementId,
      sectionId: sectionId,
      type: type,
      content: element.content,
      styles: element.styles,
      _original: element
    };
  }

  getSectionConfig(): VisualEditingConfig {
    return {
      type: 'section',
      enableDrag: false,
      enableResize: true,
      mobileSupport: true,
      interactions: {
        touchEnabled: true,
        multiSelect: false,
        snapToGrid: 0 as any,
        animationDuration: 300,
        hapticFeedback: false
      },
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
    };
  }

  getAccordionConfig(): VisualEditingConfig {
    return {
      type: 'element',
      enableDrag: false,
      enableResize: true,
      mobileSupport: true,
      interactions: {
        touchEnabled: true,
        multiSelect: false,
        snapToGrid: 0 as any,
        animationDuration: 300,
        hapticFeedback: false
      },
      constraints: {
        containment: 'parent',
        minDistance: { top: 0, right: 0, bottom: 0, left: 0 },
        collisionDetection: false,
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #3b82f6',
        resizeHandles: true,
        hoverEffects: true,
        dimensionLabels: true
      }
    };
  }

  handleSectionEvent(event: any) {
    // Handle section events
  }

  handleAccordionEvent(event: any) {
    // Handle accordion events
  }
}