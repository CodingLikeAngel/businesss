import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponentPickerService } from './layout-component-picker.service';
import { COMPONENT_CATALOG, type ComponentCatalogItem } from './layout-section.interfaces';

@Component({
  selector: 'lib-layout-component-picker-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div *ngIf="(picker.stateAsObservable | async) as s; else closed">
      <ng-container *ngIf="s?.isOpen">
        <div class="layout-picker-overlay" (click)="picker.close()" role="dialog" aria-modal="true" aria-label="Añadir componente">
          <div class="layout-picker-modal-inner" (click)="$event.stopPropagation()">
            <div class="layout-picker-modal-header">
              <h3>Añadir Componente al Slot {{ s.slotIndex + 1 }}</h3>
              <button type="button" class="layout-picker-close" (click)="picker.close()">✕</button>
            </div>
            <div class="layout-picker-categories">
              <button type="button" *ngFor="let cat of categories" class="layout-picker-cat"
                [class.active]="selectedCategory === cat.id" (click)="selectedCategory = cat.id">
                {{ cat.label }}
              </button>
            </div>
            <div class="layout-picker-grid">
              <button type="button" *ngFor="let comp of getFiltered(selectedCategory)"
                class="layout-picker-option" (click)="picker.selectComponent(comp)">
                <span class="layout-picker-icon">{{ comp.icon }}</span>
                <span class="layout-picker-name">{{ comp.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
    <ng-template #closed></ng-template>
  `,
  styles: [`
    .layout-picker-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(6px);
    }
    .layout-picker-modal-inner {
      background: linear-gradient(145deg, #1e293b, #0f172a);
      border: 1px solid rgba(99, 102, 241, 0.4);
      border-radius: 16px;
      padding: 1.25rem;
      max-width: 560px;
      width: 92%;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .layout-picker-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .layout-picker-modal-header h3 {
      color: #fff;
      font-size: 1.125rem;
      margin: 0;
      font-weight: 600;
    }
    .layout-picker-close {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
    }
    .layout-picker-close:hover {
      background: rgba(239, 68, 68, 0.5);
    }
    .layout-picker-categories {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .layout-picker-cat {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      color: #e2e8f0;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .layout-picker-cat:hover { background: rgba(99, 102, 241, 0.25); }
    .layout-picker-cat.active { background: rgba(99, 102, 241, 0.45); border-color: rgba(99, 102, 241, 0.7); color: #fff; }
    .layout-picker-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.75rem;
    }
    .layout-picker-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: #e2e8f0;
      cursor: pointer;
      transition: all 0.2s;
    }
    .layout-picker-option:hover {
      background: rgba(99, 102, 241, 0.35);
      border-color: rgba(99, 102, 241, 0.5);
      transform: scale(1.03);
    }
    .layout-picker-icon { font-size: 1.5rem; }
    .layout-picker-name { font-size: 0.75rem; text-align: center; }
  `],
})
export class LayoutComponentPickerModalComponent {
  picker = inject(LayoutComponentPickerService);
  selectedCategory = 'all';
  categories = [
    { id: 'all', label: 'Todos' },
    { id: 'basic', label: 'Básicos' },
    { id: 'content', label: 'Contenido' },
    { id: 'interactive', label: 'Interactivos' },
    { id: 'media', label: 'Media' },
  ];

  getFiltered(catId: string): ComponentCatalogItem[] {
    if (catId === 'all') return COMPONENT_CATALOG;
    return COMPONENT_CATALOG.filter(c => c.category === catId);
  }
}
