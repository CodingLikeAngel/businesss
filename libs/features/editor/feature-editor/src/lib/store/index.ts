import { ActionReducerMap } from '@ngrx/store';
import { EditorFeatureState, HistoryState, initialNavigation } from './state/app.state';
import { pageReducer } from './reducers/page.reducer';
import { uiReducer, modalReducer, notificationReducer } from './reducers/ui.reducer';

export const editorReducers: ActionReducerMap<EditorFeatureState> = {
  page: pageReducer,
  ui: uiReducer,
  modal: modalReducer,
  notifications: notificationReducer,
  history: historyReducer, // Will be implemented with undo/redo
  header: (state: any = null) => state, // Placeholder reducer
  footer: (state: any = null) => state, // Placeholder reducer
  navigation: (state: any = { headerLinks: [], footerLinks: [] }) => state, // Placeholder reducer
};

import { Command } from '../models/editor.model';
import { executeCommand, undo, redo, clearHistory, undoToCommand, redoToCommand } from './actions/ui.actions';

// History reducer implementation
const initialHistoryState: HistoryState = {
  past: [],
  present: null,
  future: [],
  canUndo: false,
  canRedo: false,
};

function historyReducer(state: HistoryState = initialHistoryState, action: any): HistoryState {
  switch (action.type) {
    case executeCommand.type: {
      const command: Command = action.command;

      // Execute the command
      command.execute();

      // Add to history
      const newPast = state.present ? [...state.past, state.present] : [...state.past];

      // Limit history size to prevent memory issues
      const maxHistorySize = 50;
      if (newPast.length > maxHistorySize) {
        newPast.shift(); // Remove oldest command
      }

      return {
        past: newPast,
        present: command,
        future: [], // Clear future when new command is executed
        canUndo: true,
        canRedo: false,
      };
    }

    case undo.type: {
      if (!state.canUndo || !state.present) {
        return state;
      }

      // Undo the current command
      state.present.undo();

      // Move present to future, last past to present
      const newPast = [...state.past];
      const newPresent = newPast.pop() || null;
      const newFuture = state.present ? [state.present, ...state.future] : [...state.future];

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
        canUndo: newPast.length > 0,
        canRedo: true,
      };
    }

    case redo.type: {
      if (!state.canRedo || state.future.length === 0) {
        return state;
      }

      // Get the next command to redo
      const [nextCommand, ...remainingFuture] = state.future;

      // Redo the command
      nextCommand.redo();

      // Move next command to present
      const newPast = state.present ? [...state.past, state.present] : [...state.past];
      const newPresent = nextCommand;
      const newFuture = remainingFuture;

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      };
    }

    case clearHistory.type: {
      return initialHistoryState;
    }

    case undoToCommand.type: {
      const targetCommandId = action.commandId;
      const allCommands = [
        ...state.past,
        state.present,
        ...state.future
      ].filter(cmd => cmd !== null) as Command[];

      const targetIndex = allCommands.findIndex(cmd => cmd.id === targetCommandId);
      if (targetIndex === -1) {
        return state; // Command not found
      }

      // Calculate how many undos needed
      const pastIndex = state.past.findIndex(cmd => cmd.id === targetCommandId);
      if (pastIndex === -1) {
        return state; // Command not in past
      }

      const undoCount = state.past.length - pastIndex - 1; // -1 because we want to undo TO this command, not including it

      let newState = state;
      for (let i = 0; i < undoCount; i++) {
        if (!newState.canUndo) break;
        newState = historyReducer(newState, { type: undo.type });
      }

      return newState;
    }

    case redoToCommand.type: {
      const targetCommandId = action.commandId;
      const futureIndex = state.future.findIndex(cmd => cmd.id === targetCommandId);
      if (futureIndex === -1) {
        return state; // Command not in future
      }

      let newState = state;
      for (let i = 0; i <= futureIndex; i++) {
        if (!newState.canRedo) break;
        newState = historyReducer(newState, { type: redo.type });
      }

      return newState;
    }

    default:
      return state;
  }
}

export * from './state/app.state';
export * from './actions/page.actions';
export * from './actions/ui.actions';
export * from './reducers/page.reducer';
export * from './reducers/ui.reducer';
export * from './effects/index';

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