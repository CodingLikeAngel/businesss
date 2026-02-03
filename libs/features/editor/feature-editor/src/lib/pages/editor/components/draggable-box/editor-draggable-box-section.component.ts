import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseEditorSectionComponent } from '../base-editor-section.component';
import { SimpleVisualEditorService } from '@negocio/shared-components';
import { EditorDraggableBoxIsolatedModeComponent, IsolatedModeConfig } from './editor-draggable-box-isolated-mode.component';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { Store } from '@ngrx/store';
import * as PageActions from '../../../../store/actions/page.actions';

@Component({
  selector: 'lib-editor-draggable-box-section',
  standalone: true,
  imports: [CommonModule, EditorDraggableBoxIsolatedModeComponent],
  template: `
    <section 
      [id]="section.id" 
      class="editor-section relative group"
      style="min-height: 500px; position: relative; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1);">
      
      <!-- Floating Action Button for Isolated Mode -->
      <button 
        class="isolated-mode-trigger"
        (click)="openIsolatedMode()"
        title="Abrir en modo aislado (I)">
        <span class="icon">🎯</span>
        <span class="text">Modo Aislado</span>
      </button>

      <!-- Draggable/Resizable Box -->
      <div 
        #editableBox
        [id]="section.id + '_box'"
        [attr.data-visual-editable]="section.id + '_box'"
        [attr.sectionId]="section.id"
        [attr.elementId]="section.id + '_box'"
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

      <!-- Position/Size Debug Info -->
      <div class="debug-info">
        <div class="debug-item">X: {{ boxLeft }}px</div>
        <div class="debug-item">Y: {{ boxTop }}px</div>
        <div class="debug-item">W: {{ boxWidth }}px</div>
        <div class="debug-item">H: {{ boxHeight }}px</div>
      </div>
    </section>

    <!-- Isolated Mode Modal -->
    <lib-editor-draggable-box-isolated-mode
      *ngIf="showIsolatedMode"
      [config]="isolatedConfig"
      (closed)="closeIsolatedMode()"
      (applied)="applyIsolatedChanges($event)">
    </lib-editor-draggable-box-isolated-mode>
  `,
  styles: [`
    :host {
      display: block;
    }

    .editor-section {
      transition: all 0.3s;
    }

    .editor-section:hover .isolated-mode-trigger {
      opacity: 1;
      transform: translateY(0);
    }

    .isolated-mode-trigger {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      transform: translateY(-10px);
      z-index: 100;
    }

    .isolated-mode-trigger:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .isolated-mode-trigger .icon {
      font-size: 1.25rem;
    }

    .draggable-box {
      transition: box-shadow 0.2s, transform 0.2s;
      user-select: none;
      cursor: move;
    }

    .draggable-box:hover {
      box-shadow: 0 15px 40px rgba(0,0,0,0.4) !important;
      transform: scale(1.02);
    }

    .debug-info {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.75rem;
      display: flex;
      gap: 1rem;
      color: white;
      font-family: 'Courier New', monospace;
      font-size: 0.75rem;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .debug-info:hover {
      opacity: 1;
    }

    .debug-item {
      color: #667eea;
      font-weight: 600;
    }
  `]
})
export class EditorDraggableBoxSectionComponent extends BaseEditorSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editableBox') editableBox!: ElementRef;
  
  private simpleEditor = inject(SimpleVisualEditorService);
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  private persistSubject$ = new Subject<void>();

  // Position and size state
  boxLeft = 50;
  boxTop = 50;
  boxWidth = 300;
  boxHeight = 200;

  // Isolated mode state
  showIsolatedMode = false;
  isolatedConfig!: IsolatedModeConfig;

  ngOnInit() {
    // Load saved position/size from section.styles if available
    this.loadPositionFromStore();

    // Listen for keyboard shortcut 'I' to open isolated mode
    document.addEventListener('keydown', this.handleKeyPress);
  }

  ngAfterViewInit() {
    console.log('📦 Draggable box initialized:', this.section.id);
    console.log('📦 Listening for element ID:', this.section.id + '_box');
    
    // Debounce store persistence to avoid conflicts during drag
    this.persistSubject$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100) // Wait 100ms after drag stops before persisting
      )
      .subscribe(() => {
        this.persistPositionToStoreImmediate();
      });
    
    // Listen for move and resize events
    this.simpleEditor.elementMoved$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        console.log('📦 elementMoved$ event received:', event.id, 'looking for:', this.section.id + '_box');
        if (event.id === this.section.id + '_box') {
          console.log('✅ Match! Calling handleElementMoved');
          this.handleElementMoved(event.bounds, event.id);
        }
      });

    this.simpleEditor.elementResized$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        console.log('📦 elementResized$ event received:', event.id);
        if (event.id === this.section.id + '_box') {
          console.log('✅ Match! Calling handleElementResized');
          this.handleElementResized(event.bounds, event.id);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  private handleKeyPress = (e: KeyboardEvent) => {
    // Press 'I' to open isolated mode when section is selected
    if (e.key === 'i' || e.key === 'I') {
      const selectedSection = (this.simpleEditor as any).selectedElement;
      if (selectedSection && selectedSection.id === this.section.id + '_box') {
        this.openIsolatedMode();
      }
    }
  };

  private loadPositionFromStore() {
    if (this.section.styles) {
      const left = this.section.styles['left'];
      const top = this.section.styles['top'];
      const width = this.section.styles['width'];
      const height = this.section.styles['height'];
      
      this.boxLeft = left ? parseInt(left) : this.boxLeft;
      this.boxTop = top ? parseInt(top) : this.boxTop;
      this.boxWidth = width ? parseInt(width) : this.boxWidth;
      this.boxHeight = height ? parseInt(height) : this.boxHeight;

      console.log('📍 Loaded position from store:', { 
        left: this.boxLeft, 
        top: this.boxTop, 
        width: this.boxWidth, 
        height: this.boxHeight 
      });
    }
  }

  // Handle element moved - DON'T override base class to avoid emitting to parent
  // The parent's onElementMoved doesn't know how to handle draggable-box styles
  handleElementMoved(bounds: any, elementId: string) {
    console.log('📍 Element moved:', elementId, bounds);
    
    // CRITICAL FIX: Get the actual left/top from the element's style
    // bounds.x and bounds.y are viewport coordinates, not local coordinates
    // We need to read the actual CSS left/top that SimpleVisualEditorService set
    const element = document.getElementById(elementId);
    if (element) {
      const computedStyle = window.getComputedStyle(element);
      const left = computedStyle.left;
      const top = computedStyle.top;
      
      // Parse the pixel values
      this.boxLeft = left ? parseInt(left) : Math.round(bounds.x);
      this.boxTop = top ? parseInt(top) : Math.round(bounds.y);
      
      console.log('📍 Extracted position from element:', { left: this.boxLeft, top: this.boxTop });
    } else {
      // Fallback to bounds if element not found
      this.boxLeft = Math.round(bounds.x);
      this.boxTop = Math.round(bounds.y);
    }
    
    // Trigger manual change detection to update the view
    this.cdr.detectChanges();

    // Persist to store (debounced)
    this.persistPositionToStore();
  }

  // Handle element resized - DON'T override base class
  handleElementResized(bounds: any, elementId: string) {
    console.log('📐 Element resized:', elementId, bounds);
    
    this.boxWidth = Math.round(bounds.width);
    this.boxHeight = Math.round(bounds.height);
    
    // Trigger manual change detection
    this.cdr.detectChanges();

    // Persist to store (debounced)
    this.persistPositionToStore();
  }

  private persistPositionToStore() {
    // Trigger the debounced persist
    this.persistSubject$.next();
  }

  private persistPositionToStoreImmediate() {
    const updatedStyles = {
      ...this.section.styles,
      left: `${this.boxLeft}px`,
      top: `${this.boxTop}px`,
      width: `${this.boxWidth}px`,
      height: `${this.boxHeight}px`,
      position: 'absolute'
    };

    console.log('💾 Persisting to store:', updatedStyles);

    // Dispatch action to update section styles
    this.store.dispatch(PageActions.updateSection({
      sectionId: this.section.id,
      changes: { styles: updatedStyles }
    }));
  }

  openIsolatedMode() {
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_box',
      variant: 'draggable-box-1', // Could be dynamic based on section type
      content: this.section.content || {},
      styles: this.section.styles || {},
      position: { x: this.boxLeft, y: this.boxTop },
      size: { width: this.boxWidth, height: this.boxHeight }
    };

    this.showIsolatedMode = true;
    console.log('🎯 Opening isolated mode with config:', this.isolatedConfig);
  }

  closeIsolatedMode() {
    this.showIsolatedMode = false;
  }

  applyIsolatedChanges(config: IsolatedModeConfig) {
    console.log('✅ Applying changes from isolated mode:', config);
    
    // Update local state
    this.boxLeft = config.position.x;
    this.boxTop = config.position.y;
    this.boxWidth = config.size.width;
    this.boxHeight = config.size.height;

    // Persist to store
    this.persistPositionToStore();
  }
}

