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

| Componente           | Estado Editor   | Priority |
| :------------------- | :-------------- | :------- |
| **button**           | ✅ Wrapper Base | High     |
| **title**            | ✅ Wrapper Base | High     |
| **image**            | ✅ Wrapper Base | High     |
| **chip**             | ✅ Wrapper Base | Medium   |
| **spinner**          | ✅ Wrapper Base | Low      |
| **breadcrumbs**      | ✅ Wrapper Base | Medium   |
| **card (Generic)**   | ✅ Wrapper Base | High     |
| **input**            | ✅ Wrapper Base | High     |
| **accordion**        | ✅ Wrapper Base | Medium   |
| **tabs**             | ✅ Wrapper Base | Medium   |
| **card-animated**    | ❌ Faltante     | High     |
| **card-premium**     | ❌ Faltante     | High     |
| **card-rutas**       | ❌ Faltante     | Medium   |
| **card-products**    | ❌ Faltante     | High     |
| **date-time-picker** | ❌ Faltante     | Medium   |
| **tooltip**          | ❌ Faltante     | Low      |
| **modal**            | ❌ Faltante     | Medium   |
| **chart**            | ✅ Wrapper Base | Medium   |

---

## 📝 Plan de Acción Inmediato

### FASE 1: Interfaz del Explorador (Dual-Tab)

**Archivo**: `libs/shared-components/src/lib/shared-components/variant-selector/component-explorer.component.ts`

- [ ] Añadir selector de pestañas (Tabs: SECCIONES | COMPONENTES).
- [ ] Implementar propiedad `libraryType` en el modelo `SectionVariant`.
- [ ] Filtrar la cuadrícula según la pestaña activa.
- [ ] Mejorar la categorización secundaria (Contenido, Comercio, etc.).

### FASE 2: Completar Wrappers Atomizados

Crear los wrappers faltantes para que todos los elementos UI sean editables:

1.  **EditorCardAnimatedSection**
2.  **EditorCardPremiumSection**
3.  **EditorCardRutasSection**
4.  **EditorModalSection** (Permitir editar el contenido del modal como una sección)

### FASE 3: Enriquecer Property Editing

Asegurar que los componentes atomizados tengan todos sus inputs mapeados en el editor:

- Botones: Iconos leading/trailing, tamaños, estados de carga.
- Títulos: Alineación fluid, gradientes temáticos.
- Cards: Configuración de sombra, bordes y hover-effects.

---

## � Formato del Modelo en el Explorador

Para soportar las dos pestañas, el objeto de configuración en `component-explorer.component.ts` debe ampliarse:

```typescript
{
  type: 'button',
  label: 'Botón UI',
  icon: '🔘',
  variants: ['primary', 'glass', 'neon'],
  category: 'interactive',
  libraryType: 'component' // <--- NUEVO: Distingue pestaña
}
```

---

## 📊 Checklist de Calidad por Componente

- [ ] Soporta herencia de ADN Global (Architectural Bridge).
- [ ] Editable visualmente (Drag/Resize si aplica).
- [ ] Inputs mapeados en el panel lateral.
- [ ] Preview funcional en el carrusel de variantes.
- [ ] Responsive design nativo integrado.

---

**Última actualización**: 25 Ene 2026
**Responsable**: Antigravity AI
