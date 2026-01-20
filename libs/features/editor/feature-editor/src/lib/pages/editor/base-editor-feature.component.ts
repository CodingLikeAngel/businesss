import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction, inject } from '@angular/core';
import { EditorService } from '../../services/editor.service';
import { CartService } from '../../services/cart.service';
import { ModalService } from '../../services/modal.service';
import * as PageActions from '../../store/actions/page.actions';
import * as PageSelectors from '../../store/selectors/page.selectors';
import { Page } from '../../models/editor.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, Observable, take, Subject, takeUntil } from 'rxjs';
import {
  VariantService,
  NavBarConfig,
  HeroConfig,
  FooterConfig,
  BubbleConfig,
  CardConfig,
  TitleConfig,
  ServiceCardsConfig,
  FaqConfig,
  PricingConfig,
  PromotionsConfig,
  GalleryConfig,
  ProductsConfig,
  TestimonialsConfig,
  Testimonial,
  StatsConfig,
  FeaturesConfig,
  ChartConfig,
  UiStateService,
  VisualEditorService
} from '@negocio/shared-components';
import { CardVariant, footerVariants, bubbleVariants, cardRutasVariants, titleVariants, variants } from '@negocio/ui-components';
import { EditorState, ModalState } from '../../models/editor.model';
import { PageSection } from '@negocio/shared-components';
import { HistoryService } from '../../services/history.service';
import { KeyboardService } from '../../services/keyboard.service';
import { ResizeSectionCommand } from '../../services/commands';
import { AppState } from '../../store/state/app.state';
import * as UIActions from '../../store/actions/ui.actions';
import { Store } from '@ngrx/store';
import { MoveElementCommand, ResizeElementCommand, StyleChangeCommand } from '../../services/commands';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '',
})
export abstract class BaseEditorFeatureComponent implements OnInit, OnDestroy {
  protected editorService = inject(EditorService);
  protected cartService = inject(CartService);
  protected modalService = inject(ModalService);
  protected uiStateService = inject(UiStateService);
  protected store = inject(Store<AppState>);
  protected historyService = inject(HistoryService);
  protected keyboardService = inject(KeyboardService);
  protected visualEditorService = inject(VisualEditorService);

  private variantSub?: Subscription;
  private configSubs: Subscription[] = [];
  private editorStateSub?: Subscription;
  private modalStateSub?: Subscription;
  protected destroy$ = new Subject<void>();

  componentVariants: { [key: string]: string } = {};
  globalVariant = 'default';
  navBarConfig: NavBarConfig;
  heroConfig: HeroConfig;
  footerConfig: FooterConfig;
  bubbleConfig: BubbleConfig;
  cardConfig: CardConfig;
  titleConfig: TitleConfig;
  serviceCardsConfig: ServiceCardsConfig;
  faqConfig: FaqConfig;
  pricingConfig: PricingConfig;
  promotionsConfig: PromotionsConfig;
  galleryConfig: GalleryConfig;
  productsConfig: ProductsConfig;
  testimonialsConfig: TestimonialsConfig;
  statsConfig: StatsConfig;
  featuresConfig: FeaturesConfig;
  chartConfig: ChartConfig;

  editorState: EditorState;
  modalState: ModalState;
  loading$ = this.editorService.loading$;
  sections$: Observable<PageSection[]>;

  tabsConfig: any[] = [
    { label: 'Servicios', sectionId: 'servicios', icon: '🛠️' },
    { label: 'Productos', sectionId: 'productos', icon: '🧩' },
    { label: 'Precios', sectionId: 'precios', icon: '💰' },
    { label: 'Promociones', sectionId: 'promociones', icon: '🎁' },
    { label: 'FAQ', sectionId: 'faq', icon: '❓' },
    { label: 'Galería', sectionId: 'galeria', icon: '🖼️' },
    // { label: 'Contacto', sectionId: 'contacto', icon: '📞' },
  ];


  trackByTestimonialId: TrackByFunction<Testimonial> = (
    index: number,
    testimonial: Testimonial
  ) => testimonial.author;


