import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef, inject, Inject, PLATFORM_ID, ViewContainerRef, TemplateRef, ViewChild } from '@angular/core';
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
  getColumnCount,
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
          <span class="label-text">Layout: {{ getLayoutLabel() }} <small style="opacity: 0.5; margin-left:8px">({{ config.layoutType }} -> {{ getGridTemplate() }})</small></span>
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

      <!-- Grid Container - ONE per row for independent resize -->
      <div *ngFor="let row of getRowGroups(); let ri = index; trackBy: trackBySlotIndex"
           class="grid-container"
           [style.grid-template-columns]="getGridTemplateForRow(ri)"
           [style.gap.px]="config.gap"
           [attr.data-row]="ri">
        
        <!-- Slots -->
        <div 
          *ngFor="let slotEntry of row; trackBy: trackBySlotEntry" 
          class="slot"
          [class.empty]="slotEntry.slot.componentType === 'empty'"
          [class.selected]="selectedSlotIndex === slotEntry.globalIndex"
          [class.resizing]="resizeService.isResizing() && resizeService.activeSlotIndex() === slotEntry.globalIndex"
          [class.flow-component]="isFlowComponent(slotEntry.slot)"
          [class.preview-mode]="isPreviewMode && !showEditorControls"
          [class.strict-grid]="isStrictGridLayout()"
          [style.height]="getSlotStyleHeight(slotEntry.globalIndex, slotEntry.slot)"
          [style.minHeight]="getSlotStyleMinHeight(slotEntry.globalIndex, slotEntry.slot)"
          [style.left]="getSlotStyleLeft(slotEntry.globalIndex)"
          [style.top]="getSlotStyleTop(slotEntry.globalIndex)"
          [style.position]="getSlotStylePosition(slotEntry.globalIndex, slotEntry.slot)"
          [attr.data-slot-index]="slotEntry.globalIndex"
          (click)="selectSlot(slotEntry.globalIndex, $event)">
          
          <!-- Empty Slot -->
          <div *ngIf="slotEntry.slot.componentType === 'empty' && (!isPreviewMode || showEditorControls)" class="empty-slot">
            <div class="empty-content" (click)="openComponentPicker(slotEntry.globalIndex, $event)">
              <span class="plus-icon">+</span>
              <span class="slot-label">Añadir Componente</span>
            </div>
          </div>

          <!-- Filled Slot - Component Renderer -->
          <ng-container *ngIf="slotEntry.slot.componentType !== 'empty'">
            <div class="slot-component" style="height: auto; min-height: 100%;">
              <!-- Editing Overlay -->
              <div *ngIf="(!isPreviewMode && isEditing) || showEditorControls" class="slot-controls">
                <button *ngIf="isPositioned(slotEntry.globalIndex, slotEntry.slot)"
                        class="slot-btn" 
                        (click)="resetSlotPosition(slotEntry.globalIndex)" 
                        title="Resetear Posición (Centrar en Grid)">🎯</button>
                <button class="slot-btn drag-handle" 
                        appResizeHandle [slotIndex]="slotEntry.globalIndex" anchor="move"
                        title="Mover Componente">⠿</button>
                <button class="slot-btn edit-btn" 
                        (click)="editSlotComponent(slotEntry.globalIndex, $event)" 
                        [title]="hasIsolatedMode(slotEntry.slot.componentType) ? 'Editar en Modo Aislado' : 'Configurar'">
                  {{ hasIsolatedMode(slotEntry.slot.componentType) ? '🎯' : '⚙️' }}
                </button>
                <button class="slot-btn" (click)="openComponentPicker(slotEntry.globalIndex, $event)" title="Cambiar Componente">🔄</button>
                <button class="slot-btn danger" (click)="clearSlot(slotEntry.globalIndex, $event)" title="Eliminar">🗑️</button>
              </div>

              <!-- Component Content -->
              <ng-container [ngSwitch]="slotEntry.slot.componentType">

                <!-- UI BUTTON -->
                <lib-ui-components-button
                  *ngSwitchCase="'ui-button'"
                  [variant]="$any(slotEntry.slot.componentVariant || globalVariant || 'primary')"
                  [customStyles]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)">
                  {{ slotEntry.slot.content?.['text'] || 'Botón' }}
                </lib-ui-components-button>

                <!-- UI TITLE -->
                <lib-ui-components-title
                  *ngSwitchCase="'ui-title'"
                  [text]="slotEntry.slot.content?.['text'] || 'Título'"
                  [variant]="$any(slotEntry.slot.componentVariant || globalVariant || 'default')"
                  [customStyles]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)">
                </lib-ui-components-title>

                <!-- UI IMAGE -->
                <lib-ui-image
                  *ngSwitchCase="'ui-image'"
                  [src]="slotEntry.slot.content?.['src'] || 'assets/placeholder.jpg'"
                  [alt]="slotEntry.slot.content?.['alt'] || 'Imagen'"
                  [variant]="$any(slotEntry.slot.componentVariant || globalVariant || 'default')"
                  [filter]="slotEntry.slot.styles?.['filter']"
                  [customStyles]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)"
                  class="slot-image">
                </lib-ui-image>


                <!-- UI CARD -->
                <lib-ui-components-card
                  *ngSwitchCase="'ui-card'"
                  [variant]="$any(slotEntry.slot.componentVariant || globalVariant || 'glass')"
                  [title]="slotEntry.slot.content?.['title'] || 'Título'"
                  [description]="slotEntry.slot.content?.['description'] || 'Descripción...'"
                  [customStyles]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)"
                  class="slot-card">
                </lib-ui-components-card>

                <!-- UI CARD ANIMATED -->
                <lib-ui-components-card-animated
                  *ngSwitchCase="'ui-card-animated'"
                  [variant]="$any(slotEntry.slot.componentVariant || globalVariant || 'default')"
                  [customStyles]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)"
                  class="slot-card">
                </lib-ui-components-card-animated>

                <!-- UI ACCORDION -->
                <div 
                  *ngSwitchCase="'ui-accordion'" 
                  [ngStyle]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)">
                  <lib-ui-components-accordion
                    style="width: 100%; height: auto; display: block;"
                    [variant]="$any(slotEntry.slot.componentVariant || globalVariant || 'default')"
                    [items]="slotEntry.slot.content?.['items'] || [{title:'Item 1', content:'Contenido 1'}]">
                  </lib-ui-components-accordion>
                </div>

                <!-- UI LIST -->
                <lib-ui-list
                  *ngSwitchCase="'ui-list'"
                  [variant]="$any(slotEntry.slot.componentVariant || globalVariant || 'default')"
                  [items]="slotEntry.slot.content?.['items'] || ['Item 1', 'Item 2', 'Item 3']"
                  [customStyles]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)">
                </lib-ui-list>

                <!-- UI CARD PRODUCT -->
                <lib-card-products
                  *ngSwitchCase="'ui-card-product'"
                  [variant]="$any(slotEntry.slot.componentVariant || globalVariant || 'default')"
                  [product]="slotEntry.slot.content?.['product'] || { image: '', name: 'Producto', description: 'Descripción...', price: '0.00' }"
                  [customStyles]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)">
                </lib-card-products>

                <!-- UI CHIP -->
                <lib-ui-components-chip
                  *ngSwitchCase="'ui-chip'"
                  [variant]="$any(slotEntry.slot.componentVariant || globalVariant || 'default')"
                  [customStyles]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)">
                  {{ slotEntry.slot.content?.['text'] || 'Chip' }}
                </lib-ui-components-chip>

                <!-- DRAGGABLE BOX -->
                <lib-ui-components-draggable-box-1
                  *ngSwitchCase="'draggable-box'"
                  [variant]="$any(slotEntry.slot.content?.['variant'] || slotEntry.slot.componentVariant || globalVariant || 'secondary')"
                  [content]="slotEntry.slot.content?.['text'] || 'Caja'"
                  [customStyles]="getComponentStyles(slotEntry.slot, slotEntry.globalIndex)"
                  class="slot-box">
                </lib-ui-components-draggable-box-1>

                <!-- Default/Unknown -->
                <div *ngSwitchDefault class="unknown-component">
                  <span class="unknown-icon">❓</span>
                  <span>{{ slotEntry.slot.componentType }}</span>
                </div>

              </ng-container>

            </div>

            <!-- Resize Anchors - OUTSIDE slot-component so they aren't clipped -->
            <div *ngIf="((!isPreviewMode && isEditing) || showEditorControls) && isSlotFilled(slotEntry.slot)" class="resize-anchors">
                <div class="resize-anchor nw" appResizeHandle [slotIndex]="slotEntry.globalIndex" anchor="nw" [isStrictGrid]="isStrictGridLayout()" [layoutType]="config.layoutType" (resizeStart)="onSlotResizeStart(slotEntry.globalIndex)" (resized)="onSlotResized(slotEntry.globalIndex, $event)" (resizeMove)="onResizeMoving()"></div>
                <div class="resize-anchor n"  appResizeHandle [slotIndex]="slotEntry.globalIndex" anchor="n"  [isStrictGrid]="isStrictGridLayout()" [layoutType]="config.layoutType" direction="vertical" (resizeStart)="onSlotResizeStart(slotEntry.globalIndex)" (resized)="onSlotResized(slotEntry.globalIndex, $event)" (resizeMove)="onResizeMoving()"></div>
                <div class="resize-anchor ne" appResizeHandle [slotIndex]="slotEntry.globalIndex" anchor="ne" [isStrictGrid]="isStrictGridLayout()" [layoutType]="config.layoutType" (resizeStart)="onSlotResizeStart(slotEntry.globalIndex)" (resized)="onSlotResized(slotEntry.globalIndex, $event)" (resizeMove)="onResizeMoving()"></div>
                <div class="resize-anchor e"  appResizeHandle [slotIndex]="slotEntry.globalIndex" anchor="e"  [isStrictGrid]="isStrictGridLayout()" [layoutType]="config.layoutType" direction="horizontal" (resizeStart)="onSlotResizeStart(slotEntry.globalIndex)" (resized)="onSlotResized(slotEntry.globalIndex, $event)" (resizeMove)="onResizeMoving()"></div>
                <div class="resize-anchor se" appResizeHandle [slotIndex]="slotEntry.globalIndex" anchor="se" [isStrictGrid]="isStrictGridLayout()" [layoutType]="config.layoutType" (resizeStart)="onSlotResizeStart(slotEntry.globalIndex)" (resized)="onSlotResized(slotEntry.globalIndex, $event)" (resizeMove)="onResizeMoving()"></div>
                <div class="resize-anchor s"  appResizeHandle [slotIndex]="slotEntry.globalIndex" anchor="s"  [isStrictGrid]="isStrictGridLayout()" [layoutType]="config.layoutType" direction="vertical" (resizeStart)="onSlotResizeStart(slotEntry.globalIndex)" (resized)="onSlotResized(slotEntry.globalIndex, $event)" (resizeMove)="onResizeMoving()"></div>
                <div class="resize-anchor sw" appResizeHandle [slotIndex]="slotEntry.globalIndex" anchor="sw" [isStrictGrid]="isStrictGridLayout()" [layoutType]="config.layoutType" (resizeStart)="onSlotResizeStart(slotEntry.globalIndex)" (resized)="onSlotResized(slotEntry.globalIndex, $event)" (resizeMove)="onResizeMoving()"></div>
                <div class="resize-anchor w"  appResizeHandle [slotIndex]="slotEntry.globalIndex" anchor="w"  [isStrictGrid]="isStrictGridLayout()" [layoutType]="config.layoutType" direction="horizontal" (resizeStart)="onSlotResizeStart(slotEntry.globalIndex)" (resized)="onSlotResized(slotEntry.globalIndex, $event)" (resizeMove)="onResizeMoving()"></div>
            </div>
          </ng-container>
        </div>
      </div>



    </section>

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

  :host:has(.isolated-mode-fullscreen-overlay) {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    z-index: 2147483647 !important;
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

    /* When isolated mode is active, ensure overflow is visible for the section */
    .layout-section.isolated-mode {
      overflow: visible !important;
      transform: none !important;
    }

    /* Also force overflow visible for any parent containers when isolated mode is active */
    .isolated-mode-active .layout-section {
      overflow: visible !important;
      transform: none !important;
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
      z-index: 2147483647 !important; /* Max z-index possible */
      background: rgba(2, 6, 23, 0.98) !important;
      backdrop-filter: blur(20px) !important;
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
      min-height: 100px;
      border: 1px dashed rgba(99, 102, 241, 0.15);
      border-radius: 12px;
      transition: border-color 0.2s ease, background-color 0.2s ease;
      background: rgba(15, 23, 42, 0.2);
      overflow: visible;
    }

    /* Clip child content so it doesn't spill out */
    .slot > .slot-component {
      width: 100%;
      min-width: 0; /* Crucial for flex item shrinking */
      overflow: hidden;
      border-radius: inherit;
    }

    /* Strict grid slots - let grid-template-columns control width, but NOT during resize */
    .slot.strict-grid:not(.resizing) {
      width: auto !important;
      min-width: 0;
    }

    .slot.resizing {
      transition: none !important;
      z-index: 100;
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
    
    /* Ensure empty slot is clickable */
    .slot.empty {
      background: rgba(2, 6, 23, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10 !important;
    }

    .empty-content {
      pointer-events: auto !important;
      position: relative;
      z-index: 20;
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
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      box-sizing: border-box;
    }

    /* Flow components should expand to content */
    .slot.flow-component .slot-component {
      height: auto;
      min-height: 100%;
    }

    .slot-controls {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 6px;
      z-index: 100;
      opacity: 0;
      transform: translateY(-5px);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .slot:hover .slot-controls, .slot.selected .slot-controls { 
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
      z-index: 100000 !important;
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
    
    .resize-anchor {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #ffffff;
      border: 2px solid #10b981;
      border-radius: 4px;
      z-index: 2000;
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: auto;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
      overflow: visible;
      display: flex;
      flex-direction: column;
    }

    /* In strict grid mode, let grid control the width (except during resize) */
    .slot.strict-grid:not(.resizing) {
      width: auto !important;
    }

    /* Slot component wrapper fills the slot */
    .slot-component {
      flex: 1 1 auto;
      width: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
    }

    /* Flow components should allow content to expand */
    .slot.flow-component {
      overflow: visible;
      flex-shrink: 0;
    }

    .slot.flow-component .slot-component {
      flex: 0 0 auto;
    }

    /* Force children to respect parent boundaries */
    .slot:not(.flow-component) .slot-component > * {
      width: 100% !important;
      max-width: 100% !important;
    }
    
    .slot.flow-component .slot-component > * {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box;
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
    this.resizeService.syncFromConfig(this.config);
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
      const layoutType = rawConfig.layoutType || 'single';
      const isStrict = this.resizeService.isStrictGrid(layoutType);

      // PRESERVATION LOGIC:
      // If we have a local pending override and the incoming config has NONE, keep the local one.
      // This handles the race condition where store updates 'section' before our persistConfig() round-trip completes.
      let preservedOverrides = rawConfig.gridTemplateOverridePerRow;
      if (!preservedOverrides && this.config?.gridTemplateOverridePerRow && this.config.layoutType === layoutType) {
         preservedOverrides = this.config.gridTemplateOverridePerRow;
      }

      this.config = {
        ...createDefaultLayoutConfig(),
        ...rawConfig,
        gridTemplateOverridePerRow: preservedOverrides, // Apply preserved overrides
        slots: (rawConfig.slots || []).map((s: any) => {
          const cleanLayoutStyles = { ...(s.layoutStyles || {}) };
          
          // Detect and kill captured full-widths that break column layouts
          if (isStrict && cleanLayoutStyles['width']) {
            const w = parseInt(cleanLayoutStyles['width']);
            if (w > 900) {
              delete cleanLayoutStyles['width'];
              delete cleanLayoutStyles['left'];
              cleanLayoutStyles['position'] = 'relative';
              console.log(`[Layout] Sanitized slot width ${w}px for strict layout ${layoutType}`);
            }
          }

          return {
            ...s,
            content: s.content ? { ...s.content } : {},
            styles: s.styles ? { ...s.styles } : {},
            layoutStyles: cleanLayoutStyles
          };
        })
      };
    } else {
      this.config = createDefaultLayoutConfig();
    }
    
    // Sync service with loaded config
    if (this.isBrowser) {
      this.resizeService.syncFromConfig(this.config);
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
    return this.resizeService.getCustomGridTemplateForRow(this.config, 0);
  }

  /**
   * Partition slots into rows based on column count.
   * Returns Array of { slot, globalIndex }[] — one sub-array per row.
   */
  getRowGroups(): { slot: SlotConfig; globalIndex: number }[][] {
    const colCount = getColumnCount(this.config.layoutType);
    const slots = this.config.slots;
    const rows: { slot: SlotConfig; globalIndex: number }[][] = [];

    for (let i = 0; i < slots.length; i += colCount) {
      const row = slots.slice(i, i + colCount).map((slot, colIdx) => ({
        slot,
        globalIndex: i + colIdx
      }));
      rows.push(row);
    }

    return rows;
  }

  /**
   * Get independent grid template for a specific row.
   */
  getGridTemplateForRow(rowIndex: number): string {
    return this.resizeService.getCustomGridTemplateForRow(this.config, rowIndex);
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

    // Filter out size-related styles ALWAYS when switching layout types
    // to ensure the new grid distribution takes over cleanly
    for (let i = 0; i < Math.min(oldSlots.length, newSlots.length); i++) {
      const oldSlot = oldSlots[i];
      
      // We carry over content but NOT physical dimensions
      const cleanStyles = { ...(oldSlot.styles || {}) };
      const cleanLayoutStyles = {}; // Reset layout styles completely for fresh start

      const keysToRemove = ['width', 'height', 'min-height', 'max-width', 'max-height', 'left', 'top', 'position', 'transform'];
      keysToRemove.forEach(k => {
        delete cleanStyles[k];
      });

      newSlots[i] = { 
        ...newSlots[i], // Keep the fresh ID and empty componentType from initial slots
        componentType: oldSlot.componentType,
        componentVariant: oldSlot.componentVariant,
        content: oldSlot.content ? { ...oldSlot.content } : {},
        styles: cleanStyles,
        layoutStyles: cleanLayoutStyles
      };
    }

    this.config = {
      ...this.config,
      layoutType: type,
      slots: newSlots,
      gridTemplateOverride: undefined,
      gridTemplateOverridePerRow: undefined
    };
    
    // Clear ephemeral service state so getCustomGridTemplate uses the default
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
    console.log('[Editor] Opening component picker for slot', index);
    this.editingSlotIndex = index;
    this.showComponentPicker = true;
    this.selectedCategory = 'all';
    this.cdr.detectChanges();
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

  getComponentStyles(slot: SlotConfig, index: number): Record<string, any> {
    const styles = { ...(slot.styles || {}) };
    const componentType = slot.componentType as SlotComponentType;
    
    // Default Alignment / Display rules (Appearance Only)
    if (!styles['display']) {
      styles['display'] = 'flex';
      styles['align-items'] = 'center';
      styles['justify-content'] = 'center';
    }

    // Size enforcement - Component should fill its slot wrapper
    styles['width'] = '100%';
    styles['height'] = '100%';

    // Component-specific structural overrides
    const fullWidthComponents = ['ui-accordion', 'ui-list', 'ui-card', 'ui-card-animated', 'ui-card-product'];
    if (fullWidthComponents.some(type => componentType.includes(type))) {
      styles['justify-content'] = 'stretch';
      styles['align-items'] = 'stretch';
    }

    // Centering for buttons and chips
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
    
    // Detect visual width and position of the slot AND its parent section
    const metrics = this.detectSlotMetrics(event);
    
    // Use values from config if available and detection failed or yielded zero
    const currentLeft = parseInt(slot.layoutStyles?.['left']) || metrics.localX;
    const currentTop = parseInt(slot.layoutStyles?.['top']) || metrics.localY;
    
    const currentSize = this.extractCurrentSize(
      slot.layoutStyles,
      this.getDefaultSize(slot.componentType, metrics.width)
    );

    // Build component-specific content mapping
    const mappedContent = this.buildIsolatedContent(slot, metrics);
    this.editingOriginMetrics = metrics;

    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: slot.id,
      type: slot.componentType,
      variant: slot.componentVariant || this.globalVariant,
      globalVariant: this.globalVariant,
      content: mappedContent,
      styles: { ...slot.layoutStyles },
      position: { x: currentLeft, y: currentTop },
      size: currentSize,
      canvasSize: {
        width: metrics.sectionWidth,
        height: metrics.sectionHeight
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
    // FIX: Remove arbitrary caps (Math.min) so components respect the layout's actual width
    const sizeMap: Record<SlotComponentType, ComponentDefaultSize> = {
      'ui-button': { width: detectedWidth, height: 50 }, // Was min(220)
      'ui-title': { width: detectedWidth, height: 100 },
      'ui-accordion': { width: detectedWidth, height: 250 },
      'draggable-box': { width: detectedWidth, height: 120 },
      'ui-list': { width: detectedWidth, height: 300 },
      'ui-card-product': { width: detectedWidth, height: 480 }, // Was min(320)
      'ui-chip': { width: 120, height: 40 }, // Chips are naturally small
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
    
    // 1. Map content specialized per component type
    switch (slot.componentType) {
      case 'ui-button':
        mappedContent = {
          ...updatedConfig.content,
          text: updatedConfig.content.text || updatedConfig.content.label || 'Botón'
        };
        newVariant = updatedConfig.content.variant;
        if (updatedConfig.styles?.['width'] === '100%') mappedContent['expanded'] = true;
        break;
      case 'ui-accordion':
        mappedContent = { 
          ...updatedConfig.content,
          items: updatedConfig.content.items || this.DEFAULT_ACCORDION_ITEMS 
        };
        newVariant = updatedConfig.content.variant || updatedConfig.content.accordionVariant;
        break;
      case 'ui-card-product':
        mappedContent = { product: { ...updatedConfig.content } };
        newVariant = updatedConfig.content.variant;
        break;
      case 'ui-title':
      case 'ui-chip':
      case 'draggable-box':
        mappedContent = {
           ...updatedConfig.content,
           text: updatedConfig.content.text || updatedConfig.content.label || 'Contenido',
           variant: updatedConfig.content.variant // Ensure variant is preserved in content
        };
        newVariant = updatedConfig.variant || updatedConfig.content.variant;
        break;
      default:
        mappedContent = { ...updatedConfig.content };
        newVariant = updatedConfig.variant || updatedConfig.content?.variant;
    }

    const finalVariant = newVariant || slot.componentVariant;
    const newSlots = [...this.config.slots];
    const finalAppearanceStyles = { ...updatedConfig.styles };
    let layoutStyles = { ...(newSlots[this.editingSlotIndex].layoutStyles || {}) };
    
    // 2. Standardized Size & Position Sync (Robust) using the Service
    // This ensures that "strict grids" get their gridTemplateOverride updated
    // instead of just setting a width that gets ignored.
    if (updatedConfig.size && updatedConfig.position && updatedConfig.canvasSize) {
        const validated = this.resizeService.validateDimensions(updatedConfig.size.width, updatedConfig.size.height);
        
        // Calculate validated position
        const validatedPos = this.resizeService.validatePosition(
          updatedConfig.position.x, 
          updatedConfig.position.y,
          updatedConfig.canvasSize.width,
          updatedConfig.canvasSize.height,
          validated.width,
          validated.height
        );

        // Updates config with new layoutStyles AND gridTemplateOverride if needed
        this.config = this.resizeService.resizeSlot(
            this.config,
            this.editingSlotIndex,
            validated.width,
            validated.height,
            validatedPos.left,
            validatedPos.top
        );

        // Re-fetch the updated slot to get the correct layoutStyles
        const updatedSlot = this.config.slots[this.editingSlotIndex];
        layoutStyles = { ...updatedSlot.layoutStyles };
        
        // Clean up visual styles that shouldn't be there if layout service handled it
        delete finalAppearanceStyles['width'];
        delete finalAppearanceStyles['height'];
        delete finalAppearanceStyles['left'];
        delete finalAppearanceStyles['top'];
        delete finalAppearanceStyles['position'];
    }

    // 4. Update the slot in the config
    // Ensure variant is stored in BOTH componentVariant AND content.variant for consistency
    newSlots[this.editingSlotIndex] = {
      ...newSlots[this.editingSlotIndex],
      componentVariant: finalVariant,
      content: {
        ...mappedContent,
        variant: finalVariant // Ensure variant is also in content for template binding
      },
      styles: finalAppearanceStyles,
      layoutStyles: layoutStyles
    };

    this.config = { ...this.config, slots: newSlots };
    this.persistConfig();
    this.onIsolatedModeClosed();
    this.cdr.detectChanges();
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

  /**
   * TrackBy for per-row slot entries — uses the global index for identity.
   */
  trackBySlotEntry(index: number, entry: { slot: SlotConfig; globalIndex: number }): number {
    return entry.globalIndex;
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
   * Handle resize start capturing all current slot sizes for accurate proportional resizing
   */
  onSlotResizeStart(index: number): void {
    if (!this.isBrowser) return;

    const sectionEl = document.getElementById(this.section.id);
    if (!sectionEl) return;

    const sizes = new Map<number, { width: number; height: number; left?: number; top?: number }>();
    const gridContainers = sectionEl.querySelectorAll('.grid-container');

    // Capture dimensions for ALL slots in ALL rows
    // This is critical because syncFromConfig zeroes them out (isStrict=true),
    // and we need valid pixel values for neighbor rows to preserve their fr overrides.
    gridContainers.forEach(gridEl => {
      const gridRect = gridEl.getBoundingClientRect();
      const slotElements = gridEl.querySelectorAll('.slot');

      slotElements.forEach((el) => {
        const slotIndexAttr = el.getAttribute('data-slot-index');
        if (slotIndexAttr === null) return;
        
        const slotIdx = parseInt(slotIndexAttr, 10);
        const rect = el.getBoundingClientRect();
        const left = gridRect ? rect.left - gridRect.left : 0;
        const top = gridRect ? rect.top - gridRect.top : 0;

        sizes.set(slotIdx, {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          left: Math.round(left),
          top: Math.round(top)
        });
      });
    });

    this.resizeService.customSizes.set(sizes);
    this.cdr.detectChanges();
  }

  /**
   * Handle resize move to update UI (force CD)
   */
  onResizeMoving(): void {
    this.cdr.detectChanges();
  }

  /**
   * Check if current layout is a strict grid type
   */
  isStrictGridLayout(): boolean {
    return this.resizeService.isStrictGrid(this.config.layoutType);
  }

  /**
   * Get slot height style - returns string for [style.height] binding
   * In strict grid mode, we don't set inline height to let grid flow naturally
   */
  getSlotStyleHeight(index: number, slot: SlotConfig): string | null {
    const isFlow = this.isFlowComponent(slot);
    
    // During active resize, show explicit height
    if (this.resizeService.isResizing() && this.resizeService.activeSlotIndex() === index) {
      const customSize = this.resizeService.customSizes().get(index);
      if (customSize && customSize.height > 0) {
        return customSize.height + 'px';
      }
    }
    
    // For flow components, don't set fixed height - let content determine it
    if (isFlow) {
      return null;
    }
    
    // Check for persisted height in layoutStyles
    const savedHeight = slot.layoutStyles?.['height'];
    if (savedHeight) {
      const parsed = parseInt(savedHeight);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed + 'px';
      }
    }
    
    return null;
  }

  /**
   * Get slot min-height style for flow components
   */
  getSlotStyleMinHeight(index: number, slot: SlotConfig): string | null {
    const isFlow = this.isFlowComponent(slot);
    
    if (!isFlow) {
      return null;
    }
    
    // During active resize, show explicit min-height for flow components
    if (this.resizeService.isResizing() && this.resizeService.activeSlotIndex() === index) {
      const customSize = this.resizeService.customSizes().get(index);
      if (customSize && customSize.height > 0) {
        return customSize.height + 'px';
      }
    }
    
    // Check for persisted min-height in layoutStyles
    const savedMinHeight = slot.layoutStyles?.['min-height'];
    if (savedMinHeight) {
      const parsed = parseInt(savedMinHeight);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed + 'px';
      }
    }
    
    return null;
  }

  /**
   * Get slot left position style
   */
  getSlotStyleLeft(index: number): string | null {
    // In strict grid mode, no absolute positioning
    if (this.isStrictGridLayout()) {
      return null;
    }
    
    // During active resize
    if (this.resizeService.isResizing() && this.resizeService.activeSlotIndex() === index) {
      const customSize = this.resizeService.customSizes().get(index);
      if (customSize && customSize.left !== undefined && customSize.left !== null) {
        return customSize.left + 'px';
      }
    }
    
    // Check persisted position
    const slot = this.config.slots[index];
    const savedLeft = slot?.layoutStyles?.['left'];
    if (savedLeft) {
      const parsed = parseInt(savedLeft);
      if (!isNaN(parsed)) {
        return parsed + 'px';
      }
    }
    
    return null;
  }

  /**
   * Get slot top position style
   */
  getSlotStyleTop(index: number): string | null {
    // In strict grid mode, no absolute positioning
    if (this.isStrictGridLayout()) {
      return null;
    }
    
    // During active resize
    if (this.resizeService.isResizing() && this.resizeService.activeSlotIndex() === index) {
      const customSize = this.resizeService.customSizes().get(index);
      if (customSize && customSize.top !== undefined && customSize.top !== null) {
        return customSize.top + 'px';
      }
    }
    
    // Check persisted position
    const slot = this.config.slots[index];
    const savedTop = slot?.layoutStyles?.['top'];
    if (savedTop) {
      const parsed = parseInt(savedTop);
      if (!isNaN(parsed)) {
        return parsed + 'px';
      }
    }
    
    return null;
  }

  /**
   * Get slot position style
   */
  getSlotStylePosition(index: number, slot: SlotConfig): string {
    // In strict grid mode, always relative
    if (this.isStrictGridLayout()) {
      return 'relative';
    }
    
    // Check if has explicit positioning
    if (this.getSlotStyleLeft(index) !== null || this.getSlotStyleTop(index) !== null) {
      return 'absolute';
    }
    
    // Check persisted position
    if (slot.layoutStyles?.['position'] === 'absolute' || slot.styles?.['position'] === 'absolute') {
      return 'absolute';
    }
    
    return 'relative';
  }

  /**
   * Get effective slot width (custom or auto) - kept for backward compatibility
   */
  getSlotWidth(index: number): number | null {
    // During active resize, ALWAYS return the explicit width from the service
    // to prevent the "tiny box" jumping effect before the grid re-renders
    if (this.resizeService.isResizing() && this.resizeService.activeSlotIndex() === index) {
      const customSize = this.resizeService.customSizes().get(index);
      if (customSize && customSize.width > 0) {
        return customSize.width;
      }
    }

    // FORCE NULL for strict grid modes to allow grid-template-columns to take priority in idle state
    if (this.resizeService.isStrictGrid(this.config.layoutType)) {
      return null;
    }
    
    // In free mode or for finalized customizations, use custom or saved sizes
    const customSize = this.resizeService.customSizes().get(index);
    if (customSize && customSize.width > 0) {
      return customSize.width;
    }
    return null; 
  }

  /**
   * Get effective slot height (custom or auto) - kept for backward compatibility
   */
  getSlotHeight(index: number): number | null {
    // During active resize, ALWAYS return the explicit height from the service
    // to prevent the "tiny box" jumping effect
    if (this.resizeService.isResizing() && this.resizeService.activeSlotIndex() === index) {
      const customSize = this.resizeService.customSizes().get(index);
      if (customSize && customSize.height > 0) {
        return customSize.height;
      }
    }

    if (this.resizeService.isStrictGrid(this.config.layoutType)) {
      return null;
    }
    const customSize = this.resizeService.customSizes().get(index);
    if (customSize && customSize.height > 0) {
      return customSize.height;
    }
    return null;
  }

  /**
   * Get reactive slot left position - kept for backward compatibility
   */
  getSlotLeft(index: number): number | null {
    const customSize = this.resizeService.customSizes().get(index);
    if (customSize && customSize.left !== undefined) {
      return customSize.left;
    }
    return null;
  }

  /**
   * Get reactive slot top position - kept for backward compatibility
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
