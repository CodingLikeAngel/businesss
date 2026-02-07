# 🎨 UI Components & Featured Components Enhancement Plan

**Fecha de creación**: 07 Feb 2026  
**Responsable**: Antigravity AI  
**Objetivo**: Mejorar y estandarizar todos los componentes UI y sus wrappers featured con modos aislados premium

---

## 📊 Estado Actual del Proyecto

### UI Components Base (`libs/ui-components/src/lib`)

Total de componentes identificados: **35 categorías**

#### Componentes Críticos (Alta Prioridad):

1. **accordion** - Componente de acordeón expandible
2. **button** - Botones con múltiples variantes
3. **cards** - Sistema de tarjetas (múltiples tipos)
4. **chip** - Chips/tags seleccionables
5. **draggable-box** - Cajas arrastrables
6. **forms** - Componentes de formularios
7. **image** - Componente de imagen optimizado
8. **modal** - Modales y diálogos
9. **tabs** - Sistema de pestañas
10. **table** - Tablas de datos

#### Componentes de Layout (Media Prioridad):

11. **footer** - Pies de página
12. **headers** - Cabeceras
13. **nav-bars** - Barras de navegación
14. **breadcrumbs** - Migas de pan
15. **smart-container** - Contenedores inteligentes

#### Componentes de Contenido (Media Prioridad):

16. **gallery** - Galerías de imágenes
17. **list** - Listas personalizadas
18. **title** - Títulos con estilos
19. **video** - Reproductor de video
20. **chart** - Gráficos y visualizaciones

#### Componentes de Interacción (Baja Prioridad):

21. **tooltip** - Tooltips informativos
22. **spinner** - Indicadores de carga
23. **date-time-picker** - Selector de fecha/hora
24. **bubble** - Burbujas de chat
25. **spacer** - Espaciadores

#### Componentes Especiales:

26. **animations** - Sistema de animaciones
27. **shape** - Formas geométricas
28. **showcase** - Showcases de productos
29. **template-gallery** - Galería de templates
30. **map** - Integración de mapas

### Featured Components (`libs/featured-components/src/lib`)

Total de wrappers identificados: **38 categorías**

#### Secciones Genéricas (Alta Prioridad):

1. **hero** - Secciones hero
2. **features-section** - Secciones de características
3. **testimonials-section** - Testimonios
4. **pricing-table-section** - Tablas de precios
5. **cta-section** - Call-to-action
6. **contact-section** - Formularios de contacto
7. **faq-section** - Preguntas frecuentes
8. **gallery-section** - Galerías
9. **products-section** - Productos
10. **service-section** - Servicios
11. **stats-section** - Estadísticas
12. **steps-section** - Pasos/procesos
13. **newsletter-section** - Newsletter
14. **promotions-section** - Promociones
15. **reservation-form** - Formularios de reserva

#### Industrias Específicas (Media Prioridad):

16. **anto-studios** - Estudio de diseño
17. **restaurant** - Restaurantes
18. **gym** - Gimnasios
19. **spa** - Spas y wellness
20. **clinic** - Clínicas médicas
21. **pharmacy** - Farmacias
22. **school** - Escuelas
23. **barber-shop** - Barberías
24. **boutique** - Boutiques
25. **clothing-store** - Tiendas de ropa
26. **electronics-shop** - Tiendas de electrónica
27. **makeup-artist** - Maquilladores
28. **pet-grooming** - Peluquerías de mascotas
29. **real-estate** - Inmobiliarias
30. **tattoo** - Estudios de tatuajes
31. **auto-repair** - Talleres mecánicos
32. **training-institute** - Institutos de formación
33. **tutoring-center** - Centros de tutoría
34. **wellness-center** - Centros de bienestar
35. **peluqueria** - Peluquerías

---

## 🎯 Objetivos del Plan

### 1. **Estandarización de UI Components**