  constructor(
    @Inject(PLATFORM_ID) protected platformId: object,
    protected variantService: VariantService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    this.navBarConfig = this.variantService.getCurrentNavBarConfig();
    this.heroConfig = this.variantService.getCurrentHeroConfig();
    this.footerConfig = this.variantService.getCurrentFooterConfig();
    this.bubbleConfig = this.variantService.getCurrentBubbleConfig();
    this.cardConfig = this.variantService.getCurrentCardConfig();
    this.titleConfig = this.variantService.getCurrentTitleConfig();
    this.serviceCardsConfig = this.variantService.getCurrentServiceCardsConfig();
    this.faqConfig = this.variantService.getCurrentFaqConfig();
    this.pricingConfig = this.variantService.getCurrentPricingConfig();
    this.promotionsConfig = this.variantService.getCurrentPromotionsConfig();
    this.galleryConfig = this.variantService.getCurrentGalleryConfig();
    this.productsConfig = this.variantService.getCurrentProductsConfig();
    this.testimonialsConfig = this.variantService.getCurrentTestimonialsConfig();
    this.statsConfig = this.variantService.getCurrentStatsConfig();
    this.featuresConfig = this.variantService.getCurrentFeaturesConfig();
    this.chartConfig = this.variantService.getCurrentChartConfig();

    this.editorState = this.editorService.getCurrentEditorState();
    this.modalState = this.modalService.getCurrentModalState();

    this.variantSub = this.variantService.componentVariants$.subscribe((variants) => {
      this.componentVariants = { ...variants };
    });
    this.variantService.globalVariant$.subscribe((variant) => {
      this.globalVariant = variant;
    });

    this.configSubs.push(
      this.variantService.heroConfig$.subscribe((config) => (this.heroConfig = config)),
      this.variantService.footerConfig$.subscribe((config) => (this.footerConfig = config)),
      this.variantService.bubbleConfig$.subscribe((config) => (this.bubbleConfig = config)),
      this.variantService.cardConfig$.subscribe((config) => (this.cardConfig = config)),
      this.variantService.titleConfig$.subscribe((config) => (this.titleConfig = config)),
      this.variantService.serviceCardsConfig$.subscribe((config) => (this.serviceCardsConfig = config)),
      this.variantService.faqConfig$.subscribe((config) => (this.faqConfig = config)),
      this.variantService.pricingConfig$.subscribe((config) => (this.pricingConfig = config)),
      this.variantService.promotionsConfig$.subscribe((config) => (this.promotionsConfig = config)),
      this.variantService.galleryConfig$.subscribe((config) => (this.galleryConfig = config)),
      this.variantService.productsConfig$.subscribe((config) => (this.productsConfig = config)),
      this.variantService.testimonialsConfig$.subscribe((config) => (this.testimonialsConfig = config)),
      this.variantService.statsConfig$.subscribe((config) => (this.statsConfig = config)),
      this.variantService.featuresConfig$.subscribe((config) => (this.featuresConfig = config)),
      this.variantService.chartConfig$.subscribe((config) => (this.chartConfig = config))
    );

    this.editorStateSub = this.editorService.editorState$.subscribe((state) => {
      this.editorState = state;
    });

    this.modalStateSub = this.modalService.modalState$.subscribe((state) => {
      this.modalState = state;
    });

    // UNIFY WITH STORE: Use selectors for sections
    this.sections$ = this.store.select(PageSelectors.selectCurrentPageSections) as Observable<any[]>;
    
    // INITIAL LOAD: Sync VariantService data into NgRx Store
    this.syncVariantServiceToStore();

    // LISTEN FOR EXTERNAL PAGE SWITCHES AND UPDATES (from sidebar/VariantService)
    this.variantService.currentPage$.pipe(takeUntil(this.destroy$)).subscribe(page => {
      // CRITICAL: Skip sync and potential re-renders if we are currently dragging/resizing
      if (this.visualEditorService.isDragging || this.visualEditorService.isResizing) {
        return;
      }

      if (page) {
        this.store.select(PageSelectors.selectCurrentPage).pipe(take(1)).subscribe(currentStorePage => {
          if (!currentStorePage || currentStorePage.id !== page.id) {
            console.log('🔄 Syncing VariantService -> Store (Page Switch/Load Detected)');
            this.store.dispatch(PageActions.loadPageSuccess({ page: page as any }));
          } else {
            // Same page, check if sections or content changed (e.g. added component from sidebar)
            // Use a simple but effective check to avoid loops
            const storeSectionsStr = JSON.stringify(currentStorePage.sections);
            const vsSectionsStr = JSON.stringify(page.sections);
            
            if (storeSectionsStr !== vsSectionsStr) {
              console.log('🔄 Syncing VariantService -> Store (Sections/Content Update Detected)');
              this.store.dispatch(PageActions.updatePage({ 
                pageId: page.id, 
                changes: { sections: page.sections as any } 
              }));
            }
          }
        });
      }
    });

    // Subscriptions for Visual Editor persistence
    if (this.visualEditorService) {
      this.visualEditorService.elementMoved$.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
        this.handleElementMoved(event);
      });

