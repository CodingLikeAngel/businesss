import { createAction, props } from '@ngrx/store';
import { Page, Section, Element, PageVersion } from '../../models/editor.model';

// Page Actions
export const loadPage = createAction(
  '[Page] Load Page',
  props<{ pageId: string }>()
);

export const loadPageSuccess = createAction(
  '[Page] Load Page Success',
  props<{ page: Page }>()
);

export const loadPageFailure = createAction(
  '[Page] Load Page Failure',
  props<{ error: string }>()
);

export const createPage = createAction(
  '[Page] Create Page',
  props<{ page: Partial<Page> }>()
);

export const createPageSuccess = createAction(
  '[Page] Create Page Success',
  props<{ page: Page }>()
);

export const updatePage = createAction(
  '[Page] Update Page',
  props<{ page: Partial<Page> }>()
);

export const savePage = createAction(
  '[Page] Save Page'
);

export const savePageSuccess = createAction(
  '[Page] Save Page Success',
  props<{ page: Page; timestamp: Date }>()
);

export const savePageFailure = createAction(
  '[Page] Save Page Failure',
  props<{ error: string }>()
);

export const deletePage = createAction(
  '[Page] Delete Page',
  props<{ pageId: string }>()
);

export const duplicatePage = createAction(
  '[Page] Duplicate Page',
  props<{ pageId: string; newName: string }>()
);

// Section Actions
export const addSection = createAction(
  '[Page] Add Section',
  props<{ section: Section; position?: number }>()
);

export const updateSection = createAction(
  '[Page] Update Section',
  props<{ sectionId: string; changes: Partial<Section> }>()
);

export const deleteSection = createAction(
  '[Page] Delete Section',
  props<{ sectionId: string }>()
);

export const moveSection = createAction(
  '[Page] Move Section',
  props<{ sectionId: string; newPosition: number }>()
);

export const duplicateSection = createAction(
  '[Page] Duplicate Section',
  props<{ sectionId: string }>()
);

// Element Actions
export const addElement = createAction(
  '[Page] Add Element',
  props<{ sectionId: string; element: Element }>()
);

export const updateElement = createAction(
  '[Page] Update Element',
  props<{ sectionId: string; elementId: string; changes: Partial<Element> }>()
);

export const deleteElement = createAction(
  '[Page] Delete Element',
  props<{ sectionId: string; elementId: string }>()
);

export const moveElement = createAction(
  '[Page] Move Element',
  props<{ sectionId: string; elementId: string; newPosition: { x: number; y: number } }>()
);

export const duplicateElement = createAction(
  '[Page] Duplicate Element',
  props<{ sectionId: string; elementId: string }>()
);

// Version Control Actions
export const createVersion = createAction(
  '[Page] Create Version',
  props<{ name: string; description?: string }>()
);

export const restoreVersion = createAction(
  '[Page] Restore Version',
  props<{ versionId: string }>()
);

export const deleteVersion = createAction(
  '[Page] Delete Version',
  props<{ versionId: string }>()
);

// Bulk Actions
export const bulkUpdateSections = createAction(
  '[Page] Bulk Update Sections',
  props<{ updates: { sectionId: string; changes: Partial<Section> }[] }>()
);

export const bulkUpdateElements = createAction(
  '[Page] Bulk Update Elements',
  props<{ updates: { sectionId: string; elementId: string; changes: Partial<Element> }[] }>()
);

// Import/Export Actions
export const importPage = createAction(
  '[Page] Import Page',
  props<{ data: any; name: string }>()
);

export const exportPage = createAction(
  '[Page] Export Page',
  props<{ format: string; options?: any }>()
);

// Collaboration Actions
export const joinCollaboration = createAction(
  '[Page] Join Collaboration',
  props<{ pageId: string }>()
);

export const leaveCollaboration = createAction(
  '[Page] Leave Collaboration'
);

export const updateCollaboratorCursor = createAction(
  '[Page] Update Collaborator Cursor',
  props<{ collaboratorId: string; position: { x: number; y: number } }>()
);

// Template Actions
export const applyTemplate = createAction(
  '[Page] Apply Template',
  props<{ templateId: string }>()
);

export const saveAsTemplate = createAction(
  '[Page] Save As Template',
  props<{ name: string; description?: string; category?: string }>()
);