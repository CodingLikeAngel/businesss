# Draggable Box Improvement Plan

## Current Status ✅

### Completed Work

1. **Event Handling Fix**
   - Removed `elementMoved` and `elementResized` event bindings from parent template
   - Component now uses native mouse event handlers instead of `elementMoved$` subscription
   - Position changes persist directly to NgRx store

2. **Native Drag/Resize Implementation**
   - 8 resize handles (nw, n, ne, e, se, s, sw, w)
   - Smooth drag and resize with visual feedback
   - Minimum size constraints (100px)

3. **Isolated Mode Enhancements**
   - Content editing (title, description)
   - Style controls (background color, border color/radius/width, padding, shadows)
   - Position and size adjustment
   - Snap-to-grid functionality

4. **Keyboard Shortcuts**
   - `I` - Open isolated mode
   - Arrow keys - Fine position adjustment (1px normal, 10px with Shift)
   - `Escape` - Close isolated mode
   - `Ctrl+Z` / `Ctrl+Y` - Undo/redo support

5. **UI Improvements**
   - Enhanced section header with gradient background
   - 8 visible resize handles on hover
   - Position/size info panel
   - Visual drag and resize indicators

---

## Plan for Remaining Components

### Phase 1: Complete Draggable Box Variants

#### 1.1 Create `draggable-box-2` and `draggable-box-3` variants

```typescript
// editor-draggable-box-2-section.component.ts
// editor-draggable-box-3-section.component.ts
```

**Draggable Box 2 - Enhanced Features:**
- Multiple content areas (header, body, footer)
- Image support
- Icon integration
- Button styling options

**Draggable Box 3 - Advanced Features:**
- Card layout with header image
- Overlay content mode
- Gradient backgrounds
- Animation controls

#### 1.2 Unified Base Component

Create a shared base class for all draggable box variants:

```typescript
// draggable-box-base.component.ts
export abstract class DraggableBoxBaseComponent extends BaseEditorSectionComponent {
  abstract boxId: string;
  abstract currentContent: any;
  abstract currentStyles: any;
  
  // Shared drag/resize logic
  protected initDragHandlers(): void { ... }
  protected initResizeHandlers(): void { ... }
  
  // Shared style management
  protected updateStyles(changes: StyleChanges): void { ... }
  
  // Shared persistence
  protected persistToStore(): void { ... }
}
```

---

### Phase 2: Create Similar Editor Components

#### 2.1 Editor Card Section Component

```typescript
// editor-card-section.component.ts
```

**Features:**
- Card layout with header, content, footer sections
- Image upload and cropping
- Title and description editing
- Action button configuration
- Hover effects and animations

**Interface:**
```typescript
interface CardConfig {
  headerImage?: string;
  title: string;
  subtitle?: string;
  content: string;
  actionButton?: {
    text: string;
    url?: string;
    style: 'primary' | 'secondary' | 'outline';
  };
  styles: CardStyles;
}
```

#### 2.2 Editor Image Section Component

```typescript
// editor-image-section.component.ts
```

**Features:**
- Image upload with drag & drop
- Aspect ratio controls (16:9, 4:3, 1:1, 3:4, 9:16)
- Object-fit options (cover, contain, fill)
- Alt text editing
- Caption support
- Lightbox preview

#### 2.3 Editor Button Section Component

```typescript
// editor-button-section.component.ts
```

**Features:**
- Button text editing
- Style presets (primary, secondary, outline, ghost)
- Size controls (small, medium, large)
- Icon support (left/right)
- Border radius control
- Shadow options

---

### Phase 3: Editor Container Components

#### 3.1 Editor Container Section Component

```typescript
// editor-container-section.component.ts
```

**Features:**
- Nested section support
- Background options (color, gradient, image)
- Padding/margin controls
- Border and shadow options
- Max-width constraint

#### 3.2 Editor Grid Section Component

```typescript
// editor-grid-section.component.ts
```

**Features:**
- CSS Grid-based layout
- Column count controls (1-6)
- Gap controls
- Responsive column spanning
- Item alignment options

#### 3.3 Editor Flex Section Component

```typescript
// editor-flex-section.component.ts
```

**Features:**
- Flexbox layout controls
- Direction (row/column)
- Justify content options
- Align items options
- Wrap controls
- Gap controls

---

### Phase 4: Editor Media Components

#### 4.1 Editor Video Section Component

```typescript
// editor-video-section.component.ts
```

**Features:**
- YouTube/Vimeo URL support
- Video upload
- Autoplay controls
- Loop controls
- Custom thumbnail
- Aspect ratio controls

#### 4.2 Editor Gallery Section Component

```typescript
// editor-gallery-section.component.ts
```

