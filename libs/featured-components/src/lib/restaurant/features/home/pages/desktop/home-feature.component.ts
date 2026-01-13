import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, NavBarConfig, HeroConfig, FooterConfig, BubbleConfig } from '@negocio/shared-components';
import {
  UINavBarComponent,
  UIHeroSectionComponent,
  CardVariant,
  AccordionItem,
  TableColumn,
  TableRow,
  GalleryImage,
  UITitleComponent,
  CardPremiumConfig,
  UIModalComponent,
  UICardRutasComponent,
  BubbleAnimationComponent,
  BubbleConfig as BubbleAnimationConfig,
  UIFooterComponent,
} from '@negocio/ui-components';
import { FaqSectionComponent, GallerySectionComponent, PricingSectionComponent, PromotionsSectionComponent, ReservationFormComponent, ServiceSectionComponent } from '@negocio/featured-components';

@Component({
  selector: 'lib-home-feature',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UINavBarComponent,
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
    UIFooterComponent,
  ],
  templateUrl: './home-feature.component.html',
  styles: [/* Existing styles unchanged */],
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
    { dish: 'Pasta Carbonara', description: 'Pasta fresca con salsa cremosa', price: '12€' },
    { dish: 'Risotto de Setas', description: 'Arroz cremoso con setas del bosque', price: '15€' },
    { dish: 'Tiramisú', description: 'Postre italiano clásico', price: '8€' },
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

  scrollToSection(sectionId: string) {
    if (sectionId.startsWith('/')) {
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  onSocialClick(href: string) {
    console.log(`Social media clicked: ${href}`);
    window.open(href, '_blank');
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