import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, switchMap, withLatestFrom } from 'rxjs/operators';
import * as PageActions from '../actions/page.actions';
import { Page, PageSection } from '../../models/editor.model';
import { TemplateService } from '../../services/template.service';
import { VariantService } from '@negocio/shared-components';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import * as PageSelectors from '../selectors/page.selectors';

@Injectable()
export class PageEffects {

  private actions$ = inject(Actions);
  private templateService = inject(TemplateService);
  private variantService = inject(VariantService);
  private store = inject(Store<AppState>);

  // Persistence Effect: Keep VariantService in sync with Store
  syncWithVariantService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PageActions.updateElement,
        PageActions.updateSection,
        PageActions.moveElement,
        PageActions.addSection,
        PageActions.deleteSection,
        PageActions.loadPageSuccess
      ),
      tap((action: any) => {
        // Here we would typically get the whole state and save it
        // For now, let's call VariantService to save what changed
        console.log('Syncing Store -> VariantService due to action:', action.type);
      }),
      withLatestFrom(this.store.select(PageSelectors.selectCurrentPage)),
      tap(([action, currentPage]) => {
        if (currentPage) {
          // Sync sections to VariantService subjects
          (this.variantService as any).sectionsSubject.next(currentPage.sections as any);
          
          // Trigger manual save
          (this.variantService as any).saveToLocalStorage();
        }
      })
    ),
    { dispatch: false }
  );

  // Load Page Effect
  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.loadPage),
      mergeMap(({ pageId }) =>
        // TODO: Replace with actual API call when data-access layer is implemented
        this.mockLoadPage(pageId).pipe(
          map(page => PageActions.loadPageSuccess({ page })),
          catchError(error => of(PageActions.loadPageFailure({ error: error.message })))
        )
      )
    )
  );

  // Create Page Effect
  createPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.createPage),
      mergeMap(({ page }) =>
        // TODO: Replace with actual API call when data-access layer is implemented
        this.mockCreatePage(page).pipe(
          map(createdPage => PageActions.createPageSuccess({ page: createdPage })),
          catchError(error => of(PageActions.loadPageFailure({ error: error.message })))
        )
      )
    )
  );

  // Save Page Effect
  savePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.savePage),
      mergeMap(() =>
        // TODO: Replace with actual API call when data-access layer is implemented
        this.mockSavePage().pipe(
          map(({ page, timestamp }) => PageActions.savePageSuccess({ page, timestamp })),
          catchError(error => of(PageActions.savePageFailure({ error: error.message })))
        )
      )
    )
  );

  // Delete Page Effect
  deletePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.deletePage),
      mergeMap(({ pageId }) =>
        // TODO: Replace with actual API call when data-access layer is implemented
        this.mockDeletePage(pageId).pipe(
          map(() => ({ type: '[Page] Delete Page Success', pageId })),
          catchError(error => of(PageActions.loadPageFailure({ error: error.message })))
        )
      )
    )
  );

  // Duplicate Page Effect
  duplicatePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.duplicatePage),
      mergeMap(({ pageId, newName }) =>
        // TODO: Replace with actual API call when data-access layer is implemented
        this.mockDuplicatePage(pageId, newName).pipe(
          map(page => PageActions.createPageSuccess({ page })),
          catchError(error => of(PageActions.loadPageFailure({ error: error.message })))
        )
      )
    )
  );

  // Import Page Effect
  importPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.importPage),
      mergeMap(({ data, name }) =>
        // TODO: Implement actual import logic (file parsing, validation)
        this.mockImportPage(data, name).pipe(
          map(page => PageActions.createPageSuccess({ page })),
          catchError(error => of(PageActions.loadPageFailure({ error: error.message })))
        )
      )
    )
  );

  // Export Page Effect
  exportPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.exportPage),
      tap(({ format, options }) => {
        // TODO: Implement actual export logic (file generation, download)
        console.log(`Exporting page in ${format} format`, options);
        // This would typically trigger a file download
      })
    ),
    { dispatch: false }
  );

  // Apply Template Effect
  applyTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.applyTemplate),
      switchMap(({ templateId }) => {
        const sections = this.templateService.applyTemplate(templateId);
        // TODO: Create proper page structure from template sections
        const page: Page = {
          id: `page-${Date.now()}`,
          name: 'New Page from Template',
          slug: 'new-page-from-template',
          sections: sections.map((section: any, index: number) => ({
            id: section.id,
            type: section.type as any,
            name: section.name || 'Untitled Section',
            position: { x: 0, y: index },
            size: { width: 100, height: 200 },
            styles: section.styles || {},
            content: section.content || {},
            elements: section.elements || [],
            animations: section.animations || [],
            responsive: section.responsive || {
              mobile: { visible: true, styles: {} },
              tablet: { visible: true, styles: {} },
              desktop: { visible: true, styles: {} }
            },
            visible: section.visible !== undefined ? section.visible : true,
            locked: section.locked !== undefined ? section.locked : false,
            zIndex: section.zIndex || index + 1
          })),
          globalStyles: this.templateService.getTemplateById(templateId)?.globalStyles || {
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
            accentColor: '#000000',
            backgroundColor: '#ffffff',
            textColor: '#000000',
            fontFamily: 'Arial',
            fontSize: { h1: '2rem', h2: '1.5rem', h3: '1.25rem', body: '1rem' },
            spacing: { small: '0.5rem', medium: '1rem', large: '2rem' },
            borderRadius: '0',
            boxShadow: 'none',
            customCSS: ''
          },
          metadata: {
            title: 'New Page from Template',
            description: 'A page created from a template',
            keywords: [],
            author: 'current-user',
            customMeta: {}
          },
          versions: [],
          collaborators: [],
          published: false,
          settings: {
            seo: { title: '', description: '', keywords: [] },
            social: { ogImage: '', twitterCard: '' },
            analytics: { googleAnalyticsId: '', facebookPixelId: '' }
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          author: 'current-user',
          order: 0,
          visibleInHeader: true,
          visibleInFooter: true
        };
        return of(PageActions.createPageSuccess({ page }));
      })
    )
  );

  // Save As Template Effect
  saveAsTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.saveAsTemplate),
      tap(({ name, description, category }) => {
        // TODO: Implement save as template logic
        console.log(`Saving page as template: ${name}`, { description, category });
      })
    ),
    { dispatch: false }
  );

  // Mock implementations - replace with actual API calls
  private mockLoadPage(pageId: string) {
    return of({
      id: pageId,
      name: 'Sample Page',
      slug: 'sample-page',
      sections: [],
      globalStyles: {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        accentColor: '#000000',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Arial',
        fontSize: { h1: '2rem', h2: '1.5rem', h3: '1.25rem', body: '1rem' },
        spacing: { small: '0.5rem', medium: '1rem', large: '2rem' },
        borderRadius: '0',
        boxShadow: 'none',
        customCSS: ''
      },
      metadata: {
        title: 'Sample Page',
        description: 'A sample page',
        keywords: [],
        author: 'mock-user',
        customMeta: {}
      },
      versions: [],
      collaborators: [],
      published: false,
      settings: {
        seo: { title: '', description: '', keywords: [] },
        social: { ogImage: '', twitterCard: '' },
        analytics: { googleAnalyticsId: '', facebookPixelId: '' }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'mock-user',
      order: 0,
      visibleInHeader: true,
      visibleInFooter: true
    } as Page);
  }

  private mockCreatePage(pageData: Partial<Page>) {
    const page: Page = {
      id: `page-${Date.now()}`,
      name: pageData.name || 'New Page',
      slug: pageData.slug || 'new-page',
      sections: pageData.sections || [],
      globalStyles: pageData.globalStyles || {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        accentColor: '#000000',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Arial',
        fontSize: { h1: '2rem', h2: '1.5rem', h3: '1.25rem', body: '1rem' },
        spacing: { small: '0.5rem', medium: '1rem', large: '2rem' },
        borderRadius: '0',
        boxShadow: 'none',
        customCSS: ''
      },
      metadata: pageData.metadata || {
        title: pageData.name || 'New Page',
        description: '',
        keywords: [],
        author: 'current-user',
        customMeta: {}
      },
      versions: [],
      collaborators: [],
      published: pageData.published || false,
      settings: pageData.settings || {
        seo: { title: '', description: '', keywords: [] },
        social: { ogImage: '', twitterCard: '' },
        analytics: { googleAnalyticsId: '', facebookPixelId: '' }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'current-user',
      order: pageData.order || 0,
      visibleInHeader: pageData.visibleInHeader !== undefined ? pageData.visibleInHeader : true,
      visibleInFooter: pageData.visibleInFooter !== undefined ? pageData.visibleInFooter : true
    };
    return of(page);
  }

  private mockSavePage() {
    return of({
      page: {} as Page, // Would be the actual saved page
      timestamp: new Date()
    });
  }

  private mockDeletePage(pageId: string) {
    return of({ pageId });
  }

  private mockDuplicatePage(pageId: string, newName: string) {
    return of({
      id: `page-${Date.now()}`,
      name: newName,
      slug: newName.toLowerCase().replace(/\s+/g, '-'),
      sections: [], // Would copy sections from original page
      globalStyles: {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        accentColor: '#000000',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Arial',
        fontSize: { h1: '2rem', h2: '1.5rem', h3: '1.25rem', body: '1rem' },
        spacing: { small: '0.5rem', medium: '1rem', large: '2rem' },
        borderRadius: '0',
        boxShadow: 'none',
        customCSS: ''
      },
      metadata: {
        title: newName,
        description: '',
        keywords: [],
        author: 'current-user',
        customMeta: {}
      },
      versions: [],
      collaborators: [],
      published: false,
      settings: {
        seo: { title: '', description: '', keywords: [] },
        social: { ogImage: '', twitterCard: '' },
        analytics: { googleAnalyticsId: '', facebookPixelId: '' }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'current-user',
      order: 0,
      visibleInHeader: true,
      visibleInFooter: true
    } as Page);
  }

  private mockImportPage(data: any, name: string) {
    // TODO: Parse imported data and validate
    const page: Page = {
      id: `imported-${Date.now()}`,
      name: name,
      slug: data.slug || 'imported-page',
      sections: data.sections || [],
      globalStyles: data.globalStyles || {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        accentColor: '#000000',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Arial',
        fontSize: { h1: '2rem', h2: '1.5rem', h3: '1.25rem', body: '1rem' },
        spacing: { small: '0.5rem', medium: '1rem', large: '2rem' },
        borderRadius: '0',
        boxShadow: 'none',
        customCSS: ''
      },
      metadata: data.metadata || {
        title: name,
        description: '',
        keywords: [],
        author: 'current-user',
        customMeta: {}
      },
      versions: [],
      collaborators: [],
      published: data.published || false,
      settings: data.settings || {
        seo: { title: '', description: '', keywords: [] },
        social: { ogImage: '', twitterCard: '' },
        analytics: { googleAnalyticsId: '', facebookPixelId: '' }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'current-user',
      order: data.order || 0,
      visibleInHeader: data.visibleInHeader !== undefined ? data.visibleInHeader : true,
      visibleInFooter: data.visibleInFooter !== undefined ? data.visibleInFooter : true
    };
    return of(page);
  }
}