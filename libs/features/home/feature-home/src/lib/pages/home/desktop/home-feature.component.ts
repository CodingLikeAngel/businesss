import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BaseHomeFeatureComponent } from '../base-home-feature.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  UIHeroSectionComponent,
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
  UIStatsSectionComponent,
  UITestimonialsSectionComponent,
  UIFaqSectionComponent,
  UIGallerySectionComponent,
  UIPricingTableSectionComponent
} from '@negocio/ui-components';
import { Product, Testimonial, PageSection, VariantService } from '@negocio/shared-components';
import { FaqSectionComponent } from '../../../components/faq-section/faq-section.component';
import { GallerySectionComponent } from '../../../components/gallery-section/gallery-section.component';
import { PricingSectionComponent } from '../../../components/pricing-section/pricing-section.component';
import { PromotionsSectionComponent } from '../../../components/promotions-section/promotions-section.component';
import { ReservationFormComponent } from '../../../components/reservation-form/reservation-form.component';

@Component({
  selector: 'lib-home-desktop-feature',
  standalone: true,
  templateUrl: './home-feature.component.html',
  styleUrls: ['./home-feature.component.scss'],
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
    UIStatsSectionComponent,
    UITestimonialsSectionComponent,
    UIFaqSectionComponent,
    UIGallerySectionComponent,
    UIPricingTableSectionComponent
  ],
})
export class HomeDesktopFeatureComponent extends BaseHomeFeatureComponent implements OnInit {
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

  override ngOnInit() {
    super.ngOnInit();
    this.isMobile = false;
  }

  onTabSelected(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  onNavItemClick(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string) {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  trackBySectionId(index: number, section: PageSection): string {
    return section.id;
  }
}

