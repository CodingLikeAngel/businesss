import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EditorFeatureState } from '../state/app.state';
import { EditorUIState, ModalState, NotificationState } from '../../models/editor.model';

// Feature selector
export const selectEditorFeature = createFeatureSelector<EditorFeatureState>('editor');

// UI state selectors
export const selectUIState = createSelector(
  selectEditorFeature,
  (state: EditorFeatureState) => state?.ui
);

export const selectModalState = createSelector(
  selectEditorFeature,
  (state: EditorFeatureState) => state?.modal
);

export const selectNotificationState = createSelector(
  selectEditorFeature,
  (state: EditorFeatureState) => state?.notifications
);

// Selection selectors
export const selectSelectedElementId = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.selectedElementId || null
);

export const selectSelectedSectionId = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.selectedSectionId || null
);

export const selectHoveredElementId = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.hoveredElementId || null
);

export const selectDraggedElementId = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.draggedElementId || null
);

export const selectDraggedSectionId = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.draggedSectionId || null
);

export const selectIsDragging = createSelector(
  selectDraggedElementId,
  selectDraggedSectionId,
  (elementId, sectionId) => !!(elementId || sectionId)
);

// Canvas selectors
export const selectZoom = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.zoom || 1
);

export const selectCanvasSize = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.canvasSize || { width: 1200, height: 800 }
);

export const selectDevicePreview = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.devicePreview || 'desktop'
);

// Grid and guides selectors
export const selectShowGrid = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.showGrid || false
);

export const selectShowRulers = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.showRulers || false
);

export const selectSnapToGrid = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.snapToGrid || true
);

// Layout selectors
export const selectSidebarOpen = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.sidebarOpen || false
);

export const selectToolbarVisible = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.toolbarVisible || false
);

// Context menu selectors
export const selectContextMenu = createSelector(
  selectUIState,
  (state: EditorUIState) => state?.contextMenu || { visible: false, position: { x: 0, y: 0 }, targetId: '', targetType: 'canvas' }
);

export const selectContextMenuVisible = createSelector(
  selectContextMenu,
  (contextMenu) => contextMenu?.visible || false
);

// Modal selectors
export const selectModalOpen = createSelector(
  selectModalState,
  (state: ModalState) => state?.isOpen || false
);

export const selectModalType = createSelector(
  selectModalState,
  (state: ModalState) => state?.type || null
);

export const selectModalData = createSelector(
  selectModalState,
  (state: ModalState) => state?.data || null
);

export const selectModalSelectedItem = createSelector(
  selectModalState,
  (state: ModalState) => state?.selectedItem || null
);

// Notification selectors
export const selectNotifications = createSelector(
  selectNotificationState,
  (state: NotificationState) => state?.notifications || []
);

export const selectUnreadNotifications = createSelector(
  selectNotifications,
  (notifications) => (notifications || []).filter(n => n && !n.read)
);

export const selectUnreadNotificationCount = createSelector(
  selectUnreadNotifications,
  (notifications) => (notifications || []).length
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