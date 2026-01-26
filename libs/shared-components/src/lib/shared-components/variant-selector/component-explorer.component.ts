import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VariantService, PageSection } from '../../../services/variant.service';
import {
  UIHeroSectionComponent,
  UIHeaderComponent,
  UIHeaderClassicComponent,
  UIHeaderModernComponent,
  UIFooterComponent,
  UIFaqSectionComponent,
  UIFeaturesSectionComponent,
  UIGallerySectionComponent,
  UIStatsLibSectionComponent,
  UIStepsSectionComponent,
  UIPricingTableSectionComponent,
  UINewsletterSectionComponent,
  UIContactSectionComponent,
  UITabsComponent,
  UIAccordionComponent,
  UIButtonComponent,
  UIChipComponent,
  UISpinnerComponent,
  UIBreadcrumbsComponent,
  UICardAnimatedComponent,
  UiCardProductsComponent,
  UIImageComponent,
  UITableComponent,
  BubbleAnimationComponent,
  UITestimonialsSectionComponent,
  UIListComponent,
  UIGamingVariantsShowcaseComponent,
  UIInputComponent,
  UITitleComponent,
  UICardComponent,
  PromotionsSectionComponent,
  ProductsSectionComponent,
  ServiceSectionComponent,
  CTASectionComponent,
  ReservationFormComponent,
  UIDateTimePickerComponent,
  UIChartComponent,
  SmartContainerComponent,
  DraggableBoxComponent
} from '@negocio/ui-components';

interface SectionVariant {
  type: string;
  label: string;
  icon: string;
  variants: string[];
  description: string;
  category: string;
  libraryType: 'section' | 'component'; // 'section' for organisms, 'component' for atoms/molecules
  subtypes?: { id: string, label: string }[];
}

