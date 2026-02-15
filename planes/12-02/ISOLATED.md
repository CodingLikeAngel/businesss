Upgrade de Experiencia de Edición (Isolated Mode Gold Standard)
Este plan detalla la reestructuración de los Modos Aislados del editor para centralizar la lógica de manipulación (Drag, Resize, Undo/Redo, Grids) y elevar la calidad de todos los componentes al nivel de draggable-box.

User Review Required
IMPORTANT

Esta refactorización implica cambios en ~32 componentes. Se realizará de forma incremental por Tiers para minimizar riesgos de regresión.

Proposed Changes
[Foundation] Base Infrastructure
[NEW]
base-isolated-mode.component.ts
Clase abstracta que contendrá:
Lógica de mousedown/mousemove/mouseup para Drag y Resize.
Pila de
Undo
/
Redo
(
saveState
,
undo
,
redo
).
Gestión de Grids y Snapping (
toggleGrid
,
toggleSnap
).
Keyboard Shortcuts (@HostListener para Arrows, G, S, R, Ctrl+Z/Y).
Cálculo de viewportScale y auto-scroll.
[NEW]
\_isolated-mode-shared.scss
Mixins para estilos comunes de la interfaz (Overlay, Sidebar, Header, Canvas, Resize Handles, Position Dock).
[Tier 1] Core Refactoring
[MODIFY]
draggable-box-isolated-mode.component.ts
Refactorizar para extender de BaseIsolatedModeComponent.
Reducir el archivo de ~1500 líneas a ~300 (solo lógica específica y sidebar).
[MODIFY]
button-isolated-mode.component.ts
Refactorizar para extender de BaseIsolatedModeComponent.
[Tier 2+] Component Migration
Migración progresiva de componentes como:

chip-isolated-mode
title-isolated-mode
image-isolated-mode
accordion-isolated-mode
Secciones (hero, features, etc.)
Verification Plan
Automated Tests
No hay tests unitarios configurados para estos componentes visuales actualmente, pero se verificará la integridad de la compilación de cada componente migrado.
Manual Verification
Draggable Box: Abrir modo aislado, verificar que Drag, Resize (8 puntos), Undo/Redo y Teclas rápidas siguen funcionando IDÉNTICAMENTE.
Button: Verificar que ahora tiene 8 puntos de resize (antes quizás menos) y que el Undo/Redo es consistente.
UI Consistency: Verificar que el layout de la Sidebar y el Canvas es idéntico entre componentes migrados.

Independent Row Resize
Tasks
Analyze current implementation (single grid container, shared columns)
Template: Split into per-row grid containers
Add
getRowGroups()
helper to partition slots by row
Add
getGridTemplateForRow(rowIndex)
method
Update template to render one .grid-container per row
Service: Per-row grid template logic
Update buildDynamicGridTemplate() to work per-row
Update buildGridTemplateOverride() to return per-row overrides
Update getCustomGridTemplate() to accept row context
Remove getColumnSiblings() coupling (no cross-row sync)
Update resizeSlot() to stop syncing column siblings
Persistence: Per-row config
Change gridTemplateOverride → gridTemplateOverridePerRow in interface
Update
loadConfigFromSection()
for backward compatibility
Update
dispatchUpdate()
to persist per-row data
Verify in browser
Fixes
Fix "Add Component" menu clickability issue (DOM instability)
Page Settings
Implement Global Page Background Settings

Modify
VariantSelectorComponent
to add "Background Color" control
Update
BaseEditorFeatureComponent
to sync global styles to Store
Update
MainDesktopLayoutComponent
to apply background color from Store
Ensure sections (Hero, DraggableBox, etc.) respect global background
Audit
EditorHeroSectionComponent
backgrounds
Audit
EditorDraggableBoxSectionComponent
backgrounds
Audit
EditorLayoutSectionComponent
for overrides
Standardize Section Backgrounds & Patterns
Create shared SCSS mixin/utility for premium patterns (stripes/noise)
Implement per-section backgroundColor override logic
Synchronize
EditorLayoutSectionComponent
and
EditorDraggableBoxSectionComponent
styles
Fix NG0100 ExpressionChangedAfterItHasBeenCheckedError
Move dynamic background from template async pipe to CSS variable
Implement Advanced Background Customization

