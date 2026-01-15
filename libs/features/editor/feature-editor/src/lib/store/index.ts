import { ActionReducerMap } from '@ngrx/store';
import { EditorFeatureState, HistoryState } from './state/app.state';
import { pageReducer } from './reducers/page.reducer';
import { uiReducer, modalReducer, notificationReducer } from './reducers/ui.reducer';

export const editorReducers: ActionReducerMap<EditorFeatureState> = {
  page: pageReducer,
  ui: uiReducer,
  modal: modalReducer,
  notifications: notificationReducer,
  history: historyReducer, // Will be implemented with undo/redo
};

// Placeholder for history reducer - will implement undo/redo functionality
const initialHistoryState: HistoryState = {
  past: [],
  present: null,
  future: [],
  canUndo: false,
  canRedo: false,
};

function historyReducer(state: HistoryState = initialHistoryState, action: any): HistoryState {
  // TODO: Implement command pattern for undo/redo
  return state;
}

export * from './state/app.state';
export * from './actions/page.actions';
export * from './actions/ui.actions';
export * from './reducers/page.reducer';
export * from './reducers/ui.reducer';

// Export selectors individually to avoid conflicts
export * from './selectors/page.selectors';
export {
  selectUIState,
  selectModalState,
  selectNotificationState,
  selectSelectedElementId,
  selectSelectedSectionId,
  selectHoveredElementId,
  selectDraggedElementId,
  selectDraggedSectionId,
  selectIsDragging,
  selectZoom,
  selectCanvasSize,
  selectDevicePreview,
  selectShowGrid,
  selectShowRulers,
  selectSnapToGrid,
  selectSidebarOpen,
  selectToolbarVisible,
  selectContextMenu,
  selectContextMenuVisible,
  selectModalOpen,
  selectModalType,
  selectModalData,
  selectModalSelectedItem,
  selectNotifications,
  selectUnreadNotifications,
  selectUnreadNotificationCount,
  selectEditorUIState
} from './selectors/ui.selectors';