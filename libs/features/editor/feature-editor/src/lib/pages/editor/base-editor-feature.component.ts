import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction, inject } from '@angular/core';
import { EditorService, CartService, ModalService } from '../../../index';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
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
} from '@negocio/shared-components';
import { CardVariant, footerVariants, bubbleVariants, cardRutasVariants, titleVariants, variants } from '@negocio/ui-components';
import { EditorState, ModalState } from '../../models/editor.model';
import { PageSection } from '@negocio/shared-components';
import { HistoryService } from '../../services/history.service';
import { KeyboardService } from '../../services/keyboard.service';
import { ResizeSectionCommand } from '../../services/commands';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state/app.state';

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
  protected historyService = inject(HistoryService);
  protected keyboardService = inject(KeyboardService);
  protected store = inject(Store<AppState>);

  private variantSub?: Subscription;
  private configSubs: Subscription[] = [];
  private editorStateSub?: Subscription;
  private modalStateSub?: Subscription;

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

    this.sections$ = this.variantService.sections$;
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

    // Track the operation for undo/redo
    const oldSize = section.size || { width: bounds.width || 1200, height: bounds.height || 400 };
    const newSize = { width: bounds.width || oldSize.width, height: bounds.height };

    const command = new ResizeSectionCommand(
      section.id,
      oldSize,
      newSize,
      this.store
    );
    this.historyService.execute(command);

    // Update section styles with new height
    const updatedSection = {
      ...section,
      styles: {
        ...section.styles,
        minHeight: `${bounds.height}px`,
        height: `${bounds.height}px`
      }
    };

    // Update in service
    this.variantService.updateSectionInCurrentPage(section.id, updatedSection);
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
      relativeX = bounds.x - parentRect.left;
      relativeY = bounds.y - parentRect.top;
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
        const newEl = { ...section.elements[idx] };
        newEl.styles = { 
          ...(newEl.styles || {}), 
          position: 'absolute', 
          left: `${Math.round(relativeX)}px`, 
          top: `${Math.round(relativeY)}px`,
          zIndex: '10'
        };
        const newElements = [...section.elements];
        newElements[idx] = newEl;
        this.variantService.updateSectionInCurrentPage(section.id, { elements: newElements });
        return;
      }
    }

    // 2. Handle config-based items (title, subtitle, cta, etc)
    const knownFields = ['title', 'subtitle', 'cta', 'description', 'text', 'label'];
    const fieldMatch = knownFields.find(f => elementId.endsWith('_' + f));
    if (fieldMatch) {
      const styleKey = fieldMatch + 'Styles';
      const currentStyles = section.content?.[styleKey] || {};
      this.variantService.updateSectionInCurrentPage(section.id, {
        content: {
          ...section.content,
          [styleKey]: {
            ...currentStyles,
            position: 'absolute',
            left: `${Math.round(relativeX)}px`,
            top: `${Math.round(relativeY)}px`,
            zIndex: '10'
          }
        }
      });
    }
  }

  onElementResized(bounds: any, elementId: string, section?: PageSection) {
    console.log('📐 Element resized:', elementId, bounds, section?.id);
    if (!section) return;

    // 1. Persist size if element exists in section.elements
    if (section.elements) {
      const idx = section.elements.findIndex((e: any) => e.id === elementId);
      if (idx !== -1) {
        const newEl = { ...section.elements[idx] };
        newEl.styles = { 
          ...(newEl.styles || {}), 
          width: `${Math.round(bounds.width)}px`, 
          height: `${Math.round(bounds.height)}px`
        };
        const newElements = [...section.elements];
        newElements[idx] = newEl;
        this.variantService.updateSectionInCurrentPage(section.id, { elements: newElements });
        return;
      }
    }

    // 2. Handle config-based items
    const knownFields = ['title', 'subtitle', 'cta', 'description', 'text', 'label'];
    const fieldMatch = knownFields.find(f => elementId.endsWith('_' + f));
    if (fieldMatch) {
      const styleKey = fieldMatch + 'Styles';
      const currentStyles = section.content?.[styleKey] || {};
      this.variantService.updateSectionInCurrentPage(section.id, {
        content: {
          ...section.content,
          [styleKey]: {
            ...currentStyles,
            width: `${Math.round(bounds.width)}px`, 
            height: `${Math.round(bounds.height)}px`
          }
        }
      });
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
