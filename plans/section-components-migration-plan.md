# Migration Plan: Moving Section Components from ui-components to featured-components

## Overview

This document outlines the plan to migrate section components (organisms) from the `ui-components` library to the `featured-components` library to establish proper architectural separation.

## Problem Statement

Currently, section components (organisms) are incorrectly placed in the `ui-components` library alongside atomic UI components. This violates the architectural principle that:

- **ui-components** should contain atomic UI components (atoms, molecules) - reusable building blocks like buttons, inputs, cards, titles
- **featured-components** should contain sections/organisms - complex components composed of UI components

## Components to Migrate

The following section components need to be moved from `libs/ui-components/src/lib/` to `libs/featured-components/src/lib/`:

1. **newsletter-section** (with subtypes: minimal, modern, creative)
2. **testimonials-section**
3. **stats-section**
4. **steps-section**
5. **service-section**
6. **gallery-section**
7. **features-section**
8. **faq-section**
9. **hero** (with subtypes: minimal, split)

## Migration Strategy

### Phase 1: Preparation

1. **Analyze Dependencies**
   - Identify all files that import these components
   - Map component usage across the codebase
   - Document any circular dependencies

2. **Backup Current State**
   - Create a backup of the current codebase state
   - Document current export structure

### Phase 2: Component Migration

For each component to migrate:

1. **Move Component Directory**
   - Move entire component directory from `libs/ui-components/src/lib/{component-name}/` to `libs/featured-components/src/lib/{component-name}/`
   - Include all subdirectories (e.g., newsletter-minimal, newsletter-modern, etc.)

2. **Update Component Imports**
   - Update internal imports within the component (if any)
   - Ensure imports reference `@negocio/ui-components` for atomic components

3. **Update featured-components index.ts**
   - Add exports for migrated components
   - Follow existing export patterns

### Phase 3: Update Consumers

1. **Update libs/ui-components/src/index.ts**
   - Remove exports for migrated components
   - Keep atomic UI component exports

2. **Update libs/shared-components/src/lib/shared-components/variant-selector/component-explorer.component.ts**
   - Update imports from `@negocio/ui-components` to `@negocio/featured-components`
   - Update component references in template

3. **Update libs/features/editor/feature-editor/src/lib/components/editor-canvas/section-renderer.component.ts**
   - Update imports for migrated components

4. **Update Editor Section Components**
   - Update all editor section components that reference migrated sections:
     - `libs/features/editor/feature-editor/src/lib/pages/editor/components/newsletter/`
     - `libs/features/editor/feature-editor/src/lib/pages/editor/components/hero/`
     - `libs/features/editor/feature-editor/src/lib/pages/editor/components/testimonials/`
     - `libs/features/editor/feature-editor/src/lib/pages/editor/components/features/`
     - `libs/features/editor/feature-editor/src/lib/pages/editor/components/gallery/`
     - `libs/features/editor/feature-editor/src/lib/pages/editor/components/stats/`
     - `libs/features/editor/feature-editor/src/lib/pages/editor/components/steps/`
     - `libs/features/editor/feature-editor/src/lib/pages/editor/components/services/`
     - `libs/features/editor/feature-editor/src/lib/pages/editor/components/faq/`

5. **Update libs/features/editor/feature-editor/src/lib/pages/editor/desktop/editor-feature.component.ts**
   - Update imports for migrated components

6. **Update libs/features/editor/feature-editor/src/lib/pages/editor/desktop/editor-feature.component.html**
   - Update component references in template

7. **Update libs/features/editor/feature-editor/src/lib/pages/editor/mobile/editor-feature.component.ts**
   - Update imports for migrated components

8. **Update libs/features/editor/feature-editor/src/lib/pages/editor/mobile/editor-feature.component.html**
   - Update component references in template

### Phase 4: Update featured-components Library Configuration

1. **Update libs/featured-components/tsconfig.lib.json**
   - Ensure proper paths are configured

2. **Update libs/featured-components/project.json**
   - Verify build configuration

### Phase 5: Testing

1. **Build Verification**
   - Build `libs/ui-components` - should succeed without errors
   - Build `libs/featured-components` - should succeed without errors
   - Build `libs/shared-components` - should succeed without errors
   - Build `libs/features/editor/feature-editor` - should succeed without errors

