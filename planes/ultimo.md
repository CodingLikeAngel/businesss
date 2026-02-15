Implementation Plan
less than a minute ago

Review

Proceed
Independent Per-Row Resize for Grid Layouts
Currently there is one .grid-container for all slots sharing a single grid-template-columns. Resizing any column in any row forces all other rows to follow. The fix is to render one grid container per row, each with its own independent column template.

Proposed Changes
Component Template & Methods
[MODIFY]
editor-layout-section.component.ts
Template (line 167–332): Replace the single .grid-container with a loop that renders one .grid-container per row:

diff
-<div class="grid-container" [style.grid-template-columns]="getGridTemplate()" [style.gap.px]="config.gap">

- <div *ngFor="let slot of config.slots; let i = index; ...">
  +<div *ngFor="let row of getRowGroups(); let ri = index"

*     class="grid-container"
*     [style.grid-template-columns]="getGridTemplateForRow(ri)"
*     [style.gap.px]="config.gap">
* <div *ngFor="let slotEntry of row; trackBy: trackBySlotIndex"
  Each slotEntry carries the global index so resize handlers keep working.

New methods:

getRowGroups() — returns Array<{slot, globalIndex}[]> partitioning config.slots into rows using the layout definition's column count
getGridTemplateForRow(rowIndex) — delegates to service per-row
Updated methods:

onSlotResizeStart(index)
— capture sizes only for slots in the active row
onSlotResized(index, event)
— persist only the active row's template
Resize Service
[MODIFY]
slot-resize.service.ts
getCustomGridTemplate(config, rowIndex?)
— add optional rowIndex param; if provided, look up only that row's override
buildDynamicGridTemplate()
— build using only the slots in the given row
buildGridTemplateOverride(layoutType, rowIndex, colCount)
— build fr string using only the row's slot indices
resizeSlot()
— remove the
getColumnSiblings
loop that syncs widths across rows. Each row is autonomous.
Interface
[MODIFY]
layout-section.interfaces.ts
diff
export interface LayoutSectionConfig {

- gridTemplateOverride?: string;

* gridTemplateOverride?: string; // kept for backward compat
* gridTemplateOverridePerRow?: Record<number, string>; // NEW: per-row overrides
  }
  The component will migrate the old gridTemplateOverride into gridTemplateOverridePerRow[0] on load for backward compatibility.

Layout column count helper
We need to derive "columns per row" from the layout type. This is already implicit in LAYOUT_DEFINITIONS.gridTemplate but we need an explicit number. We'll add a helper:

ts
function getColumnCount(type: LayoutType): number {
// single/hero-banner → 1, two-columns/sidebar → 2, three-columns/grid-3x → 3, grid-2x2 → 2
}
Verification Plan
Manual Browser Test
Run npx nx serve feature-editor (or the app's dev server)
Navigate to localhost:4200/desktop/home
Select a Grid 2x2 layout
Row 1: Drag the east resize handle of the top-left slot — verify the top-right slot compensates and the bottom row does NOT change
Row 2: Drag the east handle of the bottom-left slot independently — verify it works independently from row 1
Reload the page — verify both rows' proportions persist correctly
Test with Grid 3x2 and Grid 3x3 layouts for the same independent behavior
