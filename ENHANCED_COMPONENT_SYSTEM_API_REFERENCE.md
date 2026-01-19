# Enhanced Component System API Reference

## Table of Contents

1. [EnhancedBaseEditorSectionComponent](#enhancedbaseeditorsectioncomponent)
2. [HistoryService](#historyservice)
3. [Command Classes](#command-classes)
4. [KeyboardService](#keyboardservice)
5. [UndoRedoToolbarComponent](#undoredotoolbarcomponent)
6. [ElementGroupService (From Implementation Summary)](#elementgroupservice)
7. [StyleValidationService (From Implementation Summary)](#stylevalidationservice)
8. [StylePresetService (From Implementation Summary)](#stylepresetservice)
9. [ApplyDynamicStylesDirective (Enhanced)](#applydynamicstylesdirective)
10. [Store Actions and State](#store-actions-and-state)

## EnhancedBaseEditorSectionComponent

Base component providing unified visual editing capabilities.

### Properties

```typescript
protected platformInfo: PlatformInfo
protected visualEditingEnabled: boolean
protected activeVisualElements: Map<string, EnhancedVisualEditableDirective>
```

### Methods

#### Visual Editing Setup

```typescript
applyVisualEditing(
  elementRef: ElementRef<HTMLElement>,
  config: Partial<VisualEditingConfig>,
  elementId: string
): void
```

Applies visual editing to an element with specified configuration.

**Parameters:**
- `elementRef`: Reference to the HTML element
- `config`: Partial visual editing configuration
- `elementId`: Unique identifier for the element

---

```typescript
removeVisualEditing(elementId: string): void
```

Removes visual editing from an element.

**Parameters:**
- `elementId`: Unique identifier for the element

---

```typescript
updateVisualConfig(
  elementId: string,
  updates: Partial<VisualEditingConfig>
): void
```

Updates visual editing configuration for an element.

**Parameters:**
- `elementId`: Unique identifier for the element
- `updates`: Configuration updates to apply

#### Platform Detection

```typescript
getPlatformInfo(): PlatformInfo
```

Returns current platform information.

**Returns:** `PlatformInfo` object with platform details

---

```typescript
supportsVisualEditing(): boolean
```

Checks if current platform supports visual editing.

**Returns:** `boolean` indicating support

#### Event Handling

```typescript
protected handleVisualEvent(event: VisualEditingEvent, elementId: string): void
```

Handles visual editing events with standardized processing.

**Parameters:**
- `event`: The visual editing event
- `elementId`: Unique identifier for the element

---

```typescript
protected onVisualEvent(event: VisualEditingEvent, elementId: string): void
```

Component-specific visual event handler (to be overridden by subclasses).

**Parameters:**
- `event`: The visual editing event
- `elementId`: Unique identifier for the element

#### Command Tracking

```typescript
protected trackOperation(event: VisualEditingEvent, elementId: string): void
```

Tracks operations for undo/redo functionality.

**Parameters:**
- `event`: The visual editing event
- `elementId`: Unique identifier for the element

---

```typescript
protected storeElementState(elementId: string): void
```

Stores the current state of an element for operation tracking.

**Parameters:**
- `elementId`: Unique identifier for the element

---

```typescript
protected trackSectionResize(oldBounds: any, newBounds: any): void
```

Tracks section resize operations.

**Parameters:**
- `oldBounds`: Previous bounds
- `newBounds`: New bounds

---

```typescript
protected trackStyleChange(
  targetType: 'element' | 'section',
  targetId: string,
  oldStyles: any,
  newStyles: any
): void
```

Tracks style changes.

**Parameters:**
- `targetType`: Type of target ('element' or 'section')
- `targetId`: Unique identifier for the target
- `oldStyles`: Previous styles
- `newStyles`: New styles

## HistoryService

Service managing undo/redo operations and command history.

### Properties

```typescript
readonly MAX_HISTORY_SIZE: number = 50
historyState$: Observable<HistoryState>
```

### Methods

#### Command Execution

```typescript
execute(command: Command): void
```

Executes a command and adds it to history.

**Parameters:**
- `command`: The command to execute

---

```typescript
undo(): void
```

Undoes the last command if available.

---

```typescript
redo(): void
```

Redoes the next command if available.

#### State Queries

```typescript
get historyState(): Observable<HistoryState>
```

Returns observable of history state.

**Returns:** Observable emitting history state changes

---

```typescript
get currentState(): HistoryState
```

Returns current history state.

**Returns:** Current `HistoryState` object

---

```typescript
get canUndo(): boolean
```

Checks if undo is available.

**Returns:** `boolean` indicating if undo is possible

---

```typescript
get canRedo(): boolean
```

Checks if redo is available.

**Returns:** `boolean` indicating if redo is possible

#### History Management

```typescript
clear(): void
```

Clears all history.

---

```typescript
getLastCommand(): Command | null
```

Gets the last executed command.

**Returns:** Last command or `null`

---

```typescript
getPastCommands(): Command[]
```

Gets all past commands.

**Returns:** Array of past commands

---

```typescript
getFutureCommands(): Command[]
```

Gets all future commands (available for redo).

**Returns:** Array of future commands

---

```typescript
getCommandById(id: string): Command | null
```

Gets command by ID from history.

**Parameters:**
- `id`: Command ID

**Returns:** Command or `null`

---

```typescript
undoToCommand(commandId: string): boolean
```

Undoes to specific command by ID.

**Parameters:**
- `commandId`: Target command ID

**Returns:** `boolean` indicating success

---

```typescript
redoToCommand(commandId: string): boolean
```

Redoes to specific command by ID.

**Parameters:**
- `commandId`: Target command ID

**Returns:** `boolean` indicating success

#### Statistics and Utilities

```typescript
getStats(): object
```

Gets history statistics.

**Returns:** Object with history statistics

---

```typescript
estimateMemoryUsage(): number
```

Estimates memory usage of history.

**Returns:** Estimated memory usage in bytes

---

```typescript
compressHistory(): void
```

Compresses history by merging similar commands.

---

```typescript
setMaxHistorySize(size: number): void
```

Sets maximum history size.

**Parameters:**
- `size`: Maximum number of commands

---

```typescript
exportHistory(): any
```

Exports history for debugging or persistence.

**Returns:** History data object

## Command Classes

### BaseCommand

Abstract base class for all commands.

#### Properties

```typescript
id: string
type: string
timestamp: Date
description: string
```

#### Abstract Methods

```typescript
abstract execute(): void
abstract undo(): void
abstract redo(): void
```

### MoveElementCommand

Command for element movement operations.

#### Constructor

```typescript
constructor(
  sectionId: string,
  elementId: string,
  oldPosition: { x: number; y: number },
  newPosition: { x: number; y: number },
  store: any
)
```

### ResizeElementCommand

Command for element resize operations.

#### Constructor

```typescript
constructor(
  sectionId: string,
  elementId: string,
  oldSize: { width: number; height: number },
  newSize: { width: number; height: number },
  store: any
)
```

### StyleChangeCommand

Command for style change operations.

#### Constructor

```typescript
constructor(
  targetType: 'element' | 'section',
  targetId: string,
  sectionId: string | null,
  oldStyles: any,
  newStyles: any,
  store: any
)
```

### ResizeSectionCommand

Command for section resize operations.

#### Constructor

```typescript
constructor(
  sectionId: string,
  oldSize: { width: number; height: number },
  newSize: { width: number; height: number },
  store: any
)
```

### CompositeCommand

Command for batch operations.

#### Constructor

```typescript
constructor(commands: Command[], description?: string)
```

#### Methods

```typescript
addCommand(command: Command): void
getCommands(): Command[]
```

## KeyboardService

Service managing keyboard shortcuts for the editor.

### Properties

```typescript
shortcuts: KeyboardShortcut[]
isEnabled: boolean
```

### Methods

#### Lifecycle

```typescript
enable(): void
```

Enables keyboard shortcuts.

---

```typescript
disable(): void
```

Disables keyboard shortcuts.

---

```typescript
isShortcutsEnabled(): boolean
```

Checks if shortcuts are enabled.

**Returns:** `boolean` indicating if shortcuts are enabled

#### Shortcut Management

```typescript
addShortcut(shortcut: KeyboardShortcut): void
```

Adds a custom keyboard shortcut.

**Parameters:**
- `shortcut`: Shortcut configuration

---

```typescript
removeShortcut(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean): void
```

Removes a keyboard shortcut.

**Parameters:**
- `key`: Key to remove
- `ctrl`: Ctrl modifier
- `shift`: Shift modifier
- `alt`: Alt modifier

---

```typescript
getShortcuts(): KeyboardShortcut[]
```

Gets all registered shortcuts.

**Returns:** Array of shortcuts

---

```typescript
getShortcutDisplay(shortcut: KeyboardShortcut): string
```

Gets display string for shortcut.

**Parameters:**
- `shortcut`: Shortcut to display

**Returns:** Formatted shortcut string (e.g., "Ctrl+Z")

---

```typescript
getShortcutsByCategory(): { [category: string]: KeyboardShortcut[] }
```

Gets shortcuts organized by category.

**Returns:** Object with shortcuts grouped by category

## UndoRedoToolbarComponent

UI component providing undo/redo controls.

### Properties

```typescript
canUndo: boolean
canRedo: boolean
historyStats: { totalCommands: number; memoryUsage: number }
showHistoryInfo: boolean
```

### Methods

```typescript
undo(): void
```

Executes undo operation.

---

```typescript
redo(): void
```

Executes redo operation.

## ElementGroupService (From Implementation Summary)

Service managing element groups and group operations.

### Key Methods

```typescript
createGroup(config: GroupConfig): Observable<ElementGroup>
```

Creates a new element group.

---

```typescript
deleteGroup(groupId: string): Observable<boolean>
```

Deletes an element group.

---

```typescript
addElementsToGroup(groupId: string, elementIds: string[]): Observable<ElementGroup>
```

Adds elements to a group.

---

```typescript
removeElementsFromGroup(groupId: string, elementIds: string[]): Observable<ElementGroup>
```

Removes elements from a group.

---

```typescript
moveGroup(groupId: string, position: Position): Observable<ElementGroup>
```

Moves an entire group.

---

```typescript
resizeGroup(groupId: string, bounds: GroupBounds): Observable<ElementGroup>
```

Resizes an entire group.

---

```typescript
checkGroupCollisions(group: ElementGroup, allGroups: ElementGroup[]): CollisionResult[]
```

Checks for collisions between groups.

## StyleValidationService (From Implementation Summary)

Service providing style validation and auto-correction.

### Key Methods

```typescript
validateStyles(styles: any): Observable<ValidationReport>
```

Validates a complete style object.

---

```typescript
validateProperty(property: string, value: any): ValidationResult
```

Validates a single property.

---

```typescript
applyAutoCorrections(styles: any, report: ValidationReport): any
```

Applies automatic corrections to styles.

---

```typescript
getCorrectionSuggestions(invalidValue: any, property: string): CorrectionSuggestion[]
```

Gets suggestions for fixing invalid values.

## StylePresetService (From Implementation Summary)

Service managing reusable style presets.

### Key Methods

```typescript
createPreset(presetData: PresetInput): Observable<StylePreset>
```

Creates a new style preset.

---

```typescript
updatePreset(id: string, updates: Partial<Preset>): Observable<Preset | null>
```

Updates an existing preset.

---

```typescript
deletePreset(id: string): Observable<boolean>
```

Deletes a preset.

---

```typescript
applyPreset(presetId: string, targetStyles: any): Observable<any>
```

Applies a preset to existing styles.

---

```typescript
searchPresets(query: PresetSearchQuery): Observable<StylePreset[]>
```

Searches for presets by criteria.

---

```typescript
getPresetsByCategory(category: string): Observable<StylePreset[]>
```

Gets presets by category.

## ApplyDynamicStylesDirective (Enhanced)

Enhanced directive for applying dynamic styles with validation.

### Inputs

```typescript
@Input() applyDynamicStyles: any
@Input() enableValidation: boolean = true
@Input() autoCorrect: boolean = false
@Input() validationService?: StyleValidationService
```

### Outputs

```typescript
@Output() validationReport = new EventEmitter<ValidationReport>()
@Output() styleError = new EventEmitter<ValidationError>()
```

### Methods

```typescript
setValidationService(service: StyleValidationService): void
```

Sets the validation service instance.

## Store Actions and State

### UI Actions

```typescript
executeCommand(command: Command)
undo()
redo()
clearHistory()
executeShortcut(shortcut: string)
```

### History State

```typescript
interface HistoryState {
  past: Command[]
  present: Command | null
  future: Command[]
  canUndo: boolean
  canRedo: boolean
}
```

### UI State Selectors

```typescript
selectUIState: MemoizedSelector<AppState, UIState>
selectSelectedElementId: MemoizedSelector<AppState, string | null>
selectCanUndo: MemoizedSelector<AppState, boolean>
selectCanRedo: MemoizedSelector<AppState, boolean>
// ... additional selectors
```

## Type Definitions

### VisualEditingConfig

```typescript
interface VisualEditingConfig {
  type: 'element' | 'section' | 'container'
  enableDrag?: boolean
  enableResize?: boolean
  minSize?: { width: number; height: number }
  maxSize?: { width: number; height: number }
  snapToGrid?: boolean
  gridSize?: number
  mobileSupport?: boolean
  interactions?: {
    touchEnabled: boolean
    multiTouchEnabled: boolean
  }
}
```

### PlatformInfo

```typescript
interface PlatformInfo {
  isMobile: boolean
  isTouch: boolean
  screenSize: 'small' | 'medium' | 'large'
  orientation: 'portrait' | 'landscape'
  pixelRatio: number
}
```

### KeyboardShortcut

```typescript
interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: string
  description: string
  preventDefault?: boolean
}
```

### ValidationReport

```typescript
interface ValidationReport {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  suggestions: CorrectionSuggestion[]
  summary: {
    totalProperties: number
    validProperties: number
    invalidProperties: number
    correctedProperties: number
  }
}
```

### StylePreset

```typescript
interface StylePreset {
  id: string
  name: string
  category: string
  styles: any
  tags: string[]
  createdAt: Date
  updatedAt: Date
  usageCount: number
}
```

This API reference provides comprehensive documentation for all services, components, and utilities in the Enhanced Component System.