2. **Runtime Testing**
   - Test component explorer - all sections should be visible and functional
   - Test editor - adding sections to canvas should work
   - Test section rendering - all sections should render correctly
   - Test variant switching - all variants should work
   - Test subtype switching - all subtypes should work

3. **Integration Testing**
   - Test in antoStudios app
   - Test in negocio app

## Detailed Migration Steps

### Step 1: Move newsletter-section

**Source:** `libs/ui-components/src/lib/newsletter-section/`
**Target:** `libs/featured-components/src/lib/newsletter-section/`

**Files to move:**
- `newsletter-section.component.ts`
- `newsletter-section.component.html`
- `newsletter-section.component.scss`
- `newsletter-minimal/` (entire directory)
- `newsletter-modern/` (entire directory)
- `newsletter-creative/` (entire directory)

**Imports to update:**
- Update `libs/featured-components/src/lib/newsletter-section/newsletter-section.component.ts`
  - Change: `import { UIInputComponent, UIButtonComponent } from '@negocio/ui-components';`
  - Keep: `import { UIInputComponent, UIButtonComponent } from '@negocio/ui-components';` (no change needed)

### Step 2: Move testimonials-section

**Source:** `libs/ui-components/src/lib/testimonials-section/`
**Target:** `libs/featured-components/src/lib/testimonials-section/`

**Files to move:**
- `testimonials-section.component.ts`
- `testimonials-section.component.html`
- `testimonials-section.component.scss`

### Step 3: Move stats-section

**Source:** `libs/ui-components/src/lib/stats-section/`
**Target:** `libs/featured-components/src/lib/stats-section/`

**Files to move:**
- All files in the directory

### Step 4: Move steps-section

**Source:** `libs/ui-components/src/lib/steps-section/`
**Target:** `libs/featured-components/src/lib/steps-section/`

**Files to move:**
- All files in the directory

### Step 5: Move service-section

**Source:** `libs/ui-components/src/lib/service-section/`
**Target:** `libs/featured-components/src/lib/service-section/`

**Files to move:**
- All files in the directory

### Step 6: Move gallery-section

**Source:** `libs/ui-components/src/lib/gallery-section/`
**Target:** `libs/featured-components/src/lib/gallery-section/`

**Files to move:**
- All files in the directory

### Step 7: Move features-section

**Source:** `libs/ui-components/src/lib/features-section/`
**Target:** `libs/featured-components/src/lib/features-section/`

**Files to move:**
- All files in the directory

### Step 8: Move faq-section

**Source:** `libs/ui-components/src/lib/faq-section/`
**Target:** `libs/featured-components/src/lib/faq-section/`

**Files to move:**
- All files in the directory

### Step 9: Move hero

**Source:** `libs/ui-components/src/lib/hero/`
**Target:** `libs/featured-components/src/lib/hero/`

**Files to move:**
- `hero.component.ts`
- `hero.component.html`
- `hero.component.scss`
- `hero.component.spec.ts`
- `hero.component.stories.ts`
- `hero-minimal/` (entire directory)
- `hero-split/` (entire directory)

## File Updates Required

### 1. libs/featured-components/src/index.ts

Add exports for all migrated components:

```typescript
export * from './lib/newsletter-section/newsletter-section.component';
export * from './lib/newsletter-section/newsletter-minimal/newsletter-minimal.component';
export * from './lib/newsletter-section/newsletter-modern/newsletter-modern.component';
export * from './lib/newsletter-section/newsletter-creative/newsletter-creative.component';
export * from './lib/testimonials-section/testimonials-section.component';
export * from './lib/stats-section/stats-section.component';
export * from './lib/steps-section/steps-section.component';
export * from './lib/service-section/service-section.component';
export * from './lib/gallery-section/gallery-section.component';
export * from './lib/features-section/features-section.component';
export * from './lib/faq-section/faq-section.component';
export * from './lib/hero/hero.component';
export * from './lib/hero/hero-minimal/hero-minimal.component';
export * from './lib/hero/hero-split/hero-split.component';
```

### 2. libs/ui-components/src/index.ts

Remove exports for migrated components:

