import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseEditorSectionComponent } from '../base-editor-section.component';
import { SimpleVisualEditorService } from '@negocio/shared-components';

@Component({
  selector: 'lib-editor-draggable-box-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section 
      [id]="section.id" 
      class="editor-section relative"
      style="min-height: 500px; position: relative; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1);">
      
      <!-- Draggable/Resizable Box -->
      <div 
        #editableBox
        [id]="section.id + '_box'"
        [attr.data-visual-editable]="section.id"
        class="draggable-box"
        [style.position]="'absolute'"
        [style.left.px]="boxLeft"
        [style.top.px]="boxTop"
        [style.width.px]="boxWidth"
        [style.height.px]="boxHeight"
        [style.backgroundColor]="section.styles['backgroundColor'] || '#10b981'"
        [style.border]="section.styles['border'] || '2px solid #059669'"
        [style.borderRadius]="section.styles['borderRadius'] || '12px'"
        [style.padding]="section.styles['padding'] || '20px'"
        [style.boxShadow]="section.styles['boxShadow'] || '0 10px 30px rgba(0,0,0,0.3)'"
        [style.zIndex]="10">
        
        <div class="box-content text-white text-center" style="pointer-events: none;">
          <h3 class="text-xl font-bold mb-2">{{ section.content['title'] || 'Draggable Box' }}</h3>
          <p class="text-sm opacity-80">{{ section.content['description'] || 'Click to select, then drag or resize!' }}</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .draggable-box {
      transition: box-shadow 0.2s;
      user-select: none;
    }

    .draggable-box:hover {
      box-shadow: 0 15px 40px rgba(0,0,0,0.4) !important;
    }
  `]
})
export class EditorDraggableBoxSectionComponent extends BaseEditorSectionComponent implements OnInit, AfterViewInit {
  @ViewChild('editableBox') editableBox!: ElementRef;
  
  private simpleEditor = inject(SimpleVisualEditorService);

  // Default position and size
  boxLeft = 50;
  boxTop = 50;
  boxWidth = 300;
  boxHeight = 200;

  ngOnInit() {
    // Load saved position/size from section.styles if available
    if (this.section.styles) {
      const left = this.section.styles['left'];
      const top = this.section.styles['top'];
      const width = this.section.styles['width'];
      const height = this.section.styles['height'];
      
      this.boxLeft = left ? parseInt(left) : this.boxLeft;
      this.boxTop = top ? parseInt(top) : this.boxTop;
      this.boxWidth = width ? parseInt(width) : this.boxWidth;
      this.boxHeight = height ? parseInt(height) : this.boxHeight;
    }
  }

  ngAfterViewInit() {
    // The SimpleVisualEditorService will automatically detect and register this element
    console.log('📦 Draggable box initialized:', this.section.id);
  }
}

