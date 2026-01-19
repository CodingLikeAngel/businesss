# Enhanced Component System Usage Guide

## Overview

The Enhanced Component System provides a comprehensive set of features for advanced visual editing, including element grouping, style validation, undo/redo functionality, and a unified visual editing framework. This guide covers how to use each feature effectively.

## Table of Contents

1. [Enhanced Visual Editing Framework](#enhanced-visual-editing-framework)
2. [Element Grouping System](#element-grouping-system)
3. [Style Validation and Presets](#style-validation-and-presets)
4. [Undo/Redo System](#undo-redo-system)
5. [Style Inheritance (Design Phase)](#style-inheritance-design-phase)

## Enhanced Visual Editing Framework

### Overview

The Enhanced Visual Editing Framework provides unified visual editing capabilities across all editor components, with standardized configurations and platform-aware behavior.

### Key Components

#### EnhancedBaseEditorSectionComponent

The base component that provides visual editing functionality to all editor sections.

**Features:**
- Unified visual editing methods
- Platform detection (mobile, touch, screen size)
- Command tracking for undo/redo
- Standardized event handling

### Usage

#### Basic Setup

```typescript
import { EnhancedBaseEditorSectionComponent } from './enhanced-base-editor-section.component';

export class MyEditorSectionComponent extends EnhancedBaseEditorSectionComponent {
  ngOnInit() {
    super.ngOnInit();
    this.initializeVisualEditing();
  }

  private initializeVisualEditing() {
    // Apply visual editing to elements
    this.applyElementVisualEditing(this.elementRef, 'element-1');
    this.applySectionVisualEditing(this.sectionRef, 'section-1');
  }
}
```

#### Applying Visual Editing

```typescript
// Apply to individual elements
this.applyElementVisualEditing(elementRef, 'element-id', {
  enableDrag: true,
  enableResize: true,
  minSize: { width: 50, height: 50 }
});

// Apply to sections
this.applySectionVisualEditing(sectionRef, 'section-id', {
  enableResize: true,
  enableDrag: false
});

// Apply to containers
this.applyContainerVisualEditing(containerRef, 'container-id');
```

#### Handling Visual Events

```typescript
protected onVisualEvent(event: VisualEditingEvent, elementId: string): void {
  switch (event.type) {
    case 'moved':
      console.log(`Element ${elementId} moved to:`, event.bounds);
      break;
    case 'resized':
      console.log(`Element ${elementId} resized to:`, event.bounds);
      break;
    case 'selected':
      this.storeElementState(elementId);
      break;
  }
}
```

### Configuration Options

```typescript
interface VisualEditingConfig {
  type: 'element' | 'section' | 'container';
  enableDrag?: boolean;
  enableResize?: boolean;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  snapToGrid?: boolean;
  gridSize?: number;
  mobileSupport?: boolean;
  interactions?: {
    touchEnabled: boolean;
    multiTouchEnabled: boolean;
  };
}
```

### Platform Detection

The framework automatically detects platform capabilities:

```typescript
const platformInfo = this.getPlatformInfo();
// Returns: { isMobile: boolean, isTouch: boolean, screenSize: string, ... }

if (this.supportsVisualEditing()) {
  // Enable visual editing features
}
```

## Element Grouping System

### Overview

The Element Grouping System allows users to create, manage, and manipulate groups of elements as single units, providing advanced layout capabilities.

### Key Features

- **Group Creation**: Create groups from selected elements
- **Unified Operations**: Move, resize, and transform entire groups
- **Collision Detection**: Prevent overlapping between groups and elements
- **Visual Feedback**: Distinctive styling for group selection and manipulation

### Usage

#### Creating Groups

```typescript
import { ElementGroupService } from './services/element-group.service';

constructor(private groupService: ElementGroupService) {}

createGroupFromSelection(elementIds: string[]) {
  const group = this.groupService.createGroup({
    name: 'My Group',
    elementIds: elementIds,
    config: {
      type: 'standard',
      allowResize: true,
      allowDrag: true
    }
  });
}
```

#### Group Operations

```typescript
// Move entire group
this.groupService.moveGroup(groupId, { x: 100, y: 200 });

// Resize group proportionally
this.groupService.resizeGroup(groupId, {
  width: 400,
  height: 300,
  maintainAspectRatio: true
});

// Add elements to group
this.groupService.addElementsToGroup(groupId, ['element-1', 'element-2']);

// Remove elements from group
this.groupService.removeElementsFromGroup(groupId, ['element-1']);
```

#### Collision Detection

```typescript
// Check for collisions before moving
const collisions = this.groupService.checkGroupCollisions(groupId, targetPosition);

if (collisions.length > 0) {
  // Handle collisions - show warnings or auto-resolve
  this.handleCollisions(collisions);
}
```

### Group Configuration

```typescript
interface GroupConfig {
  type: 'standard' | 'layout' | 'fixed';
  allowResize: boolean;
  allowDrag: boolean;
  maintainAspectRatio: boolean;
  snapToGrid: boolean;
  gridSize: number;
  collisionDetection: boolean;
}
```

### Visual Feedback

Groups are displayed with:
- Purple-themed selection overlays
- Resize handles for manipulation
- Group labels and dimension indicators
- Pulse animations for active selection

### Keyboard Shortcuts

- `Ctrl+G`: Group selected elements
- `Ctrl+Shift+G`: Ungroup selected elements

## Style Validation and Presets

### Overview

The Style Validation and Preset System ensures style consistency, provides validation feedback, and manages reusable style combinations.

### Key Features

- **Real-time Validation**: Validates styles as they're applied
- **Auto-Correction**: Intelligent suggestions for fixing invalid values
- **Preset Management**: Save and reuse style combinations
- **Comprehensive Coverage**: Supports all major CSS properties

### Usage

#### Style Validation

```typescript
import { StyleValidationService } from './services/style-validation.service';

constructor(private validationService: StyleValidationService) {}

validateStyles(styles: any) {
  const report = this.validationService.validateStyles(styles);

  if (!report.isValid) {
    console.log('Validation errors:', report.errors);
    console.log('Suggestions:', report.suggestions);
  }

  return report;
}
```

#### Auto-Correction

```typescript
// Apply auto-corrections to styles
const correctedStyles = this.validationService.applyAutoCorrections(styles, report);

// Or get suggestions for manual correction
const suggestions = this.validationService.getCorrectionSuggestions(invalidValue, property);
```

#### Using Presets

```typescript
import { StylePresetService } from './services/style-preset.service';

constructor(private presetService: StylePresetService) {}

// Create a new preset
const preset = await this.presetService.createPreset({
  name: 'Primary Button',
  category: 'button',
  styles: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '4px'
  },
  tags: ['primary', 'button']
});

// Apply preset to element
const appliedStyles = await this.presetService.applyPreset(preset.id, existingStyles);

// Search presets
const buttonPresets = await this.presetService.searchPresets({
  category: 'button',
  tags: ['primary']
});
```

### Validation Rules

The system validates:

| Property Type | Validation Rules | Examples |
|---------------|------------------|----------|
| Colors | Hex, RGB, HSL, named colors | `#ff0000`, `rgb(255,0,0)`, `red` |
| Lengths | px, em, rem, vh, vw, % | `16px`, `1.5em`, `100%` |
| Ranges | 0-1 (opacity), integers (z-index) | `0.5`, `10` |
| Font Weights | 100-900, named weights | `400`, `bold` |
| Box Shadows | CSS box-shadow syntax | `0 2px 4px rgba(0,0,0,0.1)` |

### Integration with Components

#### In Templates

```html
<div applyDynamicStyles
     [applyDynamicStyles]="componentStyles"
     [enableValidation]="true"
     [autoCorrect]="false"
     (validationReport)="onValidationReport($event)"
     (styleError)="onStyleError($event)">
</div>
```

#### In Components

```typescript
export class MyComponent {
  @ViewChild(ApplyDynamicStylesDirective)
  stylesDirective!: ApplyDynamicStylesDirective;

  ngAfterViewInit() {
    // Inject validation service
    this.stylesDirective.setValidationService(this.validationService);
  }

  onValidationReport(report: ValidationReport) {
    if (!report.isValid) {
      this.showValidationErrors(report.errors);
    }
  }
}
```

## Undo/Redo System

### Overview

The Undo/Redo System provides comprehensive history management with command pattern implementation, keyboard shortcuts, and visual feedback.

### Key Features

- **Command Pattern**: Extensible command system for all operations
- **History Management**: Configurable history size with memory monitoring
- **Keyboard Shortcuts**: Standard Ctrl+Z/Ctrl+Y shortcuts
- **Visual Toolbar**: UI component for undo/redo actions
- **Composite Commands**: Batch operations support

### Usage

#### Basic Operations

```typescript
import { HistoryService } from './services/history.service';

constructor(private historyService: HistoryService) {}

// Execute commands
this.historyService.execute(command);

// Undo/redo operations
this.historyService.undo();
this.historyService.redo();

// Check availability
if (this.historyService.canUndo) {
  // Enable undo button
}

if (this.historyService.canRedo) {
  // Enable redo button
}
```

#### Creating Commands

```typescript
import { BaseCommand } from './commands';

// Element move command
export class MoveElementCommand extends BaseCommand {
  constructor(
    private sectionId: string,
    private elementId: string,
    private oldPosition: { x: number; y: number },
    private newPosition: { x: number; y: number },
    private store: Store
  ) {
    super('move-element', `Move element ${elementId}`);
  }

  execute(): void {
    // Command executed - state already updated
  }

  undo(): void {
    this.store.dispatch(updateElement({
      sectionId: this.sectionId,
      elementId: this.elementId,
      changes: { position: this.oldPosition }
    }));
  }

  redo(): void {
    this.store.dispatch(updateElement({
      sectionId: this.sectionId,
      elementId: this.elementId,
      changes: { position: this.newPosition }
    }));
  }
}
```

#### Composite Commands

```typescript
// Batch multiple operations
const compositeCommand = new CompositeCommand([
  new MoveElementCommand(...),
  new ResizeElementCommand(...),
  new StyleChangeCommand(...)
], 'Batch element operations');

this.historyService.execute(compositeCommand);
```

### Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Z` | Undo | Undo last action |
| `Ctrl+Y` | Redo | Redo last undone action |
| `Ctrl+Shift+Z` | Redo | Alternative redo shortcut |

### History Management

```typescript
// Get history statistics
const stats = this.historyService.getStats();
// Returns: { totalCommands, pastCount, futureCount, canUndo, canRedo, memoryUsage }

// Clear history
this.historyService.clear();

// Export history for debugging
const historyData = this.historyService.exportHistory();
```

### Visual Toolbar

```html
<lib-undo-redo-toolbar></lib-undo-redo-toolbar>
```

The toolbar automatically:
- Shows enabled/disabled states
- Displays history statistics (when enabled)
- Handles keyboard shortcuts
- Provides responsive design

## Style Inheritance (Design Phase)

### Overview

**Note**: Style inheritance is currently in the design phase and not yet implemented. This section describes the planned architecture.

The Style Inheritance Service will provide cascading styles from Page → Section → Element with configurable rules and override management.

### Planned Features

- **Cascading Hierarchy**: Automatic style inheritance from parent components
- **Configurable Rules**: Property-specific inheritance with conditions
- **Override Management**: CSS-like specificity system
- **Performance Optimization**: Caching and incremental updates

### Planned API

```typescript
// Compute cascaded styles
const cascadedStyles = await inheritanceService.computeCascadedStyles(element, section, page);

// Add inheritance rules
await inheritanceService.addInheritanceRule({
  property: 'color',
  inheritFrom: 'page',
  conditions: [{ type: 'media', value: 'desktop' }]
});

// Get inherited value
const inheritedColor = await inheritanceService.getInheritedValue('color', element, section, page);
```

### Migration Path

When implemented, existing components will need to integrate with the inheritance service:

```typescript
// In component initialization
this.cascadedStyles$ = this.inheritanceService.computeCascadedStyles(
  this.element,
  this.section,
  this.page
);
```

## Best Practices

### Performance Optimization

1. **Enable validation selectively**: Only enable style validation when needed
2. **Use presets for consistency**: Leverage presets to reduce validation overhead
3. **Limit history size**: Configure appropriate history limits for your use case
4. **Batch group operations**: Use composite commands for multiple related changes

### Error Handling

```typescript
// Handle validation errors gracefully
try {
  const validatedStyles = await this.validationService.validateAndCorrect(styles);
  this.applyStyles(validatedStyles);
} catch (error) {
  console.error('Style validation failed:', error);
  this.showUserFriendlyError(error);
}
```

### User Experience

1. **Provide feedback**: Show validation errors and suggestions to users
2. **Progressive enhancement**: Enable advanced features based on user preferences
3. **Keyboard accessibility**: Ensure all shortcuts work and are customizable
4. **Responsive design**: Adapt features for different screen sizes and input methods

## Troubleshooting

### Common Issues

#### Visual editing not working
- Check platform detection: `this.getPlatformInfo()`
- Verify visual editing is enabled: `this.visualEditingEnabled`
- Ensure proper element references are passed

#### Group operations failing
- Check element IDs are valid
- Verify group configuration
- Check for collision constraints

#### Style validation errors
- Review supported property types
- Check value formats match CSS specifications
- Enable auto-correction for automatic fixes

#### Undo/redo not working
- Verify commands implement required interface
- Check history state: `this.historyService.getStats()`
- Ensure store integration is correct

## Integration Examples

### Complete Component Integration

```typescript
import {
  EnhancedBaseEditorSectionComponent,
  ElementGroupService,
  StyleValidationService,
  HistoryService
} from '@features/editor';

export class AdvancedEditorComponent extends EnhancedBaseEditorSectionComponent {
  constructor(
    private groupService: ElementGroupService,
    private validationService: StyleValidationService,
    private historyService: HistoryService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.setupEnhancedFeatures();
  }

  private setupEnhancedFeatures() {
    // Initialize visual editing
    this.initializeVisualEditing();

    // Setup group management
    this.initializeGrouping();

    // Configure validation
    this.initializeValidation();
  }

  private initializeGrouping() {
    // Listen for group events
    this.groupService.groupEvents$.subscribe(event => {
      this.handleGroupEvent(event);
    });
  }

  private initializeValidation() {
    // Setup validation for style changes
    this.validationService.setConfig({
      autoCorrect: true,
      strictMode: false
    });
  }
}
```

This comprehensive system provides powerful tools for advanced visual editing while maintaining ease of use and performance.