- ✅ Sistema de variantes consistente (`default`, `primary`, `secondary`, `glass`, `neon`, `cyberpunk`)
- ✅ Props estandarizadas (`variant`, `customStyles`, `size`, `disabled`, etc.)
- ✅ Herencia de tema global (`globalVariant`)
- ✅ Soporte para estilos personalizados
- ✅ Documentación inline de cada prop
- ✅ Tipos TypeScript estrictos

### 2. **Mejora de Featured Components (Wrappers)**

- ✅ Integración con visual editing
- ✅ Modo aislado para cada wrapper
- ✅ Quick actions toolbar
- ✅ Double-click support
- ✅ Preview en tiempo real
- ✅ Drag & drop cuando aplique
- ✅ Resize interactivo

### 3. **Sistema de Edición Unificado**

- ✅ Editor visual para cada componente UI
- ✅ Modo aislado premium para wrappers
- ✅ Controles específicos por tipo de componente
- ✅ Preview instantáneo de cambios
- ✅ Undo/Redo support
- ✅ Copy/Paste de estilos

---

## 📋 Fase 1: Auditoría y Análisis (Semana 1)

### Tareas:

1. **Inventario Completo**

   - [ ] Listar todos los componentes UI con sus props actuales
   - [ ] Identificar inconsistencias en naming conventions
   - [ ] Documentar variantes existentes por componente
   - [ ] Mapear dependencias entre componentes

2. **Análisis de Featured Components**

   - [ ] Revisar estructura de cada wrapper
   - [ ] Identificar componentes UI utilizados
   - [ ] Documentar patrones de composición
   - [ ] Detectar código duplicado

3. **Definición de Estándares**
   - [ ] Crear guía de props estándar
   - [ ] Definir sistema de variantes unificado
   - [ ] Establecer convenciones de naming
   - [ ] Documentar patrones de composición

### Entregables:

- `UI_COMPONENTS_AUDIT.md` - Inventario completo
- `FEATURED_COMPONENTS_AUDIT.md` - Análisis de wrappers
- `COMPONENT_STANDARDS.md` - Guía de estándares

---

## 🔧 Fase 2: Refactorización de UI Components (Semanas 2-4)

### Prioridad Alta (Semana 2):

#### 2.1 Cards System

- [ ] **UICardComponent** - Card base genérica

  - Props: `title`, `description`, `image`, `variant`, `customStyles`
  - Variantes: `default`, `glass`, `neon`, `cyberpunk`, `elevated`
  - Features: Hover effects, click handlers, slots para contenido custom

- [ ] **UICardAnimatedComponent** - Card con animaciones

  - Props: `animation`, `duration`, `delay`, `trigger`
  - Animaciones: `fade`, `slide`, `zoom`, `bounce`, `flip`, `rotate`

- [ ] **UICardProductComponent** - Card de producto

  - Props: `product`, `showPrice`, `showRating`, `onAddToCart`
  - Features: Badge de descuento, rating stars, botón CTA

- [ ] **UICardTestimonialComponent** - Card de testimonio
  - Props: `author`, `role`, `company`, `avatar`, `testimonial`, `rating`
  - Features: Quote marks, author info, star rating

#### 2.2 Forms System

- [ ] **UIInputComponent** - Input de texto

  - Props: `type`, `placeholder`, `label`, `error`, `icon`, `variant`
  - Validación: Integración con Angular Forms
  - Estados: `default`, `focus`, `error`, `disabled`, `success`

- [ ] **UISelectComponent** - Selector dropdown

  - Props: `options`, `multiple`, `searchable`, `placeholder`
  - Features: Búsqueda, multi-select, custom templates

- [ ] **UITextareaComponent** - Área de texto

  - Props: `rows`, `autoResize`, `maxLength`, `showCounter`

- [ ] **UICheckboxComponent** - Checkbox

  - Props: `checked`, `indeterminate`, `label`, `variant`

- [ ] **UIRadioComponent** - Radio button
  - Props: `value`, `name`, `label`, `variant`

#### 2.3 Button System

