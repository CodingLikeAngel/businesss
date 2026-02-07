import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UISpacerComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-spacer-section',
  standalone: true,
  imports: [
    CommonModule,
    UISpacerComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  template: `
    <div
      #sectionElement
      class="editor-spacer-section group relative transition-all duration-300"
      [class.is-selected]="selectedSectionId === section.id"
      (click)="selectSection($event, section)"
      [applyDynamicStyles]="section.styles"
      [enhancedVisualEditable]="getSpacerConfig()"
      sectionId="{{ section.id }}"
      (visualEvents)="handleVisualEvent($event, section.id)"
    >
      <!-- Resize Label Overlay -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="bg-indigo-600/90 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md shadow-lg border border-white/20">
          Espaciador: {{ section.styles['height'] || '50px' }}
        </div>
      </div>

      <lib-ui-spacer
        [variant]="section.content['variant'] || 'empty'"
        [height]="section.styles['height'] || '50px'"
        [customStyles]="section.content['customStyles'] || {}"
        class="w-full block"
      >
      </lib-ui-spacer>

      <!-- Drag handle hint if selected -->
      <div *ngIf="selectedSectionId === section.id" class="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500/50 animate-pulse"></div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .editor-spacer-section {
      min-height: 20px;
      cursor: row-resize;
      &:hover {
        background: rgba(99, 102, 241, 0.03);
      }
      &.is-selected {
        background: rgba(99, 102, 241, 0.05);
        outline: 1px dashed #6366f1;
      }
    }
  `]
})
export class EditorSpacerSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement') sectionElement!: ElementRef;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id, {
      enableDrag: false,
      enableResize: true,
      constraints: {
        lockAspectRatio: false,
        minHeight: 20,
        maxHeight: 1000
      }
    });
  }

  getSpacerConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      styling: {
        selectionOutline: '2px solid #6366f1',
        resizeHandles: true,
        // Only show bottom/middle handles for vertical resize
        handlePositions: ['s'] 
      }
    });
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id && event.type === 'resized') {
      this.updateHeight(event.bounds.height);
    }
  }

  private updateHeight(height: number) {
    const newHeight = `${height}px`;
    if (this.section.styles['height'] !== newHeight) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        styles: {
          ...this.section.styles,
          height: newHeight,
          minHeight: newHeight
        }
      });
    }
  }
}