@Component({
  selector: 'lib-component-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UIHeroSectionComponent,
    UIHeaderComponent,
    UIHeaderClassicComponent,
    UIHeaderModernComponent,
    UIFooterComponent,
    UIFaqSectionComponent,
    UIFeaturesSectionComponent,
    UIGallerySectionComponent,
    UIStatsLibSectionComponent,
    UIStepsSectionComponent,
    UIPricingTableSectionComponent,
    UINewsletterSectionComponent,
    UIContactSectionComponent,
    UITabsComponent,
    UIAccordionComponent,
    UIButtonComponent,
    UIChipComponent,
    UISpinnerComponent,
    UIBreadcrumbsComponent,
    UICardAnimatedComponent,
    UiCardProductsComponent,
    UIImageComponent,
    UITableComponent,
    BubbleAnimationComponent,
    UITestimonialsSectionComponent,
    UIListComponent,
    UIGamingVariantsShowcaseComponent,
    UIInputComponent,
    UITitleComponent,
    UICardComponent,
    PromotionsSectionComponent,
    ProductsSectionComponent,
    ServiceSectionComponent,
    CTASectionComponent,
    ReservationFormComponent,
    UIDateTimePickerComponent,
    UIChartComponent,
    SmartContainerComponent,
    DraggableBoxComponent
  ],
  template: `
    <div class="explorer-container">
      <header class="explorer-header">
        <h2 class="title-v2">Librería de Componentes</h2>
        <p class="subtitle-v2">Pulsa sobre un componente para previsualizarlo y añadirlo a tu lienzo.</p>
      </header>

      <!-- Dual Tab Sidebar / Header -->
      <div class="library-tabs-container">
        <button 
          class="library-tab" 
          [class.active]="selectedLibraryType === 'section'"
          (click)="selectLibraryType('section')">
          <span class="tab-icon">🏗️</span>
          <span>Secciones</span>
          <div class="tab-indicator"></div>
        </button>
        <button 
          class="library-tab" 
          [class.active]="selectedLibraryType === 'component'"
          (click)="selectLibraryType('component')">
          <span class="tab-icon">🧩</span>
          <span>Componentes UI</span>
          <div class="tab-indicator"></div>
        </button>
      </div>

      <!-- Category Navigation -->
      <nav class="category-nav-v2">
        <button
          *ngFor="let category of categories"
          class="cat-chip"
          [class.active]="selectedCategory === category.id"
          (click)="selectCategory(category.id)"
        >
          <span class="chip-icon">{{ category.icon }}</span>
          {{ category.name }}
        </button>
      </nav>

      <!-- Component Grid -->
      <div class="component-grid-area">
        <div class="comp-scroll-wrapper" role="grid" aria-label="Lista de componentes">
          <div
            *ngFor="let comp of filteredComponents"
            class="comp-card-modern"
            [class.selected]="selectedComponent?.type === comp.type"
            (click)="selectComponent(comp)"
            (keydown.enter)="selectComponent(comp)"
            (keydown.space)="selectComponent(comp); $event.preventDefault()"
            role="button"
            tabindex="0"
            [attr.aria-label]="'Seleccionar componente ' + comp.label"
            [attr.aria-selected]="selectedComponent?.type === comp.type"
          >
            <div class="comp-icon-box" aria-hidden="true">{{ comp.icon }}</div>
            <div class="comp-meta">
              <h4>{{ comp.label }}</h4>
              <span class="comp-cat">{{ comp.category }}</span>
            </div>
            <div class="comp-select-indicator" aria-hidden="true"></div>
          </div>
        </div>
        
        <!-- Empty Results Message -->
        <div *ngIf="filteredComponents.length === 0" class="empty-results">
           <div class="empty-icon">📂</div>
           <p>No se encontraron items en esta categoría para el tipo de librería seleccionado.</p>
        </div>
      </div>

      <!-- Modal Preview -->
      <div *ngIf="selectedComponent" class="preview-modal-overlay" (click)="closePreview()">
        <div class="preview-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-info">
              <span class="icon">{{ selectedComponent.icon }}</span>
              <div>
                <h3>{{ selectedComponent.label }}</h3>
                <p>{{ selectedComponent.description }}</p>
              </div>
            </div>
            <button class="close-btn" (click)="closePreview()" aria-label="Cerrar previsualización">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-variant-selector">
            <ng-container *ngIf="selectedComponent.subtypes">
                <label>Tipo</label>
                <select [(ngModel)]="selectedSubtype" class="select-v2">
                  <option *ngFor="let subtype of selectedComponent.subtypes" [value]="subtype.id">
                    {{ subtype.label }}
                  </option>
                </select>
            </ng-container>

            <label>Variante</label>
            <select [(ngModel)]="selectedVariant" class="select-v2">
              <option *ngFor="let variant of selectedComponent.variants" [value]="variant">
                {{ variant }}
              </option>
            </select>
          </div>

          <div class="modal-preview-content">
            <div class="preview-viewport" [ngSwitch]="selectedComponent.type" role="region" aria-label="Vista previa del componente">
                  <!-- CONTENT -->
                  <div *ngSwitchCase="'promotions'" class="p-4">
                    <lib-promotions-section [variant]="$any(selectedVariant)"></lib-promotions-section>
                  </div>
                  <lib-ui-hero-section *ngSwitchCase="'hero'" [variant]="$any(selectedVariant)" title="Título Hero" subtitle="Subtítulo descriptivo"></lib-ui-hero-section>
                  <lib-ui-cta-section *ngSwitchCase="'cta'" [variant]="$any(selectedVariant)"></lib-ui-cta-section>
                  <lib-reservation-form *ngSwitchCase="'reservation-form'" [variant]="$any(selectedVariant)"></lib-reservation-form>
                  <div *ngSwitchCase="'header'" class="h-full w-full">
                     <lib-ui-header *ngIf="!selectedSubtype || selectedSubtype === 'standard'" [variant]="$any(selectedVariant)" title="Logo" [navItems]="[{label:'Inicio', href:'#'}, {label:'Servicios', href:'#'}, {label:'Contacto', href:'#'}]"></lib-ui-header>
                     <lib-ui-header-classic *ngIf="selectedSubtype === 'classic'" [variant]="$any(selectedVariant)" title="Logo" [navItems]="[{label:'Inicio', href:'#'}, {label:'Servicios', href:'#'}, {label:'Contacto', href:'#'}]"></lib-ui-header-classic>
                     <lib-ui-header-modern *ngIf="selectedSubtype === 'modern'" [variant]="$any(selectedVariant)" title="Logo" [navItems]="[{label:'Inicio', href:'#'}, {label:'Servicios', href:'#'}, {label:'Contacto', href:'#'}]"></lib-ui-header-modern>
                  </div>
                  <lib-ui-components-footer *ngSwitchCase="'footer'" [variant]="$any(selectedVariant)" title="Logo"></lib-ui-components-footer>
                  <div *ngSwitchCase="'faq'" class="p-4"><lib-ui-faq-section [variant]="$any(selectedVariant)"></lib-ui-faq-section></div>
                  <div *ngSwitchCase="'features'" class="p-4"><lib-ui-features-section [variant]="$any(selectedVariant)"></lib-ui-features-section></div>
                  <div *ngSwitchCase="'gallery'" class="p-4"><lib-ui-components-gallery-section [variant]="$any(selectedVariant)"></lib-ui-components-gallery-section></div>
                  <div *ngSwitchCase="'stats'" class="p-4"><lib-ui-components-stats-section [variant]="$any(selectedVariant)"></lib-ui-components-stats-section></div>
                  <div *ngSwitchCase="'steps'" class="p-4"><lib-ui-steps-section [variant]="$any(selectedVariant)"></lib-ui-steps-section></div>
                  <div *ngSwitchCase="'showcase'" class="p-4"><lib-ui-gaming-variants-showcase></lib-ui-gaming-variants-showcase></div>
                  <div *ngSwitchCase="'testimonials'" class="p-4"><lib-ui-testimonials-section [variant]="$any(selectedVariant)"></lib-ui-testimonials-section></div>
                  <!-- COMMERCE -->
                  <div *ngSwitchCase="'services'" class="p-4"><lib-service-section [variant]="$any(selectedVariant)" [title]="'Nuestros Servicios'"></lib-service-section></div>
                  <div *ngSwitchCase="'pricing'" class="p-4"><lib-ui-pricing-table-section [variant]="$any(selectedVariant)"></lib-ui-pricing-table-section></div>
                  <div *ngSwitchCase="'newsletter'" class="p-4"><lib-ui-newsletter-section [variant]="$any(selectedVariant)"></lib-ui-newsletter-section></div>
                  <div *ngSwitchCase="'products'" class="p-4"><lib-products-section [variant]="$any(selectedVariant)"></lib-products-section></div>
                  <!-- INTERACTIVE -->
                  <div *ngSwitchCase="'contact'" class="p-4"><lib-ui-contact-section [variant]="$any(selectedVariant)"></lib-ui-contact-section></div>
                  <div *ngSwitchCase="'smart-container'" class="p-4"><lib-smart-container [variant]="$any(selectedVariant)">Contenido del Contenedor Inteligente</lib-smart-container></div>
                  <div *ngSwitchCase="'draggable-box'" class="h-64 relative border border-white/10 m-4"><lib-draggable-box [variant]="$any(selectedVariant)" label="Caja Movible"></lib-draggable-box></div>
                  <div *ngSwitchCase="'bubble'" class="h-64 relative overflow-hidden rounded-xl border border-white/10 m-4">
                     <lib-bubble-animation [variant]="$any(selectedVariant)"></lib-bubble-animation>
                  </div>
                  <div *ngSwitchCase="'tabs'" class="p-4">
                    <lib-ui-components-tabs [variant]="$any(selectedVariant)" [showAs]="'tabs'" [tabs]="[{label:'Tab 1', sectionId:'tab1'}, {label:'Tab 2', sectionId:'tab2'}]"></lib-ui-components-tabs>
                  </div>
                  <div *ngSwitchCase="'accordion'" class="p-4">
                    <lib-ui-components-accordion [variant]="$any(selectedVariant)" [items]="[{title:'Item 1', content:'Detalle 1'}, {title:'Item 2', content:'Detalle 2'}]"></lib-ui-components-accordion>
                  </div>
                  <div *ngSwitchCase="'button'" class="flex gap-4 justify-center items-center h-full min-h-[200px]">
                    <lib-ui-components-button [variant]="$any(selectedVariant)">Botón</lib-ui-components-button>
                  </div>
                  <div *ngSwitchCase="'chip'" class="flex justify-center items-center h-full min-h-[200px]">
                     <lib-ui-components-chip [variant]="$any(selectedVariant)" label="Chip"></lib-ui-components-chip>
                  </div>
                  <div *ngSwitchCase="'spinner'" class="flex justify-center items-center h-full min-h-[200px]">
                     <lib-ui-spinner [variant]="$any(selectedVariant)"></lib-ui-spinner>
                  </div>
                  <div *ngSwitchCase="'date-time-picker'" class="p-8 flex justify-center">
                     <lib-ui-components-date-time-picker [variant]="$any(selectedVariant)"></lib-ui-components-date-time-picker>
                  </div>
                  <div *ngSwitchCase="'ui-chart'" class="p-8 h-80">
                     <lib-ui-chart [variant]="$any(selectedVariant)" [data]="{labels: ['Ene', 'Feb', 'Mar'], datasets: [{label: 'Ventas', data: [10, 20, 15]}]}"></lib-ui-chart>
                  </div>
                  <div *ngSwitchCase="'breadcrumbs'" class="p-8">
                     <lib-ui-breadcrumbs [variant]="$any(selectedVariant)" [items]="[{label:'Home', url:'/'}, {label:'Sección', url:'#'}]"></lib-ui-breadcrumbs>
                  </div>
                  <div *ngSwitchCase="'card-animated'" class="max-w-xs mx-auto p-4">
                     <lib-ui-components-card-animated [variant]="$any(selectedVariant)" title="Tarjeta" description="Descripción de la tarjeta animada"></lib-ui-components-card-animated>
                  </div>
                  <div *ngSwitchCase="'card-product'" class="max-w-xs mx-auto p-4">
                     <lib-card-products [variant]="$any(selectedVariant)" [product]="{name:'Producto', price:'$99', image:'', description: 'Producto de prueba'}"></lib-card-products>
                  </div>
                  <div *ngSwitchCase="'card-testimonial'" class="max-w-md mx-auto p-4">
                     <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <p class="mb-4 italic">"Excelente servicio"</p>
                        <div class="font-bold">Cliente</div>
                     </div>
                  </div>
                  <div *ngSwitchCase="'image'" class="p-4 flex justify-center">
                    <lib-ui-image [variant]="$any(selectedVariant)" src="https://via.placeholder.com/600x400" alt="Placeholder"></lib-ui-image>
                  </div>
                  <div *ngSwitchCase="'table'" class="p-4">
                    <lib-ui-components-table [variant]="$any(selectedVariant)" [rows]="[{id:1, name:'Item A'}, {id:2, name:'Item B'}]" [columns]="[{key:'id', label:'ID'}, {key:'name', label:'Nombre'}]"></lib-ui-components-table>
                  </div>
                  <div *ngSwitchCase="'list'" class="max-w-md mx-auto p-4">
                    <lib-ui-list [variant]="$any(selectedVariant)" [items]="['Elemento 1', 'Elemento 2', 'Elemento 3']"></lib-ui-list>
                  </div>
                  <div *ngSwitchCase="'title'" class="p-4">
                    <lib-ui-components-title [variant]="$any(selectedVariant)" [level]="'h1'" text="Título de ejemplo"></lib-ui-components-title>
                  </div>
                  <div *ngSwitchCase="'card'" class="max-w-xs mx-auto p-4">
                    <lib-ui-components-card [variant]="$any(selectedVariant)" title="Tarjeta" description="Descripción de la tarjeta"></lib-ui-components-card>
                  </div>
                  <div *ngSwitchCase="'input'" class="p-4">
                    <lib-ui-components-input [variant]="$any(selectedVariant)" placeholder="Escribe algo..."></lib-ui-components-input>
                  </div>
                  <div *ngSwitchCase="'generic'" class="p-4 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                    <h2 class="text-white text-xl font-semibold mb-2">Librería de Componentes</h2>
                    <p class="text-white/70 text-sm">Pulsa sobre un componente para previsualizarlo y añadirlo a tu lienzo.</p>
                  </div>
                  <div *ngSwitchDefault class="preview-mockup default-mockup">
                    <div class="mock-content">
                       <p class="text-center text-white/50">Vista previa no disponible para este componente ({{ selectedComponent.type }})</p>
                    </div>
                  </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-add-modern" (click)="addToPage()">
              Añadir componente a mi lienzo &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      --accent-color: #6366f1;
      --accent-hover: #818cf8;
      --accent-glow: 0 0 20px rgba(99, 102, 241, 0.4);
      --success-color: #10b981;
      --success-hover: #34d399;
      --background: #0f172a;
      --surface: rgba(30, 41, 59, 0.6);
      --surface-hover: rgba(51, 65, 85, 0.6);
      --border: rgba(148, 163, 184, 0.2);
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
    }

    .explorer-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .library-tabs-container {
      display: flex;
      background: var(--surface);
      border-radius: 1rem;
      padding: 0.4rem;
      border: 1px solid var(--border);
      position: relative;
      margin-bottom: 0.5rem;
    }

    .library-tab {
      flex: 1;
      padding: 1rem;
      border-radius: 0.75rem;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;

      .tab-icon {
        font-size: 1.2rem;
      }

      &:hover {
        color: var(--text-primary);
        background: rgba(255,255,255,0.05);
      }

      &.active {
        color: white;
        background: var(--accent-color);
        box-shadow: var(--accent-glow);
        transform: translateY(-2px);
      }
    }

    .empty-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255,255,255,0.02);
      border-radius: 1.5rem;
      border: 1px dashed var(--border);
      margin-top: 1rem;
      
      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.3;
      }

      p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        max-width: 250px;
        margin: 0 auto;
      }
    }

    .explorer-header {
      text-align: center;
      padding: 1rem 0;
      .title-v2 {
        font-size: 2rem;
        font-weight: 800;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.02em;
        background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .subtitle-v2 {
        font-size: 0.95rem;
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.5;
      }
    }

    .category-nav-v2 {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding: 0.5rem 0;
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;

      &::-webkit-scrollbar {
        height: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border);
        border-radius: 2px;
      }
      
      .cat-chip {
        padding: 0.75rem 1.25rem;
        border-radius: 50px;
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        font-size: 0.8rem;
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
          border-color: var(--accent-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        &.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
          box-shadow: var(--accent-glow);
          transform: translateY(-2px);
          
          &::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
            animation: pulse 2s ease-in-out infinite;
          }
        }
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }

    .component-grid-area {
      flex: 1;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
      
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border);
        border-radius: 3px;
      }

      .comp-scroll-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        padding-bottom: 2rem;
      }
    }

    .comp-card-modern {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 1.25rem;
      padding: 1.5rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover {
        background: var(--surface-hover);
        border-color: var(--accent-color);
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        &::before {
          opacity: 1;
        }
      }

      &.selected {
        background: rgba(99, 102, 241, 0.15);
        border-color: var(--accent-color);
        box-shadow: var(--accent-glow);

        .comp-icon-box {
          transform: scale(1.1);
          color: var(--accent-color);
          background: rgba(99, 102, 241, 0.2);
        }
        .comp-select-indicator {
          bottom: 0;
        }
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
      }

      .comp-icon-box {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        position: relative;
        z-index: 1;
      }

      .comp-meta {
        position: relative;
        z-index: 1;
        h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }
        .comp-cat {
          font-size: 0.7rem;
          color: var(--accent-color);
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin-top: 0.5rem;
        }
      }

      .comp-select-indicator {
        position: absolute;
        bottom: -3px;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--accent-color);
        box-shadow: 0 0 10px var(--accent-color);
        transition: bottom 0.3s;
      }
    }

    /* Modal Preview */
    .preview-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .preview-modal {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      
      .modal-info {
        flex: 1;
        display: flex;
        gap: 1.25rem;
        
        .icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }
        
        h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }
        
        p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }
      }
      
      .close-btn {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        flex-shrink: 0;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          border-color: var(--accent-color);
          transform: rotate(90deg);
        }
      }
    }

    .modal-variant-selector {
      padding: 1rem 2rem;
      background: rgba(255, 255, 255, 0.02);
      display: flex;
      align-items: center;
      gap: 1rem;
      
      label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--accent-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .select-v2 {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        color: var(--text-primary);
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        outline: none;
        padding: 0.5rem 1rem;
        min-width: 150px;
        
        &:hover {
          border-color: var(--accent-color);
        }
        
        option {
          background: var(--background);
          color: var(--text-primary);
        }
      }
    }

    .modal-preview-content {
      flex: 1;
      padding: 1.5rem 2rem;
      overflow-y: auto;
      background: #020617;
      
      .preview-viewport {
        border: 1px dashed var(--border);
        border-radius: 1.25rem;
        background: rgba(255,255,255,0.01);
        padding: 1.5rem;
        min-height: 300px;
      }
    }

    .modal-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.02);
      
      .btn-add-modern {
        width: 100%;
        padding: 1.125rem;
        border-radius: 1rem;
        background: linear-gradient(135deg, var(--success-color) 0%, var(--success-hover) 100%);
        color: white;
        border: none;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 25px rgba(16, 185, 129, 0.4);
          
          &::before {
            width: 300px;
            height: 300px;
          }
        }

        &:active {
          transform: translateY(-1px);
        }
      }
    }

    @media (max-width: 768px) {
      .explorer-container {
        gap: 1.5rem;
        padding: 1rem;
      }

      .explorer-header {
        .title-v2 {
          font-size: 1.5rem;
        }
        .subtitle-v2 {
          font-size: 0.85rem;
        }
      }

      .category-nav-v2 {
        gap: 0.5rem;

        .cat-chip {
          padding: 0.6rem 1rem;
          font-size: 0.75rem;
        }
      }

      .comp-scroll-wrapper {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 0.75rem;
      }

      .comp-card-modern {
        padding: 1.25rem;

        .comp-icon-box {
          font-size: 2rem;
          width: 3.5rem;
          height: 3.5rem;
        }

        .comp-meta h4 {
          font-size: 0.85rem;
        }

        .comp-meta .comp-cat {
          font-size: 0.65rem;
        }
      }

      .preview-modal {
        max-height: 95vh;
        margin: 1rem;
        border-radius: 1rem;
      }

      .modal-header {
        padding: 1.25rem 1.5rem;
        
        .modal-info {
          gap: 1rem;
          
          .icon {
            font-size: 2rem;
          }
          
          h3 {
            font-size: 1.25rem;
          }
          
          p {
            font-size: 0.8rem;
          }
        }
      }

      .modal-variant-selector {
        padding: 1rem 1.5rem;
      }

      .modal-preview-content {
        padding: 1rem 1.5rem;
        
        .preview-viewport {
          padding: 1rem;
          min-height: 200px;
        }
      }

      .modal-footer {
        padding: 1.25rem 1.5rem;
      }
    }
  `]
})
export class ComponentExplorerComponent implements OnInit {
  selectedComponent: SectionVariant | null = null;
  selectedVariant = 'glass';
  selectedSubtype: string | null = null;
  selectedCategory = 'all';

