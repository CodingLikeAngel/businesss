import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VariantService, Page } from '../../../services/variant.service';

@Component({
  selector: 'lib-page-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-management">
      <div class="current-page-indicator" *ngIf="currentPage">
        <div class="indicator-content">
          <div class="page-icon">📄</div>
          <div class="page-details">
            <strong>{{ currentPage.name }}</strong>
            <span class="page-sections-count">{{ currentPage.sections.length }} secciones</span>
          </div>
        </div>
        <div class="page-status">
          <span class="status-badge" [class.homepage]="currentPage.isHomePage">
            {{ currentPage.isHomePage ? '🏠 Página Principal' : '📄 Página' }}
          </span>
        </div>
      </div>

      <div class="page-list">
        <div class="page-list-header">
          <h4>Todas las Páginas</h4>
          <button class="add-page-btn" (click)="createNewPage()">
            <span class="btn-icon">+</span>
            Nueva Página
          </button>
        </div>

        <div class="page-items">
          <div
            *ngFor="let page of pages"
            class="page-item"
            [class.active]="currentPage?.id === page.id"
            [class.homepage]="page.isHomePage"
            (click)="selectPage(page.id)"
          >
            <div class="page-info">
              <div class="page-name-section">
                <span class="page-name">{{ page.name }}</span>
                <span class="page-home-indicator" *ngIf="page.isHomePage">🏠</span>
              </div>
              <span class="page-meta">{{ page.sections.length }} secciones</span>
            </div>

            <div class="page-actions">
              <button
                class="action-btn edit-btn"
                (click)="renamePage(page.id); $event.stopPropagation()"
                title="Renombrar página"
                *ngIf="!page.isHomePage"
              >
                ✏️
              </button>
              <button
                class="action-btn delete-btn"
                (click)="deletePage(page.id); $event.stopPropagation()"
                [disabled]="pages.length <= 1"
                title="Eliminar página"
                *ngIf="!page.isHomePage"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-management {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .current-page-indicator {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05));
      border: 2px solid rgba(34, 197, 94, 0.3);
      border-radius: 16px;
      padding: 1.25rem;
      position: relative;
      overflow: hidden;
    }

    .current-page-indicator::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #22c55e, #16a34a);
    }

    .indicator-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
      z-index: 1;
    }

    .page-icon {
      font-size: 2rem;
      background: rgba(34, 197, 94, 0.2);
      padding: 0.5rem;
      border-radius: 12px;
    }

    .page-details strong {
      display: block;
      font-size: 1.1rem;
      color: #22c55e;
      margin-bottom: 0.25rem;
    }

    .page-sections-count {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    .page-status {
      margin-top: 0.75rem;
    }

    .status-badge {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;

      &.homepage {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
      }
    }

    .page-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .page-list-header h4 {
      margin: 0;
      color: var(--color-text-inverse);
      font-size: 1rem;
      font-weight: 700;
    }

    .add-page-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .add-page-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
    }

    .btn-icon {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .page-items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .page-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .page-item:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    .page-item.active {
      background: var(--color-primary);
      border-color: var(--color-primary-light);
      color: white;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
    }

    .page-item.homepage {
      border-color: rgba(34, 197, 94, 0.3);
    }

    .page-item.homepage::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #22c55e;
      border-radius: 12px 0 0 12px;
    }

    .page-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .page-name-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .page-name {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .page-home-indicator {
      font-size: 0.8rem;
    }

    .page-meta {
      font-size: 0.75rem;
      opacity: 0.7;
    }

    .page-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.1);
    }

    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .delete-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .delete-btn:disabled:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      transform: none;
    }
  `]
})
export class PageManagementComponent implements OnInit, OnDestroy {
  pages: Page[] = [];
  currentPage: Page | null = null;
  private subscriptions: Subscription[] = [];

  @Output() pageSelected = new EventEmitter<string>();

  constructor(private variantService: VariantService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.variantService.pages$.subscribe(pages => {
        this.pages = pages;
      }),
      this.variantService.currentPage$.subscribe(page => {
        this.currentPage = page;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createNewPage() {
    const pageName = prompt('Nombre de la nueva página:');
    if (pageName && pageName.trim()) {
      const newPage = this.variantService.createPage(pageName.trim());
      this.variantService.setCurrentPage(newPage.id);
      this.pageSelected.emit(newPage.id);
    }
  }

  selectPage(pageId: string) {
    this.variantService.setCurrentPage(pageId);
    this.pageSelected.emit(pageId);
  }

  renamePage(pageId: string) {
    const page = this.pages.find(p => p.id === pageId);
    if (!page) return;

    const newName = prompt('Nuevo nombre de la página:', page.name);
    if (newName && newName.trim() && newName.trim() !== page.name) {
      this.variantService.updatePage(pageId, { name: newName.trim() });
    }
  }

  deletePage(pageId: string) {
    if (this.pages.length <= 1) {
      alert('No puedes eliminar la única página existente.');
      return;
    }

    if (confirm('¿Eliminar esta página? Esta acción no se puede deshacer.')) {
      this.variantService.deletePage(pageId);
    }
  }
}