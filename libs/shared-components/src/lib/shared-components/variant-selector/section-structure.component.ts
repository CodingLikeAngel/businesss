import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { VariantService, PageSection } from '../../../services/variant.service';

@Component({
  selector: 'lib-section-structure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="structure-v2">
      <!-- Header -->
      <header class="editor-header">
        <div class="header-main">
          <h2>Arquitectura</h2>
          <span class="badge" *ngIf="sections.length > 0">{{ sections.length }} BLOQUES</span>
        </div>
        <p class="subtitle">Ordena, oculta o elimina los componentes de tu lienzo.</p>
      </header>

      <!-- Section List -->
      <div class="list-v2-container" *ngIf="sections.length > 0; else emptyState">
        <div *ngFor="let section of sections; let i = index"
             class="section-v2-card"
             [class.hidden-v2]="!section.visible"
             [class.dragging]="draggedSectionIndex === i"
             [class.drag-over]="overSectionIndex === i"
             (click)="onSelectSection(section)"
             draggable="true"
             (dragstart)="onDragStart(i)"
             (dragover)="onDragOver($event, i)"
             (dragend)="onDragEnd()">
            
            <div class="drag-handle-v2">
                <span class="dots"></span>
            </div>

            <div class="section-v2-content">
                <div class="content-header">
                    <div class="type-icon-wrapper" [attr.data-type]="section.type">
                        {{ getSectionTypeIcon(section.type) }}
                    </div>
                    <div class="text-group">
                        <span class="section-title">{{ section.label }}</span>
                        <span class="section-id">#{{ section.id.substring(0, 8) }}</span>
                    </div>
                </div>
            </div>

            <div class="actions-v2">
                <button class="mini-icon-btn" 
                        [class.active]="section.visible"
                        (click)="toggleSectionVisibility(section); $event.stopPropagation()"
                        [title]="section.visible ? 'Ocultar' : 'Mostrar'">
                    {{ section.visible ? '👁️' : '🚫' }}
                </button>
                <button class="mini-icon-btn delete" 
                        (click)="removeSection(i); $event.stopPropagation()"
                        title="Eliminar">
                    ×
                </button>
            </div>

            <div class="active-indicator" *ngIf="i === overSectionIndex"></div>
        </div>
      </div>

      <!-- Add Button -->
      <div class="footer-actions" *ngIf="sections.length > 0">
        <button class="add-section-v2" (click)="addSection.emit()">
            <span class="plus-icon">+</span> AÑADIR NUEVO BLOQUE
        </button>
      </div>

      <!-- Empty State Template -->
      <ng-template #emptyState>
        <div class="empty-state-v2">
          <div class="empty-glow-v2">🏗️</div>
          <h4>Lienzo en Blanco</h4>
          <p>Comienza a construir tu visión añadiendo el primer bloque de contenido.</p>
          <button class="primary-add-btn" (click)="addSection.emit()">
            + CREAR PRIMERA SECCIÓN
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .structure-v2 {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-bottom: 2rem;
    }

    .editor-header {
      .header-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        h2 { font-size: 1.25rem; font-weight: 800; color: white; margin: 0; }
        .badge {
          font-size: 0.6rem;
          font-weight: 900;
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
      }
      .subtitle { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0; line-height: 1.4; }
    }

    .list-v2-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .section-v2-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.1);
            transform: translateY(-1px);
        }

        &.hidden-v2 {
            opacity: 0.5;
            filter: grayscale(0.5);
            background: rgba(0, 0, 0, 0.2);
        }

        &.dragging {
            opacity: 0.4;
            transform: scale(0.95) rotate(-1deg);
            border: 2px dashed rgba(255, 255, 255, 0.2);
        }

        &.drag-over {
            padding-top: 1.5rem;
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: #10b981;
                box-shadow: 0 0 10px #10b981;
            }
        }

        .drag-handle-v2 {
            cursor: grab;
            padding: 0.5rem;
            .dots {
                display: block;
                width: 4px;
                height: 4px;
                background: #475569;
                border-radius: 50%;
                box-shadow: 0 8px #475569, 0 -8px #475569, 6px 0 #475569, 6px 8px #475569, 6px -8px #475569;
            }
            &:active { cursor: grabbing; }
        }

        .section-v2-content {
            flex: 1;
            .content-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                
                .type-icon-wrapper {
                    width: 32px;
                    height: 32px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .text-group {
                    display: flex;
                    flex-direction: column;
                    .section-title { font-size: 0.85rem; font-weight: 700; color: #f1f5f9; }
                    .section-id { font-size: 0.65rem; color: #64748b; font-family: monospace; }
                }
            }
        }

        .actions-v2 {
            display: flex;
            gap: 0.25rem;
            .mini-icon-btn {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
                color: #94a3b8;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.9rem;
                transition: all 0.2s;
                &:hover { background: rgba(255, 255, 255, 0.08); color: white; }
                &.active { color: #10b981; background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
                &.delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
            }
        }
    }

    .footer-actions {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .add-section-v2 {
        width: 100%;
        background: rgba(255, 255, 255, 0.03);
        border: 1px dashed rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 0.75rem;
        color: #94a3b8;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        &:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.3); color: white; transform: translateY(-2px); }
    }

    .empty-state-v2 {
        text-align: center;
        padding: 4rem 1.5rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px dashed rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        
        .empty-glow-v2 {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.4));
        }

        h4 { font-size: 1.1rem; color: white; margin: 0; }
        p { font-size: 0.85rem; color: #64748b; margin: 0.75rem 0 1.5rem; line-height: 1.5; }

        .primary-add-btn {
            background: #10b981;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 0.75rem;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            transition: all 0.2s;
            &:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); }
        }
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
  @Output() sectionSelected = new EventEmitter<PageSection>();

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

  onSelectSection(section: PageSection) {
    this.sectionSelected.emit(section);
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