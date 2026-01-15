import { createReducer, on } from '@ngrx/store';
import { PageState } from '../state/app.state';
import * as PageActions from '../actions/page.actions';
import { Page, Section, Element } from '../../models/editor.model';

export const initialPageState: PageState = {
  currentPage: null,
  pages: [],
  loading: false,
  error: null,
  saving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
};

export const pageReducer = createReducer(
  initialPageState,

  // Load Page
  on(PageActions.loadPage, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PageActions.loadPageSuccess, (state, { page }) => ({
    ...state,
    currentPage: page,
    loading: false,
    hasUnsavedChanges: false,
  })),

  on(PageActions.loadPageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Page
  on(PageActions.createPage, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PageActions.createPageSuccess, (state, { page }) => ({
    ...state,
    currentPage: page,
    pages: [...state.pages, page],
    loading: false,
    hasUnsavedChanges: false,
  })),

  // Update Page
  on(PageActions.updatePage, (state, { page: updates }) => {
    if (!state.currentPage) return state;

    const updatedPage = { ...state.currentPage, ...updates, updatedAt: new Date() };
    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Save Page
  on(PageActions.savePage, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),

  on(PageActions.savePageSuccess, (state, { page, timestamp }) => ({
    ...state,
    currentPage: page,
    saving: false,
    lastSaved: timestamp,
    hasUnsavedChanges: false,
  })),

  on(PageActions.savePageFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  // Add Section
  on(PageActions.addSection, (state, { section, position }) => {
    if (!state.currentPage) return state;

    const sections = [...state.currentPage.sections];
    if (position !== undefined && position >= 0 && position <= sections.length) {
      sections.splice(position, 0, section);
    } else {
      sections.push(section);
    }

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Update Section
  on(PageActions.updateSection, (state, { sectionId, changes }) => {
    if (!state.currentPage) return state;

    const sections = state.currentPage.sections.map(section =>
      section.id === sectionId
        ? { ...section, ...changes, updatedAt: new Date() }
        : section
    );

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Delete Section
  on(PageActions.deleteSection, (state, { sectionId }) => {
    if (!state.currentPage) return state;

    const sections = state.currentPage.sections.filter(section => section.id !== sectionId);

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Move Section
  on(PageActions.moveSection, (state, { sectionId, newPosition }) => {
    if (!state.currentPage) return state;

    const sections = [...state.currentPage.sections];
    const sectionIndex = sections.findIndex(section => section.id === sectionId);

    if (sectionIndex === -1) return state;

    const [movedSection] = sections.splice(sectionIndex, 1);
    sections.splice(newPosition, 0, movedSection);

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Add Element
  on(PageActions.addElement, (state, { sectionId, element }) => {
    if (!state.currentPage) return state;

    const sections = state.currentPage.sections.map(section =>
      section.id === sectionId
        ? { ...section, elements: [...section.elements, element] }
        : section
    );

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Update Element
  on(PageActions.updateElement, (state, { sectionId, elementId, changes }) => {
    if (!state.currentPage) return state;

    const sections = state.currentPage.sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            elements: section.elements.map(element =>
              element.id === elementId
                ? { ...element, ...changes }
                : element
            )
          }
        : section
    );

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Delete Element
  on(PageActions.deleteElement, (state, { sectionId, elementId }) => {
    if (!state.currentPage) return state;

    const sections = state.currentPage.sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            elements: section.elements.filter(element => element.id !== elementId)
          }
        : section
    );

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Move Element
  on(PageActions.moveElement, (state, { sectionId, elementId, newPosition }) => {
    if (!state.currentPage) return state;

    const sections = state.currentPage.sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            elements: section.elements.map(element =>
              element.id === elementId
                ? { ...element, position: newPosition }
                : element
            )
          }
        : section
    );

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Bulk Updates
  on(PageActions.bulkUpdateSections, (state, { updates }) => {
    if (!state.currentPage) return state;

    const sections = state.currentPage.sections.map(section => {
      const update = updates.find(u => u.sectionId === section.id);
      return update ? { ...section, ...update.changes } : section;
    });

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),

  on(PageActions.bulkUpdateElements, (state, { updates }) => {
    if (!state.currentPage) return state;

    const sections = state.currentPage.sections.map(section => ({
      ...section,
      elements: section.elements.map(element => {
        const update = updates.find(u => u.sectionId === section.id && u.elementId === element.id);
        return update ? { ...element, ...update.changes } : element;
      })
    }));

    const updatedPage = {
      ...state.currentPage,
      sections,
      updatedAt: new Date(),
    };

    return {
      ...state,
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    };
  }),
);