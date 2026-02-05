# VisualEditableDirective Migration Guide

## Overview

This guide provides step-by-step instructions for migrating existing editor components from the legacy `VisualEditableDirective` to the new `EnhancedVisualEditableDirective` and `EnhancedBaseEditorSectionComponent` system.

## Benefits of Migration

- **Consistent Mobile Support**: Unified behavior across all platforms
- **Advanced Boundary Constraints**: Collision detection and safe zones
- **Unified Styling**: Theme-aware, accessible visual feedback
- **Type Safety**: Comprehensive TypeScript interfaces
- **Maintainability**: Centralized configuration and behavior

## Migration Steps

### Step 1: Update Component Inheritance

**Before:**
```typescript
import { Component, Input } from '@angular/core';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({...})
export class EditorTitleSectionComponent extends BaseEditorSectionComponent {
  // Component logic
}
```

**After:**
```typescript
import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({...})
export class EditorTitleSectionComponent extends EnhancedBaseEditorSectionComponent {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef;

  ngAfterViewInit() {
    // Apply visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
  }

  // Component logic
}
```

### Step 2: Update Template Directives

**Before:**
```html
<div class="editor-section"
     [visualEditable]="true"
     visualType="section"
     (visualResized)="onSectionResized($event)">
  <div class="content">
    <lib-ui-title [visualEditable]="true"
                  visualType="element"
                  (visualMoved)="onElementMoved($event, 'title')"
                  (visualResized)="onElementResized($event, 'title')">
    </lib-ui-title>
  </div>
</div>
```

**After:**
```html
<div #sectionElement
     class="editor-section"
     [enhancedVisualEditable]="getSectionConfig()"
     (visualEvents)="handleVisualEvent($event, section.id)">
  <div class="content">
    <lib-ui-title #titleElement
                  [enhancedVisualEditable]="getTitleConfig()"
                  (visualEvents)="handleVisualEvent($event, section.id + '_title')">
    </lib-ui-title>
  </div>
</div>
```

### Step 3: Add Configuration Methods

**Add these methods to your component:**

```typescript
// Section configuration
getSectionConfig(): VisualEditingConfig {
  return this.createElementConfig('section', {
    constraints: {
      containment: 'parent',
      minDistance: { top: 10, right: 10, bottom: 10, left: 10 }
    }
  });
}

// Element configuration
getTitleConfig(): VisualEditingConfig {
  return this.createElementConfig('element', {
    interactions: {
      snapToGrid: 5,
      animationDuration: 150
    },
    constraints: {
      containment: 'parent',
      collisionDetection: true
    }
  });
}

// Event handler
handleVisualEvent(event: VisualEditingEvent, elementId: string): void {
  this.handleVisualEvent(event, elementId);
}
```

### Step 4: Update Imports

**Update your component imports:**

```typescript
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { EnhancedVisualEditableDirective } from '@negocio/shared-components';
import { VisualEditingConfig, VisualEditingEvent } from '../../../shared-components/variant-selector/enhanced-visual-editing.interfaces';
```

**Update your module/template imports:**

```typescript
// In component decorator
imports: [
  // ... existing imports
  EnhancedVisualEditableDirective
]
```

## Configuration Examples

### Basic Section Configuration
```typescript
getSectionConfig(): VisualEditingConfig {
  return this.createElementConfig('section', {
    enableDrag: false,  // Sections don't move
    enableResize: true, // But can be resized
    constraints: {
      containment: 'parent',
      minDistance: { top: 10, right: 10, bottom: 10, left: 10 }
    }
  });
}
```

### Interactive Element Configuration
```typescript
getButtonConfig(): VisualEditingConfig {
  return this.createElementConfig('element', {
    enableDrag: true,
    enableResize: true,
    interactions: {
      snapToGrid: 5,
      touchEnabled: true,
      hapticFeedback: true
    },
    constraints: {
      containment: 'parent',
      collisionDetection: true,
      minDistance: { top: 5, right: 5, bottom: 5, left: 5 }
    }
  });
}
```

### Container Configuration
```typescript
getContainerConfig(): VisualEditingConfig {
  return this.createElementConfig('container', {
    enableDrag: false,
    enableResize: false,
    styling: {
      selectionOutline: '1px dashed #94a3b8',
      hoverEffects: false
    }
  });
}
```

## Mobile-Specific Considerations

### Automatic Mobile Adjustments
The enhanced system automatically adjusts for mobile platforms:

- **Touch Handles**: Larger, more accessible resize handles
- **Gesture Support**: Pinch-to-zoom, two-finger drag
- **Performance**: Reduced visual effects on low-end devices
- **Safe Zones**: Adjusted for mobile viewport

### Manual Mobile Configuration
```typescript
getMobileConfig(): VisualEditingConfig {
  return this.createElementConfig('element', {
    mobileSupport: true,
    interactions: {
      touchEnabled: true,
      multiSelect: false,  // Disable multi-select on mobile
      snapToGrid: 10       // Larger grid for touch
    },
    styling: {
      dimensionLabels: false,  // Reduce clutter
      resizeHandles: true
    }
  });
}
```

