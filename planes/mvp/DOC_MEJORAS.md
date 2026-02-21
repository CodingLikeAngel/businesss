# 📋 Posibles Mejoras – Anto Studios Editor

**Objetivo:** Lista priorizada de mejoras técnicas, de producto y de experiencia para llevar el editor de un MVP estable a un producto comercial y escalable.

**Referencias:** Plan Maestro MVP, Análisis MVP y Negocio, Guía de Ejecución Agente.

---

## 1. Mejoras críticas (base)

### 1.1 Sistema de exportación y publicación

- **Reparar imports y rutas** del módulo de exportación (`libs/shared-components`, servicios de export).
- **Verificar y completar** `WebComponentExporter` y generación de código limpio.
- **Smoke test** de build de producción (`nx build`) y flujo "Publicar" de punta a punta.
- **Generador ZIP:** HTML/CSS/Assets empaquetados y descarga desde el editor.
- **Export multi-framework:** React, Angular, Vue, Web Components con calidad producción (ver `COMPONENT_EXPORT_ARCHITECTURE.md`).

### 1.2 Layout y modo aislado (Smart-Adapt)

- **Extensión Smart-Adapt** a todos los componentes de layout: `height: auto`, `min-height` preservado, sin `height: 100%` que corte contenido.
- **Componentes a adaptar:** ui-card (todas las variantes), ui-list, ui-text, ui-button, ui-chip, draggable-box.
- **Persistencia:** Guardar en JSON dimensiones y estilos flexibles; al restaurar, aplicar `min-height` en componentes de flujo y `height` fija solo donde corresponda (media).
- **Interfaz unificada de modo aislado:** Sidebar a la derecha con pestañas (Contenido | Estilo | Avanzado), vista previa en vivo y evento `applied` consistente con dimensiones correctas.

### 1.3 Redimensionamiento (resize)

- Comprobar **handles** de resize (integración visual y usabilidad).
- **Persistir y restaurar** dimensiones personalizadas en el modelo de página (JSON).

---

## 2. Mejoras de componentes y UI

### 2.1 Librería base (`libs/ui-components`)

- **Button:** Más variantes (Glitch, Neon, Glass), estados hover/active, soporte de iconos estable.
- **Card:** Contenido dinámico real, bordes animados, glassmorphism, sin alturas fijas en host.
- **Accordion:** Transiciones suaves, iconos configurables.
- **Input/Form:** Estilos alineados con la estética global (dark/cyberpunk), validación y feedback.
- **Gallery:** Grid masonry real, lightbox funcional.
- **Map:** Integración real o placeholder claro, estilos custom (dark mode).

### 2.2 Componentes de negocio (`libs/featured-components`)

- **Hero:** Vídeo de fondo, tipografía destacada, CTAs claros; en modo aislado poder editar texto, imagen y vídeo.
- **Pricing Table:** Toggle mensual/anual funcional, destacar plan "Recomendado".
- **Testimonials:** Carrusel estable, avatares, valoración (estrellas).
- **Contact Form:** Validación real y feedback visual de envío.
- **Restaurant Menu:** Estructura clara de ítems/precios, fotos.
- **Gym Schedule:** Tabla horaria responsive.
- **Stats/Steps:** Animaciones count-up y flujo visual consistente.
- **Templates por sección:** Uso consistente de `lib-ui-components-title`, botones, espaciado y variables de diseño.

### 2.3 Consistencia visual y diseño

- **Design tokens:** Uso sistemático de variables (`--theme-*`, `--fs-*`, `--sp-*`) en todas las secciones.
- **Empty states:** Diseño claro para slots vacíos y listas sin datos.
- **Accesibilidad:** ARIA, contraste, foco y navegación por teclado en editor y preview.

---

## 3. Mejoras de arquitectura y rendimiento

### 3.1 Limpieza y deuda técnica

- **Eliminación de legacy:** Ejecutar plan de borrado de wrappers antiguos (`editor-hero-section`, etc.) y usar solo layout flexible.
- **Tree shaking:** Eliminar módulos no usados y barriles que arrastren de más.
- **Lazy loading:** Cargar componentes de edición pesados solo bajo demanda (p. ej. registro lazy de secciones ya aplicado).

### 3.2 Rendimiento

- **Compilación y refresh:** Mantener registro lazy de secciones, entradas finas de store y caché de Nx.
- **Editor:** Evitar re-renders innecesarios (OnPush, `distinctUntilChanged`, huellas de comparación).
- **Bundle size:** Vigilar tamaño del shell del editor y de chunks por tipo de sección.

### 3.3 Estabilidad del build

- **Tests:** Unit tests para exportadores y servicios críticos; integración para flujo de export.
- **CI:** Pipeline que ejecute build, tests y (opcional) export de ejemplo en cada cambio.

---

## 4. Mejoras de experiencia (UX) y móvil

### 4.1 Responsive y móvil

- **Auto-stacking:** Grid a 1 columna en viewport móvil de forma predecible.
- **Font scaling:** Ajuste de tamaños de fuente en viewports pequeños.
- **Touch targets:** Botones y controles con tamaño mínimo adecuado para dedo.
- **Vista previa móvil** en el editor (toggle desktop/tablet/móvil).

### 4.2 Editor

- **Drag & drop:** Feedback visual claro al arrastrar (placeholder, highlight de zona de soltar).
- **Undo/Redo:** Historial de cambios en página y secciones.
- **Guardado automático** con indicador de estado (guardado / guardando / error).
- **Atajos de teclado** para acciones frecuentes (guardar, deshacer, duplicar, eliminar).

### 4.3 Onboarding y ayuda

- **Tooltips o tour** para primera vez (qué es cada panel, cómo añadir secciones).
- **Documentación in-app** o enlaces a docs (componentes, variantes, export).

---

## 5. Mejoras de negocio y producto

### 5.1 Flujo de publicación y entrega

- **Botón "Publicar"** visible y fiable: genera artefactos (HTML/CSS/ZIP o JSON) y ofrece descarga o siguiente paso (hosting).
- **Preview público:** Enlace de previsualización temporal (opcional, con auth o token).
- **Versiones:** Guardar versiones nombradas o por fecha para recuperar estados anteriores.

### 5.2 Monetización y límites

- **Flujo premium:** Pago o validación antes de export sin marca de agua / con límites elevados.
- **Límites por plan:** Número de páginas, de exportaciones, de dominios, etc., según modelo de negocio elegido.

### 5.3 Plantillas y contenido

- **Landing del producto** hecha con Anto Studios.
- **Plantillas por nicho:** Gym (Dark/Neon), Restaurante (Elegant), Portfolio (Minimal), etc., listas para clonar y personalizar.

---

## 6. Priorización sugerida

| Prioridad | Área              | Mejora principal                          |
|----------|-------------------|-------------------------------------------|
| P0       | Core              | Export/publicación estable + ZIP          |
| P0       | Layout            | Smart-Adapt en todos los componentes     |
| P1       | UX editor         | Modo aislado unificado + persistencia     |
| P1       | Móvil             | Responsive y vista previa móvil          |
| P2       | UI                | Pulido de cards, forms, gallery           |
| P2       | Negocio           | Botón Publicar + flujo premium           |
| P3       | Escala            | Tests, CI, documentación y onboarding     |

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0
