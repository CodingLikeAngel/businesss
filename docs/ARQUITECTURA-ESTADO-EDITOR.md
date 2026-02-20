# Arquitectura de estado del editor

## Fuente de verdad: NgRx Store

El **contenido actual de la página** (secciones, orden, content y styles de cada sección) vive en el **store NgRx** del feature editor:

- **Estado**: `state.editor.page` (PageState)
- **Selectores**: `selectCurrentPage`, `selectCurrentPageSections`, `selectHasUnsavedChanges`, `selectPageSaving`, `selectLastSaved`
- **Acciones**: actualización de página/secciones a través de `PageActions` (updateSection, updatePage, etc.)

Cualquier cambio que deba persistirse (edición de contenido, estilos, mover, redimensionar, reordenar) debe **despachar acciones al store**. El store es la única fuente de verdad para “qué tiene la página ahora”.

## VariantService y configs globales

**VariantService** (shared-components) mantiene:

- **Configs por tipo de componente** (heroConfig, galleryConfig, faqConfig, etc.): valores por defecto o plantillas cuando se crea una sección nueva.
- **builderStep$** ('welcome' | 'editor' | 'preview'): modo del builder.
- **componentVariants$**, **globalVariant**: variante visual por sección o global.

Estos datos son **complementarios** al store: no duplican el contenido de la página. Los configs se usan para:

1. Inicializar secciones nuevas (p. ej. `galleryConfig.images` si la sección no tiene `content.items`).
2. Ofrecer variantes y opciones en el panel (DesignEditor, variantes).

El **contenido actual** de cada sección (lo que el usuario editó) debe leerse y escribirse vía **store**, no desde VariantService. VariantService puede seguir exponiendo configs como referencia o defaults.

## Sincronización UI ↔ Store

- **Editor (canvas)**: lee secciones con `sections$ = store.select(selectCurrentPageSections)` y las pasa a cada `lib-editor-*-section`.
- **Panel lateral (ContentEditor, DesignEditor)**: reciben `selectedSection` / `selectedElement` desde **UiStateService**, que a su vez puede estar sincronizado con la selección en el store o en un servicio compartido. Las actualizaciones que hace el panel (p. ej. `updateProperty`) deben acabar **persistiendo en el store** (p. ej. mediante VariantService.updateSectionInCurrentPage que despache la acción correspondiente, o llamando directamente al store desde el feature editor).

## Undo/redo (historia)

La **historia** (undo/redo) se gestiona en el store (`state.editor.history` o similar). Para que undo/redo sea fiable:

- Toda acción editable (cambio de contenido, estilos, move, resize) debe ejecutarse como **comando** y registrarse en la historia (p. ej. `HistoryService.execute(command)` o el equivalente que despache la acción de NgRx).
- Tras undo/redo, el estado de la página debe quedar consistente con lo que muestra el store; no debe quedar estado “en memoria” en VariantService que contradiga al store.

## Resumen

| Dónde | Qué es | Fuente de verdad |
|-------|--------|-------------------|
| Contenido de la página (secciones, content, styles) | Lo que el usuario ve y edita | **Store NgRx** |
| Configs por tipo (defaults, plantillas) | Valores iniciales / variantes | VariantService (derivado o caché, no duplicar contenido actual) |
| builderStep, variantes globales | Estado del builder | VariantService |
| Historia (undo/redo) | Comandos y pasado/futuro | Store (history) |

Evitar duplicar “contenido actual de la página” entre store y VariantService: una sola fuente de verdad (store) y el resto derivado o auxiliar.