  categories = [
    { id: 'all', name: 'Todos', icon: '🎯' },
    { id: 'content', name: 'Contenido', icon: '📝' },
    { id: 'commerce', name: 'Comercio', icon: '🛒' },
    { id: 'social', name: 'Social', icon: '🤝' },
    { id: 'interactive', name: 'Interactivo', icon: '🎮' }
  ];

  availableComponents: SectionVariant[] = [
    // --- WRAPPED SECTIONS (Organisms) ---
    {
      type: 'hero',
      label: 'Portada Hero',
      icon: '🚀',
      variants: ['glass', 'neon', 'cyberpunk', 'minimal', 'mario', 'rayman', 'rockstar'],
      description: 'Sección principal con título, subtítulo y llamada a la acción',
      category: 'content',
      libraryType: 'section',
      subtypes: [
        { id: 'standard', label: 'Estándar' },
        { id: 'split', label: 'Dividido' },
        { id: 'minimal', label: 'Minimalista' }
      ]
    },
    {
      type: 'cta',
      label: 'Llamada a la Acción (CTA)',
      icon: '📢',
      variants: ['glass', 'neon', 'cyberpunk', 'minimal', 'mario'],
      description: 'Sección enfocada en convertir usuarios con un botón destacado',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'reservation-form',
      label: 'Reserva de Citas',
      icon: '📅',
      variants: ['default', 'glass', 'neon', 'minimal'],
      description: 'Formulario estructurado para reserva de servicios y citas',
      category: 'commerce',
      libraryType: 'section'
    },
    {
      type: 'contact',
      label: 'Formulario de Contacto',
      icon: '📬',
      variants: ['default', 'glass', 'neon', 'minimal'],
      description: 'Formulario de reserva o contacto para tus clientes',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'header',
      label: 'Encabezado Global',
      icon: '🏳️',
      variants: ['primary', 'outline', 'glass', 'neon', 'cyberpunk', 'mario', 'rayman', 'rockstar'],
      description: 'Barra de navegación principal (Global)',
      category: 'content',
      libraryType: 'section',
      subtypes: [
        { id: 'standard', label: 'Estándar' },
        { id: 'classic', label: 'Clásico' },
        { id: 'modern', label: 'Moderno' }
      ]
    },
    {
      type: 'footer',
      label: 'Pie de Página Global',
      icon: '🦶',
      variants: ['primary', 'glass', 'neon', 'cyberpunk', 'mario', 'rayman', 'rockstar', 'ice', 'metal', 'energy', 'void'],
      description: 'Sección inferior con enlaces y redes sociales (Global)',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'faq',
      label: 'Preguntas Frecuentes',
      icon: '❓',
      variants: ['glass', 'accordion', 'minimal', 'neon', 'cyberpunk'],
      description: 'Sección de preguntas y respuestas con acordeón',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'features',
      label: 'Características',
      icon: '✨',
      variants: ['glass', 'cards', 'icons', 'minimal', 'neon', 'cyberpunk'],
      description: 'Lista de características y beneficios clave',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'gallery',
      label: 'Galería',
      icon: '🖼️',
      variants: ['glass', 'grid', 'masonry', 'carousel', 'neon', 'cyberpunk'],
      description: 'Galería de imágenes y trabajos',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'stats',
      label: 'Estadísticas',
      icon: '📊',
      variants: ['glass', 'cards', 'numbers', 'minimal', 'neon'],
      description: 'Métricas, contadores y números importantes',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'steps',
      label: 'Pasos / Proceso',
      icon: '👣',
      variants: ['default', 'glass', 'neon', 'vertical', 'horizontal'],
      description: 'Guía paso a paso o línea de tiempo',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'showcase',
      label: 'Showcase',
      icon: '💎',
      variants: ['default', 'glass', 'neon', 'interactive'],
      description: 'Muestra destacada de productos o servicios',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'testimonials',
      label: 'Testimonios',
      icon: '⭐',
      variants: ['glass', 'cards', 'carousel', 'minimal', 'neon', 'cyberpunk'],
      description: 'Opiniones de clientes satisfechos',
      category: 'content',
      libraryType: 'section'
    },
    {
      type: 'services',
      label: 'Servicios',
      icon: '🛠️',
      variants: ['glass', 'cards', 'grid', 'minimal', 'neon', 'cyberpunk'],
      description: 'Muestra los servicios ofrecidos con iconos y descripciones',
      category: 'commerce',
      libraryType: 'section'
    },
    {
      type: 'pricing',
      label: 'Precios',
      icon: '💰',
      variants: ['glass', 'cards', 'table', 'minimal', 'neon', 'cyberpunk'],
      description: 'Tabla de precios y planes disponibles',
      category: 'commerce',
      libraryType: 'section'
    },
    {
      type: 'promotions',
      label: 'Promociones',
      icon: '🎁',
      variants: ['glass', 'cards', 'banner', 'minimal', 'neon'],
      description: 'Ofertas especiales y descuentos',
      category: 'commerce',
      libraryType: 'section'
    },
    {
      type: 'newsletter',
      label: 'Newsletter',
      icon: '📧',
      variants: ['default', 'glass', 'neon', 'minimal'],
      description: 'Suscripción a boletín de noticias',
      category: 'commerce',
      libraryType: 'section'
    },
    {
      type: 'products',
      label: 'Productos',
      icon: '🛍️',
      variants: ['glass', 'grid', 'list', 'minimal', 'neon'],
      description: 'Muestra de productos con información detallada',
      category: 'commerce',
      libraryType: 'section'
    },

    // --- UI COMPONENTS (Atoms) ---
    {
      type: 'ui-button',
      label: 'Botón UI',
      icon: '🔘',
      variants: ['primary', 'secondary', 'outline', 'ghost', 'link', 'glass', 'neon', 'cyberpunk', 'mario'],
      description: 'Botones interactivos con múltiples estilos',
      category: 'interactive',
      libraryType: 'component'
    },
    {
      type: 'ui-title',
      label: 'Título',
      icon: '📜',
      variants: ['default', 'primary', 'secondary', 'outline', 'ghost', 'link', 'neon', 'cyberpunk', 'gradient', 'glass', 'retro', 'pulse-gradient', 'holo', 'matrix', 'quantum', 'cybernetic', 'danger', 'success', 'nano', 'stellar', 'phoenix', 'galactic', 'orbitron', 'cartoon', 'luma', 'platform', 'hero', 'coin', 'cloud', 'fire', 'water', 'leaf', 'amber-glow', 'minimal-white', 'mario', 'zelda', 'kirby', 'rayman', 'lum', 'river', 'minimal', 'hex-teal', 'purple-edge', 'rose-radial', 'yellow-pulse', 'green-inset', 'blue-skew', 'orange-dash', 'indigo-dots', 'bubble', 'electoon', 'jungle', 'joycon', 'neomorph', 'glitch', 'portal', 'bioshock', 'super-meat-boy', 'pokemon', 'animal-crossing', 'assassins-creed', 'far-cry', 'watch-dogs', 'bioshock-enhanced', 'lol', 'overwatch', 'minecraft', 'fortnite', 'ice', 'metal', 'energy', 'void', 'cosmic', 'plasma', 'arcade', 'pixel', 'chaos', 'vortex', 'stone', 'donkeykong', 'supermeatboy', 'aqua', 'vaporwave', 'aurora', 'trailblazer', 'elegant', 'vintage', 'luxury', 'rockstar', 'ubisoft'],
      description: 'Títulos editables con nivel (h1-h6), alineación y animación',
      category: 'content',
      libraryType: 'component'
    },
    {
      type: 'ui-image',
      label: 'Imagen Avanzada',
      icon: '🖼️',
      variants: ['default', 'rounded', 'circle', 'thumbnail', 'glass', 'neon', 'hover-zoom'],
      description: 'Componente de imagen con efectos y lazy loading',
      category: 'content',
      libraryType: 'component'
    },
    {
      type: 'ui-chip',
      label: 'Chips / Tags',
      icon: '🏷️',
      variants: ['default', 'outline', 'solid', 'glass', 'neon'],
      description: 'Etiquetas compactas para categorías o filtros',
      category: 'interactive',
      libraryType: 'component'
    },
    {
      type: 'ui-card',
      label: 'Tarjeta Genérica',
      icon: '🃏',
      variants: ['default', 'primary', 'secondary', 'outline', 'ghost', 'link', 'neon', 'cyberpunk', 'gradient', 'glass', 'retro', 'pulse-gradient', 'holo', 'matrix', 'quantum', 'cybernetic', 'danger', 'success', 'nano', 'stellar', 'phoenix', 'galactic', 'orbitron', 'cartoon', 'luma', 'platform', 'hero', 'coin', 'cloud', 'fire', 'water', 'leaf', 'amber-glow', 'minimal-white', 'mario', 'zelda', 'kirby', 'rayman', 'lum', 'river', 'minimal', 'hex-teal', 'purple-edge', 'rose-radial', 'yellow-pulse', 'green-inset', 'blue-skew', 'orange-dash', 'indigo-dots', 'bubble', 'electoon', 'jungle', 'joycon', 'neomorph', 'glitch', 'portal', 'bioshock', 'super-meat-boy', 'pokemon', 'animal-crossing', 'assassins-creed', 'far-cry', 'watch-dogs', 'bioshock-enhanced', 'lol', 'overwatch', 'minecraft', 'fortnite', 'ice', 'metal', 'energy', 'void', 'cosmic', 'plasma', 'arcade', 'pixel', 'chaos', 'vortex', 'stone', 'donkeykong', 'supermeatboy', 'aqua', 'vaporwave', 'aurora', 'trailblazer', 'elegant', 'vintage', 'luxury', 'rockstar', 'ubisoft'],
      description: 'Tarjetas genéricas editables',
      category: 'content',
      libraryType: 'component'
    },
    {
      type: 'ui-card-animated',
      label: 'Tarjeta Animada',
      icon: '🃏',
      variants: ['glass', 'neon', 'cyberpunk', 'mario', 'rayman', 'hover-scale'],
      description: 'Tarjeta con efectos de animación avanzados',
      category: 'content',
      libraryType: 'component'
    },
    {
      type: 'ui-card-product',
      label: 'Tarjeta Producto',
      icon: '🛍️',
      variants: ['default', 'glass', 'neon', 'minimal'],
      description: 'Tarjeta específica para mostrar productos',
      category: 'commerce',
      libraryType: 'component'
    },
    {
      type: 'ui-card-testimonial',
      label: 'Tarjeta Testimonio',
      icon: '💬',
      variants: ['default', 'glass', 'neon', 'quote', 'bubble'],
      description: 'Tarjeta para mostrar reseñas de clientes',
      category: 'social',
      libraryType: 'component'
    },
    {
      type: 'ui-input',
      label: 'Input de Formulario',
      icon: '📝',
      variants: ['default', 'primary', 'secondary', 'outline', 'ghost', 'link', 'neon', 'cyberpunk', 'gradient', 'glass', 'retro', 'pulse-gradient', 'holo', 'matrix', 'quantum', 'cybernetic', 'danger', 'success', 'nano', 'stellar', 'phoenix', 'galactic', 'orbitron', 'cartoon', 'luma', 'platform', 'hero', 'coin', 'cloud', 'fire', 'water', 'leaf', 'amber-glow', 'minimal-white', 'mario', 'zelda', 'kirby', 'rayman', 'lum', 'river', 'minimal', 'hex-teal', 'purple-edge', 'rose-radial', 'yellow-pulse', 'green-inset', 'blue-skew', 'orange-dash', 'indigo-dots', 'bubble', 'electoon', 'jungle', 'joycon', 'neomorph', 'glitch', 'portal', 'bioshock', 'super-meat-boy', 'pokemon', 'animal-crossing', 'assassins-creed', 'far-cry', 'watch-dogs', 'bioshock-enhanced', 'lol', 'overwatch', 'minecraft', 'fortnite', 'ice', 'metal', 'energy', 'void', 'cosmic', 'plasma', 'arcade', 'pixel', 'chaos', 'vortex', 'stone', 'donkeykong', 'supermeatboy', 'aqua', 'vaporwave', 'aurora', 'trailblazer', 'elegant', 'vintage', 'luxury', 'rockstar', 'ubisoft', 'kingfisher', 'custom1', 'custom2'],
      description: 'Inputs de formulario editables',
      category: 'interactive',
      libraryType: 'component'
    },
    {
      type: 'ui-spinner',
      label: 'Loading Spinners',
      icon: '⏳',
      variants: ['default', 'circle', 'dots', 'bars', 'neon', 'glass'],
      description: 'Indicadores de carga animados',
      category: 'interactive',
      libraryType: 'component'
    },
    {
      type: 'ui-breadcrumbs',
      label: 'Breadcrumbs',
      icon: '🗺️',
      variants: ['default', 'slash', 'arrow', 'glass', 'neon'],
      description: 'Navegación de migas de pan',
      category: 'interactive',
      libraryType: 'component'
    },
    {
       type: 'ui-accordion',
       label: 'Acordeón UI',
       icon: '↕️',
       variants: ['default', 'glass', 'neon', 'minimal'],
       description: 'Lista de elementos expandibles atomizada',
       category: 'interactive',
       libraryType: 'component'
    },
    {
       type: 'ui-tabs',
       label: 'Pestañas UI',
       icon: '📑',
       variants: ['default', 'glass', 'neon', 'pills'],
       description: 'Navegación por pestañas atomizada',
       category: 'interactive',
       libraryType: 'component'
    },
    {
       type: 'ui-list',
       label: 'Lista de Items',
       icon: '📋',
       variants: ['default', 'glass', 'neon', 'minimal'],
       description: 'Lista simple de elementos atomizada',
       category: 'content',
       libraryType: 'component'
    },
    {
       type: 'ui-table',
       label: 'Tabla de Datos',
       icon: '▦',
       variants: ['default', 'striped', 'bordered', 'hover', 'glass', 'neon'],
       description: 'Presentación tabular de datos atomizada',
       category: 'content',
       libraryType: 'component'
    },
    {
       type: 'ui-chart',
       label: 'Gráfico UI',
       icon: '📈',
       variants: ['primary', 'secondary', 'glass', 'neon', 'cyberpunk'],
       description: 'Visualización de datos atomizada',
       category: 'content',
       libraryType: 'component'
    },
    {
       type: 'date-time-picker',
       label: 'Selector Fecha/Hora',
       icon: '📅',
       variants: ['primary', 'secondary', 'glass', 'neon'],
       description: 'Selector de fecha y hora atomizado para formularios',
       category: 'interactive',
       libraryType: 'component'
    },
    {
       type: 'bubble',
       label: 'Efecto Burbujas',
       icon: '🫧',
       variants: ['glass', 'neon', 'cyberpunk', 'minimal'],
       description: 'Animación de fondo interactiva (Como Sección)',
       category: 'interactive',
       libraryType: 'section'
    },
    {
       type: 'smart-container',
       label: 'Contenedor Inteligente',
       icon: '📦',
       variants: ['default', 'glass', 'neon', 'minimal'],
       description: 'Bloque genérico para layouts personalizados',
       category: 'content',
       libraryType: 'section'
    },
    {
       type: 'draggable-box',
       label: 'Caja Arrastrable',
       icon: '🎯',
       variants: ['default', 'glass', 'neon', 'minimal'],
       description: 'Elemento sandbox para pruebas de posición',
       category: 'interactive',
       libraryType: 'component'
    },
    {
       type: 'generic',
       label: 'Librería de Componentes',
       icon: '📚',
       variants: ['default'],
       description: 'Sección de ayuda y navegación de la librería',
       category: 'content',
       libraryType: 'section'
    }
  ];


