import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { BaseEditorFeatureComponent } from '../base-editor-feature.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  UIModalComponent,
} from '@negocio/ui-components';
import {
  VisualEditorService,
  SimpleVisualEditorService
} from '@negocio/shared-components';
import { EditorHeroSectionComponent } from '../components/hero/editor-hero-section.component';
import { EditorFeaturesSectionComponent } from '../components/features/editor-features-section.component';
import { EditorStatsSectionComponent } from '../components/stats/editor-stats-section.component';
import { EditorServicesSectionComponent } from '../components/services/editor-services-section.component';
import { EditorProductsSectionComponent } from '../components/products/editor-products-section.component';
import { EditorTestimonialsSectionComponent } from '../components/testimonials/editor-testimonials-section.component';
import { EditorPricingSectionComponent } from '../components/pricing/editor-pricing-section.component';
import { EditorPromotionsSectionComponent } from '../components/promotions/editor-promotions-section.component';
import { EditorFaqSectionComponent } from '../components/faq/editor-faq-section.component';
import { EditorGallerySectionComponent } from '../components/gallery/editor-gallery-section.component';
import { EditorContactSectionComponent } from '../components/contact/editor-contact-section.component';
import { EditorBubbleSectionComponent } from '../components/bubble/editor-bubble-section.component';
import { EditorHeaderSectionComponent } from '../components/header/editor-header-section.component';
import { EditorFooterSectionComponent } from '../components/footer/editor-footer-section.component';
import { EditorAccordionSectionComponent } from '../components/accordion/editor-accordion-section.component';
import { EditorListSectionComponent } from '../components/list/editor-list-section.component';
import { EditorNewsletterSectionComponent } from '../components/newsletter/editor-newsletter-section.component';
import { EditorStepsSectionComponent } from '../components/steps/editor-steps-section.component';
import { EditorTableSectionComponent } from '../components/table/editor-table-section.component';
import { EditorTabsSectionComponent } from '../components/tabs/editor-tabs-section.component';
import { EditorBreadcrumbsSectionComponent } from '../components/breadcrumbs/editor-breadcrumbs-section.component';
import { EditorChartSectionComponent } from '../components/chart/editor-chart-section.component';
import { EditorCtaSectionComponent } from '../components/cta/editor-cta-section.component';
import { EditorShowcaseSectionComponent } from '../components/showcase/editor-showcase-section.component';
import { EditorSpinnerSectionComponent } from '../components/spinner/editor-spinner-section.component';
import { EditorChipSectionComponent } from '../components/chip/editor-chip-section.component';
import { EditorTitleSectionComponent } from '../components/title/editor-title-section.component';
import { EditorCardSectionComponent } from '../components/card/editor-card-section.component';
import { EditorCardAnimatedSectionComponent } from '../components/card-animated/editor-card-animated-section.component';
import { EditorCardProductSectionComponent } from '../components/card-product/editor-card-product-section.component';
import { EditorCardTestimonialSectionComponent } from '../components/card-testimonial/editor-card-testimonial-section.component';
import { EditorInputSectionComponent } from '../components/input/editor-input-section.component';
import { EditorButtonSectionComponent } from '../components/button/editor-button-section.component';
import { EditorImageSectionComponent } from '../components/image/editor-image-section.component';
import { EditorSmartContainerSectionComponent } from '../components/smart-container/editor-smart-container-section.component';
import { EditorDraggableBoxSectionComponent } from '../components/draggable-box/editor-draggable-box-section.component';
import { EditorDraggableBox1SectionComponent } from '../components/draggable-box/editor-draggable-box-1-section.component';
import { EditorDraggableBox2SectionComponent } from '../components/draggable-box/editor-draggable-box-2-section.component';
import { EditorDraggableBox3SectionComponent } from '../components/draggable-box/editor-draggable-box-3-section.component';
import { EditorReservationFormSectionComponent } from '../components/reservation-form/editor-reservation-form-section.component';
import { EditorGenericSectionComponent } from '../components/generic/editor-generic-section.component';
import { ShortcutsGuideComponent } from '../components/shortcuts-guide/shortcuts-guide.component';
import { EditorNavBar1SectionComponent } from '../components/nav-bar/editor-nav-bar-1-section.component';
import { EditorNavBar2SectionComponent } from '../components/nav-bar/editor-nav-bar-2-section.component';
import { EditorNavBar3SectionComponent } from '../components/nav-bar/editor-nav-bar-3-section.component';
import { EditorGallery1SectionComponent } from '../components/gallery/editor-gallery-1-section.component';
import { EditorGallery2SectionComponent } from '../components/gallery/editor-gallery-2-section.component';
import { EditorGallery3SectionComponent } from '../components/gallery/editor-gallery-3-section.component';
import { EditorChart1SectionComponent } from '../components/chart/editor-chart-1-section.component';
import { EditorChart2SectionComponent } from '../components/chart/editor-chart-2-section.component';
import { EditorChart3SectionComponent } from '../components/chart/editor-chart-3-section.component';
import { EditorAccordion1SectionComponent } from '../components/accordion/editor-accordion-1-section.component';
import { EditorAccordion2SectionComponent } from '../components/accordion/editor-accordion-2-section.component';
import { EditorAccordion3SectionComponent } from '../components/accordion/editor-accordion-3-section.component';
import { EditorBreadcrumbs1SectionComponent } from '../components/breadcrumbs/editor-breadcrumbs-1-section.component';
import { EditorBreadcrumbs2SectionComponent } from '../components/breadcrumbs/editor-breadcrumbs-2-section.component';
import { EditorBreadcrumbs3SectionComponent } from '../components/breadcrumbs/editor-breadcrumbs-3-section.component';




