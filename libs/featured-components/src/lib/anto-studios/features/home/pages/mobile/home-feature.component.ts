import { Component, OnInit, TrackByFunction } from '@angular/core';
import { BaseHomeFeatureComponent } from '../base-home-feature.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UIHeroSectionComponent, UIModalComponent, UICardRutasComponent, BubbleAnimationComponent, UITitleComponent, UiCardProductsComponent, UiTestimonialsCardComponent, UICardAnimatedComponent, UICardComponent } from '@negocio/ui-components';
import { FaqSectionComponent } from '../../components/faq-section/faq-section.component';
import { GallerySectionComponent } from '../../components/gallery-section/gallery-section.component';
import { PricingSectionComponent } from '../../components/pricing-section/pricing-section.component';
import { PromotionsSectionComponent } from '../../components/promotions-section/promotions-section.component';
import { ReservationFormComponent } from '../../components/reservation-form/reservation-form.component';
import { Product } from '@negocio/shared-components';


@Component({
  selector: 'lib-home-mobile-feature',
  standalone: true,
  templateUrl: './home-feature.component.html',
  styleUrl: './home-feature.component.scss',
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
    UICardComponent
],
})
export class HomeMobileFeatureComponent extends BaseHomeFeatureComponent implements OnInit {
  trackByProductId!: TrackByFunction<Product>;
testimonials: any;
  override ngOnInit() {
    super.ngOnInit();
    this.isMobile = true; // Mobile-specific default
  }
}