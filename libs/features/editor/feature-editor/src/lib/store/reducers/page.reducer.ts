import { createReducer, on } from '@ngrx/store';
import { PageState, initialNavigationState, initialPreviewState, initialMigrationState } from '../state/app.state';
import * as PageActions from '../actions/page.actions';
import { Page, Section, Element, NavigationState, PreviewState, MigrationState, MigrationRecord } from '../../models/editor.model';

export const initialPageState: PageState = {
  currentPage: null,
  pages: [],
  loading: false,
  error: null,
  saving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  navigationState: initialNavigationState,
  preview: initialPreviewState,
  migration: initialMigrationState,
};

export const pageReducer = createReducer(
  initialPageState,

  // Load Page
  on(PageActions.loadPage, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PageActions.loadPageSuccess, (state, { page }) => {
    // Ensure backward compatibility by setting default values
    const compatiblePage: Page = {
      ...page,
      visibleInHeader: page.visibleInHeader !== undefined ? page.visibleInHeader : true,
      visibleInFooter: page.visibleInFooter !== undefined ? page.visibleInFooter : false,
      isHomePage: page.isHomePage !== undefined ? page.isHomePage : false,
      order: page.order !== undefined ? page.order : 0,
    };

    return {
      ...state,
      currentPage: compatiblePage,
      loading: false,
      hasUnsavedChanges: false,
    };
  }),

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

  on(PageActions.createPageSuccess, (state, { page }) => {
    // Ensure backward compatibility by setting default values
    const compatiblePage: Page = {
      ...page,
      visibleInHeader: page.visibleInHeader !== undefined ? page.visibleInHeader : true,
      visibleInFooter: page.visibleInFooter !== undefined ? page.visibleInFooter : false,
      isHomePage: page.isHomePage !== undefined ? page.isHomePage : false,
      order: page.order !== undefined ? page.order : state.pages.length,
    };

    return {
      ...state,
      currentPage: compatiblePage,
      pages: [...state.pages, compatiblePage],
      loading: false,
      hasUnsavedChanges: false,
    };
  }),

  // Update Page
  on(PageActions.updatePage, (state, { pageId, changes }) => {
    const pages = state.pages.map(page =>
      page.id === pageId ? { ...page, ...changes, updatedAt: new Date() } : page
    );
    
    const updatedCurrentPage = state.currentPage?.id === pageId 
      ? { ...state.currentPage, ...changes, updatedAt: new Date() }
      : state.currentPage;

    return {
      ...state,
      pages,
      currentPage: updatedCurrentPage,
      hasUnsavedChanges: true,
    };
  }),

  // Toggle Page Visibility
  on(PageActions.togglePageVisibility, (state, { pageId, visibilityType }) => {
    const pages = state.pages.map(page =>
      page.id === pageId 
        ? { 
            ...page, 
            [visibilityType === 'header' ? 'visibleInHeader' : 'visibleInFooter']: !page[visibilityType === 'header' ? 'visibleInHeader' : 'visibleInFooter'],
            updatedAt: new Date() 
          }
        : page
    );

    const updatedCurrentPage = state.currentPage?.id === pageId
      ? { 
          ...state.currentPage,
          [visibilityType === 'header' ? 'visibleInHeader' : 'visibleInFooter']: !state.currentPage[visibilityType === 'header' ? 'visibleInHeader' : 'visibleInFooter'],
          updatedAt: new Date()
        }
      : state.currentPage;

    return {
      ...state,
      pages,
      currentPage: updatedCurrentPage,
      hasUnsavedChanges: true,
    };
  }),

  // Set Home Page
  on(PageActions.setHomePage, (state, { pageId }) => {
    const pages = state.pages.map(page => ({
      ...page,
      isHomePage: page.id === pageId
    }));

    const updatedCurrentPage = state.currentPage?.id === pageId
      ? { ...state.currentPage, isHomePage: true }
      : state.currentPage;

    return {
      ...state,
      pages,
      currentPage: updatedCurrentPage,
      hasUnsavedChanges: true,
    };
  }),

  // Update Navigation Links
  on(PageActions.updateNavigationLinks, (state, { headerLinks, footerLinks }) => {
    const editorState = state as any;
    return {
      ...state,
      navigation: {
        ...editorState.navigation,
        headerLinks,
        footerLinks,
      },
      hasUnsavedChanges: true,
    };
  }),

  // Set Global Header
  on(PageActions.setGlobalHeader, (state, { headerId }) => {
    const editorState = state as any;
    return {
      ...state,
      navigation: {
        ...editorState.navigation,
        globalHeaderId: headerId,
      },
      hasUnsavedChanges: true,
    };
  }),

  // Set Global Footer
  on(PageActions.setGlobalFooter, (state, { footerId }) => {
    const editorState = state as any;
    return {
      ...state,
      navigation: {
        ...editorState.navigation,
        globalFooterId: footerId,
      },
      hasUnsavedChanges: true,
    };
  }),

  // Delete Page
  on(PageActions.deletePage, (state, { pageId }) => ({
    ...state,
    pages: state.pages.filter(page => page.id !== pageId),
    currentPage: state.currentPage?.id === pageId ? null : state.currentPage,
    hasUnsavedChanges: true,
  })),

  // Duplicate Page
  on(PageActions.duplicatePage, (state, { pageId, newName }) => {
    const pageToDuplicate = state.pages.find(page => page.id === pageId);
    if (!pageToDuplicate) return state;

    const duplicatedPage: Page = {
      ...pageToDuplicate,
      id: Math.random().toString(36).substring(2, 11),
      name: newName,
      slug: newName.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      ...state,
      pages: [...state.pages, duplicatedPage],
      currentPage: duplicatedPage,
      hasUnsavedChanges: true,
    };
  }),

  // Reorder Pages
  on(PageActions.reorderPages, (state, { pageIds }) => {
    const reorderedPages = pageIds.map(id => state.pages.find(page => page.id === id)).filter(Boolean) as Page[];
    return {
      ...state,
      pages: reorderedPages,
      hasUnsavedChanges: true,
    };
  }),

  // Set Current Page
  on(PageActions.setCurrentPage, (state, { pageId }) => {
    const page = state.pages.find(p => p.id === pageId);
    return {
      ...state,
      currentPage: page || null,
    };
  }),

  // Navigation Actions
  on(PageActions.navigateToPage, (state, { pageId, path }) => ({
    ...state,
    navigationState: {
      ...state.navigationState,
      currentPath: path,
      activePageId: pageId,
      isNavigating: true,
    },
  })),

  on(PageActions.updateBreadcrumbs, (state, { breadcrumbs }) => ({
    ...state,
    navigationState: {
      ...state.navigationState,
      breadcrumbs,
    },
  })),

  on(PageActions.navigationStarted, (state) => ({
    ...state,
    navigationState: {
      ...state.navigationState,
      isNavigating: true,
    },
  })),

  on(PageActions.navigationCompleted, (state) => ({
    ...state,
    navigationState: {
      ...state.navigationState,
      isNavigating: false,
    },
  })),

  // Preview Actions
  on(PageActions.enterPreviewMode, (state, { pageId }) => ({
    ...state,
    preview: {
      ...state.preview,
      isPreviewMode: true,
      previewPageId: pageId,
    },
  })),

  on(PageActions.exitPreviewMode, (state) => ({
    ...state,
    preview: {
      ...state.preview,
      isPreviewMode: false,
      previewPageId: null,
    },
  })),

  on(PageActions.setPreviewDevice, (state, { device }) => ({
    ...state,
    preview: {
      ...state.preview,
      previewDevice: device,
    },
  })),

  on(PageActions.togglePreviewGrid, (state) => ({
    ...state,
    preview: {
      ...state.preview,
      showGrid: !state.preview.showGrid,
    },
  })),

  on(PageActions.togglePreviewRulers, (state) => ({
    ...state,
    preview: {
      ...state.preview,
      showRulers: !state.preview.showRulers,
    },
  })),

  // Migration Actions
  on(PageActions.startMigration, (state, { fromVersion, toVersion }) => ({
    ...state,
    migration: {
      ...state.migration,
      migrationHistory: [
        ...state.migration.migrationHistory,
        {
          id: Math.random().toString(36).substring(2, 11),
          fromVersion,
          toVersion,
          timestamp: new Date(),
          status: 'pending',
        },
      ],
    },
  })),

  on(PageActions.migrationSuccess, (state, { record }) => ({
    ...state,
    migration: {
      ...state.migration,
      version: record.toVersion,
      lastMigrated: new Date(),
      migrationHistory: state.migration.migrationHistory.map(r =>
        r.id === record.id ? { ...r, status: 'success', details: 'Migration completed successfully' } : r
      ),
    },
  })),

  on(PageActions.migrationFailure, (state, { error, fromVersion, toVersion }) => {
    const pendingRecord = state.migration.migrationHistory.find((r: MigrationRecord) => r.fromVersion === fromVersion && r.toVersion === toVersion && r.status === 'pending');
    
    return {
      ...state,
      migration: {
        ...state.migration,
        migrationHistory: pendingRecord ? state.migration.migrationHistory.map((r: MigrationRecord) =>
          r.id === pendingRecord.id 
            ? { 
                ...r, 
                status: 'failed', 
                details: `Migration failed: ${error}` 
              } 
            : r
        ) : state.migration.migrationHistory,
      },
    };
  }),

  on(PageActions.updateMigrationState, (state, { state: updates }) => ({
    ...state,
    migration: {
      ...state.migration,
      ...updates,
    },
  })),

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
  on(PageActions.addSection, (state, { section, pageId, position }) => {
    const targetPage = state.pages.find(p => p.id === pageId) || state.currentPage;
    if (!targetPage) return state;

    const sections = [...targetPage.sections];
    if (position !== undefined && position >= 0 && position <= sections.length) {
      sections.splice(position, 0, section);
    } else {
      sections.push(section);
    }

    const updatedPage = {
      ...targetPage,
      sections,
      updatedAt: new Date(),
    };

    const updatedPages = state.pages.map(p => p.id === updatedPage.id ? updatedPage : p);
    const updatedCurrentPage = state.currentPage?.id === updatedPage.id ? updatedPage : state.currentPage;

    return {
      ...state,
      pages: updatedPages,
      currentPage: updatedCurrentPage,
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