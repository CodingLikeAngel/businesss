# Enhanced Component System Migration Guide

## Overview

This guide provides step-by-step instructions for migrating existing editor components to use the Enhanced Component System features including visual editing, undo/redo, element grouping, and style validation.

## Table of Contents

1. [Migration Prerequisites](#migration-prerequisites)
2. [Base Component Migration](#base-component-migration)
3. [Visual Editing Integration](#visual-editing-integration)
4. [Undo/Redo System Integration](#undo-redo-system-integration)
5. [Element Grouping Integration](#element-grouping-integration)
6. [Style Validation Integration](#style-validation-integration)
7. [Testing Migration](#testing-migration)
8. [Troubleshooting](#troubleshooting)

## Migration Prerequisites

### Dependencies

Ensure the following packages are installed:

```json
{
  "dependencies": {
    "@ngrx/store": "^15.0.0",
    "@ngrx/effects": "^15.0.0",
    "rxjs": "^7.5.0"
  }
}
```

### Required Imports

```typescript
import { EnhancedBaseEditorSectionComponent } from '@features/editor';
import { HistoryService } from '@features/editor';
import { ElementGroupService } from '@features/editor';
import { StyleValidationService } from '@features/editor';
import { StylePresetService } from '@features/editor';
```

## Base Component Migration

### Step 1: Extend EnhancedBaseEditorSectionComponent

**Before:**
```typescript
import { BaseEditorSectionComponent } from './base-editor-section.component';

export class MyEditorSectionComponent extends BaseEditorSectionComponent {
  // Component logic
}
```

**After:**
```typescript
import { EnhancedBaseEditorSectionComponent } from '@features/editor';

export class MyEditorSectionComponent extends EnhancedBaseEditorSectionComponent {
  // Enhanced component logic
}
```

### Step 2: Update Constructor and Dependencies

**Before:**
```typescript
export class MyEditorSectionComponent extends BaseEditorSectionComponent {
  constructor() {
    super();
  }
}
```

**After:**
```typescript
export class MyEditorSectionComponent extends EnhancedBaseEditorSectionComponent {
  constructor(
    private historyService: HistoryService,
    private groupService: ElementGroupService,
    private validationService: StyleValidationService
  ) {
    super();
  }
}
```

### Step 3: Initialize Enhanced Features

Add initialization in `ngOnInit`:

```typescript
ngOnInit() {
  super.ngOnInit(); // Important: Call super first
  this.initializeEnhancedFeatures();
}

private initializeEnhancedFeatures() {
  // Initialize visual editing
  this.initializeVisualEditing();

  // Setup enhanced event handling
  this.setupEnhancedEventHandling();

  // Configure services
  this.configureServices();
}
```

## Visual Editing Integration

### Step 1: Enable Visual Editing

```typescript
private initializeVisualEditing() {
  // Enable visual editing globally
  this.setVisualEditingEnabled(true);

  // Apply to section container
  this.applySectionVisualEditing(
    this.sectionElementRef,
    this.section.id,
    {
      enableResize: true,
      enableDrag: false // Sections typically don't move
    }
  );
}
```

### Step 2: Apply to Individual Elements

```typescript
private applyVisualEditingToElements() {
  this.section.elements.forEach(element => {
    const elementRef = this.getElementRef(element.id);

    this.applyElementVisualEditing(
      elementRef,
      element.id,
      {
        enableDrag: true,
        enableResize: true,
        minSize: { width: 50, height: 50 },
        snapToGrid: true,
        gridSize: 10
      }
    );
  });
}
```

### Step 3: Handle Visual Events

Override the event handler:

```typescript
protected onVisualEvent(event: VisualEditingEvent, elementId: string): void {
  // Call parent handler first
  super.onVisualEvent(event, elementId);

  // Add custom logic
  switch (event.type) {
    case 'moved':
      this.onElementMoved(event, elementId);
      break;
    case 'resized':
      this.onElementResized(event, elementId);
      break;
    case 'selected':
      this.onElementSelected(elementId);
      break;
  }
}

private onElementMoved(event: VisualEditingEvent, elementId: string) {
  // Update element position in your data model
  this.updateElementPosition(elementId, event.bounds);
}

private onElementResized(event: VisualEditingEvent, elementId: string) {
  // Update element size in your data model
  this.updateElementSize(elementId, event.bounds);
}
```

## Undo/Redo System Integration

### Step 1: Import Command Classes

```typescript
import {
  MoveElementCommand,
  ResizeElementCommand,
  StyleChangeCommand,
  CompositeCommand
} from '@features/editor';
```

### Step 2: Track Operations

The base component already tracks basic operations. For custom operations:

```typescript
private performCustomOperation() {
  // Create a composite command for complex operations
  const commands = [
    new MoveElementCommand(this.section.id, 'element1', oldPos1, newPos1, this.store),
    new MoveElementCommand(this.section.id, 'element2', oldPos2, newPos2, this.store),
    new StyleChangeCommand('section', this.section.id, null, oldStyles, newStyles, this.store)
  ];

  const compositeCommand = new CompositeCommand(commands, 'Complex layout change');
  this.historyService.execute(compositeCommand);
}
```

### Step 3: Add Undo/Redo Toolbar

In your template:

```html
<!-- Add to your component template -->
<lib-undo-redo-toolbar></lib-undo-redo-toolbar>
```

### Step 4: Handle Keyboard Shortcuts

The keyboard service is automatically enabled. Add custom shortcuts if needed:

```typescript
ngOnInit() {
  super.ngOnInit();

  // Add custom shortcuts
  this.keyboardService.addShortcut({
    key: 's',
    ctrl: true,
    action: 'save',
    description: 'Save current work',
    preventDefault: true
  });
}
```

## Element Grouping Integration

### Step 1: Import Group Service

```typescript
import { ElementGroupService } from '@features/editor';

constructor(
  // ... other services
  private groupService: ElementGroupService
) {}
```

### Step 2: Initialize Group Management

```typescript
private initializeGrouping() {
  // Listen for group events
  this.groupService.groupEvents$.subscribe(event => {
    this.handleGroupEvent(event);
  });

  // Load existing groups for this section
  this.loadExistingGroups();
}
```

### Step 3: Handle Group Operations

```typescript
private handleGroupEvent(event: GroupEvent) {
  switch (event.type) {
    case 'groupCreated':
      this.onGroupCreated(event.group);
      break;
    case 'groupDeleted':
      this.onGroupDeleted(event.groupId);
      break;
    case 'elementsAdded':
      this.onElementsAddedToGroup(event.groupId, event.elementIds);
      break;
  }
}

private createGroupFromSelection(elementIds: string[]) {
  this.groupService.createGroup({
    name: `Group ${Date.now()}`,
    elementIds: elementIds,
    config: {
      type: 'standard',
      allowResize: true,
      allowDrag: true
    }
  }).subscribe(group => {
    console.log('Group created:', group);
  });
}
```

### Step 4: Update Element Templates

Add group membership indicators to element templates:

```html
<div class="element"
     [class.group-member]="isElementInGroup(element.id)"
     [attr.data-group-id]="getElementGroupId(element.id)">
  <!-- Element content -->
</div>
```

## Style Validation Integration

### Step 1: Import Validation Service

```typescript
import { StyleValidationService, ApplyDynamicStylesDirective } from '@features/editor';

constructor(
  // ... other services
  private validationService: StyleValidationService
) {}
```

### Step 2: Configure Validation

```typescript
private configureValidation() {
  // Set validation preferences
  this.validationService.setConfig({
    autoCorrect: true,        // Auto-fix common issues
    strictMode: false,        // Allow some flexibility
    warnOnConflicts: true     // Show warnings for conflicts
  });
}
```

### Step 3: Update Style Application

In templates, use the enhanced directive:

```html
<div applyDynamicStyles
     [applyDynamicStyles]="element.styles"
     [enableValidation]="true"
     [autoCorrect]="false"
     (validationReport)="onValidationReport($event)"
     (styleError)="onStyleError($event)">
  <!-- Element content -->
</div>
```

### Step 4: Handle Validation Events

```typescript
onValidationReport(report: ValidationReport) {
  if (!report.isValid) {
    console.warn('Style validation issues:', report.errors);

    // Show user-friendly messages
    this.showValidationWarnings(report.warnings);
  }
}

onStyleError(error: ValidationError) {
  // Handle individual property errors
  this.showStyleError(error.property, error.message, error.suggestions);
}
```

### Step 5: Integrate with Presets

```typescript
private initializePresets() {
  // Load available presets
  this.presetService.getPresetsByCategory('button').subscribe(presets => {
    this.availableButtonPresets = presets;
  });
}

applyPresetToElement(elementId: string, presetId: string) {
  this.presetService.applyPreset(presetId, this.getElementStyles(elementId))
    .subscribe(mergedStyles => {
      this.updateElementStyles(elementId, mergedStyles);
    });
}
```

## Testing Migration

### Unit Tests

Update existing tests to work with enhanced components:

```typescript
describe('MyEditorSectionComponent', () => {
  let component: MyEditorSectionComponent;
  let historyService: jasmine.SpyObj<HistoryService>;
  let groupService: jasmine.SpyObj<ElementGroupService>;

  beforeEach(() => {
    // Create spies for services
    historyService = jasmine.createSpyObj('HistoryService', ['execute', 'undo', 'redo']);
    groupService = jasmine.createSpyObj('ElementGroupService', ['createGroup']);

    TestBed.configureTestingModule({
      declarations: [MyEditorSectionComponent],
      providers: [
        { provide: HistoryService, useValue: historyService },
        { provide: ElementGroupService, useValue: groupService }
      ]
    });

    fixture = TestBed.createComponent(MyEditorSectionComponent);
    component = fixture.componentInstance;
  });

  it('should initialize enhanced features', () => {
    spyOn(component as any, 'initializeEnhancedFeatures');

    component.ngOnInit();

    expect((component as any).initializeEnhancedFeatures).toHaveBeenCalled();
  });
});
```

### Integration Tests

Test feature interactions:

```typescript
describe('Enhanced Features Integration', () => {
  it('should track visual editing operations in history', () => {
    // Simulate visual editing event
    const event = { type: 'moved', bounds: { x: 100, y: 200 } };
    component.handleVisualEvent(event, 'element1');

    // Verify command was added to history
    expect(historyService.execute).toHaveBeenCalled();
  });

  it('should validate styles when applied', () => {
    const invalidStyles = { color: 'invalid-color', fontSize: '16px' };

    // Apply styles through directive
    // Verify validation service was called
    expect(validationService.validateStyles).toHaveBeenCalledWith(invalidStyles);
  });
});
```

### E2E Tests

Test complete user workflows:

```typescript
describe('Visual Editing Workflow', () => {
  it('should allow undo/redo of element movements', () => {
    // Navigate to editor
    cy.visit('/editor');

    // Select and move element
    cy.get('[data-element-id="element1"]').click();
    cy.drag('[data-element-id="element1"]', { x: 100, y: 50 });

    // Verify position changed
    cy.get('[data-element-id="element1"]').should('have.attr', 'style').and('contain', 'left: 100px');

    // Click undo
    cy.get('.undo-btn').click();

    // Verify position reverted
    cy.get('[data-element-id="element1"]').should('not.have.attr', 'style', 'contain', 'left: 100px');
  });
});
```

## Troubleshooting

### Common Issues

#### 1. Visual Editing Not Working

**Symptoms:** Elements don't respond to drag/resize operations

**Solutions:**
- Verify `visualEditingEnabled` is `true`
- Check platform detection: `this.getPlatformInfo()`
- Ensure element refs are properly set
- Check for CSS conflicts with pointer events

#### 2. Commands Not Tracking

**Symptoms:** Undo/redo doesn't work for custom operations

**Solutions:**
- Ensure commands extend `BaseCommand`
- Verify `execute()`, `undo()`, `redo()` are implemented
- Check store integration in command constructors
- Verify command is passed to `historyService.execute()`

#### 3. Style Validation Errors

**Symptoms:** Styles not applying or validation warnings

**Solutions:**
- Check if `StyleValidationService` is injected
- Verify directive inputs: `enableValidation`, `autoCorrect`
- Review supported property types in validation rules
- Check for circular dependencies in validation setup

#### 4. Group Operations Failing

**Symptoms:** Cannot create or manipulate groups

**Solutions:**
- Verify `ElementGroupService` is available
- Check element IDs are valid and unique
- Ensure collision detection is configured
- Review group configuration parameters

#### 5. Memory Issues

**Symptoms:** Performance degradation over time

**Solutions:**
- Configure appropriate `MAX_HISTORY_SIZE`
- Call `historyService.clear()` when appropriate
- Implement proper cleanup in `ngOnDestroy()`
- Monitor memory usage with `historyService.getStats()`

### Performance Optimization

```typescript
// Configure performance settings
private optimizePerformance() {
  // Limit history size
  this.historyService.setMaxHistorySize(25);

  // Disable validation for performance-critical operations
  this.validationService.setConfig({
    enableValidation: false, // Temporarily disable
    autoCorrect: false
  });

  // Use efficient collision detection
  this.groupService.setCollisionDetectionMode('optimized');
}
```

### Debugging Tools

```typescript
// Enable debug logging
private enableDebugMode() {
  // Log all visual events
  this.visualEventLog = [];

  // Log history operations
  this.historyService.historyState.subscribe(state => {
    console.log('History state:', state);
  });

  // Log validation reports
  this.validationReports = [];
}

// Export debug information
exportDebugInfo() {
  return {
    visualEvents: this.visualEventLog,
    historyStats: this.historyService.getStats(),
    validationReports: this.validationReports,
    platformInfo: this.getPlatformInfo()
  };
}
```

## Migration Checklist

- [ ] Extended `EnhancedBaseEditorSectionComponent`
- [ ] Updated constructor with required services
- [ ] Called `super.ngOnInit()` in component initialization
- [ ] Initialized visual editing for elements and sections
- [ ] Implemented visual event handlers
- [ ] Added undo/redo toolbar to template
- [ ] Integrated command tracking for custom operations
- [ ] Set up element grouping management
- [ ] Configured style validation and presets
- [ ] Updated templates with enhanced directives
- [ ] Added proper error handling
- [ ] Updated unit tests for enhanced functionality
- [ ] Added integration tests for feature interactions
- [ ] Tested complete user workflows
- [ ] Verified performance is acceptable
- [ ] Updated component documentation

## Support

For additional help with migration:

1. Check the [Usage Guide](ENHANCED_COMPONENT_SYSTEM_USAGE_GUIDE.md) for detailed examples
2. Review the [API Reference](ENHANCED_COMPONENT_SYSTEM_API_REFERENCE.md) for method signatures
3. Examine existing enhanced components for implementation patterns
4. Run the test suite to verify migration success

The migration process maintains backward compatibility while adding powerful new capabilities to your editor components.