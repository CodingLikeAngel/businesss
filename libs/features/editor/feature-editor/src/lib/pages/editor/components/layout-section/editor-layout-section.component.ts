import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEditorSectionComponent } from '../base-editor-section.component';
import { Store } from '@ngrx/store';
import * as PageActions from '../../../../store/actions/page.actions';
import { Subject, takeUntil, debounceTime } from 'rxjs';

// UI Components imports
import {
  UIButtonComponent,
  UIImageComponent,
  UITitleComponent,
  UICardComponent,
  UICardAnimatedComponent,
  UIAccordionComponent,
  UIListComponent,
  UIChipComponent,
  UiCardProductsComponent,
  UIDraggableBox1Component
} from '@negocio/ui-components';

import { EditorButtonIsolatedModeComponent } from '../button/editor-button-isolated-mode.component';
import { EditorAccordionIsolatedModeComponent } from '../accordion/editor-accordion-isolated-mode.component';
import { EditorDraggableBoxIsolatedModeComponent } from '../draggable-box/editor-draggable-box-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

import { 
  LayoutSectionConfig, 
  LayoutType, 
  SlotConfig, 
  SlotComponentType,
  LAYOUT_DEFINITIONS,
  COMPONENT_CATALOG,
  getLayoutDefinition,
  createInitialSlots,
  createDefaultLayoutConfig,
  ComponentCatalogItem
} from './layout-section.interfaces';

