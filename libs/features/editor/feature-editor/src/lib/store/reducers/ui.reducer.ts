import { createReducer, on } from '@ngrx/store';
import { EditorUIState, ModalState, NotificationState } from '../../models/editor.model';
import * as UIActions from '../actions/ui.actions';

export const initialUIState: EditorUIState = {
  selectedElementId: null,
  selectedSectionId: null,
  hoveredElementId: null,
  draggedElementId: null,
  draggedSectionId: null,
  zoom: 1,
  canvasSize: { width: 1200, height: 800 },
  showGrid: true,
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
};

export const initialModalState: ModalState = {
  isOpen: false,
  type: 'element-settings',
};

export const initialNotificationState: NotificationState = {
  notifications: [],
};

export const uiReducer = createReducer(
  initialUIState,

  // Selection Actions
  on(UIActions.selectElement, (state, { elementId }) => ({
    ...state,
    selectedElementId: elementId,
    selectedSectionId: null, // Clear section selection when selecting element
  })),

  on(UIActions.selectSection, (state, { sectionId }) => ({
    ...state,
    selectedSectionId: sectionId,
    selectedElementId: null, // Clear element selection when selecting section
  })),

  on(UIActions.hoverElement, (state, { elementId }) => ({
    ...state,
    hoveredElementId: elementId,
  })),

  on(UIActions.clearSelection, (state) => ({
    ...state,
    selectedElementId: null,
    selectedSectionId: null,
  })),

  // Drag and Drop Actions
  on(UIActions.startDragElement, (state, { elementId }) => ({
    ...state,
    draggedElementId: elementId,
  })),

  on(UIActions.endDragElement, (state) => ({
    ...state,
    draggedElementId: null,
  })),

  on(UIActions.startDragSection, (state, { sectionId }) => ({
    ...state,
    draggedSectionId: sectionId,
  })),

  on(UIActions.endDragSection, (state) => ({
    ...state,
    draggedSectionId: null,
  })),

  // Canvas Actions
  on(UIActions.setZoom, (state, { zoom }) => ({
    ...state,
    zoom: Math.max(0.1, Math.min(3, zoom)), // Clamp between 0.1 and 3
  })),

  on(UIActions.setCanvasSize, (state, { size }) => ({
    ...state,
    canvasSize: size,
  })),

  on(UIActions.setDevicePreview, (state, { device }) => ({
    ...state,
    devicePreview: device,
  })),

  // Grid and Guides
  on(UIActions.toggleGrid, (state) => ({
    ...state,
    showGrid: !state.showGrid,
  })),

  on(UIActions.toggleRulers, (state) => ({
    ...state,
    showRulers: !state.showRulers,
  })),

  on(UIActions.toggleSnapToGrid, (state) => ({
    ...state,
    snapToGrid: !state.snapToGrid,
  })),

  // Layout Actions
  on(UIActions.toggleSidebar, (state) => ({
    ...state,
    sidebarOpen: !state.sidebarOpen,
  })),

  on(UIActions.toggleToolbar, (state) => ({
    ...state,
    toolbarVisible: !state.toolbarVisible,
  })),

  // Context Menu Actions
  on(UIActions.showContextMenu, (state, { position, targetId, targetType }) => ({
    ...state,
    contextMenu: {
      visible: true,
      position,
      targetId,
      targetType,
    },
  })),

  on(UIActions.hideContextMenu, (state) => ({
    ...state,
    contextMenu: {
      ...state.contextMenu,
      visible: false,
    },
  })),
);

export const modalReducer = createReducer(
  initialModalState,

  on(UIActions.openModal, (state, { modalType, data, selectedItem }) => ({
    isOpen: true,
    type: modalType as any, // TODO: Update modal types to be more flexible
    data,
    selectedItem,
  })),

  on(UIActions.closeModal, (state) => ({
    ...state,
    isOpen: false,
  })),
);

export const notificationReducer = createReducer(
  initialNotificationState,

  on(UIActions.showNotification, (state, { notificationType, title, message, action }) => ({
    ...state,
    notifications: [
      ...state.notifications,
      {
        id: Date.now().toString(),
        type: notificationType,
        title,
        message,
        timestamp: new Date(),
        read: false,
        action,
      },
    ],
  })),

  on(UIActions.hideNotification, (state, { notificationId }) => ({
    ...state,
    notifications: state.notifications.filter(n => n.id !== notificationId),
  })),

  on(UIActions.clearNotifications, (state) => ({
    ...state,
    notifications: [],
  })),
);