## Theme Integration

### Applying Themes
```typescript
getThemedConfig(): VisualEditingConfig {
  return this.createElementConfig('element', {
    styling: {
      theme: 'pokemon',  // 'dark', 'minecraft', 'retro', etc.
      selectionOutline: '2px solid #ef4444'
    }
  });
}
```

### Custom Styling
```typescript
getCustomStyledConfig(): VisualEditingConfig {
  return this.createElementConfig('element', {
    styling: {
      customClasses: ['my-custom-editing-style'],
      selectionOutline: '3px solid #6366f1',
      hoverEffects: true
    }
  });
}
```

## Boundary Constraints

### Safe Zones
```typescript
getSafeZoneConfig(): VisualEditingConfig {
  return this.createElementConfig('element', {
    constraints: {
      safeZones: [
        {
          id: 'header-area',
          bounds: { x: 0, y: 0, width: 100, height: 80 },
          type: 'absolute'
        }
      ]
    }
  });
}
```

### Collision Detection
```typescript
getCollisionConfig(): VisualEditingConfig {
  return this.createElementConfig('element', {
    constraints: {
      collisionDetection: true,
      containment: 'parent'
    }
  });
}
```

## Event Handling

### Enhanced Event Processing
```typescript
handleVisualEvent(event: VisualEditingEvent, elementId: string): void {
  // Call parent handler for standard processing
  super.handleVisualEvent(event, elementId);

  // Custom event handling
  switch (event.type) {
    case 'selected':
      console.log(`Element ${elementId} selected`);
      this.onElementSelected(elementId, event.bounds);
      break;

    case 'moved':
      this.updateElementPosition(elementId, event.bounds);
      break;

    case 'resized':
      this.updateElementSize(elementId, event.bounds);
      break;
  }
}
```

## Backward Compatibility

### Legacy Support
Existing components using the old `VisualEditableDirective` will continue to work. The new system is designed to be:

- **Non-breaking**: Existing code continues to function
- **Progressive**: Components can be migrated individually
- **Compatible**: Old and new systems can coexist

### Migration Utilities
```typescript
// Utility to convert legacy config to enhanced config
convertLegacyConfig(legacyConfig: any): VisualEditingConfig {
  return {
    type: legacyConfig.visualType || 'element',
    enableDrag: legacyConfig.enableDrag !== false,
    enableResize: legacyConfig.enableResize !== false,
    mobileSupport: true,
    constraints: {
      containment: legacyConfig.containment || 'parent',
      minDistance: { top: 0, right: 0, bottom: 0, left: 0 },
      collisionDetection: false,
      safeZones: []
    },
    styling: {
      selectionOutline: '2px solid #6366f1',
      hoverEffects: true,
      dimensionLabels: true,
      resizeHandles: true
    },
    interactions: {
      touchEnabled: true,
      multiSelect: false,
      snapToGrid: legacyConfig.grid || 0,
      animationDuration: 200,
      hapticFeedback: false
    }
  };
}
```

## Testing Migration

### Unit Tests
```typescript
describe('EditorTitleSectionComponent', () => {
  it('should apply visual editing to section and title elements', () => {
    const fixture = TestBed.createComponent(EditorTitleSectionComponent);
    fixture.detectChanges();

    // Verify visual editing is applied
    expect(fixture.componentInstance.getCurrentConfig).toBeDefined();
  });

  it('should handle visual events correctly', () => {
    // Test event handling
  });
});
```

### Integration Tests
```typescript
describe('Enhanced Visual Editing', () => {
  it('should respect boundary constraints', () => {
    // Test boundary enforcement
  });

  it('should work on mobile platforms', () => {
    // Test mobile functionality
  });
});
```

## Troubleshooting

### Common Issues

1. **Directive not applied**: Ensure `EnhancedVisualEditableDirective` is imported
2. **Configuration errors**: Verify `VisualEditingConfig` structure
3. **Mobile issues**: Check `mobileSupport` flag and platform detection
4. **Styling problems**: Verify theme and custom class application

### Debug Mode
Enable debug logging:
```typescript
// In component
handleVisualEvent(event: VisualEditingEvent, elementId: string): void {
  console.log('Visual Event:', event);
  super.handleVisualEvent(event, elementId);
}
```

## Performance Considerations

- **Lazy Initialization**: Visual editing is only initialized when needed
- **Event Debouncing**: Prevents excessive event firing
- **Platform Optimization**: Reduced features on mobile for performance
- **Memory Management**: Proper cleanup prevents memory leaks

## Next Steps

1. Migrate one component at a time
2. Test thoroughly on all platforms
3. Gather user feedback
4. Migrate remaining components
5. Remove legacy code when all components are migrated

---

**Migration Priority**: Start with high-usage components like title, button, and image sections.