**Features:**
- Multiple image support
- Gallery layout options (grid, carousel, masonry)
- Image ordering
- Spacing controls
- Lightbox functionality
- Navigation controls

#### 4.3 Editor Icon Section Component

```typescript
// editor-icon-section.component.ts
```

**Features:**
- Icon picker (from library)
- Icon size controls
- Color customization
- Animation options (pulse, spin, bounce)
- Link configuration

---

### Phase 5: Editor Form Components

#### 5.1 Editor Form Section Component

```typescript
// editor-form-section.component.ts
```

**Features:**
- Form field builder
- Field types (text, email, textarea, select, checkbox, radio)
- Validation rules
- Submit button configuration
- Form layout options

#### 5.2 Editor Input Section Component

```typescript
// editor-input-section.component.ts
```

**Features:**
- Input type selection
- Label and placeholder editing
- Validation display
- Error message configuration
- Icon integration

#### 5.3 Editor Textarea Section Component

```typescript
// editor-textarea-section.component.ts
```

**Features:**
- Rows configuration
- Character limit
- Resize options
- Autogrow option

---

### Phase 6: Editor Navigation Components

#### 6.1 Editor Navbar Section Component

```typescript
// editor-navbar-section.component.ts
```

**Features:**
- Logo configuration
- Navigation links management
- Menu style (horizontal, vertical, hamburger)
- Background options
- Sticky header option

#### 6.2 Editor Menu Section Component

```typescript
// editor-menu-section.component.ts
```

**Features:**
- Menu item management
- Nested menu support
- Active state styling
- Hover effects
- Icon options

#### 6.3 Editor Breadcrumb Section Component

```typescript
// editor-breadcrumb-section.component.ts
```

**Features:**
- Breadcrumb items management
- Separator configuration
- Link styling
- Home icon option

---

### Phase 7: Editor Content Components

#### 7.1 Editor Text Section Component

```typescript
// editor-text-section.component.ts
```

**Features:**
- Rich text editing (HTML)
- Font family selection
- Font size controls
- Text alignment
- Line height
- Letter spacing

#### 7.2 Editor Heading Section Component

```typescript
// editor-heading-section.component.ts
```

**Features:**
- Heading level (h1-h6)
- Font size presets
- Font weight options
- Color customization
- Line height

#### 7.3 Editor Quote Section Component

```typescript
// editor-quote-section.component.ts
```

**Features:**
- Quote text editing
- Author configuration
- Citation style
- Border styling
- Background options

#### 7.4 Editor List Section Component

```typescript
// editor-list-section.component.ts
```

**Features:**
- List type (ordered, unordered)
- List items management
- Icon customization
- Spacing controls
- Numbered style options

---

### Phase 8: Editor Interactive Components

#### 8.1 Editor Accordion Section Component

```typescript
// editor-accordion-section.component.ts
```

**Features:**
- Accordion items management
- Icon customization (chevron, plus, arrow)
- Multiple open option
- Animation controls
- Header styling

#### 8.2 Editor Tabs Section Component

```typescript
// editor-tabs-section.component.ts
```

**Features:**
- Tab items management
- Tab style (underline, pills, boxed)
- Icon integration
- Active tab styling
- Animation options

#### 8.3 Editor Modal Section Component

```typescript
// editor-modal-section.component.ts
```

**Features:**
- Modal size (small, medium, large, full)
- Header configuration
- Footer buttons
- Backdrop options
- Animation controls
- Close button options

#### 8.4 Editor Popup Section Component

```typescript
// editor-popup-section.component.ts
```

**Features:**
- Trigger type (click, hover, scroll)
- Position options
- Animation (fade, slide, zoom)
- Close conditions
- Overlay options

---

### Phase 9: Editor Social Components

#### 9.1 Editor Social Links Section Component

```typescript
// editor-social-links-section.component.ts
```

**Features:**
- Social platform selection
- URL configuration
- Icon customization
- Style presets
- Size options

#### 9.2 Editor Share Button Section Component

```typescript
// editor-share-button-section.component.ts
```

**Features:**
- Share networks selection
- Button styling
- Count display options
- Hover effects

#### 9.3 Editor Profile Section Component

```typescript
// editor-profile-section.component.ts
```

**Features:**
- Avatar upload
- Name and bio editing
- Social links integration
- Cover image
- Layout options

---

### Phase 10: Editor E-commerce Components

#### 10.1 Editor Product Card Section Component

```typescript
// editor-product-card-section.component.ts
```

**Features:**
- Product image
- Title and description
- Price display
- Add to cart button
- Badge options (sale, new)
- Rating display

#### 10.2 Editor Price Section Component

```typescript
// editor-price-section.component.ts
```

