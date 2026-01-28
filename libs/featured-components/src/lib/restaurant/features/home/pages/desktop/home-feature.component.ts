import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, NavBarConfig, HeroConfig, FooterConfig, BubbleConfig } from '@negocio/shared-components';
import {
  UIStatsLibSectionComponent,
  UIFeaturesSectionComponent,
  UITestimonialsSectionComponent,
  UINewsletterSectionComponent,
  ProductsSectionComponent,
  UIFaqSectionComponent,
  UIGallerySectionComponent,
  UIPricingTableSectionComponent,
  UIHeroSectionComponent,
  PromotionsSectionComponent,
  ReservationFormComponent
} from '@negocio/featured-components';
import {
  UINavBarComponent,
  UICardRutasComponent,
  BubbleAnimationComponent,
  UITitleComponent,
  UIFooterComponent,
  UIModalComponent,
  CardVariant,
  AccordionItem,
  TableColumn,
  TableRow,
  CardPremiumConfig
} from '@negocio/ui-components';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'lib-home-feature',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UINavBarComponent,
    ReservationFormComponent,
    UIFaqSectionComponent,
    UIPricingTableSectionComponent,
    UIGallerySectionComponent,
    PromotionsSectionComponent,
    UIStatsLibSectionComponent,
    UIModalComponent,
    UICardRutasComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UIFooterComponent,
    UIFeaturesSectionComponent,
    UITestimonialsSectionComponent,
    UINewsletterSectionComponent,
    ProductsSectionComponent,
    UIHeroSectionComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-feature.component.html',
  styles: [`
    .text-dim { color: rgba(255, 255, 255, 0.6); }
    .glass-panel {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
    }
  `],
})
export class HomeDesktopFeatureComponent implements OnDestroy, OnInit {
  isMobile = false;
  modalOpen = false;
  selectedService: any | null = null;
  private variantSub?: Subscription;
  private navBarConfigSub?: Subscription;
  private heroConfigSub?: Subscription;
  private footerConfigSub?: Subscription;
  private bubbleConfigSub?: Subscription;

  componentVariants: { [key: string]: string } = {};
  globalVariant = 'default';
  navBarConfig: NavBarConfig;
  heroConfig: HeroConfig;
  footerConfig: FooterConfig;
  bubbleConfig: BubbleConfig;

  faqItems: AccordionItem[] = [
    {
      title: '¿Cuánto tiempo dura una reserva?',
      content: 'Las reservas se hacen por mesa y pueden durar hasta 2 horas. Te recomendamos llegar a tiempo.',
      expanded: false,
    },
    {
      title: '¿Puedo cancelar mi reserva?',
      content: 'Sí, hasta 2 horas antes sin costo. Contáctanos para gestionar.',
      expanded: false,
    },
  ];

