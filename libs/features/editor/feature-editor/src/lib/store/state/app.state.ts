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

export interface AppState {
  editor: EditorFeatureState;
}

// Re-export HistoryState for use in reducers
export { HistoryState } from '../../models/editor.model';