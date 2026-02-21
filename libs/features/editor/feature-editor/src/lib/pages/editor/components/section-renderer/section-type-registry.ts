import { Type } from '@angular/core';

/** Lazy loader: returns the component type. Cached after first load to avoid re-fetching. */
type SectionLoader = () => Promise<Type<unknown>>;

const loaders = new Map<string, SectionLoader>();
const cache = new Map<string, Type<unknown>>();

function register(types: string[], loader: SectionLoader): void {
  types.forEach((t) => loaders.set(t, loader));
}

// Fallback: only this is imported eagerly so unknown section types still work
import { EditorFallbackSectionComponent } from '../fallback/editor-fallback-section.component';

function fallbackLoader(): Promise<Type<unknown>> {
  return Promise.resolve(EditorFallbackSectionComponent);
}

// Register all section types with dynamic imports (lazy load on first use)
register(['hero', 'hero-minimal', 'hero-split'], () => import('../hero/editor-hero-section.component').then((m) => m.EditorHeroSectionComponent));
register(['features'], () => import('../features/editor-features-section.component').then((m) => m.EditorFeaturesSectionComponent));
register(['stats'], () => import('../stats/editor-stats-section.component').then((m) => m.EditorStatsSectionComponent));
register(['services'], () => import('../services/editor-services-section.component').then((m) => m.EditorServicesSectionComponent));
register(['products'], () => import('../products/editor-products-section.component').then((m) => m.EditorProductsSectionComponent));
register(['testimonials'], () => import('../testimonials/editor-testimonials-section.component').then((m) => m.EditorTestimonialsSectionComponent));
register(['pricing'], () => import('../pricing/editor-pricing-section.component').then((m) => m.EditorPricingSectionComponent));
register(['promotions'], () => import('../promotions/editor-promotions-section.component').then((m) => m.EditorPromotionsSectionComponent));
register(['faq'], () => import('../faq/editor-faq-section.component').then((m) => m.EditorFaqSectionComponent));
register(['gallery', 'gallery-new'], () => import('../gallery/editor-gallery-section.component').then((m) => m.EditorGallerySectionComponent));
register(['contact'], () => import('../contact/editor-contact-section.component').then((m) => m.EditorContactSectionComponent));
register(['bubble'], () => import('../bubble/editor-bubble-section.component').then((m) => m.EditorBubbleSectionComponent));
register(['header'], () => import('../header/editor-header-section.component').then((m) => m.EditorHeaderSectionComponent));
register(['footer'], () => import('../footer/editor-footer-section.component').then((m) => m.EditorFooterSectionComponent));
register(['accordion', 'accordion-new', 'ui-accordion'], () => import('../accordion/editor-accordion-section.component').then((m) => m.EditorAccordionSectionComponent));
register(['list', 'list-new', 'ui-list'], () => import('../list/editor-list-section.component').then((m) => m.EditorListSectionComponent));
register(['newsletter'], () => import('../newsletter/editor-newsletter-section.component').then((m) => m.EditorNewsletterSectionComponent));
register(['steps'], () => import('../steps/editor-steps-section.component').then((m) => m.EditorStepsSectionComponent));
register(['table', 'table-new', 'ui-table'], () => import('../table/editor-table-section.component').then((m) => m.EditorTableSectionComponent));
register(['tabs', 'tabs-new', 'ui-tabs'], () => import('../tabs/editor-tabs-section.component').then((m) => m.EditorTabsSectionComponent));
register(['breadcrumbs', 'breadcrumbs-new', 'ui-breadcrumbs'], () => import('../breadcrumbs/editor-breadcrumbs-section.component').then((m) => m.EditorBreadcrumbsSectionComponent));
register(['chip', 'chip-new', 'ui-chip'], () => import('../chip/editor-chip-section.component').then((m) => m.EditorChipSectionComponent));
register(['spinner', 'spinner-new', 'ui-spinner'], () => import('../spinner/editor-spinner-section.component').then((m) => m.EditorSpinnerSectionComponent));
register(['title', 'title-new', 'ui-title'], () => import('../title/editor-title-section.component').then((m) => m.EditorTitleSectionComponent));
register(['card', 'ui-card'], () => import('../card/editor-card-section.component').then((m) => m.EditorCardSectionComponent));
register(['card-premium', 'ui-card-premium'], () => import('../card-premium/editor-card-premium-section.component').then((m) => m.EditorCardPremiumSectionComponent));
register(['card-rutas', 'ui-card-rutas'], () => import('../card-rutas/editor-card-rutas-section.component').then((m) => m.EditorCardRutasSectionComponent));
register(['ui-card-animated'], () => import('../card-animated/editor-card-animated-section.component').then((m) => m.EditorCardAnimatedSectionComponent));
register(['ui-card-product'], () => import('../card-product/editor-card-product-section.component').then((m) => m.EditorCardProductSectionComponent));
register(['ui-card-testimonial'], () => import('../card-testimonial/editor-card-testimonial-section.component').then((m) => m.EditorCardTestimonialSectionComponent));
register(['input', 'input-new', 'ui-input', 'date-time-picker', 'ui-date-time-picker'], () => import('../input/editor-input-section.component').then((m) => m.EditorInputSectionComponent));
register(['button', 'button-new', 'ui-button'], () => import('../button/editor-button-section.component').then((m) => m.EditorButtonSectionComponent));
register(['image', 'image-new', 'ui-image'], () => import('../image/editor-image-section.component').then((m) => m.EditorImageSectionComponent));
register(['shape', 'ui-shape'], () => import('../shape/editor-shape-section.component').then((m) => m.EditorShapeSectionComponent));
register(['video', 'ui-video'], () => import('../video/editor-video-section.component').then((m) => m.EditorVideoSectionComponent));
register(['map', 'ui-map'], () => import('../map/editor-map-section.component').then((m) => m.EditorMapSectionComponent));
register(['smart-container'], () => import('../smart-container/editor-smart-container-section.component').then((m) => m.EditorSmartContainerSectionComponent));
register(['layout-section'], () => import('../layout-section/editor-layout-section.component').then((m) => m.EditorLayoutSectionComponent));
register(['draggable-box', 'draggable-box-new', 'ui-draggable-box'], () => import('../draggable-box/editor-draggable-box-section.component').then((m) => m.EditorDraggableBoxSectionComponent));
register(['draggable-box-1', 'ui-draggable-box-1'], () => import('../draggable-box/editor-draggable-box-1-section.component').then((m) => m.EditorDraggableBox1SectionComponent));
register(['draggable-box-2', 'ui-draggable-box-2'], () => import('../draggable-box/editor-draggable-box-2-section.component').then((m) => m.EditorDraggableBox2SectionComponent));
register(['draggable-box-3', 'ui-draggable-box-3'], () => import('../draggable-box/editor-draggable-box-3-section.component').then((m) => m.EditorDraggableBox3SectionComponent));
register(['nav-bar-1', 'nav-bar-new', 'ui-nav-bar-1'], () => import('../nav-bar/editor-nav-bar-1-section.component').then((m) => m.EditorNavBar1SectionComponent));
register(['nav-bar-2', 'ui-nav-bar-2'], () => import('../nav-bar/editor-nav-bar-2-section.component').then((m) => m.EditorNavBar2SectionComponent));
register(['nav-bar-3', 'ui-nav-bar-3'], () => import('../nav-bar/editor-nav-bar-3-section.component').then((m) => m.EditorNavBar3SectionComponent));
register(['tooltip-1', 'tooltip-new', 'ui-tooltip-1'], () => import('../tooltip/editor-tooltip-1-section.component').then((m) => m.EditorTooltip1SectionComponent));
register(['tooltip-2', 'ui-tooltip-2'], () => import('../tooltip/editor-tooltip-2-section.component').then((m) => m.EditorTooltip2SectionComponent));
register(['tooltip-3', 'ui-tooltip-3'], () => import('../tooltip/editor-tooltip-3-section.component').then((m) => m.EditorTooltip3SectionComponent));
register(['modal-1', 'modal-new', 'ui-modal-1'], () => import('../modal/editor-modal-1-section.component').then((m) => m.EditorModal1SectionComponent));
register(['modal-2', 'ui-modal-2'], () => import('../modal/editor-modal-2-section.component').then((m) => m.EditorModal2SectionComponent));
register(['modal-3', 'ui-modal-3'], () => import('../modal/editor-modal-3-section.component').then((m) => m.EditorModal3SectionComponent));
register(['chart', 'chart-new', 'ui-chart'], () => import('../chart/editor-chart-section.component').then((m) => m.EditorChartSectionComponent));
register(['showcase', 'ui-showcase'], () => import('../showcase/editor-showcase-section.component').then((m) => m.EditorShowcaseSectionComponent));
register(['reservation-form', 'ui-reservation-form', 'ui-forms'], () => import('../reservation-form/editor-reservation-form-section.component').then((m) => m.EditorReservationFormSectionComponent));
register(['cta', 'ui-cta'], () => import('../cta/editor-cta-section.component').then((m) => m.EditorCtaSectionComponent));
register(['generic'], () => import('../generic/editor-generic-section.component').then((m) => m.EditorGenericSectionComponent));
register(['spacer', 'ui-spacer'], () => import('../spacer/editor-spacer-section.component').then((m) => m.EditorSpacerSectionComponent));

/** Registry: section type string → loader. */
export const SECTION_TYPE_REGISTRY = loaders;

/** Load section component type (cached). Resolves to fallback for unknown types. */
export async function getSectionComponent(type: string): Promise<Type<unknown>> {
  const key = (type || '').toLowerCase();
  const cached = cache.get(key);
  if (cached) return cached;
  const loader = loaders.get(key) ?? fallbackLoader;
  const component = await loader();
  cache.set(key, component);
  return component;
}

/** Set of section types that have a dedicated editor view. Used for 3.3 Bloques alignment. */
export const SUPPORTED_SECTION_TYPES = new Set(loaders.keys());

export function hasDedicatedEditorView(type: string): boolean {
  return SUPPORTED_SECTION_TYPES.has((type || '').toLowerCase());
}
