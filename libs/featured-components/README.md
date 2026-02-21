# featured-components

Secciones y shells de negocio reutilizables para las apps del monorepo (Anto Studios, SPAs por sector, etc.).

## Contenido

### Secciones (exportadas en `index.ts`)

| Sección | Selector | Uso |
|--------|-----------|-----|
| Hero | `lib-ui-hero-section` | Cabecera con vídeo, título, CTA y variantes (matrix, neon, glass, etc.) |
| Hero Minimal / Split | `lib-hero-minimal`, `lib-hero-split` | Variantes de hero |
| Newsletter | `lib-newsletter-*` | Suscripción (minimal, modern, creative) |
| Testimonials | `lib-ui-testimonials-section` | Carrusel de testimonios |
| Stats | `lib-ui-components-stats-section` | Métricas / KPIs |
| Steps | `lib-ui-steps-section` | Pasos o proceso |
| Service | `lib-ui-service-section` | Servicios |
| Gallery | `lib-ui-gallery-section` | Galería de imágenes |
| Features | `lib-ui-features-section` | Características / beneficios |
| FAQ | `lib-ui-faq-section` | Preguntas frecuentes |
| Pricing Table | `lib-ui-pricing-table-section` | Tabla de precios (con empty state) |
| Products | `lib-products-section` | Grid de productos (filtros, empty state) |
| Promotions | `lib-ui-promotions-section` | Promociones |
| CTA | `lib-ui-cta-section` | Llamada a la acción |
| Contact | `lib-ui-contact-section` | Formulario + datos de contacto (validación email, aria) |
| Reservation Form | `lib-ui-reservation-form` | Formulario de reservas |

### Utilidades

- **`applySectionStyles(customStyles)`** – Convierte `CustomStyles` en un objeto de estilos que aplica variables de tema (`--theme-bg`, `--theme-color`, etc.). Uso en secciones para mantener consistencia.

### Modelos

- **`CustomStyles`** – Interface para estilos personalizados (backgroundColor, color, variables CSS).
- **`StatItem`**, **`Step`** – Tipos usados por stats y steps.

### Shells de negocio

Incluyen layout, navegación y rutas por sector: `anto-studios`, `spa`, `restaurant`, `gym`, `clinic`, `pharmacy`, `wellness-center`, `school`, `tutoring-center`, `training-institute`, `clothing-store`, `electronics-shop`, `boutique`, `real-estate`, `auto-repair`, `pet-grooming`, `peluqueria`, `barber-shop`, `makeup-artist`.

## Uso

```ts
import {
  UIHeroSectionComponent,
  UIContactSectionComponent,
  UIPricingTableSectionComponent,
  applySectionStyles
} from '@negocio/featured-components';
```

Las secciones usan **inputs** (signal-based donde aplica), **outputs** para eventos y **customStyles** para tema. El contacto incluye validación de email y mensajes de error; la tabla de precios y productos muestran **empty state** cuando no hay datos.

## Tests

```bash
nx test featured-components
```

## Convenciones

- Estilos: usar variables `--theme-bg`, `--theme-color`, `--component-bg`, `--component-text` cuando se pasen `customStyles`.
- Accesibilidad: `role`, `aria-label`, `aria-labelledby`, `aria-current` en carruseles y formularios.
- Empty states: bloque dedicado cuando `rows().length === 0` o `products().length === 0`.
