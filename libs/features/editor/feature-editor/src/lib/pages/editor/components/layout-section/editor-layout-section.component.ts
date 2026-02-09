import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef, inject, Inject, PLATFORM_ID, ViewContainerRef, TemplateRef, ViewChild, HostBinding } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEditorSectionComponent } from '../base-editor-section.component';
import { Store } from '@ngrx/store';
import * as PageActions from '../../../../store/actions/page.actions';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { VariantService } from '@negocio/shared-components';

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
import { EditorTitleIsolatedModeComponent } from '../title/editor-title-isolated-mode.component';
import { EditorImageIsolatedModeComponent } from '../image/editor-image-isolated-mode.component';
import { EditorCardAnimatedIsolatedModeComponent } from '../card-animated/editor-card-animated-isolated-mode.component';
import { EditorCardPremiumIsolatedModeComponent } from '../card-premium/editor-card-premium-isolated-mode.component';
import { EditorListIsolatedModeComponent } from '../list/editor-list-isolated-mode.component';
import { EditorChipIsolatedModeComponent } from '../chip/editor-chip-isolated-mode.component';
import { EditorCardProductIsolatedModeComponent } from '../card-product/editor-card-product-isolated-mode.component';
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

import { SlotResizeService } from './slot-resize.service';
import { ResizeHandleDirective, ResizeEvent } from './resize-handle.directive';

// Interfaces for better type safety
interface SlotEditOrigin {
  x: number;
  y: number;
  width: number;
}

interface ComponentContentMap {
  [key: string]: any;
}

interface SlotMetrics {
  width: number;
  sectionWidth: number;
  sectionHeight: number;
  localX: number;
  localY: number;
}