@Component({
  selector: 'lib-editor-layout-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // UI Components
    UIButtonComponent,
    UIImageComponent,
    UITitleComponent,
    UICardComponent,
    UICardAnimatedComponent,
    UIAccordionComponent,
    UIListComponent,
    UIChipComponent,
    UiCardProductsComponent,
    UIDraggableBox1Component,
    EditorButtonIsolatedModeComponent,
    EditorAccordionIsolatedModeComponent,
    EditorDraggableBoxIsolatedModeComponent
  ],
  template: `
    <section 
      [id]="section.id" 
      class="layout-section"
      [class.editing]="isEditing"
      [style.minHeight.px]="config.minHeight"
      [style.padding.px]="config.padding"
      [style.backgroundColor]="config.backgroundColor"
      [style.borderRadius.px]="config.borderRadius">
      
      <!-- Section Header -->
      <div class="section-header">
        <div class="section-label">
          <span class="label-icon">🧩</span>
          <span class="label-text">Layout: {{ getLayoutLabel() }}</span>
        </div>
        <div class="section-actions">
          <button class="action-btn" (click)="toggleLayoutPicker()" title="Cambiar Layout">
            <span>📐</span>
            <span class="btn-text">Layout</span>
          </button>
          <button class="action-btn" (click)="toggleEditing()" [class.active]="isEditing" title="Modo Edición">
            <span>✏️</span>
            <span class="btn-text">Editar</span>
          </button>
        </div>
      </div>

      <!-- Layout Picker Modal -->
      <div *ngIf="showLayoutPicker" class="layout-picker-overlay" (click)="closeLayoutPicker()">
        <div class="layout-picker-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Selecciona un Layout</h3>
            <button class="close-btn" (click)="closeLayoutPicker()">✕</button>
          </div>
          <div class="layouts-grid">
            <button 
              *ngFor="let layout of availableLayouts" 
              class="layout-option"
              [class.selected]="config.layoutType === layout.type"
              (click)="selectLayout(layout.type)">
              <span class="layout-icon">{{ layout.icon }}</span>
              <span class="layout-name">{{ layout.label }}</span>
              <span class="layout-desc">{{ layout.slotCount }} slots</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Grid Container -->
      <div class="grid-container" [style.gridTemplateColumns]="getGridTemplate()" [style.gap.px]="config.gap">
        
        <!-- Slots -->
        <div 
          *ngFor="let slot of config.slots; let i = index" 
          class="slot"
          [class.empty]="slot.componentType === 'empty'"
          [class.selected]="selectedSlotIndex === i"
          (click)="selectSlot(i, $event)">
          
          <!-- Empty Slot -->
          <div *ngIf="slot.componentType === 'empty'" class="empty-slot">
            <div class="empty-content" (click)="openComponentPicker(i, $event)">
              <span class="plus-icon">+</span>
              <span class="slot-label">Añadir Componente</span>
            </div>
          </div>

          <!-- Filled Slot - Component Renderer -->
          <ng-container *ngIf="slot.componentType !== 'empty'">
            <div class="slot-component">
              <!-- Editing Overlay -->
              <div *ngIf="isEditing" class="slot-controls">
                <button class="slot-btn" (click)="openIsolatedMode(i, $event)" 
                        *ngIf="['ui-button', 'ui-accordion', 'draggable-box'].includes(slot.componentType)"
                        title="Modo Aislado">🎯</button>
                <button class="slot-btn" (click)="openComponentPicker(i, $event)" title="Cambiar">🔄</button>
                <button class="slot-btn" (click)="editSlotComponent(i, $event)" title="Configurar">⚙️</button>
                <button class="slot-btn danger" (click)="clearSlot(i, $event)" title="Eliminar">🗑️</button>
              </div>

              <!-- Component Content -->
              <ng-container [ngSwitch]="slot.componentType">

                <!-- UI BUTTON -->
                <lib-ui-components-button
                  *ngSwitchCase="'ui-button'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'primary')">
                  {{ slot.content?.['text'] || 'Botón' }}
                </lib-ui-components-button>

                <!-- UI TITLE -->
                <lib-ui-components-title
                  *ngSwitchCase="'ui-title'"
                  [text]="slot.content?.['text'] || 'Título'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')">
                </lib-ui-components-title>

                <!-- UI IMAGE -->
                <lib-ui-image
                  *ngSwitchCase="'ui-image'"
                  [src]="slot.content?.['src'] || 'assets/placeholder.jpg'"
                  [alt]="slot.content?.['alt'] || 'Imagen'"
                  class="slot-image">
                </lib-ui-image>

                <!-- UI CARD -->
                <lib-ui-components-card
                  *ngSwitchCase="'ui-card'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'glass')"
                  [title]="slot.content?.['title'] || 'Título'"
                  [description]="slot.content?.['description'] || 'Descripción...'"
                  class="slot-card">
                </lib-ui-components-card>

                <!-- UI CARD ANIMATED -->
                <lib-ui-components-card-animated
                  *ngSwitchCase="'ui-card-animated'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  class="slot-card">
                </lib-ui-components-card-animated>

                <!-- UI ACCORDION -->
                <lib-ui-components-accordion
                  *ngSwitchCase="'ui-accordion'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  [items]="slot.content?.['items'] || [{title:'Item 1', content:'Contenido 1'}]">
                </lib-ui-components-accordion>

                <!-- UI LIST -->
                <lib-ui-list
                  *ngSwitchCase="'ui-list'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  [items]="slot.content?.['items'] || ['Item 1', 'Item 2', 'Item 3']">
                </lib-ui-list>

                <!-- UI CARD PRODUCT -->
                <lib-card-products
                  *ngSwitchCase="'ui-card-product'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  [product]="slot.content?.['product'] || { image: '', name: 'Producto', description: 'Descripción...', price: '0.00' }">
                </lib-card-products>

                <!-- UI CHIP -->
                <lib-ui-components-chip
                  *ngSwitchCase="'ui-chip'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')">
                  {{ slot.content?.['text'] || 'Chip' }}
                </lib-ui-components-chip>

                <!-- DRAGGABLE BOX -->
                <lib-ui-components-draggable-box-1
                  *ngSwitchCase="'draggable-box'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'secondary')"
                  [content]="slot.content?.['text'] || 'Caja'"
                  class="slot-box">
                </lib-ui-components-draggable-box-1>

                <!-- Default/Unknown -->
                <div *ngSwitchDefault class="unknown-component">
                  <span class="unknown-icon">❓</span>
                  <span>{{ slot.componentType }}</span>
                </div>

              </ng-container>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- Component Picker Modal -->
      <div *ngIf="showComponentPicker" class="component-picker-overlay" (click)="closeComponentPicker()">
        <div class="component-picker-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Añadir Componente al Slot {{ editingSlotIndex + 1 }}</h3>
            <button class="close-btn" (click)="closeComponentPicker()">✕</button>
          </div>
          
          <!-- Category Tabs -->
          <div class="category-tabs">
            <button 
              *ngFor="let cat of componentCategories" 
              class="category-tab"
              [class.active]="selectedCategory === cat.id"
              (click)="selectedCategory = cat.id">
              {{ cat.label }}
            </button>
          </div>

          <!-- Components Grid -->
          <div class="components-grid">
            <button 
              *ngFor="let comp of getFilteredComponents()" 
              class="component-option"
              (click)="assignComponent(comp)">
              <span class="component-icon">{{ comp.icon }}</span>
              <span class="component-name">{{ comp.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Slot Config Modal -->
      <div *ngIf="showSlotConfig" class="slot-config-overlay" (click)="closeSlotConfig()">
        <div class="slot-config-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Configurar: {{ getSlotComponentLabel() }}</h3>
            <button class="close-btn" (click)="closeSlotConfig()">✕</button>
          </div>
          
          <div class="config-content" *ngIf="editingSlot">
            <!-- Variant Selector -->
            <div class="config-field">
              <label>Variante</label>
              <select [(ngModel)]="editingSlot.componentVariant" (ngModelChange)="onSlotConfigChange()">
                <option value="">Por defecto ({{ globalVariant || 'default' }})</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="glass">Glass</option>
                <option value="neon">Neon</option>
                <option value="cyberpunk">Cyberpunk</option>
              </select>
            </div>

            <!-- Text Content (for components that support it) -->
            <div class="config-field" *ngIf="slotSupportsText(editingSlot)">
              <label>Texto</label>
              <input type="text" [(ngModel)]="editingSlot.content!['text']" (ngModelChange)="onSlotConfigChange()">
            </div>

            <!-- Title Content -->
            <div class="config-field" *ngIf="editingSlot.componentType === 'ui-title'">
              <label>Nivel</label>
              <select [(ngModel)]="editingSlot.content!['level']" (ngModelChange)="onSlotConfigChange()">
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
              </select>
            </div>

            <!-- Image Source -->
            <div class="config-field" *ngIf="editingSlot.componentType === 'ui-image'">
              <label>URL de Imagen</label>
              <input type="text" [(ngModel)]="editingSlot.content!['src']" (ngModelChange)="onSlotConfigChange()" placeholder="https://...">
            </div>

            <!-- Card Title/Description -->
            <ng-container *ngIf="editingSlot.componentType === 'ui-card'">
              <div class="config-field">
                <label>Título</label>
                <input type="text" [(ngModel)]="editingSlot.content!['title']" (ngModelChange)="onSlotConfigChange()">
              </div>
              <div class="config-field">
                <label>Descripción</label>
                <textarea [(ngModel)]="editingSlot.content!['description']" (ngModelChange)="onSlotConfigChange()"></textarea>
              </div>
            </ng-container>

            <!-- Card Product Config -->
            <ng-container *ngIf="editingSlot.componentType === 'ui-card-product'">
              <div class="config-field">
                <label>Nombre del Producto</label>
                <input type="text" [(ngModel)]="editingSlot.content!['product']['name']" (ngModelChange)="onSlotConfigChange()">
              </div>
              <div class="config-field">
                <label>Descripción</label>
                <textarea [(ngModel)]="editingSlot.content!['product']['description']" (ngModelChange)="onSlotConfigChange()"></textarea>
              </div>
              <div class="config-field">
                <label>Precio</label>
                <input type="text" [(ngModel)]="editingSlot.content!['product']['price']" (ngModelChange)="onSlotConfigChange()">
              </div>
              <div class="config-field">
                <label>Imagen</label>
                <input type="text" [(ngModel)]="editingSlot.content!['product']['image']" (ngModelChange)="onSlotConfigChange()" placeholder="URL...">
              </div>
            </ng-container>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeSlotConfig()">Cerrar</button>
            <button class="btn-primary" (click)="applySlotConfig()">Aplicar</button>
          </div>
        </div>
      </div>

      <!-- Isolated Mode Components -->
      <ng-container *ngIf="showIsolatedMode && activeIsolatedType">
        <lib-editor-button-isolated-mode
          *ngIf="activeIsolatedType === 'ui-button'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-button-isolated-mode>

        <lib-editor-accordion-isolated-mode
          *ngIf="activeIsolatedType === 'ui-accordion'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-accordion-isolated-mode>

        <lib-editor-draggable-box-isolated-mode
          *ngIf="activeIsolatedType === 'draggable-box'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-draggable-box-isolated-mode>
      </ng-container>

    </section>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    
    .layout-section {
      position: relative;
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 12px;
      overflow: visible;
    }

    .layout-section.editing {
      border-color: rgba(99, 102, 241, 0.5);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px 12px 0 0;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .section-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.35rem 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: white;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover { background: rgba(99, 102, 241, 0.3); }
    .action-btn.active { background: rgba(99, 102, 241, 0.5); border-color: rgba(99, 102, 241, 0.7); }
    .btn-text { display: none; }
    @media (min-width: 640px) { .btn-text { display: inline; } }

    /* Grid Container */
    .grid-container {
      display: grid;
      padding: 1rem;
    }

    /* Slots */
    .slot {
      position: relative;
      min-height: 120px;
      border: 2px dashed rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      transition: all 0.2s;
      overflow: hidden;
    }

    .slot:hover { border-color: rgba(99, 102, 241, 0.4); }
    .slot.selected { border-color: rgba(99, 102, 241, 0.8); background: rgba(99, 102, 241, 0.05); }
    .slot.empty { background: rgba(0, 0, 0, 0.2); }

    .empty-slot {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 120px;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.2s;
    }

    .empty-content:hover { color: rgba(99, 102, 241, 0.8); transform: scale(1.05); }
    .plus-icon { font-size: 2rem; }
    .slot-label { font-size: 0.75rem; }

    /* Slot Component */
    .slot-component {
      position: relative;
      height: 100%;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
    }

    .slot-controls {
      position: absolute;
      top: 4px;
      right: 4px;
      display: flex;
      gap: 4px;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .slot:hover .slot-controls { opacity: 1; }

    .slot-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      color: white;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.2s;
    }

    .slot-btn:hover { background: rgba(99, 102, 241, 0.8); }
    .slot-btn.danger:hover { background: rgba(239, 68, 68, 0.8); }

    .slot-image, .slot-video, .slot-map { width: 100%; height: 100%; object-fit: cover; }
    .slot-card, .slot-box { width: 100%; }

    .unknown-component {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
    }

    /* Modal Styles */
    .layout-picker-overlay, .component-picker-overlay, .slot-config-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .layout-picker-modal, .component-picker-modal, .slot-config-modal {
      background: linear-gradient(145deg, #1e293b, #0f172a);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      padding: 1.5rem;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header h3 { color: white; font-size: 1.125rem; margin: 0; }
    .close-btn {
      width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border: none; border-radius: 50%;
      color: white; cursor: pointer;
      transition: all 0.2s;
    }
    .close-btn:hover { background: rgba(239, 68, 68, 0.6); }

    /* Layouts Grid */
    .layouts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 0.75rem;
    }

    .layout-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid transparent;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .layout-option:hover { background: rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.3); }
    .layout-option.selected { background: rgba(99, 102, 241, 0.2); border-color: rgba(99, 102, 241, 0.7); }
    .layout-icon { font-size: 1.5rem; }
    .layout-name { font-size: 0.875rem; font-weight: 500; }
    .layout-desc { font-size: 0.625rem; opacity: 0.6; }

    /* Component Picker */
    .category-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .category-tab {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      color: white;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .category-tab:hover { background: rgba(99, 102, 241, 0.2); }
    .category-tab.active { background: rgba(99, 102, 241, 0.4); border-color: rgba(99, 102, 241, 0.6); }

    .components-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.75rem;
    }

    .component-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .component-option:hover { background: rgba(99, 102, 241, 0.3); border-color: rgba(99, 102, 241, 0.5); transform: scale(1.02); }
    .component-icon { font-size: 1.5rem; }
    .component-name { font-size: 0.75rem; text-align: center; }

    /* Slot Config Modal */
    .config-content { display: flex; flex-direction: column; gap: 1rem; }
    .config-field { display: flex; flex-direction: column; gap: 0.5rem; }
    .config-field label { color: rgba(255, 255, 255, 0.7); font-size: 0.75rem; }
    .config-field input, .config-field select, .config-field textarea {
      padding: 0.75rem;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: white;
      font-size: 0.875rem;
    }
    .config-field textarea { min-height: 80px; resize: vertical; }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-secondary, .btn-primary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary { background: rgba(255, 255, 255, 0.1); color: white; }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.2); }
    .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); }
  `]
})
export class EditorLayoutSectionComponent extends BaseEditorSectionComponent implements OnInit, OnDestroy, OnChanges {
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();
  private persistSubject$ = new Subject<void>();
  // Local property to track browser platform
  private localIsBrowser: boolean;