  @Output() componentSelected = new EventEmitter<{ component: SectionVariant; variant: string }>();

  constructor(private variantService: VariantService) {}

  selectedLibraryType: 'section' | 'component' = 'section';

  ngOnInit() {
    // Initialize with first variant
    if (this.availableComponents.length > 0) {
      this.selectedVariant = this.availableComponents[0].variants[0];
    }
  }

  get filteredComponents(): SectionVariant[] {
    return this.availableComponents.filter(comp => {
      const matchesType = comp.libraryType === this.selectedLibraryType;
      const matchesCategory = this.selectedCategory === 'all' || comp.category === this.selectedCategory;
      return matchesType && matchesCategory;
    });
  }

  selectLibraryType(type: 'section' | 'component') {
    this.selectedLibraryType = type;
    this.selectedComponent = null;
    // We keep category selection to allow persistent filtering across tabs
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.selectedComponent = null;
  }

  selectComponent(component: SectionVariant) {
    this.selectedComponent = component;
    this.selectedVariant = component.variants[0];
    this.selectedSubtype = component.subtypes ? component.subtypes[0].id : null;
  }

  closePreview() {
    this.selectedComponent = null;
  }

  addToPage() {
    if (!this.selectedComponent) return;

    const newSection: PageSection = {
      id: `sec_${new Date().getTime()}`,
      type: this.selectedComponent.type as any,
      label: `${this.selectedComponent.label} (${this.selectedVariant})`,
      visible: true,
      name: '',
      styles: {},
      content: {},
      elements: [],
      config: {
        subtype: this.selectedSubtype
      },
      customStyles: {},
      animation: 'none',
      layout: 'default'
    };

    // Set its specific variant
    this.variantService.setComponentVariant(newSection.id, this.selectedVariant);

    // Add to current page
    this.variantService.addSectionToCurrentPage(newSection);

    this.componentSelected.emit({
      component: this.selectedComponent,
      variant: this.selectedVariant
    });

    // Reset selection
    this.selectedComponent = null;
  }
}
