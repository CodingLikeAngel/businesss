import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PageState, EditorFeatureState } from '../state/app.state';
import { Page, Section, Element } from '../../models/editor.model';

// Feature selector
export const selectEditorFeature = createFeatureSelector<EditorFeatureState>('editor');

// Page state selectors
export const selectPageState = createSelector(
  selectEditorFeature,
  (state: EditorFeatureState) => state?.page
);

export const selectCurrentPage = createSelector(
  selectPageState,
  (state: PageState) => state?.currentPage
);

export const selectPages = createSelector(
  selectPageState,
  (state: PageState) => state?.pages || []
);

export const selectPageLoading = createSelector(
  selectPageState,
  (state: PageState) => state?.loading || false
);

export const selectPageSaving = createSelector(
  selectPageState,
  (state: PageState) => state?.saving || false
);

export const selectPageError = createSelector(
  selectPageState,
  (state: PageState) => state?.error || null
);

export const selectHasUnsavedChanges = createSelector(
  selectPageState,
  (state: PageState) => state?.hasUnsavedChanges || false
);

export const selectLastSaved = createSelector(
  selectPageState,
  (state: PageState) => state?.lastSaved || null
);

/** Keep only the first occurrence of each section type. Fixes "all sections duplicated" (Hero, Features, Contact each showing twice). */
function deduplicateByTypeKeepFirst<T extends { type?: string }>(sections: T[]): T[] {
  if (!sections?.length) return sections;
  const seen = new Set<string>();
  return sections.filter((s) => {
    const type = (s.type || '').toLowerCase();
    if (seen.has(type)) return false;
    seen.add(type);
    return true;
  });
}

/** @deprecated Use deduplicateByTypeKeepFirst. Kept for compatibility. */
const deduplicateSingleInstanceSections = deduplicateByTypeKeepFirst;

/** Remove duplicate sections by id (first occurrence kept). Fixes "all sections duplicated" when array is repeated. */
function deduplicateSectionsById<T extends { id?: string }>(sections: T[]): T[] {
  if (!sections?.length) return sections;
  const seen = new Set<string>();
  return sections.filter((s) => {
    const id = s.id ?? '';
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/** If the array is exactly two copies of the same type sequence (e.g. [hero, features, hero, features]), keep only the first half. */
function removeDuplicateSequence<T extends { type?: string }>(sections: T[]): T[] {
  if (!sections?.length || sections.length < 2) return sections;
  const half = Math.floor(sections.length / 2);
  if (sections.length !== half * 2) return sections;
  const types = (s: T) => (s.type || '').toLowerCase();
  const firstTypes = sections.slice(0, half).map(types).join('\0');
  const secondTypes = sections.slice(half).map(types).join('\0');
  if (firstTypes !== secondTypes) return sections;
  return sections.slice(0, half);
}

// Current page derived selectors
export const selectCurrentPageSections = createSelector(
  selectCurrentPage,
  (page: Page | null) => page?.sections || []
);

/** Sections deduped: remove duplicate sequence, by id, then one per type (first only). Use for editor canvas. */
export const selectCurrentPageSectionsDeduped = createSelector(
  selectCurrentPageSections,
  (sections: Section[]) =>
    deduplicateByTypeKeepFirst(
      deduplicateSectionsById(removeDuplicateSequence(sections || []))
    )
);

export const selectCurrentPageGlobalStyles = createSelector(
  selectCurrentPage,
  (page: Page | null) => page?.globalStyles
);

export const selectCurrentPageMetadata = createSelector(
  selectCurrentPage,
  (page: Page | null) => page?.metadata
);

// Section selectors
export const selectSectionById = (sectionId: string) => createSelector(
  selectCurrentPageSections,
  (sections: Section[]) => (sections || []).find(section => section.id === sectionId) || null
);

export const selectSectionsByType = (type: string) => createSelector(
  selectCurrentPageSections,
  (sections: Section[]) => (sections || []).filter(section => section.type === type)
);

export const selectVisibleSections = createSelector(
  selectCurrentPageSections,
  (sections: Section[]) => (sections || []).filter(section => section.visible)
);

// Element selectors
export const selectElementsInSection = (sectionId: string) => createSelector(
  selectSectionById(sectionId),
  (section: Section | null) => section?.elements || []
);

export const selectElementById = (sectionId: string, elementId: string) => createSelector(
  selectElementsInSection(sectionId),
  (elements: Element[]) => (elements || []).find(element => element.id === elementId) || null
);

export const selectAllElements = createSelector(
  selectCurrentPageSections,
  (sections: Section[]) => (sections || []).flatMap(section => section.elements || [])
);

export const selectElementsByType = (type: string) => createSelector(
  selectAllElements,
  (elements: Element[]) => (elements || []).filter(element => element.type === type)
);

export const selectVisibleElements = createSelector(
  selectAllElements,
  (elements: Element[]) => (elements || []).filter(element => element.visible)
);

// Statistics selectors
export const selectPageStats = createSelector(
  selectCurrentPage,
  (page: Page | null | undefined) => {
    if (!page || !page.sections) return { sections: 0, elements: 0, visibleSections: 0, visibleElements: 0 };

    const sections = page.sections || [];
    const elements = sections.flatMap(s => s.elements || []);

    return {
      sections: sections.length,
      elements: elements.length,
      visibleSections: sections.filter(s => s.visible).length,
      visibleElements: elements.filter(e => e.visible).length,
    };
  }
);

// Version control selectors
export const selectPageVersions = createSelector(
  selectCurrentPage,
  (page: Page | null) => page?.versions || []
);

export const selectLatestVersion = createSelector(
  selectPageVersions,
  (versions) => (versions || []).length > 0 ? versions[versions.length - 1] : null
);

// Collaboration selectors
export const selectCollaborators = createSelector(
  selectCurrentPage,
  (page: Page | null) => page?.collaborators || []
);

export const selectActiveCollaborators = createSelector(
  selectCollaborators,
  (collaborators) => (collaborators || []).filter(c => {
    if (!c || !c.lastActive) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(c.lastActive) > fiveMinutesAgo;
  })
);
