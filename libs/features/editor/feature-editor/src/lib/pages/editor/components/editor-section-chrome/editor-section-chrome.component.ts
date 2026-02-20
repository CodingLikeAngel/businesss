import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Shared section editor chrome: header (label + Editar) and preview-mode toggle.
 * Use in all editor sections so behaviour matches draggable-box and layout-section.
 */
@Component({
  selector: 'lib-editor-section-chrome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Section Header (hidden in preview unless showEditorControls) -->
    <div *ngIf="!isPreviewMode || showEditorControls" class="section-header">
      <div class="section-label">
        <span class="label-icon">{{ sectionIcon }}</span>
        <span class="label-text">{{ sectionLabel }}</span>
      </div>
      <div class="section-actions">
        <button
          class="action-btn"
          (click)="editClick.emit($event)"
          [title]="editButtonTitle">
          <span>🎯</span>
          <span class="btn-text">Editar</span>
        </button>
      </div>
    </div>

    <!-- Floating Toggle in Preview Mode -->
    <button
      *ngIf="isPreviewMode"
      type="button"
      class="preview-toggle-btn"
      (click)="togglePreview.emit()"
      [class.active]="showEditorControls"
      title="Mostrar/Ocultar opciones de edición">
      <span class="toggle-icon">{{ showEditorControls ? '✕' : '✏️' }}</span>
      <span class="toggle-text">{{ showEditorControls ? 'Ocultar edición' : 'Editar (activar modo aislado)' }}</span>
    </button>
  `,
  styles: [`
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      height: 50px;
    }
    .section-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #1e293b;
    }
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.75rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      color: #475569;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    .btn-text { display: none; }
    @media (min-width: 768px) {
      .btn-text { display: inline; }
    }
    .preview-toggle-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border: 2px solid rgba(255, 255, 255, 0.15);
      border-radius: 50px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    }
    .preview-toggle-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(99, 102, 241, 0.6);
    }
    .preview-toggle-btn.active {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-color: rgba(255, 255, 255, 0.3);
    }
    .toggle-icon { font-size: 1.1rem; }
    .toggle-text { font-size: 0.875rem; }
  `]
})
export class EditorSectionChromeComponent {
  @Input() sectionLabel = 'Sección';
  @Input() sectionIcon = '📦';
  @Input() isPreviewMode = false;
  @Input() showEditorControls = false;
  @Input() editButtonTitle = 'Modo Aislado (I)';

  @Output() editClick = new EventEmitter<Event>();
  @Output() togglePreview = new EventEmitter<void>();
}
