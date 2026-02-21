import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  ChangeDetectorRef,
  inject,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
} from '@angular/core';
import { getSectionComponent } from './section-type-registry';
import { PageSection } from '@negocio/shared-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';
import type {
  HeroConfig,
  FeaturesConfig,
  StatsConfig,
  GalleryConfig,
  TitleConfig,
  ChartConfig,
  NavBarConfig,
  FooterConfig,
  BubbleConfig,
  CardConfig,
  ServiceCardsConfig,
  FaqConfig,
  PricingConfig,
  PromotionsConfig,
  ProductsConfig,
  TestimonialsConfig,
} from '@negocio/shared-components';

/** Which config @Input(s) each section type accepts. Only these are set on the dynamic component to avoid NG0303. */
const SECTION_CONFIG_KEYS: Record<string, string[]> = {
  hero: ['heroConfig'],
  'hero-minimal': ['heroConfig'],
  'hero-split': ['heroConfig'],
  features: ['featuresConfig'],
  stats: ['statsConfig'],
  services: ['serviceCardsConfig', 'titleConfig'],
  products: ['productsConfig', 'titleConfig'],
  testimonials: ['testimonialsConfig'],
  pricing: ['pricingConfig'],
  promotions: ['promotionsConfig'],
  faq: ['faqConfig'],
  gallery: ['galleryConfig', 'titleConfig'],
  'gallery-new': ['galleryConfig', 'titleConfig'],
  contact: ['titleConfig'],
  bubble: ['bubbleConfig'],
  header: ['navBarConfig'],
  footer: ['footerConfig'],
  chart: ['chartConfig'],
};

/** Context passed to dynamically created section components. All configs optional so any section can ignore unused ones. */
export interface EditorSectionRendererContext {
  section: PageSection;
  componentVariants: { [key: string]: string };
  globalVariant: string;
  heroConfig?: HeroConfig;
  featuresConfig?: FeaturesConfig;
  statsConfig?: StatsConfig;
  galleryConfig?: GalleryConfig;
  titleConfig?: TitleConfig;
  chartConfig?: ChartConfig;
  navBarConfig?: NavBarConfig;
  footerConfig?: FooterConfig;
  bubbleConfig?: BubbleConfig;
  cardConfig?: CardConfig;
  serviceCardsConfig?: ServiceCardsConfig;
  faqConfig?: FaqConfig;
  pricingConfig?: PricingConfig;
  promotionsConfig?: PromotionsConfig;
  productsConfig?: ProductsConfig;
  testimonialsConfig?: TestimonialsConfig;
}