  config: LayoutSectionConfig = createDefaultLayoutConfig();
  isEditing = false;
  showLayoutPicker = false;
  showComponentPicker = false;
  showSlotConfig = false;
  selectedSlotIndex = -1;
  editingSlotIndex = -1;
  editingSlot: SlotConfig | null = null;
  selectedCategory: string = 'all';

  availableLayouts = LAYOUT_DEFINITIONS;
  componentCatalog = COMPONENT_CATALOG;

  componentCategories = [
    { id: 'all', label: 'Todos' },
    { id: 'basic', label: 'Básicos' },
    { id: 'content', label: 'Contenido' },
    { id: 'interactive', label: 'Interactivos' },
    { id: 'data', label: 'Datos' },
    { id: 'media', label: 'Media' }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    super(platformId);
    this.localIsBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.loadConfigFromSection();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['section'] && !changes['section'].firstChange) {
      this.loadConfigFromSection();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadConfigFromSection() {
    if (this.section?.content?.['layoutConfig']) {
      const rawConfig = this.section.content['layoutConfig'];
      this.config = {
        ...createDefaultLayoutConfig(),
        ...rawConfig,
        slots: (rawConfig.slots || []).map((s: any) => ({
          ...s,
          content: s.content ? { ...s.content } : {},
          styles: s.styles ? { ...s.styles } : {}
        }))
      };
    } else {
      this.config = createDefaultLayoutConfig();
    }
    this.cdr.detectChanges();
  }

  getLayoutLabel(): string {
    const layout = getLayoutDefinition(this.config.layoutType);
    return layout?.label || 'Layout';
  }

  getGridTemplate(): string {
    const layout = getLayoutDefinition(this.config.layoutType);
    if (!layout) return '1fr';
    
    // Handle special layouts with rows
    if (this.config.layoutType === 'grid-2x2') return 'repeat(2, 1fr)';
    if (this.config.layoutType === 'grid-3x2') return 'repeat(3, 1fr)';
    if (this.config.layoutType === 'grid-3x3') return 'repeat(3, 1fr)';
    if (this.config.layoutType === 'hero-banner') return '1fr';
    
    return layout.gridTemplate;
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
    this.cdr.detectChanges();
  }

  toggleLayoutPicker() {
    this.showLayoutPicker = !this.showLayoutPicker;
  }

  closeLayoutPicker() {
    this.showLayoutPicker = false;
  }

  selectLayout(type: LayoutType) {
    const newLayout = getLayoutDefinition(type);
    if (!newLayout) return;

    const oldSlots = this.config.slots;
    const newSlots = createInitialSlots(type);

    // Preserve existing slot content where possible
    for (let i = 0; i < Math.min(oldSlots.length, newSlots.length); i++) {
      newSlots[i] = { 
        ...oldSlots[i], 
        id: newSlots[i].id // Keep the type and content but use new ID if needed or keep it
      };
    }

    this.config = {
      ...this.config,
      layoutType: type,
      slots: newSlots
    };
    
    this.persistConfig();
    this.closeLayoutPicker();
  }

  selectSlot(index: number, event: Event) {
    event.stopPropagation();
    this.selectedSlotIndex = index;
  }

  openComponentPicker(index: number, event: Event) {
    event.stopPropagation();
    this.editingSlotIndex = index;
    this.showComponentPicker = true;
    this.selectedCategory = 'all';
  }

  closeComponentPicker() {
    this.showComponentPicker = false;
    this.editingSlotIndex = -1;
  }

  getFilteredComponents(): ComponentCatalogItem[] {
    if (this.selectedCategory === 'all') {
      return this.componentCatalog;
    }
    return this.componentCatalog.filter(c => c.category === this.selectedCategory);
  }

  assignComponent(comp: ComponentCatalogItem) {
    if (this.editingSlotIndex < 0 || this.editingSlotIndex >= this.config.slots.length) return;

    const newSlots = [...this.config.slots];
    newSlots[this.editingSlotIndex] = {
      ...newSlots[this.editingSlotIndex],
      componentType: comp.type,
      componentVariant: comp.defaultVariant || '',
      content: { ...(comp.defaultContent || {}) }
    };

    this.config = {
      ...this.config,
      slots: newSlots
    };

    this.persistConfig();
    this.closeComponentPicker();
  }

  clearSlot(index: number, event: Event) {
    event.stopPropagation();
    if (index < 0 || index >= this.config.slots.length) return;

    const newSlots = [...this.config.slots];
    newSlots[index] = {
      ...newSlots[index],
      componentType: 'empty',
      componentVariant: undefined,
      content: {},
      styles: {}
    };

    this.config = {
      ...this.config,
      slots: newSlots
    };

    this.persistConfig();
  }

  editSlotComponent(index: number, event: Event) {
    event.stopPropagation();
    if (index < 0 || index >= this.config.slots.length) return;

    const slot = this.config.slots[index];
    if (slot.componentType === 'empty') return;

    this.editingSlotIndex = index;
    this.editingSlot = { ...slot, content: { ...(slot.content || {}) } };
    this.showSlotConfig = true;
  }

  closeSlotConfig() {
    this.showSlotConfig = false;
    this.editingSlot = null;
    this.editingSlotIndex = -1;
  }

  getSlotComponentLabel(): string {
    if (!this.editingSlot) return '';
    const comp = COMPONENT_CATALOG.find(c => c.type === this.editingSlot!.componentType);
    return comp?.label || this.editingSlot.componentType;
  }

  slotSupportsText(slot: SlotConfig): boolean {
    const textComponents: SlotComponentType[] = ['ui-button', 'ui-title', 'ui-chip', 'draggable-box'];
    return textComponents.includes(slot.componentType);
  }

  onSlotConfigChange() {
    // Live preview changes (config isn't saved until apply)
    this.cdr.detectChanges();
  }

  // Isolated Mode Logic
  showIsolatedMode = false;
  activeIsolatedType: SlotComponentType | null = null;
  isolatedConfig: IsolatedModeConfig = {
    sectionId: '',
    elementId: '',
    type: '',
    variant: '',
    globalVariant: '',
    content: {},
    styles: {},
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 }
  };