Plan advanced background architecture
Extend
SectionStyles
data model
Create reusable
BackgroundEditorComponent
Integrate granular controls in "Ajustes" (Global)
Integrate granular controls in "Diseño" (Section)
Update SCSS mixins for dynamic patterns
Verify global vs per-section inheritance
Phase 5: AI Design Co-pilot (Vision & Prototyping)
Research & Setup AIIntegrationService for Gemini API
Design AI Response Interface (JSON Mapping for Styles)
Implement floating AI Prompt Modal in the Editor
Implement Real-time Style Application logic from AI feedback
Create Demo Walkthrough of AI-driven styling
Consolidate Strategy & Vision Document in negocioplans
AI Brain Weight System (Afinidad por estilo)
Implementar pesos persistentes en
AIMemoryService
Añadir lógica de Rejection Tracking (deshacer cambios)
Orquestación Multi-LLM para ahorro de costes (Mistral/Free tier)
Estandarización de API de IA (Uni-format response)
Limpieza de lints y avisos de compilación
Phase 6: Editing Experience Upgrade (Gold Standard)
Tier 1: Infraestructura & Draggable Box Gold (Foundation) [x]
Crear
BaseIsolatedModeComponent
abstracto
Crear
\_isolated-mode-shared.scss
con mixins premium
Refactorizar
DraggableBoxIsolatedModeComponent
(Herencia)
Refactorizar
ButtonIsolatedModeComponent
(Herencia)
Tier 2: Componentes Core & Contenido [x]
Refactorizar
ChipIsolatedModeComponent
Refactorizar
TitleIsolatedModeComponent
Refactorizar
ImageIsolatedModeComponent
Unificar Estilos Visuales (Overlay, Sidebar, Canvas) en Tier 2
Refactorizar BadgeIsolatedModeComponent (Omitir si no existe)
Tier 3: UI Content Components [x]
Migrar
CardPremiumIsolatedModeComponent
Migrar
CardProductIsolatedModeComponent
Migrar
ListIsolatedModeComponent
Migrar
AccordionIsolatedModeComponent
Migrar
TableIsolatedModeComponent
Migrar TabIsolatedModeComponent
Tier 3.5: Componentes Secundarios & Contenido [/]
Migrar
VideoIsolatedModeComponent
Migrar
ShapeIsolatedModeComponent
Migrar MapIsolatedModeComponent
Migrar GalleryIsolatedModeComponent
Migrar FAQIsolatedModeComponent
Migrar CardAnimated, CardRutas, CardTestimonial
Migrar
Stats
, Steps, CTA, Showcase
Tier 4: Secciones & Layout Migration
Migrar
HeroIsolatedModeComponent
Migrar
FeaturesIsolatedModeComponent
Migrar
PricingIsolatedModeComponent
Migrar ContactIsolatedModeComponent
Migrar Services,
Testimonials
,
Products
Verification & Polish
Validar Keyboard Shortcuts unificados

Validar consistencia visual de Sidebar/Canvas

Fix Horizontal Scroll in Preview & Isolated Modes

Enforce overflow-x: hidden on canvas and frame
Replace 100vw with 100% on desktop frame
Fix "Seamless" overflow leaks in preview mode

Comment
Ctrl+Alt+M

Independent Row Resize
Tasks
Analyze current implementation (single grid container, shared columns)
Template: Split into per-row grid containers
Add
getRowGroups()
helper to partition slots by row
Add
getGridTemplateForRow(rowIndex)
method
Update template to render one .grid-container per row
Service: Per-row grid template logic
Update buildDynamicGridTemplate() to work per-row
Update buildGridTemplateOverride() to return per-row overrides
Update getCustomGridTemplate() to accept row context
Remove getColumnSiblings() coupling (no cross-row sync)
Update resizeSlot() to stop syncing column siblings
Persistence: Per-row config
Change gridTemplateOverride → gridTemplateOverridePerRow in interface
Update
loadConfigFromSection()
for backward compatibility
Update
dispatchUpdate()
to persist per-row data
Verify in browser
Fixes
Fix "Add Component" menu clickability issue (DOM instability)
Page Settings
Implement Global Page Background Settings

Modify
VariantSelectorComponent
to add "Background Color" control
Update
BaseEditorFeatureComponent
to sync global styles to Store
Update
MainDesktopLayoutComponent
to apply background color from Store
Ensure sections (Hero, DraggableBox, etc.) respect global background
Audit
EditorHeroSectionComponent
backgrounds
Audit
EditorDraggableBoxSectionComponent
backgrounds
Audit
EditorLayoutSectionComponent
for overrides
Standardize Section Backgrounds & Patterns
Create shared SCSS mixin/utility for premium patterns (stripes/noise)
Implement per-section backgroundColor override logic
Synchronize
EditorLayoutSectionComponent
and
EditorDraggableBoxSectionComponent
styles
Fix NG0100 ExpressionChangedAfterItHasBeenCheckedError
Move dynamic background from template async pipe to CSS variable
Implement Advanced Background Customization