interface ComponentDefaultSize {
  width: number;
  height: number;
}

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
    EditorDraggableBoxIsolatedModeComponent,
    EditorTitleIsolatedModeComponent,
    EditorImageIsolatedModeComponent,
    EditorCardAnimatedIsolatedModeComponent,
    EditorCardPremiumIsolatedModeComponent,
    EditorListIsolatedModeComponent,
    EditorChipIsolatedModeComponent,
    EditorCardProductIsolatedModeComponent,
    ResizeHandleDirective
  ],
  template: `
    <section 
      [id]="section.id" 
      class="layout-section"
      [class.editing]="isEditing"
      [class.isolated-mode]="showIsolatedMode"
      [class.preview-mode]="isPreviewMode && !showEditorControls"
      [style.minHeight.px]="config.minHeight"
      [style.padding.px]="config.padding"
      [style.backgroundColor]="config.backgroundColor"
      [style.borderRadius.px]="config.borderRadius">
      
      <!-- Section Header -->
      <div *ngIf="!isPreviewMode || showEditorControls" class="section-header">
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

      <!-- Floating Toggle Button for Preview Mode -->
      <button *ngIf="isPreviewMode" 
              class="preview-toggle-btn" 
              (click)="toggleEditorControlsInPreview()"
              [class.active]="showEditorControls"
              title="Mostrar/Ocultar opciones de edición">
        <span class="toggle-icon">{{ showEditorControls ? '✕' : '✏️' }}</span>
        <span class="toggle-text">{{ showEditorControls ? 'Ocultar edición' : 'Editar (activar modo aislado)' }}</span>
      </button>

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
          *ngFor="let slot of config.slots; let i = index; trackBy: trackBySlotIndex" 
          class="slot"
          [class.empty]="slot.componentType === 'empty'"
          [class.selected]="selectedSlotIndex === i"
          [class.resizing]="resizeService.isResizing() && resizeService.activeSlotIndex() === i"
          [class.flow-component]="isFlowComponent(slot)"
          [class.preview-mode]="isPreviewMode && !showEditorControls"
          [style.width]="getSlotWidth(i) ? getSlotWidth(i) + 'px' : slot.layoutStyles?.['width']"
          [style.height]="!isFlowComponent(slot) ? (getSlotHeight(i) ? getSlotHeight(i) + 'px' : slot.layoutStyles?.['height']) : null"
          [style.minHeight]="isFlowComponent(slot) ? (getSlotHeight(i) ? getSlotHeight(i) + 'px' : slot.layoutStyles?.['height']) : null"
          [style.left]="getSlotLeft(i) !== null ? getSlotLeft(i) + 'px' : slot.layoutStyles?.['left']"
          [style.top]="getSlotTop(i) !== null ? getSlotTop(i) + 'px' : slot.layoutStyles?.['top']"
          [style.position]="isPositioned(i, slot) ? 'absolute' : (slot.layoutStyles?.['position'] || 'relative')"
          [attr.data-slot-index]="i"
          (click)="selectSlot(i, $event)">
          
          <!-- Empty Slot -->
          <div *ngIf="slot.componentType === 'empty' && (!isPreviewMode || showEditorControls)" class="empty-slot">
            <div class="empty-content" (click)="openComponentPicker(i, $event)">
              <span class="plus-icon">+</span>
              <span class="slot-label">Añadir Componente</span>
            </div>
          </div>

          <!-- Filled Slot - Component Renderer -->
          <ng-container *ngIf="slot.componentType !== 'empty'">
            <!-- Slot Toolbar (Fixed to Slot Corners) - Moved INSIDE .slot-component for better anchoring -->
            <div class="slot-component">
              <div *ngIf="(!isPreviewMode && isEditing) || showEditorControls" class="slot-toolbar-right">
                <button *ngIf="isPositioned(i, slot)"
                        class="slot-btn" 
                        (click)="resetSlotPosition(i)" 
                        title="Resetear Posición (Centrar en Grid)">🎯</button>
                <button class="slot-btn drag-handle" 
                        appResizeHandle [slotIndex]="i" anchor="move"
                        title="Mover Componente">⠿</button>
                <button class="slot-btn edit-btn" 
                        (click)="editSlotComponent(i, $event)" 
                        [title]="hasIsolatedMode(slot.componentType) ? 'Editar en Modo Aislado' : 'Configurar'">
                  {{ hasIsolatedMode(slot.componentType) ? '🎯' : '⚙️' }}
                </button>
                <button class="slot-btn" (click)="openComponentPicker(i, $event)" title="Cambiar Componente">🔄</button>
                <button class="slot-btn danger" (click)="clearSlot(i, $event)" title="Eliminar">🗑️</button>
              </div>

              <!-- Component Content -->
              <ng-container [ngSwitch]="slot.componentType">

                <!-- UI BUTTON -->
                <lib-ui-components-button
                  *ngSwitchCase="'ui-button'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'primary')"
                  [customStyles]="getComponentStyles(slot)">
                  {{ slot.content?.['text'] || 'Botón' }}
                </lib-ui-components-button>

                <!-- UI TITLE -->
                <lib-ui-components-title
                  *ngSwitchCase="'ui-title'"
                  [text]="slot.content?.['text'] || 'Título'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  [customStyles]="getComponentStyles(slot)">
                </lib-ui-components-title>

                <!-- UI IMAGE -->
                <lib-ui-image
                  *ngSwitchCase="'ui-image'"
                  [src]="slot.content?.['src'] || 'assets/placeholder.jpg'"
                  [alt]="slot.content?.['alt'] || 'Imagen'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  [filter]="slot.styles?.['filter']"
                  [customStyles]="getComponentStyles(slot)"
                  class="slot-image">
                </lib-ui-image>


                <!-- UI CARD -->
                <lib-ui-components-card
                  *ngSwitchCase="'ui-card'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'glass')"
                  [title]="slot.content?.['title'] || 'Título'"
                  [description]="slot.content?.['description'] || 'Descripción...'"
                  [customStyles]="getComponentStyles(slot)"
                  class="slot-card">
                </lib-ui-components-card>

                <!-- UI CARD ANIMATED -->
                <lib-ui-components-card-animated
                  *ngSwitchCase="'ui-card-animated'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  [customStyles]="getComponentStyles(slot)"
                  class="slot-card">
                </lib-ui-components-card-animated>

                <!-- UI ACCORDION -->
                <div 
                  *ngSwitchCase="'ui-accordion'" 
                  [ngStyle]="getComponentStyles(slot)">
                  <lib-ui-components-accordion
                    style="width: 100%; height: auto; display: block;"
                    [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                    [items]="slot.content?.['items'] || [{title:'Item 1', content:'Contenido 1'}]">
                  </lib-ui-components-accordion>
                </div>

                <!-- UI LIST -->
                <lib-ui-list
                  *ngSwitchCase="'ui-list'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  [items]="slot.content?.['items'] || ['Item 1', 'Item 2', 'Item 3']"
                  [customStyles]="getComponentStyles(slot)">
                </lib-ui-list>

                <!-- UI CARD PRODUCT -->
                <lib-card-products
                  *ngSwitchCase="'ui-card-product'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  [product]="slot.content?.['product'] || { image: '', name: 'Producto', description: 'Descripción...', price: '0.00' }"
                  [customStyles]="getComponentStyles(slot)">
                </lib-card-products>

                <!-- UI CHIP -->
                <lib-ui-components-chip
                  *ngSwitchCase="'ui-chip'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'default')"
                  [customStyles]="getComponentStyles(slot)">
                  {{ slot.content?.['text'] || 'Chip' }}
                </lib-ui-components-chip>

                <!-- DRAGGABLE BOX -->
                <lib-ui-components-draggable-box-1
                  *ngSwitchCase="'draggable-box'"
                  [variant]="$any(slot.componentVariant || globalVariant || 'secondary')"
                  [content]="slot.content?.['text'] || 'Caja'"
                  [customStyles]="slot.styles || {}"
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

          <!-- Resize Anchors (Fixed to Slot Boundaries) -->
          <div *ngIf="slot.componentType !== 'empty' && ((!isPreviewMode && isEditing) || showEditorControls) && isSlotFilled(slot)" class="resize-anchors">
            <div class="resize-anchor nw" appResizeHandle [slotIndex]="i" anchor="nw" (resized)="onSlotResized(i, $event)" (resizeMove)="onResizeMoving()"></div>
            <div class="resize-anchor n"  appResizeHandle [slotIndex]="i" anchor="n"  (resized)="onSlotResized(i, $event)" (resizeMove)="onResizeMoving()"></div>
            <div class="resize-anchor ne" appResizeHandle [slotIndex]="i" anchor="ne" (resized)="onSlotResized(i, $event)" (resizeMove)="onResizeMoving()"></div>
            <div class="resize-anchor e"  appResizeHandle [slotIndex]="i" anchor="e"  (resized)="onSlotResized(i, $event)" (resizeMove)="onResizeMoving()"></div>
            <div class="resize-anchor se" appResizeHandle [slotIndex]="i" anchor="se" (resized)="onSlotResized(i, $event)" (resizeMove)="onResizeMoving()"></div>
            <div class="resize-anchor s"  appResizeHandle [slotIndex]="i" anchor="s"  (resized)="onSlotResized(i, $event)" (resizeMove)="onResizeMoving()"></div>
            <div class="resize-anchor sw" appResizeHandle [slotIndex]="i" anchor="sw" (resized)="onSlotResized(i, $event)" (resizeMove)="onResizeMoving()"></div>
            <div class="resize-anchor w"  appResizeHandle [slotIndex]="i" anchor="w"  (resized)="onSlotResized(i, $event)" (resizeMove)="onResizeMoving()"></div>
          </div>
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



    </section>

    <!-- Isolated Mode Overlay - Outside section to prevent clipping -->
    <div 
      *ngIf="showIsolatedMode && activeIsolatedType" 
      class="isolated-mode-fullscreen-overlay" 
      [class]="'isolated-mode-overlay-' + (activeIsolatedType || '')">
      <div class="isolated-mode-overlay-content">
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

        <lib-editor-title-isolated-mode
          *ngIf="activeIsolatedType === 'ui-title'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-title-isolated-mode>

        <lib-editor-image-isolated-mode
          *ngIf="activeIsolatedType === 'ui-image'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-image-isolated-mode>

        <lib-editor-card-premium-isolated-mode
          *ngIf="activeIsolatedType === 'ui-card'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-card-premium-isolated-mode>

        <lib-editor-card-animated-isolated-mode
          *ngIf="activeIsolatedType === 'ui-card-animated'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-card-animated-isolated-mode>

        <lib-editor-list-isolated-mode
          *ngIf="activeIsolatedType === 'ui-list'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-list-isolated-mode>

        <lib-editor-chip-isolated-mode
          *ngIf="activeIsolatedType === 'ui-chip'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-chip-isolated-mode>

        <lib-editor-card-product-isolated-mode
          *ngIf="activeIsolatedType === 'ui-card-product'"
          [config]="$any(isolatedConfig)"
          (closed)="onIsolatedModeClosed()"
          (applied)="onIsolatedModeApplied($any($event))">
        </lib-editor-card-product-isolated-mode>
      </div>
    </div>
  `,
  styles: [`:host { 
    display: block; 
    width: 100%;
    position: relative;
    z-index: 1;
  }

  /* Cuando isolated mode está activo, el host no debe restringir y debe estar arriba */
  :host:has(.isolated-mode-fullscreen-overlay),
  :host.isolated-mode-active-host {
    position: static !important;
    z-index: 9999999 !important;
  }

    .layout-section {
      position: relative;
      background: linear-gradient(165deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85));
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 16px;
      overflow: hidden;
      z-index: 1;
      backdrop-filter: blur(20px);
      box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
    }

    .layout-section.preview-mode {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .layout-section:not(.preview-mode) {
      border: 1px solid rgba(99, 102, 241, 0.25);
      background: linear-gradient(165deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85));
      box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
    }

    .layout-section.isolated-mode {
      z-index: 10000001 !important;
      overflow: visible !important;
    }

    /* When isolated mode is active, ensure overflow is visible and no clipping contexts exist */
    /* When isolated mode is active, ensure overflow is visible and no clipping contexts exist */
    /* Lower z-index so it doesn't cover the overlay (which is a sibling) */
    .layout-section.isolated-mode,
    .isolated-mode-active .layout-section {
      overflow: visible !important;
      transform: none !important;
      backdrop-filter: none !important;
      filter: none !important;
      z-index: 1 !important;
    }

    /* Isolated Mode Overlay - Fixed position with maximum priority */
    .isolated-mode-fullscreen-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 10000005 !important;
      background: rgba(2, 6, 23, 0.95) !important;
      backdrop-filter: blur(16px) !important;
      overflow: auto !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .isolated-mode-overlay-content {
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      overflow: visible !important;
      position: relative;
    }

    .layout-section.editing {
      border-color: rgba(99, 102, 241, 0.4);
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.15), 0 10px 40px -10px rgba(0, 0, 0, 0.5);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1.25rem;
      background: rgba(15, 23, 42, 0.6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px 16px 0 0;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #f1f5f9;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .label-icon {
      font-size: 1.1rem;
      filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.6));
    }

    .section-actions {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1rem;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 8px;
      color: #94a3b8;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .action-btn:hover { 
      background: rgba(99, 102, 241, 0.15); 
      color: white;
      border-color: #6366f1;
      transform: translateY(-1px);
    }

    .action-btn.active { 
      background: rgba(99, 102, 241, 0.4); 
      color: white;
      border-color: #818cf8;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
    }

    .btn-text { display: none; }
    @media (min-width: 640px) { .btn-text { display: inline; } }

    /* Preview Toggle Button */
    .preview-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      color: white;
      font-size: 0.875rem;
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

    .toggle-icon {
      font-size: 1.1rem;
    }

    .toggle-text {
      font-size: 0.875rem;
    }

    /* Grid Container */
    .grid-container {
      display: grid;
      padding: 1.5rem;
      position: relative;
      min-height: inherit;
      overflow: visible;
      background-image: radial-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    .layout-section.preview-mode .grid-container {
      background-image: none;
    }

    .layout-section:not(.preview-mode) .grid-container {
      background-image: radial-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px);
    }

    /* Slots */
    .slot {
      position: relative;
      width: 100%;
      min-height: 100px;
      border: 1px dashed rgba(99, 102, 241, 0.15);
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(15, 23, 42, 0.2);
    }

    .slot.preview-mode {
      border: none !important;
      background: transparent !important;
    }

    .slot:not(.preview-mode) {
      border: 1px dashed rgba(99, 102, 241, 0.15);
      background: rgba(15, 23, 42, 0.2);
    }

    .slot:hover { 
      border-color: rgba(99, 102, 241, 0.4); 
      background: rgba(15, 23, 42, 0.3);
    }

    .slot.selected { 
      border-color: #6366f1; 
      background: rgba(99, 102, 241, 0.08); 
      box-shadow: inset 0 0 20px rgba(99, 102, 241, 0.05);
    }

    .slot.empty { 
      background: rgba(2, 6, 23, 0.3); 
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      cursor: pointer;
      color: #64748b;
      transition: all 0.3s;
    }

    .empty-content:hover { 
      color: #818cf8; 
      transform: scale(1.02);
    }

    .plus-icon { 
      font-size: 1.75rem; 
      background: rgba(99, 102, 241, 0.1);
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .slot-label { 
      font-size: 0.65rem; 
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Slot Component */
    .slot-component {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: inherit;
      box-sizing: border-box;
    }

    .slot-toolbar-right {
      position: absolute !important;
      top: 10px !important;
      right: 16px !important;
      left: auto !important;
      display: flex !important;
      gap: 6px !important;
      z-index: 1000 !important;
      opacity: 0;
      transform: translateY(-5px);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      width: auto !important;
      pointer-events: auto !important;
    }

    .slot:hover .slot-toolbar-right, .slot.selected .slot-toolbar-right { 
      opacity: 1; 
      transform: translateY(0);
    }

    .slot-btn {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      color: #e2e8f0;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .slot-btn:hover { 
      background: #6366f1; 
      color: white; 
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .slot-btn.drag-handle { 
      cursor: grab; 
      background: rgba(99, 102, 241, 0.15); 
      border-color: rgba(99, 102, 241, 0.4); 
      color: #818cf8;
    }

    .slot-btn.drag-handle:hover { 
      background: #6366f1; 
      color: white; 
    }

    .slot-btn.danger:hover { 
      background: #ef4444; 
    }

    .slot-image { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      border-radius: inherit;
    }

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

    /* Premium Resize Anchors (8 points) */
    .slot { 
      position: relative; 
      transition: border-color 0.2s, width 0.1s; 
      z-index: 1;
    } 
    
    .slot:hover, .slot.selected, .slot.resizing {
      z-index: 100;
    }
    
    .resize-anchors {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 105;
    }

    .resize-anchor {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #ffffff;
      border: 2px solid #6366f1;
      border-radius: 2px;
      opacity: 0;
      pointer-events: all;
      transition: all 0.2s;
    }
    
    .slot.selected .resize-anchor, .slot.resizing .resize-anchor {
      opacity: 1;
    }

    .resize-anchor:hover {
      background: #10b981;
      transform: scale(1.3);
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
    }

    .resize-anchor.nw { top: -6px; left: -6px; cursor: nwse-resize; }
    .resize-anchor.n  { top: -6px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
    .resize-anchor.ne { top: -6px; right: -6px; cursor: nesw-resize; }
    .resize-anchor.e  { top: 50%; right: -6px; transform: translateY(-50%); cursor: ew-resize; }
    .resize-anchor.se { bottom: -6px; right: -6px; cursor: nwse-resize; }
    .resize-anchor.s  { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
    .resize-anchor.sw { bottom: -6px; left: -6px; cursor: nesw-resize; }
    .resize-anchor.w  { top: 50%; left: -6px; transform: translateY(-50%); cursor: ew-resize; }

    .slot:hover .resize-anchor,
    .slot.selected .resize-anchor,
    .slot.resizing .resize-anchor {
      opacity: 1;
    }

    .resize-anchor:hover {
      transform: scale(1.4);
      background: #10b981;
      border-color: #ffffff;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
    }

    /* Corner positions */
    .resize-anchor.nw { top: -6px; left: -6px; cursor: nw-resize; }
    .resize-anchor.ne { top: -6px; right: -6px; cursor: ne-resize; }
    .resize-anchor.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
    .resize-anchor.se { bottom: -6px; right: -6px; cursor: se-resize; }

    /* Mid positions */
    .resize-anchor.n { top: -6px; left: calc(50% - 5px); cursor: ns-resize; }
    .resize-anchor.s { bottom: -6px; left: calc(50% - 5px); cursor: ns-resize; }
    .resize-anchor.e { right: -6px; top: calc(50% - 5px); cursor: ew-resize; }
    .resize-anchor.w { left: -6px; top: calc(50% - 5px); cursor: ew-resize; }

    .slot.resizing {
      border: 2px dashed #6366f1 !important;
      z-index: 10;
    }

    .layout-section.editing .slot:hover {
      border: 1px dashed rgba(99, 102, 241, 0.5);
      background: rgba(99, 102, 241, 0.02);
    }

    .layout-section.editing .slot.selected {
      border: 1px solid #6366f1;
      background: rgba(99, 102, 241, 0.05);
      box-shadow: inset 0 0 10px rgba(99, 102, 241, 0.1);
    }

    /* Containment & Overflow Protection */
    .slot {
      position: relative;
      overflow: hidden; /* Prevent children from breaking the grid */
      display: flex;
      flex-direction: column;
    }

    /* Force children to respect parent boundaries but allow auto height for flow */
    .slot:not(.flow-component) > * {
      width: 100% !important;
      height: 100% !important;
    }
    
    .slot.flow-component > * {
      width: 100% !important;
      height: auto !important;
    }

    .slot > * {
      max-width: 100%;
      max-height: 100%;
    }

    /* Flow components should allow vertical overflow if auto-height is active */
    .slot.flow-component {
      overflow: visible;
    }

    /* Track changes in layout-section */
    .layout-section {
      transition: all 0.3s ease;
    }
  `]
})
export class EditorLayoutSectionComponent extends BaseEditorSectionComponent implements OnInit, OnDestroy, OnChanges {
  // Dependency Injection
  readonly store = inject(Store);
  readonly cdr = inject(ChangeDetectorRef);
  readonly resizeService = inject(SlotResizeService);
  override readonly variantService = inject(VariantService);
  
