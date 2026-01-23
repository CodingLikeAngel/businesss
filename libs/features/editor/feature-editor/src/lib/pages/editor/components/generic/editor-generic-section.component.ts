import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import {
  EnhancedVisualEditableDirective,
  VisualEditingConfig
} from '@negocio/shared-components';
import {
  UIButtonComponent,
  UIImageComponent,
  UITitleComponent,
  UICardComponent,
  UIInputComponent,
  UIChipComponent,
  UISpinnerComponent,
  UITableComponent,
  UIAccordionComponent
} from '@negocio/ui-components';

@Component({
  selector: 'lib-editor-generic-section',
  standalone: true,
  imports: [
    CommonModule,
    EnhancedVisualEditableDirective,
    // UI Components
    UIButtonComponent,
    UIImageComponent,
    UITitleComponent,
    UICardComponent,
    UIInputComponent,
    UIChipComponent,
    UISpinnerComponent,
    UITableComponent,
    UIAccordionComponent
  ],
  template: `
    <section
      #sectionElement
      class="editor-generic-section relative w-full overflow-hidden"
      [class.selected]="isActive"
      [style]="getSectionStyles()"
      [enhancedVisualEditable]="getSectionConfig()"
      [elementId]="section.id"
      [sectionId]="section.id"
      (visualEvents)="handleSectionEvent($event)">

      <!-- Section Content (Optional Title/Background logic could go here) -->

      <!-- Dynamic Elements -->
      <ng-container *ngFor="let element of section.elements; trackBy: trackByElementId">
        <div
          class="absolute"
          [enhancedVisualEditable]="getElementConfig(element)"
          [elementId]="element.id"
          [sectionId]="section.id"
          [style.left.px]="element.position.x"
          [style.top.px]="element.position.y"
          [style.width.px]="element.size?.width"
          [style.height.px]="element.size?.height"
          [style.zIndex]="element.zIndex"
          (visualEvents)="handleElementEvent($event, element.id)"
        >
          <!-- Element Content Switcher -->
          <ng-container [ngSwitch]="element.type">

            <lib-ui-components-button
              *ngSwitchCase="'button'"
              [style]="element.styles">
              {{ element.content.text || 'Button' }}
            </lib-ui-components-button>

            <lib-ui-image
              *ngSwitchCase="'image'"
              [src]="element.content.image || 'assets/placeholder.jpg'"
              [alt]="element.content.text || 'Image'"
              class="w-full h-full object-cover">
            </lib-ui-image>

            <lib-ui-components-title
              *ngSwitchCase="'heading'"
              [text]="element.content.text || 'Heading'"
              [level]="'h2'"
              [style]="element.styles">
            </lib-ui-components-title>

            <lib-ui-components-title
              *ngSwitchCase="'text'"
              [text]="element.content.text || 'Text block'"
              [level]="'h1'"
              [style]="element.styles">
            </lib-ui-components-title>

            <lib-ui-components-card
              *ngSwitchCase="'card'"
              class="w-full h-full block">
              <div class="p-4">
                <h3>{{ element.content.title || 'Card Title' }}</h3>
                <p>{{ element.content.description || 'Card description...' }}</p>
              </div>
            </lib-ui-components-card>

            <lib-ui-components-accordion
              *ngSwitchCase="'accordion'"
              [variant]="element.content.variant || 'default'"
              [items]="element.content.items || [{title:'Item 1', content:'Contenido 1'}, {title:'Item 2', content:'Contenido 2'}]">
            </lib-ui-components-accordion>

            <!-- Fallback -->
            <div *ngSwitchDefault class="p-2 border border-dashed border-gray-400 opacity-50">
              Unknown: {{ element.type }}
            </div>

          </ng-container>
        </div>
      </ng-container>
      
      <!-- Empty State -->
      <div *ngIf="!section.elements?.length" class="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/10 rounded-lg m-4 text-center">
        <h2 class="text-white text-xl font-semibold mb-2">Librería de Componentes</h2>
        <p class="text-white/70 text-sm">Pulsa sobre un componente para previsualizarlo y añadirlo a tu lienzo.</p>
      </div>

    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .editor-generic-section {
       min-height: 200px; /* Default height */
    }
  `]
})
export class EditorGenericSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChildren(EnhancedVisualEditableDirective) visualDirectives!: QueryList<EnhancedVisualEditableDirective>;
  @ViewChildren('sectionElement') sectionRef!: QueryList<ElementRef>;

  get isActive(): boolean {
    // You might want to link this to selection state
    return false; 
  }

  ngAfterViewInit() {
    // Parent logic handles setup via template directives mostly
    // But we can do extra initialization here if needed.
  }

  getSectionStyles(): any {
    // Combine base section styles with custom styles
    return {
      'position': 'relative', 
      'min-height': '300px',
      ...this.section.styles,
      // Map customStyles from data model
      ...(this.section.customStyles || {})
    };
  }

  trackByElementId(index: number, element: any): string {
    return element.id;
  }

  // Configuration for the section container itself
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

  // Configuration for child elements
  getElementConfig(element: any): VisualEditingConfig {
    return this.createElementConfig('element', {
      enableDrag: true,
      enableResize: true,
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
    });
  }

  handleElementEvent(event: any, elementId: string) {
     this.handleVisualEvent(event, elementId);
   }

   handleSectionEvent(event: any) {
     this.handleVisualEvent(event, this.section.id);
   }
 }
