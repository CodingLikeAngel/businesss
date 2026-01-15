# Plan de Corrección de Errores de Compilación en Proyecto Angular Nx

## Análisis de Errores

Los errores se agrupan en las siguientes causas raíz:

### 1. Inconsistencia en Nombres de Selectores
Los selectores de componentes no coinciden con los nombres usados en los templates.

**Componentes afectados:**
- `UIHeroSectionComponent`: selector `'lib-ui-hero'` vs template `'lib-ui-hero-section'`
- `UIModalComponent`: selector `'lib-ui-modal'` vs template `'lib-ui-components-modal'`
- `UITabsComponent`: selector `'lib-ui-tabs'` vs template `'lib-ui-components-tabs'`
- `UIGallerySectionComponent`: selector `'lib-ui-gallery-section'` vs template `'lib-ui-components-gallery-section'`

### 2. Componentes No Importados en Standalone Components
Algunos componentes usados en templates no están incluidos en `@Component.imports`.

**En EditorDesktopFeatureComponent:**
- Faltan: `UITabsComponent`, `UIGallerySectionComponent`

**En EditorMobileFeatureComponent:**
- Faltan: `UIHeroSectionComponent` (aunque importado, no usado correctamente)

### 3. Inputs/Outputs Incorrectos
Una vez resueltos los imports, algunos inputs pueden no existir o haber cambiado.

### 4. Tipos de Eventos Incorrectos
Errores de tipo en bindings de eventos, probablemente resueltos al importar correctamente.

## Soluciones Propuestas

### Corrección Inmediata

#### Cambiar Selectores de Componentes
Actualizar los selectores para que coincidan con los templates:

1. **UIHeroSectionComponent** (`libs/ui-components/src/lib/hero/hero.component.ts`):
   - Cambiar selector de `'lib-ui-hero'` a `'lib-ui-hero-section'`

2. **UIModalComponent** (`libs/ui-components/src/lib/modal/modal.component.ts`):
   - Cambiar selector de `'lib-ui-modal'` a `'lib-ui-components-modal'`

3. **UITabsComponent** (`libs/ui-components/src/lib/tabs/tabs.component.ts`):
   - Cambiar selector de `'lib-ui-tabs'` a `'lib-ui-components-tabs'`

4. **UIGallerySectionComponent** (`libs/ui-components/src/lib/gallery-section/gallery-section.component.ts`):
   - Cambiar selector de `'lib-ui-gallery-section'` a `'lib-ui-components-gallery-section'`

#### Añadir Imports Faltantes

**EditorDesktopFeatureComponent** (`libs/features/editor/feature-editor/src/lib/pages/editor/desktop/editor-feature.component.ts`):
- Añadir a imports: `UITabsComponent`, `UIGallerySectionComponent`

**EditorMobileFeatureComponent** (`libs/features/editor/feature-editor/src/lib/pages/editor/mobile/editor-feature.component.ts`):
- Verificar que `UIHeroSectionComponent` esté correctamente usado (cambiar template de `'lib-ui-components-hero-section'` a `'lib-ui-hero-section'` si es necesario)

### Solución Estructural

#### Crear Barrel Export Consistente
Crear un archivo barrel en `libs/ui-components/src/lib/index.ts` con aliases consistentes:

```typescript
// Barrel exports with consistent naming
export { UIHeroSectionComponent as UIHeroSectionComponent } from './hero/hero.component';
export { UIModalComponent as UIComponentsModalComponent } from './modal/modal.component';
// ... otros con nombres consistentes
```

#### Refactor de APIs Inconsistentes
Revisar y estandarizar las APIs de inputs/outputs de los componentes UI para evitar futuros errores.

#### Usar NO_ERRORS_SCHEMA Temporalmente (No Recomendado)
Solo si es estrictamente necesario para desarrollo rápido, pero evitar en producción.

## Archivos a Modificar

1. `libs/ui-components/src/lib/hero/hero.component.ts` - Cambiar selector
2. `libs/ui-components/src/lib/modal/modal.component.ts` - Cambiar selector
3. `libs/ui-components/src/lib/tabs/tabs.component.ts` - Cambiar selector
4. `libs/ui-components/src/lib/gallery-section/gallery-section.component.ts` - Cambiar selector
5. `libs/features/editor/feature-editor/src/lib/pages/editor/desktop/editor-feature.component.ts` - Añadir imports
6. `libs/features/editor/feature-editor/src/lib/pages/editor/mobile/editor-feature.component.html` - Corregir nombre de componente hero si necesario

## Verificación
Después de los cambios, ejecutar `nx build` para verificar que los errores se resuelvan.