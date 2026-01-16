import { Component, OnInit, TrackByFunction, inject, Inject, PLATFORM_ID } from '@angular/core';
import { EditorService } from '../../../../index';
import { BaseEditorFeatureComponent } from '../base-editor-feature.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  UIHeroSectionComponent as UIHeroSectionComponent,
  UIModalComponent,
  UICardRutasComponent,
  BubbleAnimationComponent,
  UITitleComponent,
  UiCardProductsComponent,
  UiTestimonialsCardComponent,
  UICardAnimatedComponent,
  UICardComponent,
  UINavBarComponent,
  UITabsComponent,
  UIFeaturesSectionComponent,
  UIStatsLibSectionComponent,
  UITestimonialsSectionComponent,
  UIFaqSectionComponent,
  UIGallerySectionComponent,
  UIPricingTableSectionComponent,
  UIAccordionComponent,
  UIImageComponent
} from '@negocio/ui-components';
import { Product, Testimonial, PageSection, VariantService } from '@negocio/shared-components';
import { FaqSectionComponent } from '../../../components/faq-section/faq-section.component';
import { GallerySectionComponent } from '../../../components/gallery-section/gallery-section.component';
import { PricingSectionComponent } from '../../../components/pricing-section/pricing-section.component';
import { PromotionsSectionComponent } from '../../../components/promotions-section/promotions-section.component';
import { ReservationFormComponent } from '../../../components/reservation-form/reservation-form.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-editor-mobile-feature',
  standalone: true,
  templateUrl: './editor-feature.component.html',
  styleUrls: ['./editor-feature.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    UIHeroSectionComponent,
    ReservationFormComponent,
    FaqSectionComponent,
    PricingSectionComponent,
    GallerySectionComponent,
    PromotionsSectionComponent,
    UIModalComponent,
    UICardRutasComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UiCardProductsComponent,
    UiTestimonialsCardComponent,
    UICardAnimatedComponent,
    UICardComponent,
    UITabsComponent,
    UIFeaturesSectionComponent,
    UIStatsLibSectionComponent,
    UITestimonialsSectionComponent,
    UIFaqSectionComponent,
    UIGallerySectionComponent,
    UIPricingTableSectionComponent,
    UIAccordionComponent,
    UIImageComponent
  ],
})
export class EditorMobileFeatureComponent extends BaseEditorFeatureComponent implements OnInit {
  sections$: Observable<PageSection[]>;

  constructor(
    @Inject(PLATFORM_ID) protected override platformId: object,
    protected override variantService: VariantService,
    protected override router: Router,
    protected override route: ActivatedRoute
  ) {
    super(platformId, variantService, router, route);
    this.sections$ = this.variantService.sections$;
  }


  testimonials: Testimonial[] = [];


  override ngOnInit() {
    super.ngOnInit();
    this.editorService.updateEditorState({ isMobile: true });
    // Inicializar testimonials desde testimonialsConfig
    // this.testimonialsConfig$.subscribe((config: { items: Testimonial[]; }) => {
    //   this.testimonials = config.items;
    // });
  }


  onTabSelected(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  onNavItemClick(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
