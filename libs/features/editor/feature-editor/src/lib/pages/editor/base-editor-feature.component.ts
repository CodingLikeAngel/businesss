import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction, inject, ChangeDetectorRef } from '@angular/core';
import { EditorService } from '../../services/editor.service';
import { CartService } from '../../services/cart.service';
import { ModalService } from '../../services/modal.service';
import * as PageActions from '../../store/actions/page.actions';
import * as PageSelectors from '../../store/selectors/page.selectors';
import { Page } from '../../models/editor.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, Observable, take, Subject, takeUntil, map } from 'rxjs';
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
import { MoveElementCommand, ResizeElementCommand, StyleChangeCommand, SectionContentCommand } from '../../services/commands';
import { Actions, ofType } from '@ngrx/effects';

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
  protected actions$ = inject(Actions);
  protected cdr = inject(ChangeDetectorRef);

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
  showShortcuts = false;
  /** 5.3 Unified template: true for mobile editor, false for desktop (toolbar/modal/shortcuts visibility). */
  isMobile = false;
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
      this.cdr.markForCheck();
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
    this.sections$ = this.store.select(PageSelectors.selectCurrentPageSections).pipe(
      map((sections: any[]) => sections.map(s => ({
        ...s,
        hasFloatingChildren: this.checkFloatingChildren(s)
      })))
    );

    // 3.2 Store → VariantService: keep Estructura panel in sync when store changes (undo/redo, load)
    this.store.select(PageSelectors.selectCurrentPage).pipe(takeUntil(this.destroy$)).subscribe((page: any) => {
      if (page) this.variantService.syncFromStore(page);
    });
    
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
            const storeGlobalStylesStr = JSON.stringify(currentStorePage.globalStyles || {});
            const vsGlobalStylesStr = JSON.stringify(page.globalStyles || {});
            
            if (storeSectionsStr !== vsSectionsStr || storeGlobalStylesStr !== vsGlobalStylesStr) {
              console.log('🔄 Syncing VariantService -> Store (Update Detected)');
              this.store.dispatch(PageActions.updatePage({ 
                pageId: page.id, 
                changes: { 
                  sections: page.sections as any,
                  globalStyles: page.globalStyles as any
                } 
              }));
            }
          }
        });
      }
    });

    // Unified persistence logic handled via direct service subscriptions
    // in this base component to avoid section-specific redundancy
    if (this.visualEditorService) {
      this.visualEditorService.elementMoved$.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
        // Find which section this element belongs to
        const el = event.element;
        const sectionId = el.getAttribute('sectionId') || el.closest('.editor-section')?.id;
        
        this.sections$.pipe(take(1)).subscribe(sections => {
          const section = sections.find(s => s.id === sectionId);
          if (section) {
            this.onElementMoved(event.bounds, el.id || el.getAttribute('elementId'), section);
          }
        });
      });

      this.visualEditorService.elementResized$.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
        const el = event.element;
        const sectionId = el.getAttribute('sectionId') || el.closest('.editor-section')?.id;
        
        this.sections$.pipe(take(1)).subscribe(sections => {
          const section = sections.find(s => s.id === sectionId);
          if (section) {
            this.onElementResized(event.bounds, el.id || el.getAttribute('elementId'), section);
          }
        });
      });
    }

    // Listen for keyboard shortcuts from the store
    if (this.actions$) {
      this.actions$.pipe(
        ofType(UIActions.executeShortcut),
        takeUntil(this.destroy$)
      ).subscribe(({ shortcut }) => {
        if (shortcut === 'toggle-shortcuts') {
          this.toggleShortcuts();
        }
      });
    }
  }

  // Removed redundant handlers in favor of onElementMoved/Resized

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
    this.visualEditorService.enableEditMode();
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

  toggleShortcuts() {
    this.showShortcuts = !this.showShortcuts;
  }

  toggleSnap() {
    this.visualEditorService.snapToGrid = !this.visualEditorService.snapToGrid;
  }

  toggleGuides() {
    this.visualEditorService.showGuides = !this.visualEditorService.showGuides;
  }

  get isSnapEnabled() {
    return this.visualEditorService.snapToGrid;
  }

  get isGuidesEnabled() {
    return this.visualEditorService.showGuides;
  }

  /** 5.3 Shared template: mode for toolbar (desktop). Mobile hides toolbar. */
  get currentMode(): 'all' | 'move' | 'resize' {
    return (this.visualEditorService?.interactionMode as 'all' | 'move' | 'resize') ?? 'all';
  }

  setMode(mode: 'all' | 'move' | 'resize') {
    this.visualEditorService?.setInteractionMode?.(mode);
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

    // COORDINATE ACCURACY ENGINE:
    // We must find the actual positioning ancestor to ensure the 'left' and 'top' 
    // values we save match the CSS context they will be rendered in.
    const el = isPlatformBrowser(this.platformId) ? document.getElementById(elementId) : null;
    let anchorRect: DOMRect | undefined;
    
    if (el) {
        // Find the nearest positioned ancestor (absolute, relative, fixed, sticky)
        let parent = el.parentElement;
        while(parent && parent !== document.body) {
            const style = window.getComputedStyle(parent);
            if (style.position !== 'static') {
                anchorRect = parent.getBoundingClientRect();
                break;
            }
            parent = parent.parentElement;
        }
    }
    
    // Fallback to section if no intermediate anchor found
    if (!anchorRect) {
        const sectionEl = isPlatformBrowser(this.platformId) ? document.getElementById(section.id) : null;
        anchorRect = sectionEl?.getBoundingClientRect() as DOMRect;
    }

    // Bounds are viewport coordinates (no scroll)
    const viewportX = bounds.x;
    const viewportY = bounds.y;

    // SAFETY GUARD: Prevent moving the entire section as an absolute element 
    // (which causes the whole page to "disintegrate").
    // We strictly block moves if the ID matches the section, OR if it's a global structural part.
    const isSectionMove = elementId === section.id || 
                          elementId.toLowerCase().includes('header') || 
                          elementId.toLowerCase().includes('footer') ||
                          elementId.toLowerCase().includes('navbar') ||
                          elementId.startsWith('global_');

    if (isSectionMove) {
        console.warn('❌ Blocked structural move to prevent layout disintegration:', elementId);
        return;
    }

    let relativeX: number;
    let relativeY: number;

    if (anchorRect) {
      relativeX = viewportX - anchorRect.left;
      relativeY = viewportY - anchorRect.top;
    } else {
      relativeX = viewportX;
      relativeY = viewportY;
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

    // 3. Handle card items in arrays (Generic list items: Features, Stats, Services, etc)
    const listPatterns = ['_card_', '_feature_', '_stat_', '_service_', '_product_', '_step_', '_item_'];
    const matchedPattern = listPatterns.find(p => elementId.includes(p));
    
    if (matchedPattern) {
      const parts = elementId.split(matchedPattern);
      const index = parseInt(parts[parts.length - 1], 10);
      
      // Try to find the items array in section content
      // Some components use 'items', others 'premiumCards', 'navigationCards', etc.
      let listKey = 'items';
      if (!section.content[listKey]) {
          // Detect key based on context if not 'items'
          if (section.type === 'hero') listKey = 'navigationCards';
          else if (section.type === 'promotions') listKey = 'premiumCards';
      }
      
      const items = section.content[listKey] || [];
      
      if (!isNaN(index) && items[index]) {
        const item = items[index];
        const oldStyles = { ...(item.styles || {}) };
        
        // COORDINATE SANITIZATION: Prevent components from "disintegrating" off-screen
        // If relative coordinates are extremely large, cap them to section bounds
        const safeLeft = Math.max(-500, Math.min(5000, Math.round(relativeX)));
        const safeTop = Math.max(-500, Math.min(10000, Math.round(relativeY)));

        const newStyles = {
          ...oldStyles,
          position: 'absolute',
          left: `${safeLeft}px`,
          top: `${safeTop}px`,
          zIndex: '100',
          width: bounds.width + 'px',
          height: bounds.height + 'px',
          margin: '0',
          transform: 'none'
        };

        // Create deep copy of items to avoid mutation
        const newItems = [...items];
        newItems[index] = { ...item, styles: newStyles };

        const command = new SectionContentCommand(section.id, section.content, { ...section.content, [listKey]: newItems }, this.store);
        this.historyService.execute(command);
      }
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

  private checkFloatingChildren(section: PageSection): boolean {
    if (!section.content) return false;
    
    // Check main title/subtitle
    if (section.content['titleStyles']?.position === 'absolute') return true;
    if (section.content['subtitleStyles']?.position === 'absolute') return true;
    
    // Check items
    const items = section.content['items'] || section.content['navigationCards'] || section.content['premiumCards'] || [];
    return items.some((item: any) => item.styles?.position === 'absolute');
  }
}