**Features:**
- Price formatting
- Currency selection
- Discount display
- Period selection (for subscriptions)
- Feature list

#### 10.3 Editor Add to Cart Section Component

```typescript
// editor-add-to-cart-section.component.ts
```

**Features:**
- Quantity selector
- Button styling
- Animation options
- Success message
- Icon options

---

### Phase 11: Component Registry and Templates

#### 11.1 Create Component Registry

```typescript
// editor-component-registry.ts
export const EDITOR_COMPONENT_REGISTRY = {
  'draggable-box-1': EditorDraggableBoxSectionComponent,
  'draggable-box-2': EditorDraggableBox2SectionComponent,
  'draggable-box-3': EditorDraggableBox3SectionComponent,
  'card-1': EditorCardSectionComponent,
  'card-2': EditorCard2SectionComponent,
  // ... add all components
};

export type EditorComponentType = keyof typeof EDITOR_COMPONENT_REGISTRY;
```

#### 11.2 Update Editor Feature Templates

Update `editor-feature.component.html` and `editor-feature-mobile.component.html` to include all new components with proper event bindings.

#### 11.3 Create Component Preview Service

```typescript
// editor-component-preview.service.ts
export class EditorComponentPreviewService {
  getComponentPreview(type: string, config: any): string {
    // Generate preview HTML for component palette
  }
  
  getComponentConfig(type: string): ComponentConfig {
    // Return default configuration for new instances
  }
}
```

---

## Implementation Priorities

### High Priority (Phase 1-2)
1. ✅ Draggable Box (completed)
2. Card components (high usage)
3. Image components (high usage)
4. Button components (high usage)

### Medium Priority (Phase 3-5)
5. Container/Grid/Flex (layout foundation)
6. Form components (user interaction)
7. Video/Gallery (media support)

### Lower Priority (Phase 6-10)
8. Navigation components
9. Content components
10. Interactive components
11. Social components
12. E-commerce components

---

## Files to Create/Modify

### New Files
```
libs/features/editor/feature-editor/src/lib/pages/editor/components/
├── draggable-box/
│   ├── editor-draggable-box-section.component.ts ✅
│   ├── editor-draggable-box-isolated-mode.component.ts ✅
│   ├── editor-draggable-box-2-section.component.ts (new)
│   └── editor-draggable-box-3-section.component.ts (new)
├── card/
│   ├── editor-card-section.component.ts (new)
│   ├── editor-card-isolated-mode.component.ts (new)
│   └── editor-card-2-section.component.ts (new)
├── image/
│   ├── editor-image-section.component.ts (new)
│   └── editor-image-isolated-mode.component.ts (new)
├── button/
│   ├── editor-button-section.component.ts (new)
│   └── editor-button-isolated-mode.component.ts (new)
└── ... (other component folders)

libs/features/editor/feature-editor/src/lib/pages/editor/services/
├── editor-component-registry.ts (new)
├── editor-component-preview.service.ts (new)
└── editor-draggable-box-base.component.ts (new)
```

### Modified Files
```
libs/features/editor/feature-editor/src/lib/pages/editor/components/draggable-box/
└── editor-draggable-box-section.component.ts (completed)

libs/features/editor/feature-editor/src/lib/pages/editor/
├── editor-feature.component.html (update imports)
├── editor-feature-mobile.component.html (update imports)
└── editor.routes.ts (add new routes if needed)
```

---

## Testing Checklist

### Unit Tests
- [ ] Drag functionality
- [ ] Resize functionality
- [ ] Position persistence
- [ ] Style changes
- [ ] Keyboard shortcuts
- [ ] Isolated mode
- [ ] Undo/redo

### Integration Tests
- [ ] NgRx store integration
- [ ] Template rendering
- [ ] Event bindings
- [ ] Component interactions

### E2E Tests
- [ ] Full drag/resize workflow
- [ ] Isolated mode editing
- [ ] Template switching
- [ ] Mobile responsiveness

---

## Performance Considerations

1. **Debounced Persistence**: Use debounceTime for position/style updates to avoid excessive store dispatches
2. **Lazy Loading**: Implement lazy loading for isolated mode components
3. **Change Detection**: Use OnPush change detection strategy where possible
4. **Virtual Scrolling**: For components with many items (gallery, accordion)
5. **Image Optimization**: Compress images before upload

---

## Accessibility

1. **Keyboard Navigation**: All interactive elements should be keyboard accessible
2. **ARIA Labels**: Add proper ARIA labels for screen readers
3. **Focus Management**: Proper focus handling in isolated mode
4. **Color Contrast**: Ensure sufficient color contrast in all themes
5. **Screen Reader Support**: Describe component states for assistive technologies