```typescript
// REMOVE these exports:
// export * from './lib/newsletter-section/newsletter-section.component';
// export * from './lib/newsletter-section/newsletter-minimal/newsletter-minimal.component';
// export * from './lib/newsletter-section/newsletter-modern/newsletter-modern.component';
// export * from './lib/newsletter-section/newsletter-creative/newsletter-creative.component';
// export * from './lib/testimonials-section/testimonials-section.component';
// export * from './lib/stats-section/stats-section.component';
// export * from './lib/steps-section/steps-section.component';
// export * from './lib/service-section/service-section.component';
// export * from './lib/gallery-section/gallery-section.component';
// export * from './lib/features-section/features-section.component';
// export * from './lib/faq-section/faq-section.component';
// export * from './lib/hero/hero.component';
// export * from './lib/hero/hero-minimal/hero-minimal.component';
// export * from './lib/hero/hero-split/hero-split.component';
```

### 3. libs/shared-components/src/lib/shared-components/variant-selector/component-explorer.component.ts

Update imports:

```typescript
// CHANGE from:
import {
  UIHeroSectionComponent,
  // ... other UI components
  UINewsletterSectionComponent,
  UINewsletterMinimalComponent,
  UINewsletterModernComponent,
  UINewsletterCreativeComponent,
  UITestimonialsSectionComponent,
  UIStatsLibSectionComponent,
  UIStepsSectionComponent,
  UIPricingTableSectionComponent,
  UIContactSectionComponent,
  UIGallerySectionComponent,
  UIFeaturesSectionComponent,
  UIFaqSectionComponent,
  // ... other components
} from '@negocio/ui-components';

// TO:
import {
  // Keep atomic UI components only
  UIInputComponent,
  UIButtonComponent,
  UICardComponent,
  UITitleComponent,
  UIImageComponent,
  // ... other atomic components
} from '@negocio/ui-components';

import {
  // Section components from featured-components
  UIHeroSectionComponent,
  UINewsletterSectionComponent,
  UINewsletterMinimalComponent,
  UINewsletterModernComponent,
  UINewsletterCreativeComponent,
  UITestimonialsSectionComponent,
  UIStatsLibSectionComponent,
  UIStepsSectionComponent,
  UIGallerySectionComponent,
  UIFeaturesSectionComponent,
  UIFaqSectionComponent,
  // ... other section components
} from '@negocio/featured-components';
```

### 4. libs/features/editor/feature-editor/src/lib/components/editor-canvas/section-renderer.component.ts

Update imports for section components from `@negocio/ui-components` to `@negocio/featured-components`.

### 5. All Editor Section Components

Update imports in each editor section component directory:
- `libs/features/editor/feature-editor/src/lib/pages/editor/components/newsletter/`
- `libs/features/editor/feature-editor/src/lib/pages/editor/components/hero/`
- `libs/features/editor/feature-editor/src/lib/pages/editor/components/testimonials/`
- `libs/features/editor/feature-editor/src/lib/pages/editor/components/features/`
- `libs/features/editor/feature-editor/src/lib/pages/editor/components/gallery/`
- `libs/features/editor/feature-editor/src/lib/pages/editor/components/stats/`
- `libs/features/editor/feature-editor/src/lib/pages/editor/components/steps/`
- `libs/features/editor/feature-editor/src/lib/pages/editor/components/services/`
- `libs/features/editor/feature-editor/src/lib/pages/editor/components/faq/`

## Risk Assessment

### High Risk
- **Breaking changes**: Any external applications using these components will need to update imports
- **Circular dependencies**: Must ensure no circular dependencies between libraries

### Medium Risk
- **Build failures**: Multiple files need updates, risk of missing some
- **Runtime errors**: Template references may be missed

### Low Risk
- **Style issues**: SCSS imports may need adjustment
- **Test failures**: Unit tests may need path updates

## Rollback Plan

If migration fails:
1. Revert all file moves
2. Restore original index.ts files
3. Restore original imports in all consumer files
4. Rebuild all libraries

## Success Criteria

Migration is successful when:
1. All libraries build without errors
2. Component explorer displays all sections correctly
3. Editor can add sections to canvas
4. All sections render correctly with all variants
5. All subtypes work correctly
6. No runtime errors in browser console
7. Both antoStudios and negocio apps work correctly

## Timeline Estimate

- Phase 1 (Preparation): 30 minutes
- Phase 2 (Component Migration): 1 hour
- Phase 3 (Update Consumers): 2 hours
- Phase 4 (Library Configuration): 15 minutes
- Phase 5 (Testing): 1 hour

**Total Estimated Time: ~4.5 hours**

## Notes

- This migration should be done in a single session to avoid partial state
- Consider creating a feature branch for this migration
- Document any issues encountered during migration
- Update project documentation after successful migration
