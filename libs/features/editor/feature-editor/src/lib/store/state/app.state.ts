import { Page, EditorUIState, ModalState, NotificationState, HistoryState } from '../../models/editor.model';

export interface EditorFeatureState {
  page: PageState;
  ui: EditorUIState;
  modal: ModalState;
  notifications: NotificationState;
  history: HistoryState;
}

export interface PageState {
  currentPage: Page | null;
  pages: Page[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export interface AppState {
  editor: EditorFeatureState;
}

// Re-export HistoryState for use in reducers
export { HistoryState } from '../../models/editor.model';