- [ ] **UIButtonComponent** - Botón principal

  - Props: `variant`, `size`, `icon`, `loading`, `disabled`, `fullWidth`
  - Variantes: `primary`, `secondary`, `outline`, `ghost`, `danger`
  - Sizes: `xs`, `sm`, `md`, `lg`, `xl`
  - Features: Loading state, icon support, ripple effect

- [ ] **UIButtonGroupComponent** - Grupo de botones
  - Props: `orientation`, `variant`, `size`

### Prioridad Media (Semana 3):

#### 2.4 Navigation Components

- [ ] **UINavBarComponent** - Barra de navegación

  - Props: `items`, `logo`, `variant`, `sticky`, `transparent`
  - Features: Responsive menu, dropdown support, search

- [ ] **UIBreadcrumbsComponent** - Migas de pan

  - Props: `items`, `separator`, `variant`

- [ ] **UITabsComponent** - Sistema de pestañas
  - Props: `tabs`, `activeTab`, `variant`, `orientation`
  - Features: Lazy loading, router integration

#### 2.5 Data Display

- [ ] **UITableComponent** - Tabla de datos

  - Props: `columns`, `data`, `sortable`, `filterable`, `paginated`
  - Features: Sorting, filtering, pagination, row selection

- [ ] **UIListComponent** - Lista personalizada
  - Props: `items`, `variant`, `selectable`, `draggable`
  - Features: Virtual scrolling, drag & drop

#### 2.6 Feedback Components

- [ ] **UIModalComponent** - Modal/Dialog

  - Props: `title`, `size`, `closable`, `backdrop`
  - Features: Animations, keyboard support, focus trap

- [ ] **UITooltipComponent** - Tooltip

  - Props: `content`, `position`, `trigger`, `delay`

- [ ] **UISpinnerComponent** - Loading spinner
  - Props: `size`, `variant`, `text`
  - Variantes: `circle`, `dots`, `bars`, `pulse`

### Prioridad Baja (Semana 4):

#### 2.7 Media Components

- [ ] **UIImageComponent** - Imagen optimizada

  - Props: `src`, `alt`, `lazy`, `placeholder`, `aspectRatio`
  - Features: Lazy loading, blur placeholder, zoom

- [ ] **UIVideoComponent** - Reproductor de video

  - Props: `src`, `poster`, `controls`, `autoplay`, `loop`

- [ ] **UIGalleryComponent** - Galería de imágenes
  - Props: `images`, `layout`, `lightbox`, `thumbnails`
  - Layouts: `grid`, `masonry`, `carousel`

#### 2.8 Layout Components

- [ ] **UIHeaderComponent** - Cabecera

  - Props: `variant`, `height`, `sticky`, `transparent`

- [ ] **UIFooterComponent** - Pie de página

  - Props: `variant`, `columns`, `social`, `newsletter`

- [ ] **UISmartContainerComponent** - Contenedor inteligente
  - Props: `layout`, `gap`, `responsive`, `draggable`
  - Layouts: `flex`, `grid`, `masonry`

---

## 🎨 Fase 3: Featured Components Enhancement (Semanas 5-7)

### Semana 5: Secciones Genéricas Core

#### 3.1 Hero Sections

- [ ] **HeroMinimalComponent**
  - Isolated mode con controles de: título, subtítulo, CTA, imagen de fondo
  - Variantes: `centered`, `left-aligned`, `split`
- [ ] **HeroSplitComponent**

  - Isolated mode con: contenido izquierdo/derecho, imagen, CTA
  - Features: Swap sides, parallax effect

- [ ] **HeroFullScreenComponent**
  - Isolated mode con: video background, overlay, scroll indicator

#### 3.2 Features Sections

- [ ] **FeaturesGridComponent**

  - Isolated mode con: grid layout, iconos, títulos, descripciones
  - Drag & drop para reordenar features

- [ ] **FeaturesTimelineComponent**
  - Isolated mode con: timeline vertical/horizontal
  - Animaciones de entrada

#### 3.3 Testimonials

- [ ] **TestimonialsCarouselComponent**

  - Isolated mode con: autoplay, navigation, testimonials management
  - Drag & drop para reordenar testimonios

