import { createAction, props } from '@ngrx/store';
import { Position, Size } from '../../models/editor.model';

// Selection Actions
export const selectElement = createAction(
  '[UI] Select Element',
  props<{ elementId: string | null }>()
);

export const selectSection = createAction(
  '[UI] Select Section',
  props<{ sectionId: string | null }>()
);

export const hoverElement = createAction(
  '[UI] Hover Element',
  props<{ elementId: string | null }>()
);

export const clearSelection = createAction(
  '[UI] Clear Selection'
);

// Drag and Drop Actions
export const startDragElement = createAction(
  '[UI] Start Drag Element',
  props<{ elementId: string; sectionId: string }>()
);

export const dragElement = createAction(
  '[UI] Drag Element',
  props<{ position: Position }>()
);

export const endDragElement = createAction(
  '[UI] End Drag Element'
);

export const startDragSection = createAction(
  '[UI] Start Drag Section',
  props<{ sectionId: string }>()
);

export const dragSection = createAction(
  '[UI] Drag Section',
  props<{ position: Position }>()
);

export const endDragSection = createAction(
  '[UI] End Drag Section'
);

// Canvas Actions
export const setZoom = createAction(
  '[UI] Set Zoom',
  props<{ zoom: number }>()
);

export const setCanvasSize = createAction(
  '[UI] Set Canvas Size',
  props<{ size: Size }>()
);

export const setDevicePreview = createAction(
  '[UI] Set Device Preview',
  props<{ device: 'mobile' | 'tablet' | 'desktop' }>()
);

// Grid and Guides
export const toggleGrid = createAction(
  '[UI] Toggle Grid'
);

export const toggleRulers = createAction(
  '[UI] Toggle Rulers'
);

export const toggleSnapToGrid = createAction(
  '[UI] Toggle Snap to Grid'
);

// Layout Actions
export const toggleSidebar = createAction(
  '[UI] Toggle Sidebar'
);

export const toggleToolbar = createAction(
  '[UI] Toggle Toolbar'
);

// Context Menu Actions
export const showContextMenu = createAction(
  '[UI] Show Context Menu',
  props<{
    position: Position;
    targetId: string;
    targetType: 'element' | 'section' | 'canvas';
  }>()
);

export const hideContextMenu = createAction(
  '[UI] Hide Context Menu'
);

// Modal Actions
export const openModal = createAction(
  '[UI] Open Modal',
  props<{
    modalType: string;
    data?: any;
    selectedItem?: any;
  }>()
);

export const closeModal = createAction(
  '[UI] Close Modal'
);

// Notification Actions
export const showNotification = createAction(
  '[UI] Show Notification',
  props<{
    notificationType: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    action?: { label: string; callback: () => void };
  }>()
);

export const hideNotification = createAction(
  '[UI] Hide Notification',
  props<{ notificationId: string }>()
);

export const clearNotifications = createAction(
  '[UI] Clear Notifications'
);

// Loading and Error States
export const setLoading = createAction(
  '[UI] Set Loading',
  props<{ loading: boolean; message?: string }>()
);

export const setError = createAction(
  '[UI] Set Error',
  props<{ error: string }>()
);

export const clearError = createAction(
  '[UI] Clear Error'
);

// Keyboard Shortcuts
export const registerShortcut = createAction(
  '[UI] Register Shortcut',
  props<{ key: string; action: string; ctrl?: boolean; shift?: boolean; alt?: boolean }>()
);

export const executeShortcut = createAction(
  '[UI] Execute Shortcut',
  props<{ shortcut: string }>()
);

// Theme and Appearance
export const setTheme = createAction(
  '[UI] Set Theme',
  props<{ theme: 'light' | 'dark' | 'auto' }>()
);

export const setLanguage = createAction(
  '[UI] Set Language',
  props<{ language: string }>()
);

// Performance Actions
export const enablePerformanceMode = createAction(
  '[UI] Enable Performance Mode'
);

export const disablePerformanceMode = createAction(
  '[UI] Disable Performance Mode'
);