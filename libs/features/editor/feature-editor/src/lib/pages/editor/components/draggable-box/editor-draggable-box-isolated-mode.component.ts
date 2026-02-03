import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIDraggableBox1Component, UIDraggableBox2Component, UIDraggableBox3Component } from '@negocio/ui-components';
import { SimpleVisualEditorService } from '@negocio/shared-components';
import { Subject, takeUntil } from 'rxjs';

export interface IsolatedModeConfig {
  sectionId: string;
  elementId: string;
  variant: string;
  content: any;
  styles: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

@Component({
  selector: 'lib-editor-draggable-box-isolated-mode',
  standalone: true,
  imports: [
    CommonModule,
    UIDraggableBox1Component,
    UIDraggableBox2Component,
    UIDraggableBox3Component
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-left">
            <span class="mode-badge">🎯 Modo Aislado</span>
            <h3 class="component-title">{{ config.elementId }}</h3>
          </div>
          <div class="header-right">
            <button class="control-btn" (click)="resetPosition()" title="Resetear posición">
              <span>↺</span>
            </button>
            <button class="control-btn" (click)="toggleGrid()" 
                    [class.active]="showGrid" 
                    title="Toggle grid">
              <span>#</span>
            </button>
            <button class="control-btn" (click)="toggleSnap()" 
                    [class.active]="snapToGrid" 
                    title="Snap to grid">
              <span>⊞</span>
            </button>
            <button class="close-btn" (click)="close()" title="Cerrar (Esc)">
              <span>✕</span>
            </button>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="isolated-canvas" 
             [class.show-grid]="showGrid"
             #canvas>
          
          <!-- Draggable Box Component -->
          <div class="draggable-wrapper"
               [attr.data-visual-editable]="config.elementId"
               [id]="config.elementId"
               [style.position]="'absolute'"
               [style.left.px]="currentPosition.x"
               [style.top.px]="currentPosition.y"
               [style.width.px]="currentSize.width"
               [style.height.px]="currentSize.height">
            
            <lib-ui-components-draggable-box-1
              *ngIf="config.variant === 'draggable-box-1'"
              [variant]="config.content['variant'] || 'secondary'"
              [rounded]="config.content['rounded'] || 'md'"
              [size]="config.content['size'] || 'md'"
              [dark]="config.content['dark'] || false"
              [content]="config.content['content'] || 'Drag me'"
              [customStyles]="config.styles || {}">
            </lib-ui-components-draggable-box-1>

            <lib-ui-components-draggable-box-2
              *ngIf="config.variant === 'draggable-box-2'"
              [variant]="config.content['variant'] || 'secondary'"
              [rounded]="config.content['rounded'] || 'md'"
              [size]="config.content['size'] || 'md'"
              [dark]="config.content['dark'] || false"
              [content]="config.content['content'] || 'Drag me'"
              [customStyles]="config.styles || {}">
            </lib-ui-components-draggable-box-2>

            <lib-ui-components-draggable-box-3
              *ngIf="config.variant === 'draggable-box-3'"
              [variant]="config.content['variant'] || 'secondary'"
              [rounded]="config.content['rounded'] || 'md'"
              [size]="config.content['size'] || 'md'"
              [dark]="config.content['dark'] || false"
              [content]="config.content['content'] || 'Drag me'"
              [customStyles]="config.styles || {}">
            </lib-ui-components-draggable-box-3>
          </div>

          <!-- Position Info -->
          <div class="position-info">
            <div class="info-item">
              <span class="label">X:</span>
              <span class="value">{{ currentPosition.x }}px</span>
            </div>
            <div class="info-item">
              <span class="label">Y:</span>
              <span class="value">{{ currentPosition.y }}px</span>
            </div>
            <div class="info-item">
              <span class="label">W:</span>
              <span class="value">{{ currentSize.width }}px</span>
            </div>
            <div class="info-item">
              <span class="label">H:</span>
              <span class="value">{{ currentSize.height }}px</span>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="isolated-mode-footer">
          <button class="btn btn-secondary" (click)="cancel()">
            Cancelar
          </button>
          <button class="btn btn-primary" (click)="apply()">
            Aplicar Cambios
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .isolated-mode-container {
      background: #1a1a2e;
      border-radius: 16px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      width: 90vw;
      max-width: 1400px;
      height: 85vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .isolated-mode-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 2rem;
      background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mode-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .component-title {
      color: #fff;
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }

    .header-right {
      display: flex;
      gap: 0.5rem;
    }

    .control-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1.125rem;
    }

    .control-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .control-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
    }

    .close-btn {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1.25rem;
      font-weight: bold;
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.3);
      transform: scale(1.05);
    }

    .isolated-canvas {
      flex: 1;
      background: #0f0f1e;
      position: relative;
      overflow: hidden;
    }

    .isolated-canvas.show-grid {
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    .draggable-wrapper {
      cursor: move;
      transition: box-shadow 0.2s;
    }

    .draggable-wrapper:hover {
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5);
    }

    .position-info {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      gap: 1.5rem;
      color: white;
      font-family: 'Courier New', monospace;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-item .label {
      font-size: 0.75rem;
      opacity: 0.6;
      text-transform: uppercase;
    }

    .info-item .value {
      font-size: 1rem;
      font-weight: 600;
      color: #667eea;
    }

    .isolated-mode-footer {
      padding: 1.5rem 2rem;
      background: #16213e;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 1rem;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  `]
})
export class EditorDraggableBoxIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  private visualEditor = inject(SimpleVisualEditorService);
  private destroy$ = new Subject<void>();

  currentPosition: { x: number; y: number } = { x: 100, y: 100 };
  currentSize: { width: number; height: number } = { width: 300, height: 200 };
  initialPosition: { x: number; y: number } = { x: 100, y: 100 };
  initialSize: { width: number; height: number } = { width: 300, height: 200 };

  showGrid = true;
  snapToGrid = false;

  ngOnInit() {
    // Load initial position and size
    this.currentPosition = { ...this.config.position };
    this.currentSize = { ...this.config.size };
    this.initialPosition = { ...this.config.position };
    this.initialSize = { ...this.config.size };

    // Enable visual editor
    setTimeout(() => {
      this.visualEditor.enableEditMode();
      
      // Listen for move events
      this.visualEditor.elementMoved$
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {
          if (event.id === this.config.elementId) {
            this.currentPosition = {
              x: Math.round(event.bounds.x),
              y: Math.round(event.bounds.y)
            };
          }
        });

      // Listen for resize events
      this.visualEditor.elementResized$
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {
          if (event.id === this.config.elementId) {
            this.currentSize = {
              width: Math.round(event.bounds.width),
              height: Math.round(event.bounds.height)
            };
          }
        });
    }, 100);

    // Listen for Escape key
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.visualEditor.deselect();
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.cancel();
    }
  };

  toggleGrid() {
    this.showGrid = !this.showGrid;
  }

  toggleSnap() {
    this.snapToGrid = !this.snapToGrid;
    // Note: Snap to grid logic would be implemented in the visual editor service
  }

  resetPosition() {
    this.currentPosition = { x: 100, y: 100 };
    this.currentSize = { width: 300, height: 200 };
  }

  onOverlayClick(event: MouseEvent) {
    // Close when clicking outside
    this.cancel();
  }

  cancel() {
    this.closed.emit();
  }

  close() {
    this.cancel();
  }

  apply() {
    const updatedConfig: IsolatedModeConfig = {
      ...this.config,
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    };
    this.applied.emit(updatedConfig);
    this.closed.emit();
  }
}