- [ ] **TestimonialsGridComponent**
  - Isolated mode con: grid layout, filtros por rating

### Semana 6: Secciones de Conversión

#### 3.4 CTA Sections

- [ ] **CTABannerComponent**

  - Isolated mode con: headline, subheadline, button, background

- [ ] **CTABoxComponent**
  - Isolated mode con: icon, title, description, CTA

#### 3.5 Pricing Tables

- [ ] **PricingTableComponent**
  - Isolated mode con: plans management, features, pricing, highlight
  - Drag & drop para reordenar planes

#### 3.6 Contact Forms

- [ ] **ContactFormComponent**
  - Isolated mode con: fields configuration, validation, submit action
  - Form builder visual

### Semana 7: Secciones de Contenido

#### 3.7 Gallery Sections

- [ ] **GallerySectionComponent**
  - Isolated mode con: layout selection, images management
  - Drag & drop para reordenar imágenes

#### 3.8 Products Sections

- [ ] **ProductsSectionComponent**
  - Isolated mode con: products grid, filters, sorting
  - Product card customization

#### 3.9 Stats Sections

- [ ] **StatsSectionComponent**
  - Isolated mode con: stats management, icons, animations
  - Counter animations

---

## 🏭 Fase 4: Industry-Specific Wrappers (Semanas 8-10)

### Semana 8: Servicios Personales

- [ ] **BarberShopSections** (5 componentes)
- [ ] **SpaSections** (21 componentes)
- [ ] **MakeupArtistSections** (8 componentes)
- [ ] **TattooSections** (2 componentes)

### Semana 9: Comercio y Retail

- [ ] **BoutiqueSections** (8 componentes)
- [ ] **ClothingStoreSections** (8 componentes)
- [ ] **ElectronicsShopSections** (8 componentes)
- [ ] **PharmacySections** (8 componentes)

### Semana 10: Servicios Profesionales

- [ ] **ClinicSections** (8 componentes)
- [ ] **GymSections** (9 componentes)
- [ ] **RestaurantSections** (9 componentes)
- [ ] **SchoolSections** (8 componentes)

---

## 🔨 Fase 5: Editor Integration (Semanas 11-12)

### Semana 11: Visual Editor Enhancement

#### 5.1 Component Palette

- [ ] Crear paleta de componentes UI arrastrables
- [ ] Categorización por tipo
- [ ] Preview thumbnails
- [ ] Búsqueda y filtros

#### 5.2 Properties Panel

- [ ] Panel de propiedades dinámico por componente
- [ ] Controles específicos por tipo de prop
- [ ] Preview en tiempo real
- [ ] Presets y templates

#### 5.3 Isolated Mode System

- [ ] Template base para isolated modes
- [ ] Sistema de controles reutilizables
- [ ] Preview canvas con grid
- [ ] Toolbar de acciones

### Semana 12: Advanced Features

#### 5.4 Style System

- [ ] Theme builder visual
- [ ] Color palette manager
- [ ] Typography system
- [ ] Spacing system

#### 5.5 Component Library

- [ ] Biblioteca de componentes guardados
- [ ] Import/Export de componentes
- [ ] Versionado de componentes
- [ ] Compartir componentes

---

## 📐 Arquitectura y Patrones

### Estructura de Componente UI Estándar

```typescript
@Component({
  selector: 'lib-ui-[component-name]',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './[component-name].component.html',
  styleUrl: './[component-name].component.scss'
})
export class UI[ComponentName]Component {
  // Props estándar
  @Input() variant: ComponentVariant = 'default';
  @Input() size: ComponentSize = 'md';
  @Input() customStyles?: Record<string, string>;
  @Input() disabled = false;

  // Props específicas del componente
  @Input() [specificProp]: Type;

  // Eventos estándar
  @Output() clicked = new EventEmitter<void>();
  @Output() changed = new EventEmitter<any>();

  // Computed properties
  public computedClasses = computed(() => ({
    [`variant-${this.variant}`]: true,
    [`size-${this.size}`]: true,
    'disabled': this.disabled
  }));

  public computedStyles = computed(() => ({
    ...this.getVariantStyles(),
    ...this.customStyles
  }));

  private getVariantStyles(): Record<string, string> {
    // Lógica de variantes
  }
}
```

