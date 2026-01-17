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
  ],
  template: `
    <div class="component-explorer">
      <div class="explorer-header">
        <h3>Librería de Componentes</h3>
        <p class="helper-text">
          Explora los componentes disponibles y previsualiza sus variantes antes de añadirlos.
        </p>
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <button
          *ngFor="let category of categories"
          class="category-btn"
          [class.active]="selectedCategory === category.id"
          (click)="selectCategory(category.id)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-label">{{ category.name }}</span>
        </button>
      </div>

      <!-- Component Grid -->
      <div class="component-grid">
        <div
          *ngFor="let comp of filteredComponents"
          class="component-card"
          [class.selected]="selectedComponent?.type === comp.type"
          (click)="selectComponent(comp)"
        >
          <div class="component-icon">{{ comp.icon }}</div>
          <div class="component-info">
            <h4 class="component-name">{{ comp.label }}</h4>
            <p class="component-description">{{ comp.description }}</p>
          </div>
          <div class="component-category">{{ comp.category }}</div>
        </div>
      </div>

      <!-- Component Preview -->
      <div *ngIf="selectedComponent" class="component-preview">
        <div class="preview-header">
          <div class="preview-title">
            <span class="preview-icon">{{ selectedComponent.icon }}</span>
            <h4>{{ selectedComponent.label }}</h4>
          </div>
          <div class="variant-selector">
            <label>Variante:</label>
            <select [(ngModel)]="selectedVariant" class="variant-select">
              <option *ngFor="let variant of selectedComponent.variants" [value]="variant">
                {{ variant }}
              </option>
            </select>
          </div>
        </div>

        <div class="preview-content">
          <div class="preview-label">
            Vista Previa - {{ selectedVariant }}
          </div>

          <div class="preview-container p-6 bg-slate-900 overflow-y-auto" [ngSwitch]="selectedComponent.type">
            
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
            
            <!-- ELEMENTS -->
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
            
            <!-- CARDS -->
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

            <!-- LIST -->
            <div *ngSwitchCase="'list'" class="max-w-md mx-auto p-4">
              <lib-ui-list [variant]="selectedVariant" [items]="['Elemento 1', 'Elemento 2', 'Elemento 3']"></lib-ui-list>
            </div>

            <!-- DEFAULT -->
            <div *ngSwitchDefault class="preview-mockup default-mockup">
              <div class="mock-content">
                 <p class="text-center text-white/50">Vista previa no disponible para este componente ({{ selectedComponent.type }})</p>
              </div>
            </div>
          </div>
        </div>

        <div class="preview-actions">
          <button class="add-to-page-btn" (click)="addToPage()">
            ✚ Añadir a la Página
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .component-explorer {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .explorer-header h3 {
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

    .category-filter {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .category-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 25px;
      color: var(--color-text-inverse-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .category-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .category-btn.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }

    .category-icon {
      font-size: 1rem;
    }

    .component-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .component-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .component-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .component-card.selected {
      background: var(--color-primary);
      border-color: var(--color-primary-light);
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
    }

    .component-card.selected::before {
      content: '✓';
      position: absolute;
      top: 10px;
      right: 10px;
      background: white;
      color: var(--color-primary);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.8rem;
    }

    .component-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .component-info {
      margin-bottom: 1rem;
    }

    .component-name {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-inverse);
    }

    .component-description {
      margin: 0;
      font-size: 0.85rem;
      color: var(--color-text-inverse-secondary);
      line-height: 1.4;
    }

    .component-category {
      font-size: 0.75rem;
      color: var(--color-primary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .component-preview {
      background: #1e293b;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .preview-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .preview-icon {
      font-size: 1.5rem;
    }

    .preview-title h4 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--color-text-inverse);
    }

    .variant-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--color-text-inverse-secondary);
    }

    .variant-select {
      background: #1e293b;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.85rem;
      min-width: 120px;
    }

    .preview-content {
      position: relative;
      min-height: 300px;
      max-height: 500px;
      overflow-y: auto;
    }

    .preview-label {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 0.6rem;
      color: #6366f1;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      z-index: 10;
      background: rgba(30, 41, 59, 0.8);
      padding: 2px 8px;
      border-radius: 4px;
      backdrop-filter: blur(4px);
    }

    .preview-container {
      padding: 1.5rem;
      height: 100%;
    }

    .preview-mockup {
      background: #0f172a;
      border-radius: 12px;
      padding: 2rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .hero-mockup {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      flex-direction: column;
      text-align: center;
      color: white;
    }

    .hero-content h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .hero-content p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-btn {
      background: #6366f1;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .services-mockup {
      padding: 1rem;
    }

    .service-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      width: 100%;
    }

    .service-card {
      background: rgba(255, 255, 255, 0.05);
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .service-card h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .service-card p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .contact-mockup {
      padding: 1rem;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      width: 100%;
    }

    .form-input, .form-textarea {
      padding: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 0.9rem;
    }

    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .submit-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .gallery-mockup {
      padding: 1rem;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 0.5rem;
    }

    .gallery-item {
      aspect-ratio: 1;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .gallery-placeholder {
      font-size: 1.5rem;
      opacity: 0.6;
    }

    .default-mockup {
      padding: 2rem;
    }

    .mock-content {
      width: 100%;
    }

    .mock-line {
      height: 12px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .mock-line.long { width: 80%; }
    .mock-line.medium { width: 60%; }
    .mock-line.short { width: 40%; }

    .mock-blocks {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .mock-blocks span {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }

    .preview-actions {
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: center;
    }

    .add-to-page-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.95rem;
    }

    .add-to-page-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
      background: linear-gradient(135deg, #059669, #047857);
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

    // --- CARDS & MEDIA ---
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