  priceColumns: TableColumn[] = [
    { key: 'dish', label: 'Plato' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

  priceRows: TableRow[] = [
    { dish: 'Tataki de Atún Rojo', description: 'Con costra de sésamo y reducción de soja cítrica', price: '24€' },
    { dish: 'Solomillo de Ternera', description: 'A la brasa con puré de boletus y trufa negra', price: '28€' },
    { dish: 'Arroz de Marisco', description: 'Caldoso con gambas de Denia y base de azafrán', price: '22€' },
    { dish: 'Burrata Trufada', description: 'Tomates cherry confitados y pesto de albahaca', price: '18€' },
    { dish: 'Coulant de Chocolate', description: 'Corazón fundente con helado de vainilla Bourbon', price: '9€' },
  ];

  restaurantFeatures = [
    {
      title: 'Producto de Km 0',
      description: 'Seleccionamos los mejores ingredientes de proveedores locales cada mañana.',
      icon: '🌿'
    },
    {
      title: 'Bodega Exclusiva',
      description: 'Más de 100 referencias nacionales e internacionales seleccionadas por nuestro sumiller.',
      icon: '🍷'
    },
    {
      title: 'Cocina de Autor',
      description: 'Platos tradicionales reinterpretados con técnicas de vanguardia por nuestro equipo.',
      icon: '🎨'
    },
    {
      title: 'Ambiente Único',
      description: 'Un espacio diseñado para que cada cena sea una experiencia sensorial completa.',
      icon: '🏺'
    }
  ];

  restaurantTestimonials = [
    {
      author: 'Elena Sanz',
      role: 'Crítica Gastronómica',
      quote: 'Una explosión de sabores. El equilibrio entre vanguardia y tradición es exquisito.',
      avatar: 'https://i.pravatar.cc/150?u=elena'
    },
    {
      author: 'Marc Torres',
      role: 'Cliente Habitual',
      quote: 'El mejor solomillo que he probado en la ciudad. El servicio es impecable y la bodega sorprendente.',
      avatar: 'https://i.pravatar.cc/150?u=marc'
    },
    {
      author: 'Sofia Vicens',
      role: 'Influencer Lifestyle',
      quote: 'El local más instagrameable. Pero lo mejor no es la luz, es el sabor de su tataki.',
      avatar: 'https://i.pravatar.cc/150?u=sofia'
    }
  ];


  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Menú Degustación',
      description: 'Experiencia culinaria completa con 5 platos.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      price: '45€',
      discount: '-15%',
      icon: 'heroStar',
      tooltip: '¡Disfruta de nuestra selección especial!',
    },
    {
      title: 'Cena Romántica',
      description: 'Menú para dos con velas y música.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      price: '80€',
      discount: 'Oferta',
      icon: 'heroStar',
      tooltip: 'Ideal para ocasiones especiales.',
    },
    {
      title: 'Brunch Dominical',
      description: 'Buffet variado con opciones saludables.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      price: '25€',
      discount: 'Novedad',
      icon: 'heroStar',
      tooltip: 'Relájate y disfruta del fin de semana.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: '/1029.png', alt: 'Plato 1' },
        { src: '/1090.png', alt: 'Restaurante 1' },
        { src: '/retro-stars.png', alt: 'Ambiente 1' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Cena Italiana',
      imageUrl: '/retro-stars.png',
      difficulty: 'Duración: 2 horas',
      rating: 4.8,
      reviews: 200,
      duration: 2,
      distance: 0,
      ascent: 0,
      description: 'Disfruta de auténtica cocina italiana en un ambiente acogedor.',
      features: ['Ingredientes frescos', 'Vino incluido'],
      link: '#forms',
    },
    {
      routeName: 'Almuerzo Ejecutivo',
      imageUrl: '/1029.png',
      difficulty: 'Duración: 1 hora',
      rating: 4.9,
      reviews: 150,
      duration: 1,
      distance: 0,
      ascent: 0,
      description: 'Menús rápidos y saludables para el almuerzo.',
      features: ['Opciones vegetarianas', 'Servicio rápido'],
      link: '#forms',
    },
    {
      routeName: 'Evento Privado',
      imageUrl: '/1090.png',
      difficulty: 'Duración: variable',
      rating: 4.7,
      reviews: 80,
      duration: 3,
      distance: 0,
      ascent: 0,
      description: 'Organizamos eventos privados con menús personalizados.',
      features: ['Catering completo', 'Decoración temática'],
      link: '#forms',
    },
  ];

  products = [
    {
      name: 'Vino Tinto Reserva',
      image: '/1029.png',
      description: 'Vino español de alta calidad, perfecto para acompañar tus comidas.',
      price: '20€',
    },
    {
      name: 'Café Especial',
      image: '/1029.png',
      description: 'Mezcla única de granos tostados para un sabor excepcional.',
      price: '5€',
    },
    {
      name: 'Postre Artesanal',
      image: '/1029.png',
      description: 'Deliciosos postres hechos a mano con ingredientes naturales.',
      price: '7€',
    },
  ];

  restaurantStats: any[] = [
    {
      icon: '🍽️',
      label: 'Platos Servidos',
      value: '5,000+',
      description: 'Delicias culinarias cada mes',
      progress: 85,
      trend: 'up',
      trendValue: '+10%',
      unit: '',
    },
    {
      icon: '⭐',
      label: 'Calificación',
      value: '4.8/5',
      description: 'Satisfacción del cliente',
      progress: 96,
      trend: 'stable',
      trendValue: '0%',
      unit: '',
    },
    {
      icon: '👨‍🍳',
      label: 'Chefs Expertos',
      value: '5+',
      description: 'Años de experiencia culinaria',
      progress: 100,
      trend: 'stable',
      trendValue: '0%',
      unit: '',
    },
    {
      icon: '🏆',
      label: 'Años de Servicio',
      value: '15+',
      description: 'Tradición y calidad',
      progress: 100,
      trend: 'stable',
      trendValue: '0%',
      unit: '',
    },
  ];

  trackByProductId: TrackByFunction<{ name: string; image: string; description: string; price: string }> = (
    index: number,
    product: { name: string; image: string; description: string; price: string }
  ) => product.name;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private variantService: VariantService) {
    this.navBarConfig = this.variantService.getCurrentNavBarConfig();
    this.heroConfig = this.variantService.getCurrentHeroConfig();
    this.footerConfig = this.variantService.getCurrentFooterConfig();
    this.bubbleConfig = this.variantService.getCurrentBubbleConfig();
    this.variantSub = this.variantService.componentVariants$.subscribe((variants) => {
      this.componentVariants = { ...variants };
    });
    this.variantService.globalVariant$.subscribe((variant) => {
      this.globalVariant = variant;
    });
    this.navBarConfigSub = this.variantService.navBarConfig$.subscribe((config) => {
      this.navBarConfig = config;
    });
    this.heroConfigSub = this.variantService.heroConfig$.subscribe((config) => {
      this.heroConfig = config;
    });
    this.footerConfigSub = this.variantService.footerConfig$.subscribe((config) => {
      this.footerConfig = config;
    });
    this.bubbleConfigSub = this.variantService.bubbleConfig$.subscribe((config) => {
      this.bubbleConfig = config;
    });
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnDestroy() {
    this.variantSub?.unsubscribe();
    this.navBarConfigSub?.unsubscribe();
    this.heroConfigSub?.unsubscribe();
    this.footerConfigSub?.unsubscribe();
    this.bubbleConfigSub?.unsubscribe();
  }

  scrollToSection(sectionId: string | Event) {
    const id = typeof sectionId === 'string' ? sectionId : (sectionId as any).target?.value || sectionId;
    if (typeof id === 'string' && id.startsWith('/')) {
      return;
    }
    if (typeof id === 'string') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSocialClick(href: string | Event) {
    const url = typeof href === 'string' ? href : (href as any).target?.value || href;
    if (typeof url === 'string') {
      console.log(`Social media clicked: ${url}`);
      window.open(url, '_blank');
    }
  }

  openServiceModal(service: any) {
    this.selectedService = service;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedService = null;
  }

  handleKeyUp(event: KeyboardEvent, service: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.openServiceModal(service);
    }
  }

  addToCart(product: { name: string; image: string; description: string; price: string }) {
    console.log(`Producto añadido al carrito: ${product.name}`);
  }

  getVariant(componentId: string): CardVariant {
    const variant = this.componentVariants[componentId] || this.globalVariant;
    const validVariants = [
      'default', 'cyberpunk', 'jungle', 'enchanted', 'mystic', 'ancient', 'twilight', 'frosty', 'desert',
      'candy', 'oceanic', 'fiery', 'primary', 'secondary', 'neon', 'matrix', 'stellar', 'retro', 'phoenix',
      'aqua', 'plasma', 'cosmic', 'vaporwave', 'aurora'
    ];
    return validVariants.includes(variant) ? (variant as CardVariant) : 'default';
  }
}