Plan advanced background architecture
Extend
SectionStyles
data model
Create reusable
BackgroundEditorComponent
Integrate granular controls in "Ajustes" (Global)
Integrate granular controls in "Diseño" (Section)
Update SCSS mixins for dynamic patterns
Verify global vs per-section inheritance
Phase 5: AI Design Co-pilot (Vision & Prototyping)
Research & Setup AIIntegrationService for Gemini API
Design AI Response Interface (JSON Mapping for Styles)
Implement floating AI Prompt Modal in the Editor
Implement Real-time Style Application logic from AI feedback
Create Demo Walkthrough of AI-driven styling
Consolidate Strategy & Vision Document in negocioplans
AI Brain Weight System (Afinidad por estilo)
Implementar pesos persistentes en
AIMemoryService
Añadir lógica de Rejection Tracking (deshacer cambios)
Orquestación Multi-LLM para ahorro de costes (Mistral/Free tier)
Estandarización de API de IA (Uni-format response)
Limpieza de lints y avisos de compilación
Phase 6: Editing Experience Upgrade (Gold Standard)
Tier 1: Infraestructura & Draggable Box Gold (Foundation) [x]
Crear
BaseIsolatedModeComponent
abstracto
Crear
\_isolated-mode-shared.scss
con mixins premium
Refactorizar
DraggableBoxIsolatedModeComponent
(Herencia)
Refactorizar
ButtonIsolatedModeComponent
(Herencia)
Tier 2: Componentes Core & Contenido [x]
Refactorizar
ChipIsolatedModeComponent
Refactorizar
TitleIsolatedModeComponent
Refactorizar
ImageIsolatedModeComponent
Unificar Estilos Visuales (Overlay, Sidebar, Canvas) en Tier 2
Refactorizar BadgeIsolatedModeComponent (Omitir si no existe)
Tier 3: UI Content Components [x]
Migrar
CardPremiumIsolatedModeComponent
Migrar
CardProductIsolatedModeComponent
Migrar
ListIsolatedModeComponent
Migrar
AccordionIsolatedModeComponent
Migrar
TableIsolatedModeComponent
Migrar TabIsolatedModeComponent
Tier 3.5: Componentes Secundarios & Contenido [/]
Migrar
VideoIsolatedModeComponent
Migrar
ShapeIsolatedModeComponent
Migrar MapIsolatedModeComponent
Migrar GalleryIsolatedModeComponent
Migrar FAQIsolatedModeComponent
Migrar CardAnimated, CardRutas, CardTestimonial
Migrar
Stats
, Steps, CTA, Showcase
Tier 4: Secciones & Layout Migration
Migrar
HeroIsolatedModeComponent
Migrar
FeaturesIsolatedModeComponent
Migrar
PricingIsolatedModeComponent
Migrar ContactIsolatedModeComponent
Migrar Services,
Testimonials
,
Products
Verification & Polish
Validar Keyboard Shortcuts unificados

Validar consistencia visual de Sidebar/Canvas

Fix Horizontal Scroll in Preview & Isolated Modes

Enforce overflow-x: hidden on canvas and frame
Replace 100vw with 100% on desktop frame
Fix "Seamless" overflow leaks in preview mode

Comment
Ctrl+Alt+M

Independent Row Resize
Tasks
Analyze current implementation (single grid container, shared columns)
Template: Split into per-row grid containers
Add
getRowGroups()
helper to partition slots by row
Add
getGridTemplateForRow(rowIndex)
method
Update template to render one .grid-container per row
Service: Per-row grid template logic
Update buildDynamicGridTemplate() to work per-row
Update buildGridTemplateOverride() to return per-row overrides
Update getCustomGridTemplate() to accept row context
Remove getColumnSiblings() coupling (no cross-row sync)
Update resizeSlot() to stop syncing column siblings
Persistence: Per-row config
Change gridTemplateOverride → gridTemplateOverridePerRow in interface
Update
loadConfigFromSection()
for backward compatibility
Update
dispatchUpdate()
to persist per-row data
Verify in browser
Fixes
Fix "Add Component" menu clickability issue (DOM instability)
Page Settings
Implement Global Page Background Settings

