import { Type } from '@angular/core';
import { EditorHeroSectionComponent } from '../hero/editor-hero-section.component';
import { EditorFeaturesSectionComponent } from '../features/editor-features-section.component';
import { EditorStatsSectionComponent } from '../stats/editor-stats-section.component';
import { EditorServicesSectionComponent } from '../services/editor-services-section.component';
import { EditorProductsSectionComponent } from '../products/editor-products-section.component';
import { EditorTestimonialsSectionComponent } from '../testimonials/editor-testimonials-section.component';
import { EditorPricingSectionComponent } from '../pricing/editor-pricing-section.component';
import { EditorPromotionsSectionComponent } from '../promotions/editor-promotions-section.component';
import { EditorFaqSectionComponent } from '../faq/editor-faq-section.component';
import { EditorGallerySectionComponent } from '../gallery/editor-gallery-section.component';
import { EditorContactSectionComponent } from '../contact/editor-contact-section.component';
import { EditorBubbleSectionComponent } from '../bubble/editor-bubble-section.component';
import { EditorHeaderSectionComponent } from '../header/editor-header-section.component';
import { EditorFooterSectionComponent } from '../footer/editor-footer-section.component';
import { EditorAccordionSectionComponent } from '../accordion/editor-accordion-section.component';
import { EditorListSectionComponent } from '../list/editor-list-section.component';
import { EditorNewsletterSectionComponent } from '../newsletter/editor-newsletter-section.component';
import { EditorStepsSectionComponent } from '../steps/editor-steps-section.component';
import { EditorTableSectionComponent } from '../table/editor-table-section.component';
import { EditorTabsSectionComponent } from '../tabs/editor-tabs-section.component';
import { EditorBreadcrumbsSectionComponent } from '../breadcrumbs/editor-breadcrumbs-section.component';
import { EditorChartSectionComponent } from '../chart/editor-chart-section.component';
import { EditorCtaSectionComponent } from '../cta/editor-cta-section.component';
import { EditorShowcaseSectionComponent } from '../showcase/editor-showcase-section.component';
import { EditorSpinnerSectionComponent } from '../spinner/editor-spinner-section.component';
import { EditorChipSectionComponent } from '../chip/editor-chip-section.component';
import { EditorTitleSectionComponent } from '../title/editor-title-section.component';
import { EditorCardSectionComponent } from '../card/editor-card-section.component';
import { EditorCardPremiumSectionComponent } from '../card-premium/editor-card-premium-section.component';
import { EditorCardRutasSectionComponent } from '../card-rutas/editor-card-rutas-section.component';
import { EditorCardAnimatedSectionComponent } from '../card-animated/editor-card-animated-section.component';
import { EditorCardProductSectionComponent } from '../card-product/editor-card-product-section.component';
import { EditorCardTestimonialSectionComponent } from '../card-testimonial/editor-card-testimonial-section.component';
import { EditorInputSectionComponent } from '../input/editor-input-section.component';
import { EditorButtonSectionComponent } from '../button/editor-button-section.component';
import { EditorImageSectionComponent } from '../image/editor-image-section.component';
import { EditorSmartContainerSectionComponent } from '../smart-container/editor-smart-container-section.component';
import { EditorDraggableBoxSectionComponent } from '../draggable-box/editor-draggable-box-section.component';
import { EditorDraggableBox1SectionComponent } from '../draggable-box/editor-draggable-box-1-section.component';
import { EditorDraggableBox2SectionComponent } from '../draggable-box/editor-draggable-box-2-section.component';
import { EditorDraggableBox3SectionComponent } from '../draggable-box/editor-draggable-box-3-section.component';
import { EditorReservationFormSectionComponent } from '../reservation-form/editor-reservation-form-section.component';
import { EditorGenericSectionComponent } from '../generic/editor-generic-section.component';
import { EditorShapeSectionComponent } from '../shape/editor-shape-section.component';
import { EditorVideoSectionComponent } from '../video/editor-video-section.component';
import { EditorMapSectionComponent } from '../map/editor-map-section.component';
import { EditorSpacerSectionComponent } from '../spacer/editor-spacer-section.component';
import { EditorFallbackSectionComponent } from '../fallback/editor-fallback-section.component';
import { EditorNavBar1SectionComponent } from '../nav-bar/editor-nav-bar-1-section.component';
import { EditorNavBar2SectionComponent } from '../nav-bar/editor-nav-bar-2-section.component';
import { EditorNavBar3SectionComponent } from '../nav-bar/editor-nav-bar-3-section.component';
import { EditorTooltip1SectionComponent } from '../tooltip/editor-tooltip-1-section.component';
import { EditorTooltip2SectionComponent } from '../tooltip/editor-tooltip-2-section.component';
import { EditorTooltip3SectionComponent } from '../tooltip/editor-tooltip-3-section.component';
import { EditorModal1SectionComponent } from '../modal/editor-modal-1-section.component';
import { EditorModal2SectionComponent } from '../modal/editor-modal-2-section.component';
import { EditorModal3SectionComponent } from '../modal/editor-modal-3-section.component';
import { EditorLayoutSectionComponent } from '../layout-section/editor-layout-section.component';

const registry = new Map<string, Type<unknown>>();

function register(types: string[], component: Type<unknown>): void {
  types.forEach((t) => registry.set(t, component));
}