      this.visualEditorService.elementResized$.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
        this.handleElementResized(event);
      });
    }
  }

  private handleElementMoved(event: { element: HTMLElement, bounds: any }) {
    const elementId = event.element.id || event.element.getAttribute('id') || event.element.getAttribute('data-element-id');
    if (!elementId) return;

    const styles: any = {
      position: 'absolute',
      left: event.element.style.left,
      top: event.element.style.top
    };
    
    // Also capture width/height if set, to be safe
    if(event.element.style.width) styles.width = event.element.style.width;
    if(event.element.style.height) styles.height = event.element.style.height;

    console.log(`Persistence: Element ${elementId} moved to`, styles);
    this.variantService.updateElementStyles(elementId, styles);
  }

  private handleElementResized(event: { element: HTMLElement, bounds: any }) {
    const elementId = event.element.id || event.element.getAttribute('id');
    if (!elementId) return;

    const styles: any = {
      width: event.element.style.width,
      height: event.element.style.height,
      left: event.element.style.left,
      top: event.element.style.top
    };

    console.log(`Persistence: Element ${elementId} resized to`, styles);
    this.variantService.updateElementStyles(elementId, styles);
  }

  private syncVariantServiceToStore() {
    this.store.select(PageSelectors.selectCurrentPage).pipe(take(1)).subscribe((existingPage: any) => {
      if (existingPage) {
        console.log('Store already has paging state, skipping sync from VariantService');
        return;
      }

      console.log('Initializing Store from VariantService...');
      const pages = (this.variantService as any).pagesSubject.value as Page[];
      const currentPage = (this.variantService as any).currentPageSubject.value as Page;
      
      if (pages && pages.length > 0) {
        this.store.dispatch(PageActions.setPages({ pages }));
        if (currentPage) {
          this.store.dispatch(PageActions.setCurrentPage({ pageId: currentPage.id }));
        }
      } else {
        // Fallback to segments if no pages found (legacy)
        const sections = (this.variantService as any).sectionsSubject.value;
        const initialPage: Page = {
          id: 'default-page',
          name: 'Home',
          slug: 'home',
          sections: sections as any,
          globalStyles: {} as any,
          metadata: { title: 'Landing Page' } as any,
          versions: [],
          collaborators: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          published: false,
          order: 0,
          visibleInHeader: true,
          visibleInFooter: true
        };
        this.store.dispatch(PageActions.loadPageSuccess({ page: initialPage }));
      }
    });
  }


  ngOnInit() {
    this.onResize();
  }

  selectSection(event: Event, section: any) {
    event.stopPropagation();
    console.log('Selecting section:', section.id);
    
    // Ensure section has proper structure for editor
    const sectionCopy = {
      ...section,
      content: { ...(section.content || {}) },
      styles: { ...(section.styles || {}) }
    };
    
    this.uiStateService.selectSection(sectionCopy);
    this.store.dispatch(UIActions.selectSection({ sectionId: section.id }));
  }

  selectElement(event: Event | null, element: any) {
    if (event) {
      event.stopPropagation();
    }

    // Auto-populate styles from content if missing (for top-level section elements)
    if (element.type && element.content && !element.styles) {
      const styleKey = element.type + 'Styles';
      if (element.content[styleKey]) {
        element.styles = { ...element.content[styleKey] };
      }
    }

    console.log('Selecting element:', element);
    this.uiStateService.selectElement(element);
    
    const elementId = element.id || (element._original ? element._original.id : null) || element.name;
    if (elementId) {
      this.store.dispatch(UIActions.selectElement({ elementId }));
    }
  }

  trackBySectionId(index: number, section: any): string {
    return section.id;
  }

  trackByProductName(index: number, product: any): string {
    return product.name;
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = window.innerWidth < 768;
      this.editorService.updateEditorState({ isMobile });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.variantSub?.unsubscribe();
    this.configSubs.forEach((sub) => sub.unsubscribe());
    this.editorStateSub?.unsubscribe();
    this.modalStateSub?.unsubscribe();
  }



  onSocialClick(href: string) {
    console.log(`Social media clicked: ${href}`);
    window.open(href, '_blank');
  }

  openServiceModal(service: any) {
    this.modalService.openModal(service);
  }

  closeModal() {
    this.modalService.closeModal();
  }

  handleKeyUp(event: KeyboardEvent, service: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.openServiceModal(service);
    }
  }

  addToCart(product: { name: string; image: string; description: string; price: string }) {
    this.cartService.addToCart(product);
  }

  getVariant(componentId: string): any {
    return this.componentVariants[componentId] || this.globalVariant;
  }

  getModalTitle(): string {
    const item = this.modalState.selectedItem;
    if (!item) return 'Detalles';
    if ('serviceName' in item) {
      return item.serviceName;
    }
    if ('name' in item) {
      return item.name;
    }
    return 'Detalles';
  }
  onSectionResized(section: PageSection, bounds: any) {
    console.log('📏 Section resized:', section.id, bounds);

    const oldSize = section.size || { width: bounds.width || 1200, height: bounds.height || 400 };
    const newSize = { width: bounds.width || oldSize.width, height: bounds.height };

    const command = new ResizeSectionCommand(section.id, oldSize, newSize, this.store);
    this.historyService.execute(command);
  }

  onElementMoved(bounds: any, elementId: string, section?: PageSection) {
    console.log('📍 Element moved:', elementId, bounds, section?.id);
    if (!section) return;

    // Get the actual DOM element to find its coordinate system (offsetParent)
    const el = isPlatformBrowser(this.platformId) ? document.getElementById(elementId) : null;
    const offsetParent = el?.offsetParent as HTMLElement;
    const parentRect = offsetParent?.getBoundingClientRect();
    
    // Calculate coordinates relative to the parent that will position it
    let relativeX = bounds.x;
    let relativeY = bounds.y;

    if (parentRect) {
      const computedStyle = isPlatformBrowser(this.platformId) ? window.getComputedStyle(offsetParent) : null;
      const borderLeft = computedStyle ? parseInt(computedStyle.borderLeftWidth) || 0 : 0;
      const borderTop = computedStyle ? parseInt(computedStyle.borderTopWidth) || 0 : 0;
      
      relativeX = bounds.x - parentRect.left - borderLeft;
      relativeY = bounds.y - parentRect.top - borderTop;
    } else {
      // Fallback to section-relative if no offsetParent found
      const sectionElement = isPlatformBrowser(this.platformId) ? document.getElementById(section.id) : null;
      const sectionRect = sectionElement?.getBoundingClientRect();
      relativeX = sectionRect ? bounds.x - sectionRect.left : bounds.x;
      relativeY = sectionRect ? bounds.y - sectionRect.top : bounds.y;
    }

    // 1. Persist position if element exists in section.elements
    if (section.elements) {
      const idx = section.elements.findIndex((e: any) => e.id === elementId);
      if (idx !== -1) {
        const oldPos = section.elements[idx].position || { x: 0, y: 0 };
        const newPos = { x: Math.round(relativeX), y: Math.round(relativeY) };
        
        const command = new MoveElementCommand(section.id, elementId, oldPos, newPos, this.store);
        this.historyService.execute(command);
        return;
      }
    }

    // 2. Handle config-based items (title, subtitle, cta, etc)
    const knownFields = ['title', 'subtitle', 'cta', 'description', 'text', 'label'];
    const fieldMatch = knownFields.find(f => elementId.endsWith('_' + f));
    if (fieldMatch) {
      const styleKey = fieldMatch + 'Styles';
      const currentStyles = section.content?.[styleKey] || {};
      const oldStyles = { ...currentStyles };
      const newStyles = {
        ...currentStyles,
        position: 'absolute',
        left: `${Math.round(relativeX)}px`,
        top: `${Math.round(relativeY)}px`,
        zIndex: '10'
      };

      const command = new StyleChangeCommand('element', elementId, section.id, oldStyles, newStyles, this.store);
      this.historyService.execute(command);
    }
  }

  onElementResized(bounds: any, elementId: string, section?: PageSection) {
    console.log('📐 Element resized:', elementId, bounds, section?.id);
    if (!section) return;

    if (section.elements) {
      const idx = section.elements.findIndex((e: any) => e.id === elementId);
      if (idx !== -1) {
        const oldSize = section.elements[idx].size || { width: 100, height: 100 };
        const newSize = { width: Math.round(bounds.width), height: Math.round(bounds.height) };
        
        const command = new ResizeElementCommand(section.id, elementId, oldSize, newSize, this.store);
        this.historyService.execute(command);
      }
    }
  }

  onTabSelected(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  onNavItemClick(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