Modify
VariantSelectorComponent
to add "Background Color" control
Update
BaseEditorFeatureComponent
to sync global styles to Store
Update
MainDesktopLayoutComponent
to apply background color from Store
Ensure sections (Hero, DraggableBox, etc.) respect global background
Audit
EditorHeroSectionComponent
backgrounds
Audit
EditorDraggableBoxSectionComponent
backgrounds
Audit
EditorLayoutSectionComponent
for overrides
Standardize Section Backgrounds & Patterns
Create shared SCSS mixin/utility for premium patterns (stripes/noise)
Implement per-section backgroundColor override logic
Synchronize
EditorLayoutSectionComponent
and
EditorDraggableBoxSectionComponent
styles
Fix NG0100 ExpressionChangedAfterItHasBeenCheckedError
Move dynamic background from template async pipe to CSS variable
Implement Advanced Background Customization

Plan advanced background architecture
Extend
SectionStyles
data model
Create reusable
BackgroundEditorComponent
Integrate granular controls in "Ajustes" (Global)
Integrate granular controls in "Diseño" (Section)
Update SCSS mixins for dynamic patterns
Verify global vs per-section inheritance
Phase 5: AI Design Co-pilot (Vision & Prototyping)
Research & Setup AIIntegrationService for Gemini API
Design AI Response Interface (JSON Mapping for Styles)
Implement floating AI Prompt Modal in the Editor
Implement Real-time Style Application logic from AI feedback
Create Demo Walkthrough of AI-driven styling
Consolidate Strategy & Vision Document in negocioplans
AI Brain Weight System (Afinidad por estilo)
Implementar pesos persistentes en
AIMemoryService
Añadir lógica de Rejection Tracking (deshacer cambios)
Orquestación Multi-LLM para ahorro de costes (Mistral/Free tier)
Estandarización de API de IA (Uni-format response)
Limpieza de lints y avisos de compilación
Phase 6: Editing Experience Upgrade (Gold Standard)
Tier 1: Infraestructura & Draggable Box Gold (Foundation) [x]
Crear
BaseIsolatedModeComponent
abstracto
Crear
\_isolated-mode-shared.scss
con mixins premium
Refactorizar
DraggableBoxIsolatedModeComponent
(Herencia)
Refactorizar
ButtonIsolatedModeComponent
(Herencia)
Tier 2: Componentes Core & Contenido [x]
Refactorizar
ChipIsolatedModeComponent
Refactorizar
TitleIsolatedModeComponent
Refactorizar
ImageIsolatedModeComponent
Unificar Estilos Visuales (Overlay, Sidebar, Canvas) en Tier 2
Refactorizar BadgeIsolatedModeComponent (Omitir si no existe)
Tier 3: UI Content Components [x]
Migrar
CardPremiumIsolatedModeComponent
Migrar
CardProductIsolatedModeComponent
Migrar
ListIsolatedModeComponent
Migrar
AccordionIsolatedModeComponent
Migrar
TableIsolatedModeComponent
Migrar TabIsolatedModeComponent
Tier 3.5: Componentes Secundarios & Contenido [/]
Migrar
VideoIsolatedModeComponent
Migrar
ShapeIsolatedModeComponent
Migrar MapIsolatedModeComponent
Migrar GalleryIsolatedModeComponent
Migrar FAQIsolatedModeComponent
Migrar CardAnimated, CardRutas, CardTestimonial
Migrar
Stats
, Steps, CTA, Showcase
Tier 4: Secciones & Layout Migration
Migrar
HeroIsolatedModeComponent
Migrar
FeaturesIsolatedModeComponent
Migrar
PricingIsolatedModeComponent
Migrar ContactIsolatedModeComponent
Migrar Services,
Testimonials
,
Products
Verification & Polish
Validar Keyboard Shortcuts unificados

Validar consistencia visual de Sidebar/Canvas

Fix Horizontal Scroll in Preview & Isolated Modes

Enforce overflow-x: hidden on canvas and frame
Replace 100vw with 100% on desktop frame
Fix "Seamless" overflow leaks in preview mode

Comment
Ctrl+Alt+M
Independent Row Resize
Tasks
Analyze current implementation (single grid container, shared columns)
Template: Split into per-row grid containers
Add
getRowGroups()
helper to partition slots by row
Add
getGridTemplateForRow(rowIndex)
method
Update template to render one .grid-container per row
Service: Per-row grid template logic
Update buildDynamicGridTemplate() to work per-row
Update buildGridTemplateOverride() to return per-row overrides
Update getCustomGridTemplate() to accept row context
Remove getColumnSiblings() coupling (no cross-row sync)
Update resizeSlot() to stop syncing column siblings
Persistence: Per-row config
Change gridTemplateOverride → gridTemplateOverridePerRow in interface
Update
loadConfigFromSection()
for backward compatibility
Update
dispatchUpdate()
to persist per-row data
Verify in browser
Fixes
Fix "Add Component" menu clickability issue (DOM instability)
Page Settings
Implement Global Page Background Settings

