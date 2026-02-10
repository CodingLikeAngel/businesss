# Plan de Estandarización Total de Componentes (v2.0) - Anto Studios

> **Estado**: EN PROGRESO  
> **Objetivo**: Elevar TODOS los componentes de la biblioteca al nivel "Gold Standard" definido por los editores de _Accordion_ y _Draggable Box_. La meta es una experiencia de edición visual unificada, exhaustiva y premium.

## 1. El "Gold Standard" de Edición Aislada

Para dar por "completado" un componente, su editor (`Editor[...]IsolatedModeComponent`) debe cumplir estrictamente con:

1.  **Acceso Total a Variantes**: No limitar a 3-4 opciones. Usar el selector híbrido (Presets + Lista Completa del Sistema).
2.  **Formato de Nombres**: Usar `formatVariantName` para mostrar "Cyberpunk Neon" en lugar de `cyberpunk-neon`.
3.  **Feedback Visual Inmediato**: El canvas debe reflejar los cambios en tiempo real (WYSIWYG 100%).
4.  **Controles Completos**:
    - **Contenido**: Textos, iconos, imágenes, listas.
    - **Estilo Base**: Variante, tamaño, redondeo, modo oscuro.
    - **Estilo Avanzado**: Colores (sólido/gradiente), tipografía, espaciado.
    - **Posición/Tamaño**: Drag & drop, resize, inputs numéricos, snapping a grid.
5.  **Persistencia Robusta**: Guardar cambios sin romper el layout (respetar `isStrictGrid` fuera del modo aislado).

---

## 2. Inventario y Estado de Actualización

Hay **32 componentes** con editor aislado.

- ✅ **Completados (Gold Standard)**: `draggable-box`.
- ⚠️ **Parciales (Funcionales pero limitados)**: `accordion` (falta formateo nombres).
- ❌ **Pendientes (Lista variantes hardcoded)**: 30 componentes.

### Grupo A: UI Crítica (Prioridad Alta)

Estos componentes forman el 80% del contenido de una web.

- [ ] **Button**: `editor-button-isolated-mode`
- [ ] **Title**: `editor-title-isolated-mode`
- [ ] **Image**: `editor-image-isolated-mode`
- [ ] **Video**: `editor-video-isolated-mode`
- [ ] **Chip**: `editor-chip-isolated-mode`

### Grupo B: Cards & Contenedores (Prioridad Media)

Elementos estructurales y de diseño.

- [ ] **Card Animated**: `editor-card-animated-isolated-mode`
- [ ] **Card Premium**: `editor-card-premium-isolated-mode`
- [ ] **Card Product**: `editor-card-product-isolated-mode`
- [ ] **Card Rutas**: `editor-card-rutas-isolated-mode`
- [ ] **Card Testimonial**: `editor-card-testimonial-isolated-mode`
- [ ] **Smart Container**: `editor-smart-container-isolated-mode`

### Grupo C: Secciones Completas (Prioridad Media-Alta)

Bloques grandes de página.

- [ ] **Hero**: `editor-hero-isolated-mode`
- [ ] **Footer**: `editor-footer-isolated-mode`
- [ ] **Features**: `editor-features-isolated-mode`
- [ ] **Services**: `editor-services-isolated-mode`
- [ ] **CTA**: `editor-cta-isolated-mode`
- [ ] **Contact**: `editor-contact-isolated-mode`
- [ ] **FAQ**: `editor-faq-isolated-mode`

### Grupo D: Datos y Marketing (Prioridad Baja)

Componentes especializados.

- [ ] **List**: `editor-list-isolated-mode`
- [ ] **Table**: `editor-table-isolated-mode`
- [ ] **Pricing**: `editor-pricing-isolated-mode`
- [ ] **Stats**: `editor-stats-isolated-mode`
- [ ] **Steps**: `editor-steps-isolated-mode`
- [ ] **Tabs**: `editor-tabs-isolated-mode`
- [ ] **Gallery**: `editor-gallery-isolated-mode`
- [ ] **Showcase**: `editor-showcase-isolated-mode`
- [ ] **Promotions**: `editor-promotions-isolated-mode`
- [ ] **Testimonials**: `editor-testimonials-isolated-mode`
- [ ] **Shape**: `editor-shape-isolated-mode`
- [ ] **Map**: `editor-map-isolated-mode`

---

## 3. Estrategia de Ejecución

Aplicaremos los cambios en **Lotes** para mantener el control de calidad.

### Paso 1: Estandarización UI Crítica (Grupo A + Accordion)

- **Acción**: Actualizar `availableVariants`, `formatVariantName` y el template HTML `<select>` en los componentes del Grupo A.
- **Validación**: Verificar que el dropdown muestra todas las variantes y se aplican correctamente.

### Paso 2: Estandarización Cards (Grupo B)

- **Acción**: Replicar la lógica en todos los editores de Cards.
- **Atención Especial**: Verificar si las cards complejas (ej. `card-product`) requieren mapeo adicional de estilos internos.

### Paso 3: Estandarización Secciones (Grupo C)

- **Acción**: Actualizar los editores de secciones completas.
- **Nota**: Estos componentes suelen tener variantes que afectan a múltiples sub-elementos. Asegurar que la variante global se propaga.

### Paso 4: Estandarización Restante (Grupo D)

- **Acción**: Barrido final para los componentes de nicho.

---

## 4. Snippet de Referencia (Gold Standard)

**TypeScript:**

```typescript
import { variants } from '@negocio/ui-components';

// En la clase:
availableVariants = variants;

formatVariantName(variant: string): string {
  if (!variant) return '';
  return variant
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

**HTML Template:**

```html
<div class="control-group">
  <label>Variante de Estilo</label>
  <div class="select-wrapper">
    <select [(ngModel)]="editableContent.variant" (ngModelChange)="onVariantChange()" class="premium-select">
      <!-- Presets Comunes -->
      <option value="">Página (Heredar)</option>
      <option value="default">Estándar (Blanco)</option>
      <option value="primary">Primario (Primary)</option>
      <option value="secondary">Secundario (Secondary)</option>
      <option value="glass">Cristal (Glass)</option>
      <option value="neon">Neón (Glow)</option>
      <option value="cyberpunk">Cyberpunk</option>

      <option disabled>──────────────</option>

      <!-- Lista Completa Dinámica (Excluyendo presets) -->
      <ng-container *ngFor="let v of availableVariants">
        <option *ngIf="!['default', 'primary', 'secondary', 'glass', 'neon', 'cyberpunk'].includes(v)" [value]="v">{{ formatVariantName(v) }}</option>
      </ng-container>
    </select>
  </div>
  <p class="variant-hint" *ngIf="!editableContent.variant">Heredando: {{ config.content['globalVariant'] || 'glass' }}</p>
</div>
```
