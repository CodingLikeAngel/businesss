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
    <div class="page-manager-v2">
      <!-- Header -->
      <header class="editor-header">
        <div class="header-main">
          <h2>Mapa de Sitio</h2>
          <span class="badge">{{ pages.length }} PÁGINAS</span>
        </div>
        <p class="subtitle">Estructura la navegación y jerarquía de tu imperio digital.</p>
      </header>

      <!-- Current Page Hero -->
      <div class="current-page-v2" *ngIf="currentPage">
        <div class="hero-top">
            <div class="page-brand">
                <span class="brand-dot"></span>
                <span class="type-label">{{ currentPage.isHomePage ? 'Principal' : 'Página' }}</span>
            </div>
            <div class="page-info">
                <h3>{{ currentPage.name }}</h3>
                <p>{{ currentPage.sections.length }} bloques activos</p>
            </div>
        </div>
        <div class="hero-footer">
            <div class="status-indicator">
                <span class="pulse-dot"></span>
                Edición en curso
            </div>
        </div>
      </div>

      <!-- Page List Section -->
      <section class="page-list-v2">
        <div class="list-header">
            <h4>Directorio de Páginas</h4>
            <button class="add-btn-v2" (click)="createNewPage()">
                <span class="plus">+</span> NUEVA
            </button>
        </div>

        <div class="pages-scroll-area">
            <div *ngFor="let page of pages" 
                 class="page-v2-card" 
                 [class.active]="currentPage?.id === page.id"
                 (click)="selectPage(page.id)">
                
                <div class="card-left">
                    <div class="page-avatar">
                        <span *ngIf="page.isHomePage">🏠</span>
                        <span *ngIf="!page.isHomePage">📄</span>
                    </div>
                    <div class="card-details">
                        <span class="name">{{ page.name }}</span>
                        <span class="count">{{ page.sections.length }} secciones</span>
                    </div>
                </div>

                <div class="card-right" *ngIf="!page.isHomePage">
                    <button class="mini-icon-btn" (click)="renamePage(page.id); $event.stopPropagation()" title="Renombrar">✏️</button>
                    <button class="mini-icon-btn delete" (click)="deletePage(page.id); $event.stopPropagation()" [disabled]="pages.length <= 1" title="Eliminar">🗑️</button>
                </div>
                
                <div class="active-line" *ngIf="currentPage?.id === page.id"></div>
            </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-manager-v2 {
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
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
      }
      .subtitle { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0; line-height: 1.4; }
    }

    .current-page-v2 {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(76, 29, 149, 0.1));
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 20px;
        padding: 1.5rem;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);

        &::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
            pointer-events: none;
        }

        .hero-top {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            position: relative;
            z-index: 1;
        }

        .page-brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            .brand-dot { width: 8px; height: 8px; background: #8b5cf6; border-radius: 50%; box-shadow: 0 0 10px #8b5cf6; }
            .type-label { font-size: 0.65rem; font-weight: 900; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.1em; }
        }

        .page-info {
            h3 { font-size: 1.5rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.02em; }
            p { font-size: 0.85rem; color: #94a3b8; margin: 0.25rem 0 0; }
        }

        .hero-footer {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
            z-index: 1;

            .status-indicator {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.75rem;
                font-weight: 600;
                color: #10b981;
                .pulse-dot {
                    width: 6px;
                    height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: pulse-green 2s infinite;
                }
            }
        }
    }

    .page-list-v2 {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            h4 { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin: 0; letter-spacing: 0.05em; }
        }
    }

    .add-btn-v2 {
        background: rgba(255, 255, 255, 0.05);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 0.65rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
        &:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); transform: translateY(-1px); }
    }

    .pages-scroll-area {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .page-v2-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 0.75rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;

        &:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.1);
            transform: translateX(4px);
        }

        &.active {
            background: rgba(139, 92, 246, 0.1);
            border-color: rgba(139, 92, 246, 0.3);
            .card-left .page-avatar { background: #8b5cf6; color: white; }
            .card-left .card-details .name { color: #a78bfa; }
        }

        .card-left {
            display: flex;
            align-items: center;
            gap: 1rem;
            
            .page-avatar {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                transition: all 0.2s;
            }

            .card-details {
                display: flex;
                flex-direction: column;
                .name { font-size: 0.9rem; font-weight: 700; color: #f8fafc; }
                .count { font-size: 0.7rem; color: #64748b; }
            }
        }

        .card-right {
            display: flex;
            gap: 0.25rem;
            opacity: 0;
            transition: opacity 0.2s;
            .mini-icon-btn {
                background: none;
                border: none;
                font-size: 0.8rem;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                &:hover { background: rgba(255, 255, 255, 0.1); }
                &.delete:hover { background: rgba(239, 68, 68, 0.1); }
            }
        }

        &:hover .card-right { opacity: 1; }

        .active-line {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: #8b5cf6;
            box-shadow: 0 0 10px #8b5cf6;
        }
    }

    @keyframes pulse-green {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
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