Modify
VariantSelectorComponent
to add "Background Color" control
Update
BaseEditorFeatureComponent
to sync global styles to Store
Update
MainDesktopLayoutComponent
to apply background color from Store
Ensure sections (Hero, DraggableBox, etc.) respect global background
Audit
EditorHeroSectionComponent
backgrounds
Audit
EditorDraggableBoxSectionComponent
backgrounds
Audit
EditorLayoutSectionComponent
for overrides
Standardize Section Backgrounds & Patterns
Create shared SCSS mixin/utility for premium patterns (stripes/noise)
Implement per-section backgroundColor override logic
Synchronize
EditorLayoutSectionComponent
and
EditorDraggableBoxSectionComponent
styles
Fix NG0100 ExpressionChangedAfterItHasBeenCheckedError
Move dynamic background from template async pipe to CSS variable
Implement Advanced Background Customization

Plan advanced background architecture
Extend
SectionStyles
data model
Create reusable
BackgroundEditorComponent
Integrate granular controls in "Ajustes" (Global)
Integrate granular controls in "Diseño" (Section)
Update SCSS mixins for dynamic patterns
Verify global vs per-section inheritance
Phase 5: AI Design Co-pilot (Vision & Prototyping)
Research & Setup AIIntegrationService for Gemini API
Design AI Response Interface (JSON Mapping for Styles)
Implement floating AI Prompt Modal in the Editor
Implement Real-time Style Application logic from AI feedback
Create Demo Walkthrough of AI-driven styling
Consolidate Strategy & Vision Document in negocioplans
AI Brain Weight System (Afinidad por estilo)
Implementar pesos persistentes en
AIMemoryService
Añadir lógica de Rejection Tracking (deshacer cambios)
Orquestación Multi-LLM para ahorro de costes (Mistral/Free tier)
Estandarización de API de IA (Uni-format response)
Limpieza de lints y avisos de compilación
Phase 6: Editing Experience Upgrade (Gold Standard)
Tier 1: Infraestructura & Draggable Box Gold (Foundation) [x]
Crear
BaseIsolatedModeComponent
abstracto
Crear
\_isolated-mode-shared.scss
con mixins premium
Refactorizar
DraggableBoxIsolatedModeComponent
(Herencia)
Refactorizar
ButtonIsolatedModeComponent
(Herencia)
Tier 2: Componentes Core & Contenido [x]
Refactorizar
ChipIsolatedModeComponent
Refactorizar
TitleIsolatedModeComponent
Refactorizar
ImageIsolatedModeComponent
Unificar Estilos Visuales (Overlay, Sidebar, Canvas) en Tier 2
Refactorizar BadgeIsolatedModeComponent (Omitir si no existe)
Tier 3: UI Content Components [x]
Migrar
CardPremiumIsolatedModeComponent
Migrar
CardProductIsolatedModeComponent
Migrar
ListIsolatedModeComponent
Migrar
AccordionIsolatedModeComponent
Migrar
TableIsolatedModeComponent
Migrar TabIsolatedModeComponent
Tier 3.5: Componentes Secundarios & Contenido [/]
Migrar
VideoIsolatedModeComponent
Migrar
ShapeIsolatedModeComponent
Migrar MapIsolatedModeComponent
Migrar GalleryIsolatedModeComponent
Migrar FAQIsolatedModeComponent
Migrar CardAnimated, CardRutas, CardTestimonial
Migrar
Stats
, Steps, CTA, Showcase
Tier 4: Secciones & Layout Migration
Migrar
HeroIsolatedModeComponent
Migrar
FeaturesIsolatedModeComponent
Migrar
PricingIsolatedModeComponent
Migrar ContactIsolatedModeComponent
Migrar Services,
Testimonials
,
Products
Verification & Polish
Validar Keyboard Shortcuts unificados

Validar consistencia visual de Sidebar/Canvas

Fix Horizontal Scroll in Preview & Isolated Modes

Enforce overflow-x: hidden on canvas and frame
Replace 100vw with 100% on desktop frame
Fix "Seamless" overflow leaks in preview mode

Comment
Ctrl+Alt+M
