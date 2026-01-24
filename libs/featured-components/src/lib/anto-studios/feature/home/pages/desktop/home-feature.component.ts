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
  PromotionsSectionComponent,
  UIStatsLibSectionComponent,
  UIStepsSectionComponent,
  UIGamingVariantsShowcaseComponent,
  StatItem,
  Step
} from '@negocio/ui-components';
import { ReservationFormComponent } from '../../components/reservation-form/reservation-form.component';
import { Product } from '@negocio/shared-components';


@Component({
  selector: 'lib-home-desktop-feature',
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
    UICardComponent,
    UIStatsLibSectionComponent,
    UIStepsSectionComponent,
    UIGamingVariantsShowcaseComponent
  ],
})
export class HomeDesktopFeatureComponent extends BaseHomeFeatureComponent implements OnInit {
  trackByProductId!: TrackByFunction<Product>;
  testimonials: any;
  searchQuery: string = '';
  searchResults: any[] = [];

  override ngOnInit() {
    super.ngOnInit();
    this.isMobile = false;
  }

  // Data for new sections
  agencyStats: StatItem[] = [
    { icon: '🏆', label: 'Premios', value: '42', description: 'Reconocimientos internacionales', trend: 'up', trendValue: '+3' },
    { icon: '🌟', label: 'Satisfacción', value: '99%', description: 'NPS de nuestros clientes', progress: 99, trend: 'stable' },
    { icon: '🎨', label: 'Proyectos', value: '500+', description: 'Diseños completados', trend: 'up', trendValue: '+12%' },
    { icon: '💡', label: 'Ideas', value: '1.2k', description: 'Conceptos generados', progress: 85 }
  ];

  agencySteps: Step[] = [
    { title: 'Inmersión', description: 'Buceamos en el ADN de tu marca para entender tus objetivos.', icon: '🔍', state: 'completed' },
    { title: 'Conceptualización', description: 'Creamos la base estratégica y visual de tu proyecto.', icon: '💡', state: 'current' },
    { title: 'Despliegue', description: 'Lanzamos tu visión al mundo con la máxima calidad.', icon: '🚀', state: 'pending' }
  ];

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