  @HostBinding('class.isolated-mode-active-host') get isIsolatedModeActive() { return this.showIsolatedMode; }

  // Lifecycle Management
  private destroy$ = new Subject<void>();
  private persistSubject$ = new Subject<void>();
  
  // Preview mode state
  isPreviewMode = false;
  showEditorControls = false; // Toggle to show/hide editor controls in preview mode
  
  config: LayoutSectionConfig = createDefaultLayoutConfig();
  isEditing = false;
  showLayoutPicker = false;
  showComponentPicker = false;
  showSlotConfig = false;
  selectedSlotIndex = -1;
  editingSlotIndex = -1;
  editingSlot: SlotConfig | null = null;
  selectedCategory: string = 'all';
  private editingOriginMetrics: SlotMetrics | null = null;

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
  }

  ngOnInit() {
    this.loadConfigFromSection();
    this.setupPersistence();
    
    // Subscribe to builder step changes to detect preview mode
    this.variantService.builderStep$
      .pipe(takeUntil(this.destroy$))
      .subscribe(step => {
        const wasPreviewMode = this.isPreviewMode;
        this.isPreviewMode = step === 'preview';
        
        // When entering preview mode, disable editing mode
        if (!wasPreviewMode && this.isPreviewMode) {
          this.isEditing = false;
        }
        
        // Reset editor controls toggle when exiting preview mode
        if (!this.isPreviewMode) {
          this.showEditorControls = false;
        }
        this.cdr.detectChanges();
      });
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
          styles: s.styles ? { ...s.styles } : {},
          layoutStyles: s.layoutStyles ? { ...s.layoutStyles } : {}
        }))
      };
    } else {
      this.config = createDefaultLayoutConfig();
    }
    this.cdr.detectChanges();
  }

  /**
   * Setup debounced persistence
   */
  private setupPersistence(): void {
    this.persistSubject$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.dispatchUpdate());
  }

  /**
   * Trigger config persistence
   */
  private persistConfig(): void {
    this.persistSubject$.next();
  }

  /**
   * Dispatch update to store
   */
  private dispatchUpdate(): void {
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

    // Preserve existing slot content where possible but reset dimensions 
    // to allow them to re-flow into the new grid structure
    for (let i = 0; i < Math.min(oldSlots.length, newSlots.length); i++) {
      const oldSlot = oldSlots[i];
      const newStyles = { ...(oldSlot.styles || {}) };
      const newLayoutStyles = { ...(oldSlot.layoutStyles || {}) };
      
      // Remove fixed dimensions and positioning to allow re-flow into new grid
      const keysToRemove = ['width', 'height', 'min-height', 'left', 'top', 'position', 'transform'];
      keysToRemove.forEach(k => {
        delete newStyles[k];
        delete newLayoutStyles[k];
      });

      newSlots[i] = { 
        ...oldSlot, 
        id: newSlots[i].id,
        styles: newStyles,
        layoutStyles: newLayoutStyles
      };
    }

    this.config = {
      ...this.config,
      layoutType: type,
      slots: newSlots
    };
    
    this.resizeService.resetCustomSizes();
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

    this.resizeService.clearSlotSize(this.config, this.editingSlotIndex);
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

  // Components that support isolated mode editing
  private isolatedModeComponents: SlotComponentType[] = [
    'ui-button', 'ui-accordion', 'draggable-box', 
    'ui-title', 'ui-image', 'ui-card', 
    'ui-card-animated', 'ui-list', 'ui-card-product', 'ui-chip'
  ];

  editSlotComponent(index: number, event: Event) {
    event.stopPropagation();
    if (index < 0 || index >= this.config.slots.length) return;

    const slot = this.config.slots[index];
    if (slot.componentType === 'empty') return;

    // If the component supports isolated mode, open it directly
    if (this.isolatedModeComponents.includes(slot.componentType)) {
      this.openIsolatedMode(index, event);
      return;
    }

    // Otherwise, use the generic configuration modal
    this.editingSlotIndex = index;
    this.editingSlot = { ...slot, content: { ...(slot.content || {}) } };
    this.showSlotConfig = true;
  }

  closeSlotConfig() {
    this.showSlotConfig = false;
    this.editingSlot = null;
    this.editingSlotIndex = -1;
  }

  hasIsolatedMode(componentType: SlotComponentType): boolean {
    return this.isolatedModeComponents.includes(componentType);
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

  /**
   * Component Type Constants
   */
  private readonly ISOLATED_MODE_COMPONENTS: readonly SlotComponentType[] = [
    'ui-button', 
    'ui-accordion', 
    'draggable-box', 
    'ui-title', 
    'ui-image', 
    'ui-card', 
    'ui-card-animated', 
    'ui-list', 
    'ui-card-product', 
    'ui-chip'
  ] as const;

  private readonly TEXT_COMPONENTS: readonly SlotComponentType[] = [
    'ui-button', 
    'ui-title', 
    'ui-chip', 
    'draggable-box'
  ] as const;

  private readonly FLOW_COMPONENTS: readonly string[] = [
    'accordion', 
    'card', 
    'list', 
    'title', 
    'chip', 
    'button', 
    'draggable-box', 
    'text'
  ] as const;

  // Default Content Constants
  readonly DEFAULT_ACCORDION_ITEMS = [{ title: 'Item 1', content: 'Contenido 1' }];
  readonly DEFAULT_LIST_ITEMS = ['Item 1', 'Item 2', 'Item 3'];
  readonly DEFAULT_PRODUCT = { 
    image: '', 
    name: 'Producto', 
    description: 'Descripción...', 
    price: '0.00' 
  };

  getComponentStyles(slot: any): Record<string, any> {
    const styles = { ...(slot.styles || {}) };
    const componentType = slot.componentType as SlotComponentType;
    
    // 1. Draggable box handles its own style merging
    if (componentType === 'draggable-box') {
      return styles;
    }

    // 2. Position logic: Relative offsets vs absolute
    // Flow components use relative positioning to act as offsets from grid cell
    const hasCoordinates = !!styles['left'] || !!styles['top'] || !!styles['transform'];
    const isAbsolute = slot.layoutStyles?.['position'] === 'absolute' || styles['position'] === 'absolute';
    
    if (isAbsolute) {
      styles['position'] = 'absolute';
    } else if (hasCoordinates) {
      styles['position'] = 'relative';
    } else {
      if (styles['position'] === 'absolute') delete styles['position'];
    }
    
    // 3. Size enforcement
    // If no explicit width/height in styles, use layoutStyles if provided
    if (!styles['width'] && slot.layoutStyles?.['width']) styles['width'] = slot.layoutStyles['width'];
    if (!styles['height'] && slot.layoutStyles?.['height']) styles['height'] = slot.layoutStyles['height'];

    // 4. Default Alignment (Centered for small components)
    if (!styles['display'] && !isAbsolute) {
      styles['display'] = 'flex';
      styles['align-items'] = 'center';
      styles['justify-content'] = 'center';
      styles['width'] = styles['width'] || '100%';
    }

    // 5. Special Component Rules
    if (componentType === 'ui-accordion' || componentType === 'ui-list') {
      styles['width'] = '100%';
      styles['justify-content'] = 'stretch';
      styles['align-items'] = 'stretch';
    }

    if (componentType === 'ui-button' || componentType === 'ui-chip') {
      styles['align-self'] = 'center';
    }

    return {
      'max-width': '100%',
      'box-sizing': 'border-box',
      ...styles
    };
  }

  openIsolatedMode(index: number, event: Event) {
    event.stopPropagation();
    const slot = this.config.slots[index];
    if (slot.componentType === 'empty') return;

    this.editingSlotIndex = index;
    this.activeIsolatedType = slot.componentType;
    
    // DETECT METRICS & NORMALIZE TO 1200px REFERENCE GRID
    const metrics = this.detectSlotMetrics(event);
    const REFERENCE_WIDTH = 1200;
    const scaleFactor = REFERENCE_WIDTH / metrics.sectionWidth;
    
    // Normalize position relative to SECTION start for isolated mode
    // (slot position + component offset) * scale
    const rawLeft = parseInt(slot.layoutStyles?.['left']) || 0;
    const rawTop = parseInt(slot.layoutStyles?.['top']) || 0;
    
    const normalizedX = (metrics.localX + rawLeft) * scaleFactor;
    const normalizedY = (metrics.localY + rawTop) * scaleFactor;
    
    // Normalize size
    const currentSize = this.extractCurrentSize(
      slot.layoutStyles,
      this.getDefaultSize(slot.componentType, metrics.width)
    );
    const normalizedWidth = currentSize.width * scaleFactor;
    const normalizedHeight = currentSize.height * scaleFactor;

    // Build component-specific content mapping
    const mappedContent = this.buildIsolatedContent(slot, metrics);
    this.editingOriginMetrics = metrics;

    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: slot.id,
      type: slot.componentType,
      variant: slot.componentVariant || this.globalVariant,
      globalVariant: this.globalVariant,
      content: {
        ...mappedContent,
        currentScale: scaleFactor, // Store exact scale for perfect inverse mapping
        slotBounds: {
          x: metrics.localX * scaleFactor,
          y: metrics.localY * scaleFactor,
          width: metrics.width * scaleFactor,
          height: metrics.sectionHeight * scaleFactor 
        }
      },
      styles: { ...slot.layoutStyles },
      position: { x: Math.round(normalizedX), y: Math.round(normalizedY) },
      size: { width: Math.round(normalizedWidth), height: Math.round(normalizedHeight) },
      canvasSize: {
        width: REFERENCE_WIDTH,
        height: Math.round(metrics.sectionHeight * scaleFactor)
      }
    };
    
    if (this.isBrowser) {
      document.body.classList.add('isolated-mode-active');
    }
    
    this.showIsolatedMode = true;
    this.cdr.detectChanges();
  }

  /**
   * Detect slot visual metrics
   */
  private detectSlotMetrics(event: Event): SlotMetrics {
    let detectedWidth = 400;
    let sectionWidth = 1200;
    let sectionHeight = 800;
    let localX = 0;
    let localY = 0;

    try {
      const target = event.target as HTMLElement;
      const slotEl = target.closest('.slot') || target.closest('.layout-slot');
      const gridEl = target.closest('.grid-container');
      
      if (slotEl && gridEl) {
        const slotRect = slotEl.getBoundingClientRect();
        const gridRect = gridEl.getBoundingClientRect();
        
        detectedWidth = Math.round(slotRect.width);
        sectionWidth = Math.round(gridRect.width);
        sectionHeight = Math.round(gridRect.height);
        
        localX = Math.round(slotRect.left - gridRect.left);
        localY = Math.round(slotRect.top - gridRect.top);
      }
    } catch (error) {
      console.warn('Slot metrics detection failed', error);
    }

    return {
      width: detectedWidth,
      sectionWidth,
      sectionHeight,
      localX,
      localY
    };
  }

  /**
   * Build isolated mode content map
   */
  private buildIsolatedContent(
    slot: SlotConfig, 
    metrics: SlotMetrics
  ): ComponentContentMap {
    const contentBuilders: Record<SlotComponentType, () => ComponentContentMap> = {
      'ui-button': () => ({
        variant: slot.componentVariant || this.globalVariant || 'primary',
        rounded: slot.content?.['rounded'] || 'md',
        size: slot.content?.['size'] || 'md',
        dark: slot.content?.['dark'] || false,
        label: slot.content?.['text'] || slot.content?.['label'] || 'Botón',
        leadingIcon: slot.content?.['leadingIcon'],
        trailingIcon: slot.content?.['trailingIcon'],
        haptic: slot.content?.['haptic'] || false,
        soundUrl: slot.content?.['soundUrl'] || ''
      }),

      'ui-title': () => ({
        variant: slot.componentVariant || this.globalVariant || 'default',
        text: slot.content?.['text'] || 'Título',
        level: slot.content?.['level'] || 'h2',
        align: slot.content?.['align'] || 'left'
      }),
        
      'ui-accordion': () => ({
        variant: slot.componentVariant || this.globalVariant || 'default',
        items: slot.content?.['items'] || [{ title: 'Item 1', content: 'Contenido 1' }],
        multiOpen: slot.content?.['multiOpen'] || false,
        animation: slot.content?.['animation'] || 'smooth'
      }),
        
      'draggable-box': () => ({
        variant: slot.componentVariant || this.globalVariant || 'secondary',
        rounded: slot.content?.['rounded'] || 'md',
        size: slot.content?.['size'] || 'md',
        dark: slot.content?.['dark'] || false,
        text: slot.content?.['text'] || 'Draggable Box'
      }),

      'ui-list': () => ({
        variant: slot.componentVariant || this.globalVariant || 'default',
        items: slot.content?.['items'] || ['Item 1', 'Item 2', 'Item 3'],
        listVariant: slot.content?.['listVariant'] || 'default'
      }),

      'ui-card-product': () => {
        const productData = slot.content?.['product'] || {};
        return {
          variant: slot.componentVariant || this.globalVariant || 'default',
          name: productData.name || 'Producto',
          price: productData.price || '0.00',
          image: productData.image || '',
          description: productData.description || 'Descripción...',
          currency: productData.currency || 'USD',
          onSale: productData.onSale || false
        };
      },

      'ui-chip': () => ({
        variant: slot.componentVariant || this.globalVariant || 'default',
        text: slot.content?.['text'] || 'Chip',
        removable: slot.content?.['removable'] || false
      }),

      'ui-image': () => ({
        variant: slot.componentVariant || this.globalVariant || 'default',
        src: slot.content?.['src'] || 'assets/placeholder.jpg',
        alt: slot.content?.['alt'] || 'Imagen'
      }),

      'ui-card': () => ({ 
        ...slot.content,
        variant: slot.componentVariant || this.globalVariant || 'default'
      }),

      'ui-card-animated': () => ({ 
        ...slot.content,
        variant: slot.componentVariant || this.globalVariant || 'default'
      }),

      'empty': () => ({}),
    };

    const builder = contentBuilders[slot.componentType];
    return builder ? builder() : { 
      ...slot.content,
      variant: slot.componentVariant || this.globalVariant || 'default'
    };
  }

  /**
   * Get default size for component type
   */
  private getDefaultSize(
    componentType: SlotComponentType, 
    detectedWidth: number
  ): ComponentDefaultSize {
    const sizeMap: Record<SlotComponentType, ComponentDefaultSize> = {
      'ui-button': { width: Math.min(220, detectedWidth), height: 50 },
      'ui-title': { width: detectedWidth, height: 100 },
      'ui-accordion': { width: detectedWidth, height: 250 },
      'draggable-box': { width: Math.min(280, detectedWidth), height: 120 },
      'ui-list': { width: detectedWidth, height: 300 },
      'ui-card-product': { width: Math.min(320, detectedWidth), height: 480 },
      'ui-chip': { width: 120, height: 40 },
      'ui-image': { width: detectedWidth, height: Math.round(detectedWidth * 0.6) },
      'ui-card': { width: detectedWidth, height: 400 },
      'ui-card-animated': { width: detectedWidth, height: 400 },
      'empty': { width: detectedWidth, height: 300 }
    };

    return sizeMap[componentType] || { width: detectedWidth, height: 300 };
  }

  /**
   * Extract current size from styles
   */
  private extractCurrentSize(
    layoutStyles: Record<string, any> | undefined,
    defaultSize: ComponentDefaultSize
  ): ComponentDefaultSize {
    const currentStyleW = layoutStyles?.['width'];
    const currentStyleH = layoutStyles?.['height'];
    
    const parseSize = (value: any, fallback: number): number => {
      if (typeof value === 'number') return value;
      if (value && value.toString().includes('px')) return parseInt(value);
      return fallback;
    };

    return {
      width: parseSize(currentStyleW, defaultSize.width),
      height: parseSize(currentStyleH, defaultSize.height)
    };
  }

  onIsolatedModeApplied(updatedConfig: IsolatedModeConfig) {
    if (this.editingSlotIndex < 0) return;

    const slot = this.config.slots[this.editingSlotIndex];
    let mappedContent: any = { ...updatedConfig.content };
    let newVariant: string | undefined = undefined;
    
    switch (slot.componentType) {
      case 'ui-button':
        mappedContent = {
          ...updatedConfig.content,
          text: updatedConfig.content.text || updatedConfig.content.label || 'Botón'
        };
        newVariant = updatedConfig.content.variant;
        // Fix for button expanded state if width is 100%
        if (updatedConfig.styles?.['width'] === '100%') {
          mappedContent['expanded'] = true;
        }
        break;
        
      case 'ui-accordion':
        mappedContent = { 
          ...updatedConfig.content,
          items: updatedConfig.content.items || this.DEFAULT_ACCORDION_ITEMS 
        };
        newVariant = updatedConfig.content.variant || updatedConfig.content.accordionVariant;
        break;
        
      case 'draggable-box':
        mappedContent = {
          ...updatedConfig.content,
          text: updatedConfig.content.text || 'Draggable Box'
        };
        newVariant = updatedConfig.content.variant;
        break;

      case 'ui-card-product':
        mappedContent = { product: { ...updatedConfig.content } };
        newVariant = updatedConfig.content.variant;
        break;

      case 'ui-title':
      case 'ui-chip':
        mappedContent = {
           ...updatedConfig.content,
           text: updatedConfig.content.text || updatedConfig.content.label || updatedConfig.content.title
        };
        newVariant = updatedConfig.content.variant;
        break;
        
      default:
        mappedContent = { ...updatedConfig.content };
        newVariant = updatedConfig.content?.variant;
    }

    const finalVariant = newVariant || updatedConfig.variant || slot.componentVariant;
    const newSlots = [...this.config.slots];
    
    // Position & Style Sync
    // We separate 'box' styles (layout) from 'content' styles (appearance)
    const finalAppearanceStyles = { ...updatedConfig.styles };
    const layoutStyles = { ...(newSlots[this.editingSlotIndex].layoutStyles || {}) };
    
    // Coordinate Re-Mapping Flow:
    // 1. Config -> Normalized (already done in Isolated Mode)
    // 2. Normalized -> Real Section Pixels (based on current viewport width)
    // 3. Real Section Pixels -> Slot-Relative Pixels (Subtract localX/localY)
    
    if (updatedConfig.position && updatedConfig.canvasSize && this.editingOriginMetrics) {
        const REFERENCE_WIDTH = 1200;
        // Use stored scale factor for 100% precision, fallback to detection
        const activeScale = updatedConfig.content?.['currentScale'] || (REFERENCE_WIDTH / this.editingOriginMetrics.sectionWidth);
        const invScale = 1 / activeScale;
        
        // Convert normalized isolated coordinates back to real section pixels
        const realX = updatedConfig.position.x * invScale;
        const realY = updatedConfig.position.y * invScale;
        const realW = updatedConfig.size?.width ? updatedConfig.size.width * invScale : 0;
        const realH = updatedConfig.size?.height ? updatedConfig.size.height * invScale : 0;

        // Clamp to SECTION boundaries
        let clampedX = Math.max(0, realX);
        let clampedY = Math.max(0, realY);
        
        if (clampedX + realW > this.editingOriginMetrics.sectionWidth) {
          clampedX = Math.max(0, this.editingOriginMetrics.sectionWidth - realW);
        }

        // Convert SECTION-RELATIVE coordinates to SLOT-RELATIVE coordinates
        let finalX = clampedX - this.editingOriginMetrics.localX;
        let finalY = clampedY - this.editingOriginMetrics.localY;

        // Sync back width/height
        layoutStyles['width'] = Math.round(realW) + 'px';
        
        const flowComponents = ['accordion', 'card', 'list', 'title', 'chip', 'button', 'draggable-box', 'text'];
        const isFlow = flowComponents.some(type => slot.componentType.includes(type));
        
        if (isFlow) {
            layoutStyles['height'] = 'auto';
            layoutStyles['min-height'] = Math.round(realH) + 'px';
        } else {
            layoutStyles['height'] = Math.round(realH) + 'px';
        }

        // Position logic refinement:
        // Only force absolute positioning if it was already absolute 
        // OR if the position has meaningfully changed (user dragged it)
        const wasAbsolute = slot.layoutStyles?.['position'] === 'absolute' || 
                           !!slot.layoutStyles?.['left'] || 
                           !!slot.layoutStyles?.['top'];
                           
        const hasMoved = this.editingOriginMetrics && (
          Math.abs(finalX - (parseInt(slot.layoutStyles?.['left']) || 0)) > 5 ||
          Math.abs(finalY - (parseInt(slot.layoutStyles?.['top']) || 0)) > 5
        );

        if (wasAbsolute || hasMoved) {
          layoutStyles['left'] = Math.round(finalX) + 'px';
          layoutStyles['top'] = Math.round(finalY) + 'px';
          layoutStyles['position'] = 'absolute';
          
          // Remove from appearance styles
          delete finalAppearanceStyles['left'];
          delete finalAppearanceStyles['top'];
          delete finalAppearanceStyles['position'];
        } else {
          // If not moved and wasn't absolute, ensure we don't have orphan coordinates
          delete layoutStyles['left'];
          delete layoutStyles['top'];
          // Keep it flow-relative
          if (layoutStyles['position'] === 'absolute') delete layoutStyles['position'];
        }
    }

    newSlots[this.editingSlotIndex] = {
      ...newSlots[this.editingSlotIndex],
      componentVariant: finalVariant,
      content: mappedContent,
      styles: finalAppearanceStyles,
      layoutStyles: layoutStyles
    };

    this.config = {
      ...this.config,
      slots: newSlots
    };

    this.persistConfig();
    this.onIsolatedModeClosed();
  }

  onIsolatedModeClosed() {
    // Remove body class for proper z-index stacking context
    document.body.classList.remove('isolated-mode-active');
    
    this.showIsolatedMode = false;
    this.activeIsolatedType = null;
    this.editingSlotIndex = -1;
    // Reset editor controls toggle when closing isolated mode
    this.showEditorControls = false;
    this.cdr.detectChanges();
  }

  /**
   * TrackBy function for slots to prevent re-rendering during resize
   */
  trackBySlotIndex(index: number): number {
    return index;
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

  // ========== SLOT RESIZE METHODS ==========

  /**
   * Handle resize move to update UI (force CD)
   */
  onResizeMoving(): void {
    this.cdr.detectChanges();
  }

  /**
   * Get effective slot width (custom or auto)
   */
  getSlotWidth(index: number): number | null {
    const customSize = this.resizeService.customSizes().get(index);
    if (customSize && customSize.width > 0) {
      return customSize.width;
    }
    return null; // Use CSS Grid auto
  }

  /**
   * Get effective slot height (custom or auto)
   */
  getSlotHeight(index: number): number | null {
    const customSize = this.resizeService.customSizes().get(index);
    if (customSize && customSize.height > 0) {
      return customSize.height;
    }
    return null;
  }

  /**
   * Get reactive slot left position
   */
  getSlotLeft(index: number): number | null {
    const customSize = this.resizeService.customSizes().get(index);
    if (customSize && customSize.left !== undefined) {
      return customSize.left;
    }
    return null;
  }

  /**
   * Get reactive slot top position
   */
  getSlotTop(index: number): number | null {
    const customSize = this.resizeService.customSizes().get(index);
    if (customSize && customSize.top !== undefined) {
      return customSize.top;
    }
    return null;
  }

  /**
   * Handle slot resize event
   */
  onSlotResized(index: number, event: ResizeEvent): void {
    const custom = this.resizeService.customSizes().get(index);
    if (!custom) return;

    // Apply exact dimensions and position from the service state
    this.config = this.resizeService.resizeSlot(
      this.config, 
      index, 
      custom.width, 
      custom.height, 
      custom.left, 
      custom.top
    );
    
    // Optionally auto-distribute remaining space
    if (this.resizeService.resizeMode === 'auto-distribute') {
      // newWidth is not available here, assuming custom.width is the intended value
      this.config = this.resizeService.calculateAutoDistribution(this.config, index, custom.width);
    }
    
    this.persistConfig();
    this.cdr.detectChanges();
  }

  /**
   * Check if slot has custom size
   */
  hasCustomSize(index: number): boolean {
    return this.resizeService.hasCustomSize(index);
  }

  /**
   * Check if slot is not empty (helper for template)
   */
  isSlotFilled(slot: SlotConfig): boolean {
    return slot.componentType !== 'empty';
  }

  /**
   * Check if slot contains a flow component (needs auto-height)
   */
  isFlowComponent(slot: SlotConfig): boolean {
    if (!slot) return false;
    const flowTypes = ['accordion', 'card', 'list', 'title', 'chip', 'button', 'draggable-box', 'text'];
    const type = slot.componentType.toLowerCase();
    return flowTypes.some(ft => type.includes(ft));
  }

  /**
   * Reset slot to auto size
   */
  resetSlotSize(index: number): void {
    this.config = this.resizeService.clearSlotSize(this.config, index);
    this.persistConfig();
    this.cdr.detectChanges();
  }

  isPositioned(index: number, slot: SlotConfig): boolean {
    // Strictly disable absolute positioning for grid layouts to prevent structure breaking
    if (this.resizeService.isStrictGrid(this.config.layoutType)) return false;

    if (this.getSlotLeft(index) !== null || this.getSlotTop(index) !== null) return true;
    if (slot.layoutStyles?.['left'] || slot.layoutStyles?.['top']) return true;
    return slot.layoutStyles?.['position'] === 'absolute' || slot.styles?.['position'] === 'absolute';
  }

  resetSlotPosition(index: number): void {
    const slots = [...this.config.slots];
    const slot = { ...slots[index] };
    
    if (slot.layoutStyles) {
      const newLayout = { ...slot.layoutStyles };
      delete newLayout['left'];
      delete newLayout['top'];
      delete newLayout['position'];
      slot.layoutStyles = newLayout;
    }
    
    if (slot.styles) {
      const newStyles = { ...slot.styles };
      delete newStyles['left'];
      delete newStyles['top'];
      delete newStyles['position'];
      slot.styles = newStyles;
    }

    slots[index] = slot;
    this.config = { ...this.config, slots };
    this.persistConfig();
    this.cdr.detectChanges();
  }

  /**
   * Toggle editor controls in preview mode
   * When in preview mode, this toggles the editor controls visibility
   */
  toggleEditorControlsInPreview(): void {
    this.showEditorControls = !this.showEditorControls;
    
    if (this.showEditorControls) {
      this.isEditing = true;
      // showIsolatedMode only activates when user clicks
      // the edit button on a specific slot
    } else {
      this.isEditing = false;
    }
    
    this.cdr.detectChanges();
  }
}
