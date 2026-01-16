# Editor Enhancement Plan: Multi-Page Management

## Overview
This plan outlines the enhancement of the editor to support multiple pages, shared header/footer, dynamic navigation, and global preview. The goal is to make the editor more flexible and configurable.

## Current State Analysis

### Key Files Identified
- **Models**: `libs/features/editor/feature-editor/src/lib/models/editor.model.ts`
- **State Management**: `libs/features/editor/feature-editor/src/lib/store/state/app.state.ts`
- **Reducers**: `libs/features/editor/feature-editor/src/lib/store/reducers/page.reducer.ts`

### Current Structure
- The editor currently supports a single `Page` with multiple `Section`s.
- Each `Page` contains an array of `Section`s, and each `Section` contains an array of `Element`s.
- The state management is built using NgRx, with actions, reducers, and selectors for managing the editor state.

## Proposed Enhancements

### 1. Multi-Page Management
**Objective**: Allow users to create, name, order, delete, and duplicate multiple pages.

**Data Structure Changes**:
- Extend the `PageState` to manage an array of `Page` objects.
- Add fields to `Page` for ordering and visibility in navigation.

```typescript
// Proposed Page Interface Extension
export interface Page {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
  globalStyles: GlobalStyles;
  metadata: PageMetadata;
  versions: PageVersion[];
  collaborators: Collaborator[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  publishedAt?: Date;
  settings?: {
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    social?: {
      ogImage?: string;
      twitterCard?: string;
    };
    analytics?: {
      googleAnalyticsId?: string;
      facebookPixelId?: string;
    };
  };
  author?: string;
  order: number; // New field for ordering
  visibleInHeader: boolean; // New field for header visibility
  visibleInFooter: boolean; // New field for footer visibility
}
```

**Actions Required**:
- `createPage`: Create a new page with default sections.
- `updatePage`: Update page properties (name, slug, visibility, etc.).
- `deletePage`: Remove a page from the list.
- `duplicatePage`: Create a copy of an existing page.
- `reorderPages`: Change the order of pages in the list.

### 2. Shared Header and Footer
**Objective**: Define global header and footer that can be shared across pages.

**Data Structure Changes**:
- Add `Header` and `Footer` interfaces to the `editor.model.ts`.
- Extend the `EditorFeatureState` to include `header` and `footer`.

```typescript
// Proposed Header and Footer Interfaces
export interface Header {
  id: string;
  sections: Section[];
  visible: boolean;
}

export interface Footer {
  id: string;
  sections: Section[];
  visible: boolean;
}
```

**State Management Changes**:
- Update `EditorFeatureState` to include `header` and `footer`.

```typescript
export interface EditorFeatureState {
  page: PageState;
  ui: EditorUIState;
  modal: ModalState;
  notifications: NotificationState;
  history: HistoryState;
  header: Header | null; // New field
  footer: Footer | null; // New field
}
```

### 3. Dynamic Navigation
**Objective**: Generate navigation links dynamically based on user-created pages.

**Data Structure Changes**:
- Add a `Navigation` interface to manage links for header and footer.

```typescript
// Proposed Navigation Interface
export interface Navigation {
  headerLinks: { pageId: string; label: string }[];
  footerLinks: { pageId: string; label: string }[];
}
```

**Logic**:
- Generate `headerLinks` and `footerLinks` based on the `visibleInHeader` and `visibleInFooter` fields of each page.
- Update the navigation whenever a page is added, updated, or deleted.

### 4. Global Preview
**Objective**: Allow users to preview the entire site, including navigation, header, and footer.

**Implementation**:
- Create a preview mode that renders all pages with the shared header and footer.
- Ensure the preview reflects the exact structure created by the user.

### 5. Backward Compatibility
**Objective**: Ensure existing configurations remain compatible with the new structure.

**Approach**:
- Provide migration scripts to convert existing single-page configurations to the new multi-page structure.
- Ensure the editor can handle both old and new configurations seamlessly.

## Implementation Plan

### Step 1: Update Data Models
- Extend the `Page` interface to include `order`, `visibleInHeader`, and `visibleInFooter`.
- Add `Header` and `Footer` interfaces.
- Update `EditorFeatureState` to include `header` and `footer`.

### Step 2: Update State Management
- Modify the `PageState` to manage an array of `Page` objects.
- Add reducers for managing multiple pages (create, update, delete, duplicate, reorder).
- Add reducers for managing header and footer.

### Step 3: Implement Dynamic Navigation
- Create a service to generate navigation links based on user-created pages.
- Update the header and footer components to consume the dynamic navigation.

### Step 4: Implement Global Preview
- Create a preview component that renders all pages with the shared header and footer.
- Ensure the preview mode is accessible from the editor UI.

### Step 5: Ensure Backward Compatibility
- Write migration scripts to convert existing configurations.
- Test the editor with both old and new configurations.

### Step 6: Testing and Validation
- Test the creation, updating, deletion, and duplication of pages.
- Test the visibility toggles for header and footer.
- Validate the dynamic navigation generation.
- Ensure the global preview works as expected.

## Timeline
- **Phase 1**: Data Model and State Management Updates (2 weeks)
- **Phase 2**: Dynamic Navigation Implementation (1 week)
- **Phase 3**: Global Preview Implementation (1 week)
- **Phase 4**: Backward Compatibility and Testing (1 week)

## Risks and Mitigations
- **Risk**: Breaking existing configurations.
  - **Mitigation**: Provide migration scripts and ensure backward compatibility.
- **Risk**: Performance issues with multiple pages.
  - **Mitigation**: Optimize state management and rendering logic.
- **Risk**: Complexity in managing shared header and footer.
  - **Mitigation**: Design clear interfaces and separation of concerns.

## Conclusion
This plan outlines a comprehensive approach to enhancing the editor for multi-page management, shared header/footer, dynamic navigation, and global preview. The proposed changes are designed to be flexible, scalable, and backward-compatible.