@Component({
  selector: 'lib-editor-section-renderer',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditorSectionRendererComponent implements OnInit, OnChanges, OnDestroy {
  private viewContainerRef = inject(ViewContainerRef);
  private cdr = inject(ChangeDetectorRef);

  @Input() section!: PageSection;
  @Input() componentVariants: { [key: string]: string } = {};
  @Input() globalVariant = 'default';
  @Input() heroConfig?: HeroConfig;
  @Input() featuresConfig?: FeaturesConfig;
  @Input() statsConfig?: StatsConfig;
  @Input() galleryConfig?: GalleryConfig;
  @Input() titleConfig?: TitleConfig;
  @Input() chartConfig?: ChartConfig;
  @Input() navBarConfig?: NavBarConfig;
  @Input() footerConfig?: FooterConfig;
  @Input() bubbleConfig?: BubbleConfig;
  @Input() cardConfig?: CardConfig;
  @Input() serviceCardsConfig?: ServiceCardsConfig;
  @Input() faqConfig?: FaqConfig;
  @Input() pricingConfig?: PricingConfig;
  @Input() promotionsConfig?: PromotionsConfig;
  @Input() productsConfig?: ProductsConfig;
  @Input() testimonialsConfig?: TestimonialsConfig;

  @Output() elementMoved = new EventEmitter<{ bounds: unknown; elementId: string }>();
  @Output() elementResized = new EventEmitter<{ bounds: unknown; elementId: string }>();
  @Output() sectionResized = new EventEmitter<{ section: PageSection; bounds: unknown }>();

  private componentRef: import('@angular/core').ComponentRef<unknown> | null = null;
  private outputSubscriptions: (() => void)[] = [];
  private pendingType: string | null = null;

  ngOnInit(): void {
    if (!this.componentRef && this.section?.type) this.renderSection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const typeChanged =
      changes['section'] &&
      changes['section'].currentValue?.type !== changes['section'].previousValue?.type;
    if (typeChanged) {
      this.pendingType = null;
      if (this.componentRef) this.destroyCurrent();
      if (this.section?.type) this.renderSection();
    } else if (this.componentRef) {
      this.updateInputs();
      if (changes['globalVariant'] || changes['componentVariants']) {
        const ref = this.componentRef as import('@angular/core').ComponentRef<{ globalVariant?: string }>;
        if (ref?.changeDetectorRef) ref.changeDetectorRef.markForCheck();
        this.cdr.markForCheck();
      }
    } else if (this.section?.type) {
      this.renderSection();
    }
  }

  ngOnDestroy(): void {
    this.destroyCurrent();
  }

  private getContext(): EditorSectionRendererContext {
    return {
      section: this.section,
      componentVariants: this.componentVariants,
      globalVariant: this.globalVariant,
      heroConfig: this.heroConfig,
      featuresConfig: this.featuresConfig,
      statsConfig: this.statsConfig,
      galleryConfig: this.galleryConfig,
      titleConfig: this.titleConfig,
      chartConfig: this.chartConfig,
      navBarConfig: this.navBarConfig,
      footerConfig: this.footerConfig,
      bubbleConfig: this.bubbleConfig,
      cardConfig: this.cardConfig,
      serviceCardsConfig: this.serviceCardsConfig,
      faqConfig: this.faqConfig,
      pricingConfig: this.pricingConfig,
      promotionsConfig: this.promotionsConfig,
      productsConfig: this.productsConfig,
      testimonialsConfig: this.testimonialsConfig,
    };
  }

  private renderSection(): void {
    if (!this.section?.type) return;
    const typeRequested = this.section.type;
    this.pendingType = typeRequested;
    getSectionComponent(typeRequested).then((ComponentClass) => {
      if (this.pendingType !== typeRequested) return;
      this.pendingType = null;
      this.destroyCurrent();
      this.componentRef = this.viewContainerRef.createComponent(ComponentClass);
      this.setAllInputs(this.componentRef);
      this.subscribeOutputs(this.componentRef.instance);
      this.cdr.markForCheck();
    });
  }

  private setAllInputs(ref: import('@angular/core').ComponentRef<unknown>): void {
    const ctx = this.getContext();
    const set = (key: string, value: unknown) => {
      try {
        ref.setInput(key, value);
      } catch {
        // component may not have this input
      }
    };
    set('section', ctx.section);
    set('componentVariants', ctx.componentVariants);
    set('globalVariant', ctx.globalVariant);
    const type = (this.section?.type || '').toLowerCase();
    const configKeys = SECTION_CONFIG_KEYS[type] ?? [];
    const configMap: Record<string, unknown> = {
      heroConfig: ctx.heroConfig,
      featuresConfig: ctx.featuresConfig,
      statsConfig: ctx.statsConfig,
      galleryConfig: ctx.galleryConfig,
      titleConfig: ctx.titleConfig,
      chartConfig: ctx.chartConfig,
      navBarConfig: ctx.navBarConfig,
      footerConfig: ctx.footerConfig,
      bubbleConfig: ctx.bubbleConfig,
      cardConfig: ctx.cardConfig,
      serviceCardsConfig: ctx.serviceCardsConfig,
      faqConfig: ctx.faqConfig,
      pricingConfig: ctx.pricingConfig,
      promotionsConfig: ctx.promotionsConfig,
      productsConfig: ctx.productsConfig,
      testimonialsConfig: ctx.testimonialsConfig,
    };
    for (const key of configKeys) {
      if (configMap[key] !== undefined) set(key, configMap[key]);
    }
  }

  private updateInputs(): void {
    if (this.componentRef) this.setAllInputs(this.componentRef);
  }

  private subscribeOutputs(instance: unknown): void {
    this.clearOutputSubscriptions();
    const base = instance as Partial<BaseEditorSectionComponent>;
    if (base.elementMoved?.subscribe) {
      const sub = base.elementMoved.subscribe((e) => this.elementMoved.emit(e));
      this.outputSubscriptions.push(() => sub.unsubscribe());
    }
    if (base.elementResized?.subscribe) {
      const sub = base.elementResized.subscribe((e) => this.elementResized.emit(e));
      this.outputSubscriptions.push(() => sub.unsubscribe());
    }
    if (base.sectionResized?.subscribe) {
      const sub = base.sectionResized.subscribe((e) => this.sectionResized.emit(e));
      this.outputSubscriptions.push(() => sub.unsubscribe());
    }
  }

  private clearOutputSubscriptions(): void {
    this.outputSubscriptions.forEach((unsub) => unsub());
    this.outputSubscriptions = [];
  }

  private destroyCurrent(): void {
    this.clearOutputSubscriptions();
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