@Component({
  selector: 'lib-editor-desktop-feature',
  standalone: true,
  templateUrl: './editor-feature.component.html',
  styleUrls: ['./editor-feature.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    UIModalComponent,
    EditorHeroSectionComponent,
    EditorFeaturesSectionComponent,
    EditorStatsSectionComponent,
    EditorServicesSectionComponent,
    EditorProductsSectionComponent,
    EditorTestimonialsSectionComponent,
    EditorPricingSectionComponent,
    EditorPromotionsSectionComponent,
    EditorFaqSectionComponent,
    EditorGallerySectionComponent,
    EditorContactSectionComponent,
    EditorBubbleSectionComponent,
    EditorHeaderSectionComponent,
    EditorFooterSectionComponent,
    EditorAccordionSectionComponent,
    EditorListSectionComponent,
    EditorNewsletterSectionComponent,
    EditorStepsSectionComponent,
    EditorTableSectionComponent,
    EditorTabsSectionComponent,
    EditorBreadcrumbsSectionComponent,
    EditorChartSectionComponent,
    EditorCtaSectionComponent,
    EditorShowcaseSectionComponent,
    EditorSpinnerSectionComponent,
    EditorChipSectionComponent,
    EditorTitleSectionComponent,
    EditorCardSectionComponent,
    EditorCardAnimatedSectionComponent,
    EditorCardProductSectionComponent,
    EditorCardTestimonialSectionComponent,
    EditorInputSectionComponent,
    EditorButtonSectionComponent,
    EditorImageSectionComponent,
    EditorSmartContainerSectionComponent,
    EditorDraggableBoxSectionComponent,
    EditorDraggableBox1SectionComponent,
    EditorDraggableBox2SectionComponent,
    EditorDraggableBox3SectionComponent,
    EditorReservationFormSectionComponent,
    EditorGenericSectionComponent,
    ShortcutsGuideComponent,
    EditorNavBar1SectionComponent,
    EditorNavBar2SectionComponent,
    EditorNavBar3SectionComponent,
    EditorGallery1SectionComponent,
    EditorGallery2SectionComponent,
    EditorGallery3SectionComponent,
    EditorChart1SectionComponent,
    EditorChart2SectionComponent,
    EditorChart3SectionComponent,
    EditorAccordion1SectionComponent,
    EditorAccordion2SectionComponent,
    EditorAccordion3SectionComponent,
    EditorBreadcrumbs1SectionComponent,
    EditorBreadcrumbs2SectionComponent,
    EditorBreadcrumbs3SectionComponent
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class EditorDesktopFeatureComponent extends BaseEditorFeatureComponent implements OnInit {

  override ngOnInit() {
    super.ngOnInit();
    this.editorService.updateEditorState({ isMobile: false });
  }

  get currentMode() {
    return this.visualEditorService.interactionMode;
  }

  setMode(mode: 'all' | 'move' | 'resize') {
    this.visualEditorService.setInteractionMode(mode);
  }
}
