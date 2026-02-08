# 🚀 PLAN MAESTRO MVP: De Prototipo a Negocio Viable

**Objetivo:** Transformar el editor actual en un producto comercializable (MVP) robusto, estable y listo para generar ingresos, ejecutando tareas granulares paso a paso.

---

## 🏗️ FASE 1: ROBUSTEZ ABSOLUTA DEL CORE (La Base)

_No se puede vender si el editor "rompe" el diseño. Esta fase es innegociable._

### 1.1. 🔴 Reparación del Sistema de Exportación (CRÍTICO)

- [ ] **Fix Imports:** Corregir rutas rotas en `libs/shared-components/src/index.ts`.
- [ ] **Verify Export Service:** Asegurar generación de código limpio en `WebComponentExporter`.
- [ ] **Smoke Test:** Ejecutar `nx build` exitoso para producción.

### 1.2. 🟡 Extensión "Smart-Adapt" (Layout Fluido)

_Aplicar lógica de `height: auto` y `min-height` preservado a:_

- [ ] `ui-card` (todas las variantes: Animated, Glass, Premium).
- [ ] `ui-list`, `ui-text`, `ui-button`, `ui-chip`.
- [ ] **Acción:** Template cleanup en `editor-layout-section` y lógica de guardado en `onIsolatedModeApplied`.

### 1.3. 🟢 Sistema de Redimensión (Resize)

- [ ] **Handles:** Verificar integración visual y usabilidad.
- [ ] **Persistencia:** Guardar y restaurar dimensiones personalizadas en JSON.

---

## 🎨 FASE 2: PULIDO DE COMPONENTES UI (The "Wow" Factor)

_Asegurar que cada pieza del lego sea perfecta, editable y visualmente impactante._

### 2.1. 🧩 Librería Base (`libs/ui-components`)

**Objetivo:** Que los átomos de diseño sean consistentes y bellos.

- [ ] **Button:** Variantes (Glitch, Neon, Glass), estados hover/active, iconos.
- [ ] **Card:** Soportar contenido dinámico real, bordes animados, efectos glassmorphism.
- [ ] **Accordion:** Transiciones suaves, iconos personalizables.
- [ ] **Input/Form:** Estilos unificados con la estética global (dark/cyberpunk).
- [ ] **Gallery:** Grid masonry real, lightbox funcional.
- [ ] **Map:** Integración real (o placeholder estético), estilos custom (dark mode map).

### 2.2. 🏢 Componentes de Negocio (`libs/featured-components`)

**Objetivo:** Que los bloques de construcción complejos sean útiles para negocios reales.

- [ ] **Hero Section:** Soportar vídeo de fondo, tipografía masiva, CTAs claros. Isolated Mode debe permitir editar TODO (texto, imagen, vídeo).
- [ ] **Pricing Table:** Toggle mensual/anual funcional, destacar opción "Recomendada".
- [ ] **Testimonials:** Carrusel funcional, avatares, estrellas.
- [ ] **Contact Form:** Validación real, feedback visual de envío.
- [ ] **Restaurant Menu:** Estructura de items/precios clara, fotos apetecibles.
- [ ] **Gym Schedule:** Tabla horaria responsive.
- [ ] **Stats/Steps:** Animaciones de conteo (count-up) y flujo visual.

### 2.3. 🛠️ Estandarización de "Isolated Mode"

**Objetivo:** Que editar un Hero se sienta igual que editar un Footer.

- [ ] **Interfaz Unificada:** Sidebar de edición a la derecha con pestañas (Contenido | Estilo | Avanzado).
- [ ] **Live Preview:** Que los cambios en el sidebar se reflejen instantáneamente en el canvas aislado.
- [ ] **Save Logic:** Todos deben emitir el evento `applied` con dimensiones correctas para el Layout Section.

---

## 🧹 FASE 3: LIMPIEZA ARQUITECTÓNICA (Deuda Técnica)

_Eliminar lo viejo para que el mantenimiento sea barato y rápido._

### 3.1. 🗑️ Eliminación de Legacy Wrappers

_Ejecutar `PLAN_DELETION_LEGACY_COMPONENTS.md`_

- [ ] **Borrado Seguro:** Eliminar `editor-hero-section.component.ts`, etc.
- [ ] **Redirección:** Usar exclusivamente la arquitectura de Layout Flexible.

### 3.2. ⚡ Optimización

- [ ] **Tree Shaking:** Limpiar módulos no usados.
- [ ] **Lazy Loading:** Cargar componentes de edición pesados solo bajo demanda.

---

## 📱 FASE 4: EXPERIENCIA MÓVIL Y UX

_El 80% del tráfico es móvil. El editor debe garantizarlo._

### 4.1. 📲 Lógica Responsive

- [ ] **Auto-Stacking:** Grid a 1 columna en móvil.
- [ ] **Font Scaling:** Ajuste automático de tamaños de fuente en viewport pequeño.
- [ ] **Touch Targets:** Botones y enlaces usables con el dedo.

### 4.2. 🎨 UI Polish del Editor

- [ ] **Empty States:** Diseño amigable para slots vacíos.
- [ ] **Drag & Drop:** Feedback visual claro al arrastrar componentes.

---

## 💰 FASE 5: PREPARACIÓN DE NEGOCIO (Go-To-Market)

_Empaquetar la tecnología como producto vendible._

### 5.1. 📦 Producto "Demo"

- [ ] **Landing Page:** Creada con Anto Studios.
- [ ] **Plantillas Nicho:** Gym (Dark/Neon), Restaurant (Elegant), Portfolio (Minimal).

### 5.2. 💵 Modelo de Exportación

- [ ] **Botón Premium:** Flujo de pago/validación.
- [ ] **ZIP Generator:** HTML/CSS/Assets limpios.

---

## 📅 Calendario de Ejecución Sugerido

| Semana | Foco               | Tarea Principal                                |
| :----- | :----------------- | :--------------------------------------------- |
| **S1** | **Core Fixes**     | Fix Export + Smart-Adapt (Fase 1)              |
| **S2** | **UI Polish**      | Pulido UI Components + Isolated Modes (Fase 2) |
| **S3** | **Cleanup/Mobile** | Borrar Legacy + Responsive Logic (Fase 3+4)    |
| **S4** | **Launch**         | Plantillas Demo + Landing (Fase 5)             |

---

**Siguiente Paso Inmediato:** Volver a Fase 1.1 y 1.2 para tener la base sólida antes de pulir la estética.
