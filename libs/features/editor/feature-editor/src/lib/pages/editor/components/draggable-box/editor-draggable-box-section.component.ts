import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-draggable-box-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section 
      [id]="section.id" 
      class="editor-section relative"
      (click)="selectSection($event, section)">
      
      <!-- Draggable/Resizable Box -->
      <div 
        #editableBox
        [attr.data-visual-editable]="section.id"
        class="draggable-box"
        [style.position]="'absolute'"
        [style.left.px]="boxLeft"
        [style.top.px]="boxTop"
        [style.width.px]="boxWidth"
        [style.height.px]="boxHeight"
        [style.backgroundColor]="section.styles?.backgroundColor || '#ef4444'"
        [style.border]="section.styles?.border || '2px solid #dc2626'"
        [style.borderRadius]="section.styles?.borderRadius || '12px'"
        [style.padding]="section.styles?.padding || '20px'"
        [style.boxShadow]="section.styles?.boxShadow || '0 10px 30px rgba(0,0,0,0.3)'"
        [style.cursor]="'move'">
        
        <div class="box-content text-white text-center">
          <h3 class="text-xl font-bold mb-2">{{ section.content?.['title'] || 'Draggable Box' }}</h3>
          <p class="text-sm opacity-80">{{ section.content?.['description'] || 'Drag me around and resize!' }}</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 400px;
      position: relative;
    }

    .editor-section {
      min-height: 400px;
      position: relative;
      background: rgba(255,255,255,0.02);
      border: 1px dashed rgba(255,255,255,0.1);
    }

    .draggable-box {
      transition: box-shadow 0.2s;
      user-select: none;
    }

    .draggable-box:hover {
      box-shadow: 0 15px 40px rgba(0,0,0,0.4) !important;
    }

    .box-content {
      pointer-events: none;
    }
  `]
})
export class EditorDraggableBoxSectionComponent extends BaseEditorSectionComponent implements OnInit, AfterViewInit {
  @ViewChild('editableBox') editableBox!: ElementRef;

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
    // The VisualEditorService will automatically detect elements with data-visual-editable
    // and attach drag/resize handlers
  }
}
