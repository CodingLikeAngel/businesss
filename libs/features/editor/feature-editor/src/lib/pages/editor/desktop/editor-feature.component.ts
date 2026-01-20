import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { BaseEditorFeatureComponent } from '../base-editor-feature.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  UIModalComponent,
} from '@negocio/ui-components';
import { 
  VisualEditorService
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
import { EditorInputSectionComponent } from '../components/input/editor-input-section.component';
import { EditorButtonSectionComponent } from '../components/button/editor-button-section.component';
import { EditorImageSectionComponent } from '../components/image/editor-image-section.component';
import { EditorSmartContainerSectionComponent } from '../components/smart-container/editor-smart-container-section.component';
import { EditorDraggableBoxSectionComponent } from '../components/draggable-box/editor-draggable-box-section.component';




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
    EditorInputSectionComponent,
    EditorButtonSectionComponent,
    EditorImageSectionComponent,
    EditorSmartContainerSectionComponent,
    EditorDraggableBoxSectionComponent
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class EditorDesktopFeatureComponent extends BaseEditorFeatureComponent implements OnInit {


  override ngOnInit() {
    super.ngOnInit();
    this.editorService.updateEditorState({ isMobile: false });
    this.visualEditorService.enableEditMode();
  }

  get currentMode() {
    return this.visualEditorService.interactionMode;
  }

  setMode(mode: any) {
    this.visualEditorService.setInteractionMode(mode);
  }
}
