import { Component, OnInit, TrackByFunction } from '@angular/core';
import { BaseHomeFeatureComponent } from '../base-home-feature.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  UIHeroSectionComponent, 
  UIModalComponent, 
  UICardRutasComponent, 
  BubbleAnimationComponent, 
  UITitleComponent, 
  UiCardProductsComponent, 
  UITestimonialsSectionComponent, 
  UICardAnimatedComponent, 
  UICardComponent,
  UIFaqSectionComponent,
  UIGallerySectionComponent,
  UIPricingTableSectionComponent,
  PromotionsSectionComponent
} from '@negocio/ui-components';
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
    FormsModule,
    UIHeroSectionComponent,
    ReservationFormComponent,
    UIFaqSectionComponent,
    UIPricingTableSectionComponent,
    UIGallerySectionComponent,
    PromotionsSectionComponent,
    UIModalComponent,
    UICardRutasComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UiCardProductsComponent,
    UITestimonialsSectionComponent,
    UICardAnimatedComponent,
    UICardComponent
  ],
})
export class HomeMobileFeatureComponent extends BaseHomeFeatureComponent implements OnInit {
  trackByProductId!: TrackByFunction<Product>;
  testimonials: any;
  searchQuery: string = '';
  searchResults: any[] = [];

  override ngOnInit() {
    super.ngOnInit();
    this.isMobile = true; // Mobile-specific default
  }

  onSearchInput(event: any) {
    this.performSearch();
  }

  performSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    // Search in services and products
    const allItems = [
      ...this.serviceCardsConfig.items.map(item => ({ ...item, name: item.routeName, type: 'service' })),
      ...this.productsConfig.items.map(item => ({ ...item, type: 'product' }))
    ];

    this.searchResults = allItems.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectSearchResult(result: any) {
    if (result.type === 'service') {
      this.scrollToSection('servicios');
    } else if (result.type === 'product') {
      this.scrollToSection('productos');
    }
    this.openServiceModal(result);
  }
}