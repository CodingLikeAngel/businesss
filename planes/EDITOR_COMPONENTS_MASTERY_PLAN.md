# 🚀 Plan Maestro de Implementación de Componentes V2

## Visión: "Componentes Inteligentes y Edición de Próxima Generación"

Este plan define la hoja de ruta para llevar todos los componentes UI al estándar de "Maestría" (Golden Standard), permitiendo una edición visual total, modo aislado premium y robustez estructural.

---

## 🎯 Objetivo General

Transformar la biblioteca de componentes UI en un ecosistema de diseño vivo donde cada elemento sea:

1.  **Aislable**: Edición sin distracciones vía Isolated Mode.
2.  **Draggable/Resizable**: Control total de layout en el canvas.
3.  **Persistente**: Integración nativa con NgRx y sistema de comandos (Undo/Redo).
4.  **Robusto**: Autogestión de bounding boxes y prevención de colapsos de sección.

---

## 🗺 Hoja de Ruta de Componentes

### 📦 Fase 1: Componentes de Contenido Base (Semana 1)

Integración de los "Big 5" y Isolated Mode para:

- [x] **Draggable Box**: (Completado) Referencia de robustez.
- [x] **Accordion (Suite completa)**: (En progreso) Soporte para V1, V2, V3.
- [ ] **Buttons (Universal)**: Edición de bordes, gradientes, íconos y efectos hover.
- [ ] **Cards / Pricing Tables**: Control de elevación, layouts de grid internos.

### 🖼 Fase 2: Componentes Multimedia & Formas (Semana 2)

- [ ] **Image Enhanced**: Cropping dinámico, filtros CSS, overlays de texto.
- [ ] **Icon / Badge**: Selector de biblioteca de íconos integrado en Isolated Mode.
- [ ] **Shapes / Dividers**: Formas geométricas editables para fondos.

### 🏗 Fase 3: Layouts & Secciones Complejas (Semana 3)

- [ ] **Hero Sections**: Gestión de backgrounds paralaje y alineación de contenido.
- [ ] **Feature Grids**: Reordenación de items vía Drag & Drop.
- [ ] **Testimonials / Sliders**: Configuración de animaciones y navegación.

---

## 🛠 Estándares de Implementación "Golden Standard"

### 1. Robustez Estructural (Prevención de Overflows)

Todo componente de sección debe implementar el sistema de **Autogestión de Altura**:

```typescript
private updateSectionHeight() {
  // logic to measure children bounds and expand section styles
}
```

### 2. Protocolo "Isolated Mode" Unificado

Cada `Editor{Component}Section` debe incluir:

- Atajo de teclado `I` para aislamiento.
- Botón flotante 🎯 rápido.
- Panel lateral con:
  - **Content**: Data pura (textos, arrays, urls).
  - **Appearance**: Presets de la marca (Rounded, Variant, Dark).
  - **Styles**: Overrides avanzados (CSS properties directas).
  - **Dimensions**: Control numérico exacto de X, Y, W, H.

### 3. Registro Dinámico (Arquitectura de Futuro)

Migrar hacia un `ComponentRegistry` para evitar el crecimiento infinito de plantillas:

```typescript
Registry.register('ui-button', {
  editor: EditorButtonComponent,
  isolated: EditorButtonIsolatedComponent,
  defaults: DEFAULT_BUTTON_CONTENT,
});
```

---

## 📋 Lista de Verificación para Nuevos Componentes (Definition of Done)

- [ ] Soporta el input `customStyles` y lo aplica al elemento raíz del UI.
- [ ] Implementa `VisualEditingConfig` con constraints de `containment: 'parent'`.
- [ ] El Isolated Mode soporta Undo/Redo local.
- [ ] La sección se expande automáticamente al mover/redimensionar el elemento.
- [ ] Todas las variantes visuales están mapeadas en el selector de Isolated Mode.

---

## 📅 Próximos Pasos Inmediatos

1.  **Finalizar Accordion**: Asegurar que la expansión de altura funcione en todas las variantes (V2, V3).
2.  **Componente Button**: Empezar la integración universal de botones.
3.  **Refactor de Base Component**: Extraer la lógica de `updateSectionHeight` a `EnhancedBaseEditorSectionComponent` para que sea heredable y automática.

---

**Última actualización**: 2026-02-07
**Estado del Proyecto**: 25% completado
