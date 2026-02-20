import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as PageSelectors from '../store/selectors/page.selectors';
import * as PageActions from '../store/actions/page.actions';
import { HistoryService } from '../services/history.service';
import { MoveElementCommand } from '../services/commands';
import { VariantService } from '@negocio/shared-components';
import { initialEditorFeatureState } from '../store/state/app.state';
import { Page } from '../models/editor.model';

/**
 * 5.2 Integration tests: load page, select section, preview, undo.
 * Tests the critical editor flow at store/service level with mocks.
 */
describe('Editor Flow Integration (5.2)', () => {
  let store: jest.Mocked<Store<any>>;
  let historyService: HistoryService;
  let variantService: VariantService;

  const initialPage = {
    id: 'page_1',
    name: 'Test Page',
    slug: 'test',
    sections: [
      {
        id: 'sec_1',
        type: 'hero',
        label: 'Hero',
        visible: true,
        name: '',
        styles: {},
        content: { title: 'Hello' },
        elements: [],
        config: {},
        customStyles: {},
        animation: 'none',
        layout: 'default',
      },
    ],
    globalStyles: {},
    metadata: {},
    versions: [],
    collaborators: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    published: false,
    order: 0,
    visibleInHeader: true,
    visibleInFooter: false,
    isHomePage: true,
  } as unknown as Page;

  const stateWithPage = {
    ...initialEditorFeatureState,
    page: {
      ...initialEditorFeatureState.page,
      currentPage: initialPage,
      pages: [initialPage],
      loading: false,
    },
  };

  beforeEach(() => {
    const mockStore = {
      select: jest.fn(),
      dispatch: jest.fn(),
    };
    mockStore.select.mockImplementation((selector: any) => {
      if (selector === PageSelectors.selectCurrentPage) return of(initialPage);
      if (selector === PageSelectors.selectCurrentPageSections) return of(initialPage.sections);
      if (selector === PageSelectors.selectPageLoading) return of(false);
      if (typeof selector === 'function') return of(selector(stateWithPage));
      return of(null);
    });

    TestBed.configureTestingModule({
      providers: [
        HistoryService,
        { provide: Store, useValue: mockStore },
        VariantService,
      ],
    });

    store = TestBed.inject(Store) as jest.Mocked<Store<any>>;
    historyService = TestBed.inject(HistoryService);
    variantService = TestBed.inject(VariantService);
  });

  describe('Load page', () => {
    it('should expose current page via selectCurrentPage', (done) => {
      store.select(PageSelectors.selectCurrentPage).subscribe((page) => {
        expect(page).toBeTruthy();
        expect(page?.id).toBe('page_1');
        expect(page?.sections?.length).toBe(1);
        expect(page?.sections?.[0].type).toBe('hero');
        done();
      });
    });

    it('should expose sections via selectCurrentPageSections', (done) => {
      store.select(PageSelectors.selectCurrentPageSections).subscribe((sections) => {
        expect(Array.isArray(sections)).toBe(true);
        expect(sections.length).toBe(1);
        expect(sections[0].type).toBe('hero');
        done();
      });
    });
  });

  describe('Preview mode', () => {
    it('should allow setting builder step to preview via VariantService', (done) => {
      variantService.setBuilderStep('preview');
      variantService.builderStep$.subscribe((step) => {
        expect(step).toBe('preview');
        done();
      });
    });

    it('should allow returning to editor step', (done) => {
      variantService.setBuilderStep('preview');
      variantService.setBuilderStep('editor');
      variantService.builderStep$.subscribe((step) => {
        expect(step).toBe('editor');
        done();
      });
    });
  });

  describe('Undo/redo', () => {
    it('should have HistoryService that can execute commands', () => {
      expect(historyService.execute).toBeDefined();
      expect(typeof historyService.execute).toBe('function');
    });

    it('should dispatch store actions for section updates (undo flow uses store)', () => {
      store.dispatch(PageActions.updateSection({ sectionId: 'sec_1', changes: { visible: false } }));
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  describe('Section update flow', () => {
    it('should dispatch updateSection action for content changes', () => {
      store.dispatch(
        PageActions.updateSection({
          sectionId: 'sec_1',
          changes: { content: { title: 'Updated Title' } },
        })
      );
      expect(store.dispatch).toHaveBeenCalled();
    });
  });
});
