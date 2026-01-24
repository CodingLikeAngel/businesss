---
description: Add robust accordion editing features to the visual editor
---

## Overview

This workflow outlines the steps required to make the accordion component fully editable, configurable, and robust within the editor. It covers:

1. Extending the editor accordion section to support item editing.
2. Adding UI controls for adding/removing accordion items.
3. Ensuring styles are isolated and do not leak to child components.
4. Registering the accordion component in the Component Explorer.
5. Updating the visual editing configuration for the accordion element.
6. Adding unit tests for the new functionality.

## Steps

1. **Extend `EditorAccordionSectionComponent`**

   - Add an `@Input() items: { title: string; content: string }[]` property.
   - Implement methods `addItem()`, `removeItem(index: number)`, `updateItem(index: number, changes: Partial<{title:string; content:string}>)`.
   - Emit a new `@Output() itemsChanged = new EventEmitter<any[]>()` whenever items are modified.
   - Update the template to include edit controls (buttons, inputs) that call these methods.
   - // turbo
   - Run `npm run lint` to ensure no lint errors.

2. **Update Visual Editing Config**

   - In `getAccordionConfig()`, add `customProperties: ['items']` to allow the visual editor to recognize item changes.
   - Ensure `applyElementVisualEditing` is called for each accordion item container if needed.
   - // turbo
   - Run `npm run test` to verify existing tests still pass.

3. **Add UI Controls to Template** (`editor-accordion-section.component.html`)

   - Insert a control panel above the accordion with:
     - "Add Item" button → calls `addItem()`.
     - For each item, show edit fields for title and content with two‑way binding.
     - "Remove" button per item.
   - Use `ngModel` for simplicity (ensure `FormsModule` is imported).
   - // turbo
   - Run `npm run build` to ensure the component compiles.

4. **Register Accordion in Component Explorer**

   - Verify `component-explorer.component.ts` already includes `UIAccordionComponent` in the imports and switch case.
   - If missing, add it to the imports array and the `*ngSwitchCase='accordion'` block.
   - // turbo
   - Run `npm run dev` and manually check the explorer UI.

5. **Prevent Style Inheritance**

   - In `getSectionStyles()` (already present), ensure removal of `color` and `--theme-color`.
   - Add a utility function `filterAccordionStyles(styles)` that also removes any `background` that could affect child items.
   - Apply this filter when passing `customStyles` to `UIAccordionComponent`.
   - // turbo
   - Run `npm run lint` again.

6. **Update Variant Service (if needed)**

   - Ensure `variantService.updateSectionInCurrentPage` can handle the new `accordionItems` field.
   - If not, extend the `PageSection` interface in `enhanced-visual-editing.interfaces.ts` to include `items?: any[]`.
   - // turbo
   - Run unit tests for `variant.service`.

7. **Add Unit Tests**

   - Create `editor-accordion-section.component.spec.ts` covering:
     - Adding an item updates the `items` array and emits `itemsChanged`.
     - Removing an item works correctly.
     - Updating an item triggers the correct visual editing events.
   - Use Angular TestBed with `FormsModule`.
   - // turbo
   - Run `npm run test` and ensure coverage > 80% for this component.

8. **Documentation**

   - Update `README.md` in `libs/features/editor/feature-editor` with a section "Accordion Editing" describing the new capabilities and usage examples.
   - Add comments in the component code explaining each method.

9. **Final Verification**
   - Run the full application (`npm run dev`).
   - Open the editor, add an accordion section via the explorer, edit items, resize, and move the accordion.
   - Verify that changes persist in the store and are reflected in the preview.
   - Ensure no console errors.

## Completion

Once all steps are completed and the application runs without errors, commit the changes with a descriptive commit message:

```
feat(editor): robust accordion editing with item management and isolated styling
```
