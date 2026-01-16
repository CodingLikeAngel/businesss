import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { VariantService, PageSection } from '../../../services/variant.service';

@Component({
  selector: 'lib-section-structure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-structure">
      <div class="structure-header">
        <h3>Estructura de la Página</h3>
        <p class="helper-text">
          Arrastra las secciones para reordenarlas o usa el ojo para ocultarlas.
        </p>
      </div>

      <div class="section-list" *ngIf="sections.length > 0; else emptyState">
        <div
          *ngFor="let section of sections; let i = index"
          class="section-item"
          [class.hidden-section]="!section.visible"
          [class.is-dragging]="draggedSectionIndex === i"
          [class.is-over]="overSectionIndex === i"
          draggable="true"
          (dragstart)="onDragStart(i)"
          (dragover)="onDragOver($event, i)"
          (dragend)="onDragEnd()"
        >
          <div class="section-drag-handle">
            <span class="handle-icon">⋮⋮</span>
          </div>

          <div class="section-info">
            <div class="section-header">
              <span class="section-type-badge" [attr.data-type]="section.type">
                {{ getSectionTypeIcon(section.type) }}
              </span>
              <span class="section-label">{{ section.label }}</span>
            </div>
            <div class="section-meta">
              <span class="section-id">{{ section.id }}</span>
              <span class="section-order">Orden: {{ i + 1 }}</span>
            </div>
          </div>

          <div class="section-actions">
            <button
              class="action-btn visibility-btn"
              [class.active]="section.visible"
              (click)="toggleSectionVisibility(section)"
              [title]="section.visible ? 'Ocultar sección' : 'Mostrar sección'"
            >
              {{ section.visible ? '👁️' : '🚫' }}
            </button>
            <button
              class="action-btn delete-btn"
              (click)="removeSection(i)"
              title="Eliminar sección"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <div class="empty-icon">📄</div>
          <h4>No hay secciones</h4>
          <p>Aún no has añadido ninguna sección a esta página.</p>
          <button class="add-first-section-btn" (click)="addSection.emit()">
            ➕ Añadir Primera Sección
          </button>
        </div>
      </ng-template>

      <div class="structure-footer" *ngIf="sections.length > 0">
        <button class="add-section-btn" (click)="addSection.emit()">
          ➕ Añadir Nueva Sección
        </button>
      </div>
    </div>
  `,
  styles: [`
    .section-structure {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .structure-header h3 {
      margin: 0 0 0.5rem 0;
      color: var(--color-text-inverse);
      font-size: 1.1rem;
      font-weight: 700;
    }

    .helper-text {
      margin: 0;
      color: var(--color-text-inverse-secondary);
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .section-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .section-item {
      background: rgba(255, 255, 255, 0.03);
      padding: 1rem 1.25rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      cursor: default;
      transition: all 0.2s ease;
      position: relative;
    }

    .section-item:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .section-item.hidden-section {
      opacity: 0.6;
      background: rgba(239, 68, 68, 0.05);
      border-color: rgba(239, 68, 68, 0.2);
    }

    .section-item.is-dragging {
      opacity: 0.4;
      border-style: dashed;
      transform: rotate(2deg);
    }

    .section-item.is-over {
      background: rgba(99, 102, 241, 0.1);
      border-color: #6366f1;
      transform: scale(1.02);
    }

    .section-drag-handle {
      cursor: grab;
      color: #64748b;
      font-size: 1.2rem;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .section-drag-handle:active {
      cursor: grabbing;
    }

    .section-drag-handle:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .handle-icon {
      display: block;
      line-height: 1;
      user-select: none;
    }

    .section-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .section-type-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 1rem;
      background: rgba(99, 102, 241, 0.2);
      color: #6366f1;
    }

    .section-type-badge[data-type="hero"] {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .section-type-badge[data-type="services"] {
      background: rgba(251, 191, 36, 0.2);
      color: #f59e0b;
    }

    .section-type-badge[data-type="contact"] {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .section-label {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--color-text-inverse);
    }

    .section-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: var(--color-text-inverse-secondary);
    }

    .section-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }

    .visibility-btn.active {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 16px;
      border: 2px dashed rgba(255, 255, 255, 0.1);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h4 {
      margin: 0 0 0.5rem 0;
      color: var(--color-text-inverse);
      font-size: 1.2rem;
    }

    .empty-state p {
      margin: 0 0 2rem 0;
      color: var(--color-text-inverse-secondary);
      font-size: 0.9rem;
    }

    .add-first-section-btn, .add-section-btn {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      border: none;
      padding: 0.875rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .add-first-section-btn:hover, .add-section-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
      background: linear-gradient(135deg, #4f46e5, #3730a3);
    }

    .structure-footer {
      display: flex;
      justify-content: center;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
  `]
})
export class SectionStructureComponent implements OnInit, OnDestroy {
  sections: PageSection[] = [];
  draggedSectionIndex: number | null = null;
  overSectionIndex: number | null = null;

  @Output() addSection = new EventEmitter<void>();
  @Output() sectionVisibilityChanged = new EventEmitter<PageSection>();
  @Output() sectionRemoved = new EventEmitter<number>();

  private subscriptions: Subscription[] = [];

  constructor(private variantService: VariantService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.variantService.sections$.subscribe(sections => {
        this.sections = sections;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getSectionTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      hero: '🚀',
      services: '🛠️',
      products: '🧩',
      testimonials: '⭐',
      pricing: '💰',
      promotions: '🎁',
      faq: '❓',
      gallery: '🖼️',
      contact: '📞',
      bubble: '🫧',
      features: '✨',
      stats: '📊'
    };
    return icons[type] || '📄';
  }

  toggleSectionVisibility(section: PageSection) {
    this.variantService.updateSectionInCurrentPage(section.id, { visible: !section.visible });
    this.sectionVisibilityChanged.emit(section);
  }

  removeSection(index: number) {
    if (confirm('¿Eliminar esta sección?')) {
      const section = this.sections[index];
      this.variantService.removeSectionFromCurrentPage(section.id);
      this.sectionRemoved.emit(index);
    }
  }

  // Drag and Drop Implementation
  onDragStart(index: number) {
    this.draggedSectionIndex = index;
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.overSectionIndex = index;
  }

  onDragEnd() {
    if (this.draggedSectionIndex !== null && this.overSectionIndex !== null) {
      this.moveSection(this.draggedSectionIndex, this.overSectionIndex);
    }
    this.draggedSectionIndex = null;
    this.overSectionIndex = null;
  }

  private moveSection(fromIndex: number, toIndex: number) {
    const currentPage = this.variantService.getCurrentPage();
    if (!currentPage) return;

    const sections = [...currentPage.sections];
    const [movedSection] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, movedSection);

    this.variantService.updatePage(currentPage.id, { sections });
  }
}