import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, inject, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseEditorSectionComponent } from '../base-editor-section.component';
import { EditorDraggableBoxIsolatedModeComponent, IsolatedModeConfig } from './editor-draggable-box-isolated-mode.component';
import { UIDraggableBox1Component, UIDraggableBox2Component, UIDraggableBox3Component } from '@negocio/ui-components';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { Store } from '@ngrx/store';
import * as PageActions from '../../../../store/actions/page.actions';

@Component({
  selector: 'lib-editor-draggable-box-section',
  standalone: true,
  imports: [
    CommonModule, 
    EditorDraggableBoxIsolatedModeComponent,
    UIDraggableBox1Component,
    UIDraggableBox2Component,
    UIDraggableBox3Component
  ],
  template: `
    <section 
      [id]="section.id" 
      class="editor-section"
      [style.minHeight.px]="sectionHeight"
      [style.position]="'relative'">
      
      <!-- Section Header -->
      <div class="section-header">
        <div class="section-label">
          <span class="label-icon">📦</span>
          <span class="label-text">Draggable Box</span>
        </div>
        <div class="section-actions">
          <button 
            class="action-btn"
            (click)="openIsolatedMode()"
            title="Modo Aislado (I)">
            <span>🎯</span>
            <span class="btn-text">Editar</span>
          </button>
        </div>
      </div>

      <!-- Draggable/Resizable Box Container -->
      <div 
        class="box-container"
        [style.position]="'relative'"
        [style.minHeight.px]="containerHeight"
        [style.padding.px]="40">
        
        <!-- Draggable Box -->
        <div 
          #editableBox
          [id]="boxId"
          class="draggable-box"
          [class.is-dragging]="isDragging"
          [class.is-resizing]="isResizing"
          [style.position]="'absolute'"
          [style.left.px]="boxLeft"
          [style.top.px]="boxTop"
          [style.width.px]="boxWidth"
          [style.height.px]="boxHeight"
          [style.backgroundColor]="currentStyles.backgroundColor"
          [style.border]="currentStyles.borderWidth + 'px solid ' + currentStyles.borderColor"
          [style.borderRadius]="currentContent.rounded === 'md' ? (currentStyles.borderRadius + currentStyles.borderRadiusUnit) : null"
          [style.padding]="currentStyles.padding + currentStyles.paddingUnit"
          [style.boxShadow]="currentStyles.boxShadow"
          [style.zIndex]="10"
          (mousedown)="onMouseDown($event)">
          
          <!-- Resize Handles -->
          <div class="resize-handle nw" (mousedown)="startResize($event, 'nw')"></div>
          <div class="resize-handle n" (mousedown)="startResize($event, 'n')"></div>
          <div class="resize-handle ne" (mousedown)="startResize($event, 'ne')"></div>
          <div class="resize-handle e" (mousedown)="startResize($event, 'e')"></div>
          <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
          <div class="resize-handle s" (mousedown)="startResize($event, 's')"></div>
          <div class="resize-handle sw" (mousedown)="startResize($event, 'sw')"></div>
          <div class="resize-handle w" (mousedown)="startResize($event, 'w')"></div>
          
          <!-- Box Content - UI Components -->
          <div class="box-content-wrapper" (dblclick)="openIsolatedMode()">
            <!-- Quick Action Floating Button -->
            <button class="quick-isolated-btn" (click)="openIsolatedMode($event)" title="Editar en Modo Aislado (I)">
              🎯
            </button>

            <lib-ui-components-draggable-box-1
              *ngIf="currentContent.boxVariant === 'draggable-box-1' || !currentContent.boxVariant"
              [variant]="currentContent.variant || globalVariant || 'secondary'"
              [rounded]="currentContent.rounded || 'md'"
              [size]="currentContent.size || 'md'"
              [dark]="currentContent.dark || false"
              [content]="currentContent.title || 'Draggable Box'"
              [customStyles]="currentStyles">
            </lib-ui-components-draggable-box-1>

            <lib-ui-components-draggable-box-2
              *ngIf="currentContent.boxVariant === 'draggable-box-2'"
              [variant]="currentContent.variant || globalVariant || 'secondary'"
              [rounded]="currentContent.rounded || 'md'"
              [size]="currentContent.size || 'md'"
              [dark]="currentContent.dark || false"
              [content]="currentContent.title || 'Draggable Box'"
              [customStyles]="currentStyles">
            </lib-ui-components-draggable-box-2>

            <lib-ui-components-draggable-box-3
              *ngIf="currentContent.boxVariant === 'draggable-box-3'"
              [variant]="currentContent.variant || globalVariant || 'secondary'"
              [rounded]="currentContent.rounded || 'md'"
              [size]="currentContent.size || 'md'"
              [dark]="currentContent.dark || false"
              [content]="currentContent.title || 'Draggable Box'"
              [customStyles]="currentStyles">
            </lib-ui-components-draggable-box-3>
          </div>
        </div>

        <!-- Position/Size Info -->
        <div class="info-panel">
          <div class="info-row">
            <span class="info-label">Posición</span>
            <span class="info-value">{{ boxLeft }}px × {{ boxTop }}px</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tamaño</span>
            <span class="info-value">{{ boxWidth }}px × {{ boxHeight }}px</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Isolated Mode Modal -->
    <lib-editor-draggable-box-isolated-mode
      *ngIf="showIsolatedMode"
      [config]="isolatedConfig!"
      (closed)="closeIsolatedMode()"
      (applied)="applyIsolatedChanges($event)">
    </lib-editor-draggable-box-isolated-mode>
  `,
  styles: [`
    :host {
      display: block;
    }

    .editor-section {
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .editor-section:hover {
      border-color: rgba(102, 126, 234, 0.4);
      background: rgba(255, 255, 255, 0.04);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #fff;
      font-weight: 600;
    }

    .label-icon {
      font-size: 1.25rem;
    }

    .section-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-text {
      display: none;
    }

    @media (min-width: 768px) {
      .btn-text {
        display: inline;
      }
    }

    .box-container {
      position: relative;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255, 255, 255, 0.02) 10px,
        rgba(255, 255, 255, 0.02) 20px
      );
    }

    .draggable-box {
      cursor: move;
      user-select: none;
      transition: box-shadow 0.2s ease, transform 0.1s ease;
      border-radius: 12px;
    }

    .draggable-box:hover {
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5), 0 15px 40px rgba(0, 0, 0, 0.3) !important;
    }

    .draggable-box.is-dragging {
      cursor: grabbing;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.8), 0 20px 50px rgba(0, 0, 0, 0.4) !important;
      transform: scale(1.02);
    }

    .draggable-box.is-resizing {
      cursor: se-resize;
    }

    /* QUICK ISOLATED BUTTON */
    .quick-isolated-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      background: rgba(99, 102, 241, 0.9);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 20;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      pointer-events: all;
    }

    .draggable-box:hover .quick-isolated-btn {
      opacity: 1;
      transform: scale(1);
    }

    .quick-isolated-btn:hover {
      background: #6366f1;
      transform: scale(1.15) !important;
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
    }

    .box-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 100px;
      color: white;
      text-align: center;
      pointer-events: none;
      padding: 0.5rem;
    }

    .box-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .box-description {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.8;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    /* Resize Handles */
    .resize-handle {
      position: absolute;
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 2px solid white;
      border-radius: 50%;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .draggable-box:hover .resize-handle {
      opacity: 1;
    }

    .resize-handle:hover {
      transform: scale(1.3);
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }

    .resize-handle.nw { top: -7px; left: -7px; cursor: nw-resize; }
    .resize-handle.n { top: -7px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
    .resize-handle.nw:hover, .resize-handle.n:hover { transform: translateX(-50%) scale(1.3); }
    .resize-handle.ne { top: -7px; right: -7px; cursor: ne-resize; }
    .resize-handle.e { top: 50%; right: -7px; transform: translateY(-50%); cursor: e-resize; }
    .resize-handle.ne:hover, .resize-handle.e:hover { transform: translateY(-50%) scale(1.3); }
    .resize-handle.se { bottom: -7px; right: -7px; cursor: se-resize; }
    .resize-handle.s { bottom: -7px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
    .resize-handle.se:hover, .resize-handle.s:hover { transform: translateX(-50%) scale(1.3); }
    .resize-handle.sw { bottom: -7px; left: -7px; cursor: sw-resize; }
    .resize-handle.w { top: 50%; left: -7px; transform: translateY(-50%); cursor: w-resize; }
    .resize-handle.sw:hover, .resize-handle.w:hover { transform: translateY(-50%) scale(1.3); }

    .info-panel {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 0.75rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: white;
      font-family: 'SF Mono', 'Courier New', monospace;
      font-size: 0.75rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .info-label {
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      font-size: 0.65rem;
      letter-spacing: 0.5px;
    }

    .info-value {
      color: #667eea;
      font-weight: 600;
      font-size: 0.75rem;
    }
  `]
})
export class EditorDraggableBoxSectionComponent extends BaseEditorSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editableBox') editableBox!: ElementRef;
  
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  private persistSubject$ = new Subject<void>();

  // Box ID
  get boxId(): string { return this.section.id + '_box'; }

  // Position and size state
  boxLeft = 50;
  boxTop = 50;
  boxWidth = 300;
  boxHeight = 200;
  sectionHeight = 500;
  containerHeight = 400;

  // Current content and styles (merged from section and isolated mode)
  currentContent: any = {};
  currentStyles: any = {};

  // Isolated mode state
  showIsolatedMode = false;
  isolatedConfig: IsolatedModeConfig | null = null;

  // Drag/Resize state
  isDragging = false;
  isResizing = false;
  resizeHandle = '';
  dragStartX = 0;
  dragStartY = 0;
  startLeft = 0;
  startTop = 0;
  startWidth = 0;
  startHeight = 0;

  ngOnInit() {
    this.loadPositionFromStore();
    this.mergeContentAndStyles();
  }

  ngAfterViewInit() {
    // Debounce store persistence to avoid conflicts during drag
    this.persistSubject$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100)
      )
      .subscribe(() => {
        this.persistPositionToStoreImmediate();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Press 'I' to open isolated mode
    if ((event.key === 'i' || event.key === 'I') && !event.ctrlKey && !event.metaKey) {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
        this.openIsolatedMode();
      }
    }

    // Arrow keys for fine positioning
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
        event.preventDefault();
        const delta = event.shiftKey ? 10 : 1;
        this.handleArrowKey(event.key, delta);
      }
    }
  }

  private handleArrowKey(key: string, delta: number) {
    switch (key) {
      case 'ArrowUp': this.boxTop -= delta; break;
      case 'ArrowDown': this.boxTop += delta; break;
      case 'ArrowLeft': this.boxLeft -= delta; break;
      case 'ArrowRight': this.boxLeft += delta; break;
    }
    this.cdr.detectChanges();
    this.persistPositionToStore();
  }

  private mergeContentAndStyles() {
    this.currentContent = {
      ...this.section.content,
      title: this.section.content?.['title'] || 'Draggable Box',
      description: this.section.content?.['description'] || 'Arrastra y redimensiona este elemento',
      variant: this.section.content?.['variant'] || '',
      boxVariant: this.section.content?.['boxVariant'] || 'draggable-box-1'
    };

    const hasVariant = !!this.currentContent.variant && this.currentContent.variant !== 'default';
    const borderStyle = this.section.styles?.['border'] || '';
    
    // ROBUSTNESS: If we have a variant, we should allow backgroundColor to be empty so the variant can shine.
    // However, if there's no variant, we MUST have a fallback color so it's not invisible.
    this.currentStyles = {
      backgroundColor: this.section.styles?.['backgroundColor'] !== undefined 
        ? this.section.styles?.['backgroundColor'] 
        : (hasVariant ? '' : '#10b981'),
      borderColor: this.section.styles?.['borderColor'] !== undefined 
        ? this.section.styles?.['borderColor'] 
        : (hasVariant ? '' : this.extractBorderColor(borderStyle)),
      borderWidth: this.section.styles?.['borderWidth'] !== undefined 
        ? parseInt(this.section.styles?.['borderWidth'] as string) 
        : this.extractBorderWidth(borderStyle),
      borderRadius: parseInt(this.section.styles?.['borderRadius'] as string || '12') || 12,
      borderRadiusUnit: 'px',
      padding: parseInt(this.section.styles?.['padding'] as string || '20') || 20,
      paddingUnit: 'px',
      boxShadow: this.section.styles?.['boxShadow'] || '0 10px 30px rgba(0,0,0,0.3)'
    };
  }

  private extractBorderColor(border: string): string {
    if (!border) return '#059669';
    const match = border.match(/solid\s+(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))/);
    return match ? match[1] : '#059669';
  }

  private extractBorderWidth(border: string): number {
    if (!border) return 2;
    const match = border.match(/(\d+)px/);
    return match ? parseInt(match[1]) : 2;
  }

  private loadPositionFromStore() {
    if (this.section.styles) {
      const left = this.section.styles['left'];
      const top = this.section.styles['top'];
      const width = this.section.styles['width'];
      const height = this.section.styles['height'];
      
      if (left) this.boxLeft = parseInt(left) || this.boxLeft;
      if (top) this.boxTop = parseInt(top) || this.boxTop;
      if (width) this.boxWidth = parseInt(width) || this.boxWidth;
      if (height) this.boxHeight = parseInt(height) || this.boxHeight;

      this.updateSectionHeight();
    }
  }

  onMouseDown(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('resize-handle')) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startLeft = this.boxLeft;
    this.startTop = this.boxTop;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  startResize(event: MouseEvent, handle: string) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isResizing = true;
    this.resizeHandle = handle;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startLeft = this.boxLeft;
    this.startTop = this.boxTop;
    this.startWidth = this.boxWidth;
    this.startHeight = this.boxHeight;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.isDragging) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;
      
      this.boxLeft = Math.max(0, this.startLeft + deltaX);
      this.boxTop = Math.max(0, this.startTop + deltaY);
      
      this.updateSectionHeight();
      this.cdr.detectChanges();
    }
    
    if (this.isResizing) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;
      
      let newWidth = this.startWidth;
      let newHeight = this.startHeight;
      let newLeft = this.startLeft;
      let newTop = this.startTop;
      
      if (this.resizeHandle.includes('e')) {
        newWidth = Math.max(100, this.startWidth + deltaX);
      }
      if (this.resizeHandle.includes('w')) {
        newWidth = Math.max(100, this.startWidth - deltaX);
        newLeft = this.startLeft + deltaX;
      }
      if (this.resizeHandle.includes('s')) {
        newHeight = Math.max(100, this.startHeight + deltaY);
      }
      if (this.resizeHandle.includes('n')) {
        newHeight = Math.max(100, this.startHeight - deltaY);
        newTop = this.startTop + deltaY;
      }
      
      this.boxWidth = newWidth;
      this.boxHeight = newHeight;
      this.boxLeft = newLeft;
      this.boxTop = newTop;
      
      this.updateSectionHeight();
      this.cdr.detectChanges();
    }
  }

  private onMouseUp = () => {
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = '';
    
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    
    this.persistPositionToStore();
  };

  private updateSectionHeight() {
    this.sectionHeight = Math.max(500, this.boxTop + this.boxHeight + 100);
    this.containerHeight = this.sectionHeight - 80;
  }

  private persistPositionToStore() {
    this.persistSubject$.next();
  }

  private persistPositionToStoreImmediate() {
    const updatedStyles = {
      ...this.section.styles,
      left: `${this.boxLeft}px`,
      top: `${this.boxTop}px`,
      width: `${this.boxWidth}px`,
      height: `${this.boxHeight}px`,
      position: 'absolute',
      backgroundColor: this.currentStyles.backgroundColor,
      border: `${this.currentStyles.borderWidth}px solid ${this.currentStyles.borderColor}`,
      borderRadius: `${this.currentStyles.borderRadius}${this.currentStyles.borderRadiusUnit}`,
      padding: `${this.currentStyles.padding}${this.currentStyles.paddingUnit}`,
      boxShadow: this.currentStyles.boxShadow
    };

    const updatedContent = {
      ...this.section.content,
      title: this.currentContent.title,
      description: this.currentContent.description,
      variant: this.currentContent.variant,
      boxVariant: this.currentContent.boxVariant
    };

    this.store.dispatch(PageActions.updateSection({
      sectionId: this.section.id,
      changes: { 
        styles: updatedStyles,
        content: updatedContent
      }
    }));
  }

  openIsolatedMode(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    document.body.classList.add('isolated-mode-active');
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.boxId,
      variant: this.currentContent.boxVariant || 'draggable-box-1',
      globalVariant: this.globalVariant,
      content: { ...this.currentContent },
      styles: {
        ...this.section.styles,
        backgroundColor: this.currentStyles.backgroundColor,
        border: `${this.currentStyles.borderWidth}px solid ${this.currentStyles.borderColor}`,
        borderRadius: `${this.currentStyles.borderRadius}${this.currentStyles.borderRadiusUnit}`,
        padding: `${this.currentStyles.padding}${this.currentStyles.paddingUnit}`,
        boxShadow: this.currentStyles.boxShadow
      },
      position: { x: this.boxLeft, y: this.boxTop },
      size: { width: this.boxWidth, height: this.boxHeight }
    };

    this.showIsolatedMode = true;
  }

  closeIsolatedMode() {
    document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
    this.isolatedConfig = null;
  }

  applyIsolatedChanges(config: IsolatedModeConfig) {
    this.boxLeft = config.position.x;
    this.boxTop = config.position.y;
    this.boxWidth = config.size.width;
    this.boxHeight = config.size.height;

    this.currentContent = {
      ...this.currentContent,
      title: config.content.title,
      description: config.content.description,
      variant: config.content.variant,
      boxVariant: config.content.boxVariant,
      rounded: config.content.rounded,
      size: config.content.size,
      dark: config.content.dark
    };

    const borderStyle = config.styles.border || '';
    this.currentStyles.backgroundColor = config.styles.backgroundColor;
    this.currentStyles.borderColor = config.styles.borderColor || this.extractBorderColor(borderStyle);
    this.currentStyles.borderWidth = parseInt(config.styles.borderWidth as string) || this.extractBorderWidth(borderStyle);
    this.currentStyles.borderRadius = parseInt(config.styles.borderRadius as string || '12') || 12;
    this.currentStyles.padding = parseInt(config.styles.padding as string || '20') || 20;
    this.currentStyles.boxShadow = config.styles.boxShadow;

    this.updateSectionHeight();
    this.cdr.detectChanges();
    this.persistPositionToStore();
    this.closeIsolatedMode();
  }
}
