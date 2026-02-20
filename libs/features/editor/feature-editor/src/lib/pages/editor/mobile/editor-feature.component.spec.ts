import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { EditorMobileFeatureComponent } from './editor-feature.component';
import { VariantService, UiStateService } from '@negocio/shared-components';
import { EditorService } from '../../../services/editor.service';
import { ModalService } from '../../../services/modal.service';
import { CartService } from '../../../services/cart.service';
import { HistoryService } from '../../../services/history.service';
import { KeyboardService } from '../../../services/keyboard.service';
import { VisualEditorService } from '@negocio/shared-components';

describe('EditorMobileFeatureComponent', () => {
  let component: EditorMobileFeatureComponent;
  let fixture: ComponentFixture<EditorMobileFeatureComponent>;

  const mockStore = {
    select: jest.fn(() => of(null)),
    dispatch: jest.fn(),
  };
  const emptyConfig$ = of({});
  const mockVariantService = {
    componentVariants$: of({}),
    globalVariant$: of('default'),
    builderStep$: of('editor'),
    currentPage$: of(null),
    heroConfig$: emptyConfig$,
    footerConfig$: emptyConfig$,
    bubbleConfig$: emptyConfig$,
    cardConfig$: emptyConfig$,
    titleConfig$: emptyConfig$,
    serviceCardsConfig$: emptyConfig$,
    faqConfig$: emptyConfig$,
    pricingConfig$: emptyConfig$,
    promotionsConfig$: emptyConfig$,
    galleryConfig$: emptyConfig$,
    productsConfig$: emptyConfig$,
    testimonialsConfig$: emptyConfig$,
    statsConfig$: emptyConfig$,
    featuresConfig$: emptyConfig$,
    chartConfig$: emptyConfig$,
    getCurrentNavBarConfig: () => ({}),
    getCurrentHeroConfig: () => ({}),
    getCurrentFooterConfig: () => ({}),
    getCurrentBubbleConfig: () => ({}),
    getCurrentCardConfig: () => ({}),
    getCurrentTitleConfig: () => ({}),
    getCurrentServiceCardsConfig: () => ({}),
    getCurrentFaqConfig: () => ({}),
    getCurrentPricingConfig: () => ({}),
    getCurrentPromotionsConfig: () => ({}),
    getCurrentGalleryConfig: () => ({}),
    getCurrentProductsConfig: () => ({}),
    getCurrentTestimonialsConfig: () => ({}),
    getCurrentStatsConfig: () => ({}),
    getCurrentFeaturesConfig: () => ({}),
    getCurrentChartConfig: () => ({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorMobileFeatureComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: VariantService, useValue: mockVariantService },
        { provide: EditorService, useValue: { getCurrentEditorState: () => ({}), updateEditorState: () => {}, editorState$: of({}) } },
        { provide: ModalService, useValue: { getCurrentModalState: () => ({ isOpen: false, selectedItem: null }), modalState$: of({ isOpen: false, selectedItem: null }) } },
        { provide: CartService, useValue: {} },
        { provide: UiStateService, useValue: {} },
        { provide: Actions, useValue: of({ type: 'test' }) },
        { provide: HistoryService, useValue: { execute: jest.fn() } },
        { provide: KeyboardService, useValue: {} },
        { provide: VisualEditorService, useValue: { isDragging: false, isResizing: false, elementMoved$: of(), elementResized$: of(), enableEditMode: jest.fn() } },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorMobileFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
