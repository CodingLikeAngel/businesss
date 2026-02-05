# 🚀 Universal Component Editor Integration Plan

This plan outlines the transition from specific "Draggable Box" implementations to a **Universal Editable System** where ANY UI component (Atom, Molecule, or Organism) can be easily made draggable, resizable, and editable within the visual editor.

## 🎯 Goal

Enable a "Plug & Play" experience for developers creating new components, ensuring they automatically support:

1.  **Selection & Highlighting**
2.  **Native Drag & Drop** (Positioning)
3.  **8-Point Resizing**
4.  **Content Editing** (Images, Text, Icons)
5.  **Style Overrides** (Shadows, Borders, Glassmorphism)
6.  **History & Persistence** (Undo/Redo via NgRx)

---

## 🛠 Phase 1: The Core Foundation

### 1.1 Universal Metadata Interface

Define a standardized metadata structure that components use to tell the editor what is editable.

```typescript
// libs/shared-components/src/lib/models/visual-editing.metadata.ts
export interface ComponentEditorMetadata {
  type: string;
  fields: {
    [key: string]: {
      type: 'text' | 'rich-text' | 'image' | 'icon' | 'color' | 'select';
      label: string;
      options?: string[]; // For 'select' type
    };
  };
  capabilities: {
    draggable: boolean;
    resizable: boolean;
    stylable: boolean;
  };
}
```

### 1.2 Evolution of `EnhancedBaseEditorSectionComponent`

Upgrade the base class to handle metadata-driven editing.

---

## 🏗 Phase 2: Component Registry & Factory

### 2.1 Dynamic Editor Resolver

Instead of a giant `ngSwitch` in `editor-feature.component.html`, we'll move towards a dynamic registration system.

1.  **Registry**: A central map of `component-type` -> `EditorComponentClass`.
2.  **Auto-Registration**: A decorator or a service that allows components to register themselves.

---

## 🎨 Phase 3: Aesthetic Isolated Mode (Premium UI)

### 3.1 Glassmorphism Editor Panels

Update the isolated mode panels to use:

- Transparent backdrop filters (Glassmorphism).
- Smooth CSS Transitions.
- Micro-interactions (Hover effects, ripple).
- Floating toolbars for quick actions (Duplicate, Delete, Bring to Front).

### 3.2 Real-time Style Controls

Implement a "Visual CSS Builder" for the isolated mode:

- **Shadow Builder**: 3D shadow presets.
- **Border Radius**: Individual corner control.
- **Gradients**: Visual linear/radial gradient picker.

---

## 🔄 Phase 4: Persistence & State Management

### 4.1 Debounced NgRx Updates

Ensure that rapid drag/resize operations don't overwhelm the store by implementing:

- `subject.pipe(debounceTime(300))` for store dispatches.
- Optimistic UI updates (Local state update -> Store sync).

### 4.2 Element Layering (Z-Index)

Add controls to manage the "Stacking Order":

- `bringToFront()`
- `sendToBack()`
- `moveForward()`
- `moveBackward()`

---

## 📱 Phase 5: Mobile Editing Optimization

### 5.1 Touch-Friendly Handles

- Larger hit areas for resize handles on mobile.
- "Long press to drag" functionality.
- Mobile-specific editing bottom sheet.

---

## 📋 Implementation Roadmap

| Task                              | Priority | Status     |
| :-------------------------------- | :------- | :--------- |
| **Universal Metadata Definition** | High     | 📅 Planned |
| **Standardized Isolated Mode UI** | High     | 📅 Planned |
| **Component Registry Cleanup**    | Medium   | 📅 Planned |
| **Gradients & Advanced Styles**   | Medium   | 📅 Planned |
| **Z-Index Management**            | Low      | 📅 Planned |
| **Batch Selection Support**       | Low      | 📅 Planned |

---

## ✅ Success Criteria

- [ ] Any developer can add a new component to the editor in < 15 minutes.
- [ ] Components look and feel "premium" while being edited.
- [ ] All edits persist across page reloads.
- [ ] Undo/Redo works flawlessly for all properties.
