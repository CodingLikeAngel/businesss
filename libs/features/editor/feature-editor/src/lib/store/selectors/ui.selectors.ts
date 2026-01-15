import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EditorFeatureState } from '../state/app.state';
import { EditorUIState, ModalState, NotificationState } from '../../models/editor.model';

// Feature selector
export const selectEditorFeature = createFeatureSelector<EditorFeatureState>('editor');

// UI state selectors
export const selectUIState = createSelector(
  selectEditorFeature,
  (state: EditorFeatureState) => state.ui
);

export const selectModalState = createSelector(
  selectEditorFeature,
  (state: EditorFeatureState) => state.modal
);

export const selectNotificationState = createSelector(
  selectEditorFeature,
  (state: EditorFeatureState) => state.notifications
);

// Selection selectors
export const selectSelectedElementId = createSelector(
  selectUIState,
  (state: EditorUIState) => state.selectedElementId
);

export const selectSelectedSectionId = createSelector(
  selectUIState,
  (state: EditorUIState) => state.selectedSectionId
);

export const selectHoveredElementId = createSelector(
  selectUIState,
  (state: EditorUIState) => state.hoveredElementId
);

export const selectDraggedElementId = createSelector(
  selectUIState,
  (state: EditorUIState) => state.draggedElementId
);

export const selectDraggedSectionId = createSelector(
  selectUIState,
  (state: EditorUIState) => state.draggedSectionId
);

export const selectIsDragging = createSelector(
  selectDraggedElementId,
  selectDraggedSectionId,
  (elementId, sectionId) => !!(elementId || sectionId)
);

// Canvas selectors
export const selectZoom = createSelector(
  selectUIState,
  (state: EditorUIState) => state.zoom
);

export const selectCanvasSize = createSelector(
  selectUIState,
  (state: EditorUIState) => state.canvasSize
);

export const selectDevicePreview = createSelector(
  selectUIState,
  (state: EditorUIState) => state.devicePreview
);

// Grid and guides selectors
export const selectShowGrid = createSelector(
  selectUIState,
  (state: EditorUIState) => state.showGrid
);

export const selectShowRulers = createSelector(
  selectUIState,
  (state: EditorUIState) => state.showRulers
);

export const selectSnapToGrid = createSelector(
  selectUIState,
  (state: EditorUIState) => state.snapToGrid
);

// Layout selectors
export const selectSidebarOpen = createSelector(
  selectUIState,
  (state: EditorUIState) => state.sidebarOpen
);

export const selectToolbarVisible = createSelector(
  selectUIState,
  (state: EditorUIState) => state.toolbarVisible
);

// Context menu selectors
export const selectContextMenu = createSelector(
  selectUIState,
  (state: EditorUIState) => state.contextMenu
);

export const selectContextMenuVisible = createSelector(
  selectContextMenu,
  (contextMenu) => contextMenu.visible
);

// Modal selectors
export const selectModalOpen = createSelector(
  selectModalState,
  (state: ModalState) => state.isOpen
);

export const selectModalType = createSelector(
  selectModalState,
  (state: ModalState) => state.type
);

export const selectModalData = createSelector(
  selectModalState,
  (state: ModalState) => state.data
);

export const selectModalSelectedItem = createSelector(
  selectModalState,
  (state: ModalState) => state.selectedItem
);

// Notification selectors
export const selectNotifications = createSelector(
  selectNotificationState,
  (state: NotificationState) => state.notifications
);

export const selectUnreadNotifications = createSelector(
  selectNotifications,
  (notifications) => notifications.filter(n => !n.read)
);

export const selectUnreadNotificationCount = createSelector(
  selectUnreadNotifications,
  (notifications) => notifications.length
);

// Combined selectors for UI state
export const selectEditorUIState = createSelector(
  selectSelectedElementId,
  selectSelectedSectionId,
  selectHoveredElementId,
  selectIsDragging,
  selectZoom,
  selectDevicePreview,
  selectShowGrid,
  selectSnapToGrid,
  selectSidebarOpen,
  selectToolbarVisible,
  selectContextMenuVisible,
  selectModalOpen,
  selectUnreadNotificationCount,
  (
    selectedElementId,
    selectedSectionId,
    hoveredElementId,
    isDragging,
    zoom,
    devicePreview,
    showGrid,
    snapToGrid,
    sidebarOpen,
    toolbarVisible,
    contextMenuVisible,
    modalOpen,
    unreadNotifications
  ) => ({
    selectedElementId,
    selectedSectionId,
    hoveredElementId,
    isDragging,
    zoom,
    devicePreview,
    showGrid,
    snapToGrid,
    sidebarOpen,
    toolbarVisible,
    contextMenuVisible,
    modalOpen,
    unreadNotifications,
  })
);