register(['hero', 'hero-minimal', 'hero-split'], EditorHeroSectionComponent);
register(['features'], EditorFeaturesSectionComponent);
register(['stats'], EditorStatsSectionComponent);
register(['services'], EditorServicesSectionComponent);
register(['products'], EditorProductsSectionComponent);
register(['testimonials'], EditorTestimonialsSectionComponent);
register(['pricing'], EditorPricingSectionComponent);
register(['promotions'], EditorPromotionsSectionComponent);
register(['faq'], EditorFaqSectionComponent);
register(['gallery', 'gallery-new'], EditorGallerySectionComponent);
register(['contact'], EditorContactSectionComponent);
register(['bubble'], EditorBubbleSectionComponent);
register(['header'], EditorHeaderSectionComponent);
register(['footer'], EditorFooterSectionComponent);
register(['accordion', 'accordion-new', 'ui-accordion'], EditorAccordionSectionComponent);
register(['list', 'list-new', 'ui-list'], EditorListSectionComponent);
register(['newsletter'], EditorNewsletterSectionComponent);
register(['steps'], EditorStepsSectionComponent);
register(['table', 'table-new', 'ui-table'], EditorTableSectionComponent);
register(['tabs', 'tabs-new', 'ui-tabs'], EditorTabsSectionComponent);
register(['breadcrumbs', 'breadcrumbs-new', 'ui-breadcrumbs'], EditorBreadcrumbsSectionComponent);
register(['chip', 'chip-new', 'ui-chip'], EditorChipSectionComponent);
register(['spinner', 'spinner-new', 'ui-spinner'], EditorSpinnerSectionComponent);
register(['title', 'title-new', 'ui-title'], EditorTitleSectionComponent);
register(['card', 'ui-card'], EditorCardSectionComponent);
register(['card-premium', 'ui-card-premium'], EditorCardPremiumSectionComponent);
register(['card-rutas', 'ui-card-rutas'], EditorCardRutasSectionComponent);
register(['ui-card-animated'], EditorCardAnimatedSectionComponent);
register(['ui-card-product'], EditorCardProductSectionComponent);
register(['ui-card-testimonial'], EditorCardTestimonialSectionComponent);
register(['input', 'input-new', 'ui-input', 'date-time-picker', 'ui-date-time-picker'], EditorInputSectionComponent);
register(['button', 'button-new', 'ui-button'], EditorButtonSectionComponent);
register(['image', 'image-new', 'ui-image'], EditorImageSectionComponent);
register(['shape', 'ui-shape'], EditorShapeSectionComponent);
register(['video', 'ui-video'], EditorVideoSectionComponent);
register(['map', 'ui-map'], EditorMapSectionComponent);
register(['smart-container'], EditorSmartContainerSectionComponent);
register(['layout-section'], EditorLayoutSectionComponent);
register(['draggable-box', 'draggable-box-new', 'ui-draggable-box'], EditorDraggableBoxSectionComponent);
register(['draggable-box-1', 'ui-draggable-box-1'], EditorDraggableBox1SectionComponent);
register(['draggable-box-2', 'ui-draggable-box-2'], EditorDraggableBox2SectionComponent);
register(['draggable-box-3', 'ui-draggable-box-3'], EditorDraggableBox3SectionComponent);
register(['nav-bar-1', 'nav-bar-new', 'ui-nav-bar-1'], EditorNavBar1SectionComponent);
register(['nav-bar-2', 'ui-nav-bar-2'], EditorNavBar2SectionComponent);
register(['nav-bar-3', 'ui-nav-bar-3'], EditorNavBar3SectionComponent);
register(['tooltip-1', 'tooltip-new', 'ui-tooltip-1'], EditorTooltip1SectionComponent);
register(['tooltip-2', 'ui-tooltip-2'], EditorTooltip2SectionComponent);
register(['tooltip-3', 'ui-tooltip-3'], EditorTooltip3SectionComponent);
register(['modal-1', 'modal-new', 'ui-modal-1'], EditorModal1SectionComponent);
register(['modal-2', 'ui-modal-2'], EditorModal2SectionComponent);
register(['modal-3', 'ui-modal-3'], EditorModal3SectionComponent);
register(['chart', 'chart-new', 'ui-chart'], EditorChartSectionComponent);
register(['showcase', 'ui-showcase'], EditorShowcaseSectionComponent);
register(['reservation-form', 'ui-reservation-form'], EditorReservationFormSectionComponent);
register(['cta', 'ui-cta'], EditorCtaSectionComponent);
register(['ui-forms'], EditorReservationFormSectionComponent);
register(['generic'], EditorGenericSectionComponent);
register(['spacer', 'ui-spacer'], EditorSpacerSectionComponent);

/** Registry: section type string → editor section component type. Use getSectionComponent(type) for fallback. */
export const SECTION_TYPE_REGISTRY = registry;

export function getSectionComponent(type: string): Type<unknown> {
  return SECTION_TYPE_REGISTRY.get(type) ?? EditorFallbackSectionComponent;
}

/** Set of section types that have a dedicated editor view (not fallback). Use for 3.3 Bloques alignment. */
export const SUPPORTED_SECTION_TYPES = new Set(SECTION_TYPE_REGISTRY.keys());

export function hasDedicatedEditorView(type: string): boolean {
  return SUPPORTED_SECTION_TYPES.has(type);
}
