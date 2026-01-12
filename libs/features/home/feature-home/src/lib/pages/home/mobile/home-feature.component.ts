import { Component, OnInit, TrackByFunction, inject } from '@angular/core';
import { BaseHomeFeatureComponent } from '../base-home-feature.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
} from '@negocio/ui-components';
import { Product, Testimonial } from '@negocio/shared-components';
import { FaqSectionComponent } from '../../../components/faq-section/faq-section.component';
import { GallerySectionComponent } from '../../../components/gallery-section/gallery-section.component';
import { PricingSectionComponent } from '../../../components/pricing-section/pricing-section.component';
import { PromotionsSectionComponent } from '../../../components/promotions-section/promotions-section.component';
import { ReservationFormComponent } from '../../../components/reservation-form/reservation-form.component';
import { HomeService } from '../../../services';

@Component({
  selector: 'lib-home-mobile-feature',
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
    UITabsComponent
  ],
})
export class HomeMobileFeatureComponent extends BaseHomeFeatureComponent implements OnInit {

  


  testimonials: Testimonial[] = [];
  trackByProductId: TrackByFunction<Product> = (index: number, product: Product) => product.name;
  testimonialsConfig$: any;
  location: any;


  override ngOnInit() {
    super.ngOnInit();
    inject(HomeService).updateHomeState({ isMobile: true });
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
