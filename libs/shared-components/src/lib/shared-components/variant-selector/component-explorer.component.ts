import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VariantService, PageSection } from '../../../services/variant.service';
import {
  UIHeroSectionComponent,
  UIHeaderComponent,
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
  UIModalComponent,
  UIButtonComponent,
  UIChipComponent,
  UISpinnerComponent,
  UIBreadcrumbsComponent,
  UICardAnimatedComponent,
  UiCardProductsComponent,
  UICardComponent,
  UiTestimonialsCardComponent,
  UIImageComponent,
  UITableComponent,
  BubbleAnimationComponent,
  UITestimonialsSectionComponent,
  UIListComponent,
  UIGamingVariantsShowcaseComponent,
  UIInputComponent
} from '@negocio/ui-components';

interface SectionVariant {
  type: string;
  label: string;
  icon: string;
  variants: string[];
  description: string;
  category: string;
}

@Component({
  selector: 'lib-component-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UIHeroSectionComponent,
    UIHeaderComponent,
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
    UICardComponent,
    UiTestimonialsCardComponent,
    UIImageComponent,
    UITableComponent,
    BubbleAnimationComponent,
    UITestimonialsSectionComponent,
    UIListComponent,
    UIGamingVariantsShowcaseComponent
  ],
  template: `
    <div class="explorer-container">
      <header class="explorer-header">
        <h2 class="title-v2">Librería de Componentes</h2>
        <p class="subtitle-v2">Pulsa sobre un componente para previsualizarlo y añadirlo a tu lienzo.</p>
      </header>

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

      <!-- Grid Area -->
      <div class="explorer-sections">
        <!-- List of Components -->
        <div class="component-list-area">
          <div class="comp-scroll-wrapper">
              <div
                *ngFor="let comp of filteredComponents"
                class="comp-card-modern"
                [class.selected]="selectedComponent?.type === comp.type"
                (click)="selectComponent(comp)"
              >
                <div class="comp-icon-box">{{ comp.icon }}</div>
                <div class="comp-meta">
                  <h4>{{ comp.label }}</h4>
                  <span class="comp-cat">{{ comp.category }}</span>
                </div>
                <div class="comp-select-indicator"></div>
              </div>
          </div>
        </div>

        <!-- Desktop Preview Area -->
        <aside class="preview-panel-v2" *ngIf="selectedComponent">
          <div class="panel-inner">
            <header class="panel-header">
              <div class="panel-info">
                <span class="icon">{{ selectedComponent.icon }}</span>
                <div>
                  <h3>{{ selectedComponent.label }}</h3>
                  <p>{{ selectedComponent.description }}</p>
                </div>
              </div>
              <div class="variant-hub">
                <label>Variante</label>
                <select [(ngModel)]="selectedVariant" class="select-v2">
                  <option *ngFor="let variant of selectedComponent.variants" [value]="variant">
                    {{ variant }}
                  </option>
                </select>
              </div>
            </header>

            <main class="preview-viewport">
              <div class="viewport-label">VISTA PREVIA: {{ selectedVariant }}</div>
              <div class="preview-overflow" [ngSwitch]="selectedComponent.type">
                  <!-- CONTENT -->
                  <div *ngSwitchCase="'promotions'" class="p-4 bg-slate-800 rounded-lg text-center text-gray-400">
                    <p>Promotions Component Preview (Requires Feature Module)</p>
                  </div>
                  <lib-ui-hero-section *ngSwitchCase="'hero'" [variant]="selectedVariant" title="Título Hero" subtitle="Subtítulo descriptivo"></lib-ui-hero-section>
                  <lib-ui-header *ngSwitchCase="'header'" [variant]="selectedVariant" title="Logo" [navItems]="[{label:'Inicio', href:'#'}, {label:'Servicios', href:'#'}, {label:'Contacto', href:'#'}]"></lib-ui-header>
                  <lib-ui-components-footer *ngSwitchCase="'footer'" [variant]="selectedVariant" title="Logo"></lib-ui-components-footer>
                  <div *ngSwitchCase="'faq'" class="p-4"><lib-ui-faq-section [variant]="selectedVariant"></lib-ui-faq-section></div>
                  <div *ngSwitchCase="'features'" class="p-4"><lib-ui-features-section [variant]="selectedVariant"></lib-ui-features-section></div>
                  <div *ngSwitchCase="'gallery'" class="p-4"><lib-ui-components-gallery-section [variant]="selectedVariant"></lib-ui-components-gallery-section></div>
                  <div *ngSwitchCase="'stats'" class="p-4"><lib-ui-components-stats-section [variant]="selectedVariant"></lib-ui-components-stats-section></div>
                  <div *ngSwitchCase="'steps'" class="p-4"><lib-ui-steps-section [variant]="selectedVariant"></lib-ui-steps-section></div>
                  <div *ngSwitchCase="'showcase'" class="p-4"><lib-ui-gaming-variants-showcase></lib-ui-gaming-variants-showcase></div>
                  <div *ngSwitchCase="'testimonials'" class="p-4"><lib-ui-testimonials-section [variant]="selectedVariant"></lib-ui-testimonials-section></div>
                  <!-- COMMERCE -->
                  <div *ngSwitchCase="'services'" class="p-4"><lib-ui-features-section [variant]="selectedVariant" [title]="'Nuestros Servicios'"></lib-ui-features-section></div>
                  <div *ngSwitchCase="'pricing'" class="p-4"><lib-ui-pricing-table-section [variant]="selectedVariant"></lib-ui-pricing-table-section></div>
                  <div *ngSwitchCase="'newsletter'" class="p-4"><lib-ui-newsletter-section [variant]="selectedVariant"></lib-ui-newsletter-section></div>
                  <!-- INTERACTIVE -->
                  <div *ngSwitchCase="'contact'" class="p-4"><lib-ui-contact-section [variant]="selectedVariant"></lib-ui-contact-section></div>
                  <div *ngSwitchCase="'bubble'" class="h-64 relative overflow-hidden rounded-xl border border-white/10 m-4">
                     <lib-bubble-animation [variant]="$any(selectedVariant)"></lib-bubble-animation>
                  </div>
                  <div *ngSwitchCase="'tabs'" class="p-4">
                    <lib-ui-components-tabs [variant]="selectedVariant" [showAs]="'tabs'" [tabs]="[{label:'Tab 1', sectionId:'tab1'}, {label:'Tab 2', sectionId:'tab2'}]"></lib-ui-components-tabs>
                  </div>
                  <div *ngSwitchCase="'accordion'" class="p-4">
                    <lib-ui-components-accordion [variant]="selectedVariant" [items]="[{title:'Item 1', content:'Detalle 1'}, {title:'Item 2', content:'Detalle 2'}]"></lib-ui-components-accordion>
                  </div>
                  <div *ngSwitchCase="'button'" class="flex gap-4 justify-center items-center h-full min-h-[200px]">
                    <lib-ui-components-button [variant]="selectedVariant">Botón</lib-ui-components-button>
                  </div>
                  <div *ngSwitchCase="'chip'" class="flex justify-center items-center h-full min-h-[200px]">
                     <lib-ui-components-chip [variant]="selectedVariant" label="Chip"></lib-ui-components-chip>
                  </div>
                  <div *ngSwitchCase="'spinner'" class="flex justify-center items-center h-full min-h-[200px]">
                     <lib-ui-spinner [variant]="selectedVariant"></lib-ui-spinner>
                  </div>
                  <div *ngSwitchCase="'breadcrumbs'" class="p-8">
                     <lib-ui-breadcrumbs [variant]="selectedVariant" [items]="[{label:'Home', url:'/'}, {label:'Sección', url:'#'}]"></lib-ui-breadcrumbs>
                  </div>
                  <div *ngSwitchCase="'card-animated'" class="max-w-xs mx-auto p-4">
                     <lib-ui-components-card-animated [variant]="selectedVariant" title="Tarjeta" description="Descripción de la tarjeta animada"></lib-ui-components-card-animated>
                  </div>
                  <div *ngSwitchCase="'card-product'" class="max-w-xs mx-auto p-4">
                     <lib-card-products [variant]="selectedVariant" [product]="{name:'Producto', price:'$99', image:'', description: 'Producto de prueba'}"></lib-card-products>
                  </div>
                  <div *ngSwitchCase="'card-testimonial'" class="max-w-md mx-auto p-4">
                     <lib-testimonials-card [variant]="selectedVariant" [testimonial]="{author: 'Cliente', quote: 'Excelente servicio'}"></lib-testimonials-card>
                  </div>
                  <div *ngSwitchCase="'image'" class="p-4 flex justify-center">
                    <lib-ui-image [variant]="selectedVariant" src="https://via.placeholder.com/600x400" alt="Placeholder"></lib-ui-image>
                  </div>
                  <div *ngSwitchCase="'table'" class="p-4">
                    <lib-ui-components-table [variant]="selectedVariant" [rows]="[{id:1, name:'Item A'}, {id:2, name:'Item B'}]" [columns]="[{key:'id', label:'ID'}, {key:'name', label:'Nombre'}]"></lib-ui-components-table>
                  </div>
                  <div *ngSwitchCase="'list'" class="max-w-md mx-auto p-4">
                    <lib-ui-list [variant]="selectedVariant" [items]="['Elemento 1', 'Elemento 2', 'Elemento 3']"></lib-ui-list>
                  </div>
                  <div *ngSwitchDefault class="preview-mockup default-mockup">
                    <div class="mock-content">
                       <p class="text-center text-white/50">Vista previa no disponible para este componente ({{ selectedComponent.type }})</p>
                    </div>
                  </div>
              </div>
            </main>

            <footer class="panel-footer">
              <button class="btn-add-modern" (click)="addToPage()">
                Añadir componente a mi lienzo &rarr;
              </button>
            </footer>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      --accent-glow: 0 0 20px rgba(99, 102, 241, 0.4);
    }

    .explorer-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1.5rem;
    }

    .explorer-header {
      .title-v2 { font-size: 1.5rem; font-weight: 800; color: white; margin: 0; }
      .subtitle-v2 { font-size: 0.85rem; color: #94a3b8; margin: 0.25rem 0 0; }
    }

    .category-nav-v2 {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      
      .cat-chip {
        padding: 0.5rem 1rem;
        border-radius: 50px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #94a3b8;
        font-size: 0.75rem;
        font-weight: 700;
        white-space: nowrap;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover { background: rgba(255, 255, 255, 0.08); color: white; }
        &.active {
          background: #6366f1;
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }
      }
    }

    .explorer-sections {
      flex: 1;
      display: flex;
      gap: 1.5rem;
      overflow: hidden;
    }

    .component-list-area {
      flex: 1;
      overflow-y: auto;
      
      .comp-scroll-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 0.75rem;
        padding-bottom: 2rem;
      }
    }

    .comp-card-modern {
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 1rem;
      padding: 1rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-4px);
      }

      &.selected {
        background: rgba(99, 102, 241, 0.1);
        border-color: #6366f1;
        
        .comp-icon-box { transform: scale(1.1); color: #6366f1; }
        .comp-select-indicator { bottom: 0; }
      }

      .comp-icon-box {
        font-size: 2rem;
        margin-bottom: 0.75rem;
        transition: transform 0.3s;
      }

      .comp-meta {
        h4 { font-size: 0.875rem; font-weight: 700; color: white; margin: 0; }
        .comp-cat { font-size: 0.65rem; color: #6366f1; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; }
      }

      .comp-select-indicator {
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: #6366f1;
        box-shadow: 0 0 10px #6366f1;
        transition: bottom 0.3s;
      }
    }

    /* Preview Panel */
    .preview-panel-v2 {
      width: 450px;
      background: rgba(15, 23, 42, 0.4);
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1.5rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: previewSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1);

      .panel-inner {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }

    .panel-header {
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      
      .panel-info {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.25rem;
        .icon { font-size: 2rem; }
        h3 { font-size: 1.125rem; font-weight: 700; color: white; margin: 0; }
        p { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0; line-height: 1.4; }
      }

      .variant-hub {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(0, 0, 0, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 0.75rem;
        
        label { font-size: 0.65rem; font-weight: 800; color: #6366f1; text-transform: uppercase; }
        .select-v2 {
          background: transparent;
          border: none;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }
      }
    }

    .preview-viewport {
      flex: 1;
      padding: 1rem;
      background: #020617;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .viewport-label {
        font-size: 0.6rem;
        font-weight: 900;
        color: #6366f1;
        letter-spacing: 0.1em;
        margin-bottom: 0.75rem;
        opacity: 0.7;
      }

      .preview-overflow {
        flex: 1;
        overflow-y: auto;
        border: 1px dashed rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        background: rgba(255,255,255,0.01);
      }
    }

    .panel-footer {
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.02);
      
      .btn-add-modern {
        width: 100%;
        padding: 1rem;
        border-radius: 0.75rem;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);

        &:hover { transform: translateY(-2px); box-shadow: 0 15px 20px -3px rgba(16, 185, 129, 0.4); }
      }
    }

    @keyframes previewSlide {
      from { transform: translateX(30px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @media (max-width: 1100px) {
      .preview-panel-v2 { display: none; }
    }
  `]
})
export class ComponentExplorerComponent implements OnInit {
  selectedComponent: SectionVariant | null = null;
  selectedVariant = 'glass';
  selectedCategory = 'all';

