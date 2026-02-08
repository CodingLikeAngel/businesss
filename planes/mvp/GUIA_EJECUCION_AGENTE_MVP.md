# 🤖 GUÍA DE EJECUCIÓN PARA AGENTE: MVP ANTO STUDIOS

Este documento contiene una secuencia de **Prompts Maestros** diseñados para ser ejecutados uno por uno por un Agente de IA. Cada tarea es atómica, verificable y contribuye al objetivo final del MVP.

---

## 🏗️ FASE 1: Core y Estabilidad (Prioridad Máxima)

### 🔴 Tarea 1.1: Reparar Sistema de Exportación

**Objetivo:** Solucionar errores de compilación causados por imports rotos.
**Prompt para Agente:**

```markdown
**Contexto:** El build falla porque `libs/shared-components/src/index.ts` exporta desde `./services/export` que no existe o está mal referenciado.
**Archivos:** `libs/shared-components/src/index.ts`, `libs/shared-components/src/lib/services/export/*`
**Instrucciones:**

1. Verifica la ruta real donde se encuentran los servicios de exportación (`ExporterService`, `WebComponentExporter`).
2. Corrige la línea de exportación en `libs/shared-components/src/index.ts`.
3. Si el archivo `index.ts` dentro de la carpeta de servicios no existe, créalo y exporta los servicios necesarios.
4. Ejecuta `nx build` (o simula la verificación) para asegurar que el error "Cannot find module" desaparece.
```

### 🟡 Tarea 1.2: Implementar "Smart-Adapt" en Template (HTML)

**Objetivo:** Evitar que los componentes se corten visualmente eliminando `height: 100%` fijo.
**Prompt para Agente:**

```markdown
**Contexto:** Los componentes en `EditorLayoutSectionComponent` tienen estilos inline restrictivos (`height: 100%`) que causan overflow.
**Archivo:** `libs/features/editor/feature-editor/src/lib/pages/editor/components/layout-section/editor-layout-section.component.ts`
**Instrucciones:**

1. Edita el `template` del componente.
2. Localiza el `ngSwitch` que renderiza los componentes del slot.
3. Para los casos: `'ui-card'`, `'ui-card-animated'`, `'ui-list'`, `'ui-text'`, `'ui-button'`, `'ui-chip'`, `'draggable-box'`:
   - Cambia `style="... height: 100% ..."` por `style="width: 100%; height: auto; min-height: 100%; display: block;"`.
4. Asegúrate de añadir `margin-left: auto; margin-right: auto;` si no está presente en `getComponentStyles` o en el estilo inline, para garantizar el centrado.
```

### 🟡 Tarea 1.3: Lógica de Guardado "Smart-Adapt" (TS)

**Objetivo:** Guardar la altura visual como `min-height` flexible en lugar de `height` fija.
**Prompt para Agente:**

```markdown
**Contexto:** Al guardar cambios desde el Modo Aislado, necesitamos diferenciar entre componentes de "Flujo" (crecen) y "Media" (fijos).
**Archivo:** `libs/features/editor/feature-editor/src/lib/pages/editor/components/layout-section/editor-layout-section.component.ts`
**Instrucciones:**

1. Ve al método `onIsolatedModeApplied`.
2. Define una lista de `FLOW_COMPONENTS` ('ui-accordion', 'ui-card', 'ui-list', 'ui-text', etc.).
3. Modifica la lógica de asignación de estilos (`finalStyles`):
   - SI el componente es de flujo: `height` = 'auto', `min-height` = `updatedConfig.size.height + 'px'`.
   - SI NO (imagen, video): `height` = `updatedConfig.size.height + 'px'`.
4. Asegura que `max-width: 100%` siempre se aplique.
```

---

## 🧹 FASE 2: Limpieza y Optimización

### 🗑️ Tarea 2.1: Eliminar Wrappers Legacy

**Objetivo:** Eliminar código muerto que confunde el mantenimiento.
**Prompt para Agente:**

```markdown
**Contexto:** Existen componentes antiguos `*-section.component.ts` que ya no se usan gracias al Layout Flexible.
**Lista de Eliminación:** Ver contenido de `planes/nuevos/PLAN_DELETION_LEGACY_COMPONENTS.md`.
**Instrucciones:**

1. Elimina físicamente los archivos listados en el plan (ej. `editor-hero-section.component.ts`, `editor-features-section.component.ts`).
2. NO elimines los archivos `*-isolated-mode.component.ts`.
3. Busca referencias a estos componentes eliminados en `layout-section.module.ts` o `index.ts` y elimínalas para evitar errores de compilación.
```

---

## 🎨 FASE 3: Pulido de Componentes UI (The "Wow" Factor)

### 🧩 Tarea 3.1: Pulido de UI Cards

**Objetivo:** Que las tarjetas se vean premium y respondan al contenido.
**Prompt para Agente:**

```markdown
**Contexto:** Las tarjetas base (`ui-components/cards`) deben soportar contenido variable sin romperse.
**Archivos:** `libs/ui-components/src/lib/cards/*`
**Instrucciones:**

1. Revisa `UICardComponent`, `UICardAnimatedComponent`, `UICardPremiumComponent`.
2. Asegura que sus estilos SCSS no tengan `height: fixed` forzado en el host.
3. Verifica que usen Flexbox/Grid moderno para alinear contenido interno.
4. Implementa un estado "Empty" visual si no hay datos.
```

### 🧩 Tarea 3.2: Pulido de UI List y Chips

**Objetivo:** Listas y etiquetas deben fluir correctamente (wrap).
**Prompt para Agente:**

```markdown
**Archivos:** `libs/ui-components/src/lib/list/*`, `libs/ui-components/src/lib/chip/*`
**Instrucciones:**

1. `UIListComponent`: Asegura que el contenedor `ul/ol` tenga `list-style` interno atractivo (custom bullets).
2. `UIChipComponent`: Asegura que el contenedor padre use `flex-wrap: wrap` y gap adecuado.
```

### 🏢 Tarea 3.3: Estandarización de Featured Components (Hero, Pricing)

**Objetivo:** Que los componentes de negocio funcionen perfectos en el Layout Flexible.
**Prompt para Agente:**

```markdown
**Contexto:** Componentes complejos como Hero y Pricing necesitan ajustes para el nuevo layout.
**Archivos:** `libs/featured-components/src/lib/*`
**Instrucciones:**

1. `HeroComponent`: Asegura que la imagen de fondo use `object-fit: cover` y tenga un overlay oscuro para legibilidad del texto.
2. `PricingComponent`: Verifica que las columnas de precios se apilen en móvil (flex-direction column).
3. Asegura que sus respectivos `IsolatedMode` componentes emitan correctamente el evento `applied` con el tamaño total.
```

---

## 📱 FASE 4: Experiencia Móvil

### 📲 Tarea 4.1: Responsive Layout Logic

**Objetivo:** Convertir el Grid en una pila vertical en móviles.
**Prompt para Agente:**

```markdown
**Contexto:** El editor debe simular comportamiento móvil.
**Archivo:** `libs/features/editor/feature-editor/src/lib/pages/editor/components/layout-section/editor-layout-section.component.ts` (styles)
**Instrucciones:**

1. Añade Media Query CSS para detectar ancho < 768px (o usa una clase `.mobile-view` inyectada por el servicio de preview).
2. En vista móvil: forzar `.grid-container { grid-template-columns: 1fr !important; }`.
3. Forzar slots a `width: 100%`.
```

---

## 💰 FASE 5: Exportación Real

### 📦 Tarea 5.1: Generador de ZIP

**Objetivo:** Entregar el producto final al usuario.
**Prompt para Agente:**

```markdown
**Contexto:** El usuario quiere descargar su web.
**Archivo:** `libs/shared-components/src/lib/services/export/exporter.service.ts`
**Instrucciones:**

1. Implementa un método `downloadProjectAsZip(projectData)`.
2. Usa `jszip` (asegura que esté instalado) para empaquetar:
   - `index.html` (generado por `HtmlExporter`).
   - `styles.css` (recopilado de estilos globales y componentes).
   - Carpeta `assets/` (si aplica).
3. Conecta este servicio al botón "Publicar" en la UI del editor.
```
