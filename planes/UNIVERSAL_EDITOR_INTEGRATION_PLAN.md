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

## 🛠 Phase 1: The Core Foundation & Technical Standards

### 1.1 Mandatory Property Parity (The "Big 4")

Every UI component MUST implement the following inputs to ensure consistent behavior in the editor:

- `variant`: Style variant (e.g., `primary`, `glass`, `neon`).
- `rounded`: Radius preset (`none`, `md`, `full`).
- `size`: Scaling preset (`sm`, `md`, `lg`).
- `dark`: Boolean toggle for localized dark mode.
- `customStyles`: Object for manual CSS overrides (backgroundColor, borderColor, etc.).

### 1.2 CSS Prefix Standardization

All components must use the `variant-` prefix in their SCSS and use the `apply-all-variants` mixin. This allows the editor to apply global themes (Glass, Neon, Cyberpunk) dynamically.

```scss
.my-component {
  @include shared.apply-all-variants('variant-');
}
```

### 1.3 Container Rendering Rules

To ensure correct behavior with resizing handles, UI components must:

- Use `width: 100%` and `height: 100%`.
- Use `inset: 0` if they are absolutely positioned within the editor wrapper.

---

## 🏗 Phase 2: Standardized Isolated Mode (Premium UI)

### 2.1 The "Isolation" Protocol

When a component enters Isolated Mode, the system must:

1.  **Promote Z-Index**: Use `body.isolated-mode-active` to boost the canvas stacking context to `9999999`.
2.  **Break Perspective Traps**: Disable parent `perspective` and `isolation` properties to allow the fixed overlay to cover the entire screen.
3.  **Visual Feedback**: Implement a checkerboard background in the canvas to handle transparency clearly.

### 2.2 Advanced Property Sync

The `EditorSection` components must synchronize all 5 core properties (`variant`, `rounded`, `size`, `dark`, `customStyles`) between the isolated state and the main project state via `applyIsolatedChanges`.

---

## 🏗 Phase 3: Component Registry & Factory

### 3.1 Dynamic Editor Resolver

Instead of a giant `ngSwitch` in `editor-feature.component.html`, we'll move towards a dynamic registration system.

1.  **Registry**: A central map of `component-type` -> `EditorComponentClass`.
2.  **Auto-Registration**: A decorator or a service that allows components to register themselves.

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

## 📋 Implementation Roadmap (Updated)

| Task                              | Priority | Status                                       |
| :-------------------------------- | :------- | :------------------------------------------- |
| **Draggable Box Standardization** | High     | ✅ COMPLETED (Gold Standard established)     |
| **Standardized Isolated Mode UI** | High     | ✅ COMPLETED (Z-index & rendering fixed)     |
| **Component Template Updates**    | High     | 🔄 In Progress                               |
| **Metadata-Driven Property Sync** | Medium   | 📅 Planned                                   |
| **Z-Index Management**            | Low      | ✅ In Progress (Base logic in Isolated Mode) |
| **Universal Button Integration**  | Medium   | 📅 Next Up                                   |

---

## ✅ Success Criteria

- [ ] Any developer can add a new component to the editor in < 15 minutes.
- [ ] Components look and feel "premium" while being edited.
- [ ] Isolated mode menu is ALWAYS visible (never hidden by sidebars).
- [ ] All 5 core properties (Variant, Rounded, Size, Dark, Custom) sync flawslessly.
- [ ] Undo/Redo works for all properties.