  categories = [
    { id: 'all', name: 'Todos', icon: '🎯' },
    { id: 'content', name: 'Contenido', icon: '📝' },
    { id: 'commerce', name: 'Comercio', icon: '🛒' },
    { id: 'social', name: 'Social', icon: '🤝' },
    { id: 'interactive', name: 'Interactivo', icon: '🎮' }
  ];

  availableComponents: SectionVariant[] = [
    // --- CONTENT SECTIONS ---
    {
      type: 'hero',
      label: 'Portada Hero',
      icon: '🚀',
      variants: ['glass', 'neon', 'cyberpunk', 'minimal', 'mario', 'rayman', 'rockstar'],
      description: 'Sección principal con título, subtítulo y llamada a la acción',
      category: 'content'
    },
    {
      type: 'cta',
      label: 'Llamada a la Acción (CTA)',
      icon: '📢',
      variants: ['glass', 'neon', 'cyberpunk', 'minimal', 'mario'],
      description: 'Sección enfocada en convertir usuarios con un botón destacado',
      category: 'content'
    },
    {
      type: 'contact',
      label: 'Formulario de Contacto',
      icon: '📬',
      variants: ['default', 'glass', 'neon', 'minimal'],
      description: 'Formulario de reserva o contacto para tus clientes',
      category: 'content'
    },
    {
      type: 'header',
      label: 'Encabezado Global',
      icon: '🏳️',
      variants: ['primary', 'outline', 'glass', 'neon', 'cyberpunk', 'mario', 'rayman', 'rockstar'],
      description: 'Barra de navegación principal (Global)',
      category: 'content'
    },
    {
      type: 'footer',
      label: 'Pie de Página Global',
      icon: '🦶',
      variants: ['primary', 'glass', 'neon', 'cyberpunk', 'mario', 'rayman', 'rockstar', 'ice', 'metal', 'energy', 'void'],
      description: 'Sección inferior con enlaces y redes sociales (Global)',
      category: 'content'
    },
    {
      type: 'faq',
      label: 'Preguntas Frecuentes',
      icon: '❓',
      variants: ['glass', 'accordion', 'minimal', 'neon', 'cyberpunk'],
      description: 'Sección de preguntas y respuestas con acordeón',
      category: 'content'
    },
    {
      type: 'features',
      label: 'Características',
      icon: '✨',
      variants: ['glass', 'cards', 'icons', 'minimal', 'neon', 'cyberpunk'],
      description: 'Lista de características y beneficios clave',
      category: 'content'
    },
    {
      type: 'gallery',
      label: 'Galería',
      icon: '🖼️',
      variants: ['glass', 'grid', 'masonry', 'carousel', 'neon', 'cyberpunk'],
      description: 'Galería de imágenes y trabajos',
      category: 'content'
    },
    {
      type: 'stats',
      label: 'Estadísticas',
      icon: '📊',
      variants: ['glass', 'cards', 'numbers', 'minimal', 'neon'],
      description: 'Métricas, contadores y números importantes',
      category: 'content'
    },
    {
      type: 'steps',
      label: 'Pasos / Proceso',
      icon: '👣',
      variants: ['default', 'glass', 'neon', 'vertical', 'horizontal'],
      description: 'Guía paso a paso o línea de tiempo',
      category: 'content'
    },
    {
      type: 'showcase',
      label: 'Showcase',
      icon: '💎',
      variants: ['default', 'glass', 'neon', 'interactive'],
      description: 'Muestra destacada de productos o servicios',
      category: 'content'
    },
    {
      type: 'testimonials',
      label: 'Testimonios',
      icon: '⭐',
      variants: ['glass', 'cards', 'carousel', 'minimal', 'neon', 'cyberpunk'],
      description: 'Opiniones de clientes satisfechos',
      category: 'content'
    },

    // --- COMMERCE SECTIONS ---
    {
      type: 'services',
      label: 'Servicios',
      icon: '🛠️',
      variants: ['glass', 'cards', 'grid', 'minimal', 'neon', 'cyberpunk'],
      description: 'Muestra los servicios ofrecidos con iconos y descripciones',
      category: 'commerce'
    },
    {
      type: 'pricing',
      label: 'Precios',
      icon: '💰',
      variants: ['glass', 'cards', 'table', 'minimal', 'neon', 'cyberpunk'],
      description: 'Tabla de precios y planes disponibles',
      category: 'commerce'
    },
    {
      type: 'promotions',
      label: 'Promociones',
      icon: '🎁',
      variants: ['glass', 'cards', 'banner', 'minimal', 'neon'],
      description: 'Ofertas especiales y descuentos',
      category: 'commerce'
    },
    {
      type: 'newsletter',
      label: 'Newsletter',
      icon: '📧',
      variants: ['default', 'glass', 'neon', 'minimal'],
      description: 'Suscripción a boletín de noticias',
      category: 'commerce'
    },

    // --- INTERACTIVE & UI ELEMENTS ---
    {
      type: 'contact',
      label: 'Contacto',
      icon: '📞',
      variants: ['glass', 'form', 'cards', 'minimal', 'neon', 'cyberpunk'],
      description: 'Formulario de contacto e información de ubicación',
      category: 'interactive'
    },
    {
      type: 'bubble',
      label: 'Efecto Burbujas',
      icon: '🫧',
      variants: ['glass', 'neon', 'cyberpunk', 'minimal'],
      description: 'Animación de fondo con burbujas interactivas',
      category: 'interactive'
    },
    {
      type: 'tabs',
      label: 'Pestañas (Tabs)',
      icon: '📑',
      variants: ['default', 'glass', 'neon', 'pills', 'underline', 'mario', 'cyberpunk'],
      description: 'Navegación por pestañas para organizar contenido',
      category: 'interactive'
    },
    {
      type: 'accordion',
      label: 'Acordeón',
      icon: '↕️',
      variants: ['default', 'glass', 'neon', 'minimal', 'mario', 'rayman', 'rockstar', 'cyberpunk'],
      description: 'Lista de elementos expandibles',
      category: 'interactive'
    },
    {
      type: 'chart',
      label: 'Gráficos y Datos',
      icon: '📈',
      variants: ['primary', 'secondary', 'glass', 'neon', 'cyberpunk'],
      description: 'Visualización de datos con gráficos interactivos (Barras, Líneas, etc.)',
      category: 'content'
    },
    {
      type: 'list',
      label: 'Lista de Items',
      icon: '📋',
      variants: ['default', 'glass', 'neon', 'minimal'],
      description: 'Lista simple de elementos con viñetas personalizadas',
      category: 'content'
    },
    {
      type: 'modal',
      label: 'Modal / Popup',
      icon: '🔲',
      variants: ['default', 'glass', 'neon', 'cyberpunk'],
      description: 'Ventana emergente para contenido adicional',
      category: 'interactive'
    },
    {
      type: 'tooltip',
      label: 'Tooltip',
      icon: '💬',
      variants: ['default', 'glass', 'neon', 'cyberpunk'],
      description: 'Mensaje emergente al pasar el cursor',
      category: 'interactive'
    },
    {
      type: 'button',
      label: 'Botones UI',
      icon: '🔘',
      variants: ['primary', 'secondary', 'outline', 'ghost', 'link', 'glass', 'neon', 'cyberpunk', 'mario'],
      description: 'Botones interactivos con múltiples estilos',
      category: 'interactive'
    },
    {
      type: 'chip',
      label: 'Chips / Tags',
      icon: '🏷️',
      variants: ['default', 'outline', 'solid', 'glass', 'neon'],
      description: 'Etiquetas compactas para categorías o filtros',
      category: 'interactive'
    },
    {
      type: 'spinner',
      label: 'Loading Spinners',
      icon: '⏳',
      variants: ['default', 'circle', 'dots', 'bars', 'neon', 'glass'],
      description: 'Indicadores de carga animados',
      category: 'interactive'
    },
    {
      type: 'breadcrumbs',
      label: 'Breadcrumbs',
      icon: '🗺️',
      variants: ['default', 'slash', 'arrow', 'glass', 'neon'],
      description: 'Navegación de migas de pan',
      category: 'interactive'
    },
    {
      type: 'card-animated',
      label: 'Tarjeta Animada',
      icon: '🃏',
      variants: ['glass', 'neon', 'cyberpunk', 'mario', 'rayman', 'hover-scale'],
      description: 'Tarjeta con efectos de animación avanzados',
      category: 'content'
    },
    {
      type: 'card-product',
      label: 'Tarjeta Producto',
      icon: '🛍️',
      variants: ['default', 'glass', 'neon', 'minimal'],
      description: 'Tarjeta específica para mostrar productos',
      category: 'commerce'
    },
    {
      type: 'card-testimonial',
      label: 'Tarjeta Testimonio',
      icon: '💬',
      variants: ['default', 'glass', 'neon', 'quote', 'bubble'],
      description: 'Tarjeta para mostrar reseñas de clientes',
      category: 'social'
    },
    {
      type: 'image',
      label: 'Imagen Avanzada',
      icon: '🖼️',
      variants: ['default', 'rounded', 'circle', 'thumbnail', 'glass', 'neon', 'hover-zoom'],
      description: 'Componente de imagen con efectos y lazy loading',
      category: 'content'
    },
    {
      type: 'table',
      label: 'Tabla de Datos',
      icon: '▦',
      variants: ['default', 'striped', 'bordered', 'hover', 'glass', 'neon'],
      description: 'Presentación tabular de datos',
      category: 'content'
    },
    {
      type: 'forms',
      label: 'Elementos de Formulario',
      icon: '📝',
      variants: ['default', 'filled', 'outlined', 'glass', 'neon', 'floating'],
      description: 'Inputs, selects y checkboxes estilizados',
      category: 'interactive'
    }
  ];


  @Output() componentSelected = new EventEmitter<{ component: SectionVariant; variant: string }>();

  constructor(private variantService: VariantService) {}

  ngOnInit() {
    // Initialize with first variant
    if (this.availableComponents.length > 0) {
      this.selectedVariant = this.availableComponents[0].variants[0];
    }
  }

  get filteredComponents(): SectionVariant[] {
    if (this.selectedCategory === 'all') {
      return this.availableComponents;
    }
    return this.availableComponents.filter(comp => comp.category === this.selectedCategory);
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.selectedComponent = null;
  }

  selectComponent(component: SectionVariant) {
    this.selectedComponent = component;
    this.selectedVariant = component.variants[0];
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
      config: {},
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