import { Page, EditorUIState, ModalState, NotificationState, HistoryState, Header, Footer, Navigation, NavigationState, PreviewState, MigrationState } from '../../models/editor.model';

export interface EditorFeatureState {
  page: PageState;
  ui: EditorUIState;
  modal: ModalState;
  notifications: NotificationState;
  history: HistoryState;
  header: Header | null;
  footer: Footer | null;
  navigation: Navigation;
}

export interface PageState {
  currentPage: Page | null;
  pages: Page[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  navigationState: NavigationState;
  preview: PreviewState;
  migration: MigrationState;
}

export const initialNavigationState: NavigationState = {
  currentPath: '/',
  activePageId: null,
  breadcrumbs: [],
  isNavigating: false,
};

export const initialNavigation: Navigation = {
  headerLinks: [],
  footerLinks: [],
  globalHeaderId: undefined,
  globalFooterId: undefined,
};

export const initialPreviewState: PreviewState = {
  isPreviewMode: false,
  previewPageId: null,
  previewDevice: 'desktop',
  showGrid: false,
  showRulers: false,
};

export const initialMigrationState: MigrationState = {
  version: '1.0.0',
  lastMigrated: null,
  migrationHistory: [],
};

export const initialEditorFeatureState: EditorFeatureState = {
  page: {
    currentPage: null,
    pages: [],
    loading: false,
    error: null,
    saving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    navigationState: initialNavigationState,
    preview: initialPreviewState,
    migration: initialMigrationState,
  },
  ui: {
    selectedElementId: null,
    selectedSectionId: null,
    hoveredElementId: null,
    draggedElementId: null,
    draggedSectionId: null,
    zoom: 1,
    canvasSize: { width: 1200, height: 800 },
    showGrid: false,
    showRulers: false,
    snapToGrid: true,
    devicePreview: 'desktop',
    sidebarOpen: true,
    toolbarVisible: true,
    contextMenu: {
      visible: false,
      position: { x: 0, y: 0 },
      targetId: '',
      targetType: 'canvas',
    },
  },
  modal: {
    isOpen: false,
    type: 'element-settings',
  },
  notifications: {
    notifications: [],
  },
  history: {
    past: [],
    present: null,
    future: [],
    canUndo: false,
    canRedo: false,
  },
  header: null,
  footer: null,
  navigation: initialNavigation,
};

export interface AppState {
  editor: EditorFeatureState;
}

// Re-export HistoryState for use in reducers
export { HistoryState } from '../../models/editor.model';