### Estructura de Featured Component Estándar

```typescript
@Component({
  selector: 'lib-[section-name]-section',
  standalone: true,
  imports: [
    CommonModule,
    UI[Component]Component,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    Editor[SectionName]IsolatedModeComponent
  ],
  templateUrl: './[section-name]-section.component.html'
})
export class [SectionName]SectionComponent extends EnhancedBaseEditorSectionComponent {
  @ViewChild('sectionElement') sectionElement!: ElementRef;

  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
  }

  openIsolatedMode(event: MouseEvent): void {
    // Configuración del modo aislado
  }

  onIsolatedModeApplied(config: IsolatedModeConfig): void {
    // Aplicar cambios
  }
}
```

---

## ✅ Checklist de Calidad por Componente

### UI Component

- [ ] Props estandarizadas implementadas
- [ ] Sistema de variantes completo
- [ ] Estilos SCSS con mixins
- [ ] Soporte para customStyles
- [ ] Tipos TypeScript estrictos
- [ ] Documentación JSDoc
- [ ] Tests unitarios
- [ ] Storybook stories
- [ ] Accesibilidad (ARIA)
- [ ] Responsive design

### Featured Component (Wrapper)

- [ ] Integración con visual editing
- [ ] Modo aislado implementado
- [ ] Quick actions toolbar
- [ ] Double-click support
- [ ] Preview en tiempo real
- [ ] Herencia de globalVariant
- [ ] Drag & drop (si aplica)
- [ ] Resize interactivo
- [ ] Controles específicos
- [ ] Documentación inline

### Isolated Mode

- [ ] Sidebar de controles organizado
- [ ] Canvas de preview con grid
- [ ] Dock de información
- [ ] Resize handles
- [ ] Botones Apply/Cancel
- [ ] Undo/Redo support
- [ ] Keyboard shortcuts
- [ ] Validación de inputs
- [ ] Preview instantáneo
- [ ] Estilos premium

---

## 📊 Métricas de Éxito

### KPIs del Proyecto

1. **Cobertura de Componentes**: 100% de componentes UI refactorizados
2. **Isolated Modes**: 100% de featured components con modo aislado
3. **Consistencia**: 100% de componentes siguiendo estándares
4. **Performance**: < 100ms tiempo de renderizado por componente
5. **Accesibilidad**: 100% WCAG 2.1 AA compliance
6. **Testing**: > 80% code coverage
7. **Documentación**: 100% de componentes documentados

### Timeline Estimado

- **Fase 1**: 1 semana
- **Fase 2**: 3 semanas
- **Fase 3**: 3 semanas
- **Fase 4**: 3 semanas
- **Fase 5**: 2 semanas
- **Total**: **12 semanas** (3 meses)

---

## 🚀 Próximos Pasos Inmediatos

1. **Crear archivo de auditoría** para UI Components
2. **Definir estándares** de props y variantes
3. **Seleccionar 3 componentes piloto** para refactorización inicial
4. **Crear templates** base para isolated modes
5. **Configurar Storybook** para documentación visual

---

## 📝 Notas Importantes

- **Backward Compatibility**: Mantener compatibilidad con componentes existentes durante la transición
- **Migration Guide**: Crear guía de migración para cada componente refactorizado
- **Performance**: Optimizar bundle size con lazy loading de componentes
- **A11y**: Priorizar accesibilidad en todos los componentes
- **Mobile First**: Diseñar pensando primero en móvil
- **Dark Mode**: Soporte nativo para tema oscuro en todos los componentes

---

**Última actualización**: 07 Feb 2026 05:35  
**Versión**: 1.0  
**Estado**: 📋 **PLAN INICIAL - PENDIENTE DE APROBACIÓN**
