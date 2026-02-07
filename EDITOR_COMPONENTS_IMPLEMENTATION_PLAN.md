# Plan de Implementación: Arquitectura Dual de Componentes (Secciones vs Atoms)

## 📋 Objetivo

Evolucionar la librería de componentes del editor hacia un sistema de **dos pestañas**:

1.  **UI Components (Atoms/Molecules)**: Componentes individuales como Botones, Títulos, Chips, etc.
2.  **Wrapped Sections (Organisms)**: Secciones completas pre-armadas como Heros, Servicios o Galerías.

Además, asegurar que el **100% de la librería de UI** en `libs/ui-components/` tenga un wrapper de editor funcional.

---

## �️ Nueva Arquitectura de la Librería

### 1. Tab: UI Components (Atoms)

Componentes de grano fino diseñados para ser usados individualmente o insertados en contenedores genéricos.

- **Mapeo**: `lib-ui-components-[name]`
- **Comportamiento**: Se añaden como secciones de componente único o elementos dentro de un `smart-container`.

### 2. Tab: Wrapped Sections (Organisms)

Composiciones complejas que ocupan un bloque completo de la página.

- **Mapeo**: `lib-editor-[name]-section`
- **Comportamiento**: Secciones full-width con placeholders y configuración temática completa.

---

## 🎯 Estado de Mapeo Completo

### ✅ SECCIONES (Organismos) - YA Implementadas

1.  **hero** - Full section
2.  **features** - Grid de características
3.  **stats** - Contadores y métricas
4.  **services** - Listado de servicios
5.  **pricing** - Tablas de precios
6.  **promotions** - Banners de oferta
7.  **testimonials** - Carrusel de opiniones
8.  **gallery** - Grid de imágenes
9.  **contact** - Formulario completo + Mapa
10. **header** - Navegación global
11. **footer** - Pie de página global
12. **newsletter** - Captación de leads
13. **steps** - Proceso / Timeline
14. **showcase** - Muestra destacada
15. **faq** - Preguntas frecuentes

### 🛠️ UI COMPONENTS (Atoms) - En Proceso / Faltantes

| Componente           | Estado Editor                     | Priority |
| :------------------- | :-------------------------------- | :------- |
| **button**           | ✅ Premium Isolated (Grads/Hover) | High     |
| **title**            | ✅ Isolated + Google Fonts Loader | High     |
| **image**            | ✅ Isolated Mode                  | High     |
| **accordion**        | ✅ Isolated Mode                  | Medium   |
| **video**            | ✅ Isolated Mode                  | Medium   |
| **showcase**         | ✅ Isolated Mode                  | Medium   |
| **card-animated**    | ✅ Implementado                   | High     |
| **card-product**     | ✅ Implementado                   | High     |
| **card-testimonial** | ✅ Implementado                   | High     |
| **chip**             | ✅ Wrapper Base                   | Medium   |
| **spinner**          | ✅ Wrapper Base                   | Low      |
| **visual-spacer**    | ✅ Drag-to-Resize + Decorative    | High     |
| **card-premium**     | ✅ Implementado (Isolated Mode)   | High     |
| **card-rutas**       | ✅ Implementado (Isolated Mode)   | Medium   |
| **smart-container**  | ✅ Implementado (Isolated Mode)   | High     |

---

## 📝 Plan de Acción Inmediato (Actualizado 07 Feb 2026)

### ✅ COMPLETADO

- **Visual Spacer**: Implementado con redimensionado vertical fluido y variantes decorativas.
- **Tipografía Google Fonts**: Integrado en el editor de títulos con carga dinámica y controles de espaciado.
- **Refactor de Botones**: Soporte para degradados y efectos hover avanzados.

### FASE 5: Refactor de Cards & Secciones Dinámicas

1.  **Refactor de Cards Premium**:
    - Finalizar los componentes de Card Premium y Rutas con sus respectivos modos aislados.
2.  **Sistema de Drag & Drop entre Secciones**:
    - Permitir reordenar componentes UI dentro de un `smart-container` mediante interacción visual.

---

## 📊 Checklist de Calidad por Componente

- [x] Soporta herencia de ADN Global (Architectural Bridge).
- [x] Modo Aislado Premium (Isolated Mode).
- [x] Efectos de Hover y Estados (Interactividad).
- [x] Responsive design nativo integrado.

---

**Última actualización**: 07 Feb 2026
**Responsable**: Antigravity AI