  openIsolatedMode(index: number, event: Event) {
    event.stopPropagation();
    const slot = this.config.slots[index];
    if (slot.componentType === 'empty') return;

    this.editingSlotIndex = index;
    this.activeIsolatedType = slot.componentType;
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: slot.id,
      type: slot.componentType,
      variant: slot.componentVariant,
      globalVariant: this.globalVariant,
      content: { ...slot.content },
      styles: { ...slot.styles },
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 }
    };
    
    this.showIsolatedMode = true;
    this.cdr.detectChanges();
  }

  onIsolatedModeApplied(updatedConfig: IsolatedModeConfig) {
    if (this.editingSlotIndex < 0) return;

    const newSlots = [...this.config.slots];
    newSlots[this.editingSlotIndex] = {
      ...newSlots[this.editingSlotIndex],
      content: { ...updatedConfig.content },
      styles: { ...updatedConfig.styles }
    };

    this.config = {
      ...this.config,
      slots: newSlots
    };

    this.persistConfig();
    this.onIsolatedModeClosed();
  }

  onIsolatedModeClosed() {
    this.showIsolatedMode = false;
    this.activeIsolatedType = null;
    this.editingSlotIndex = -1;
    this.cdr.detectChanges();
  }

  applySlotConfig() {
    if (!this.editingSlot || this.editingSlotIndex < 0) return;

    const newSlots = [...this.config.slots];
    newSlots[this.editingSlotIndex] = { ...this.editingSlot };

    this.config = {
      ...this.config,
      slots: newSlots
    };

    this.persistConfig();
    this.closeSlotConfig();
  }

  private persistConfig() {
    const updatedContent = {
      ...this.section.content,
      layoutConfig: this.config
    } as any;

    this.store.dispatch(PageActions.updateSection({
      sectionId: this.section.id,
      changes: { content: updatedContent }
    }));

    this.cdr.detectChanges();
  }
}
