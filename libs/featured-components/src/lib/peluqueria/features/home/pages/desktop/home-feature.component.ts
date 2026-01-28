import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, NavBarConfig, HeroConfig, FooterConfig, BubbleConfig } from '@negocio/shared-components';
import {
  UINavBarComponent,
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
import {
  UIHeroSectionComponent,
  UIFaqSectionComponent,
  UIGallerySectionComponent,
  UIPricingTableSectionComponent,
  PromotionsSectionComponent,
  ReservationFormComponent
} from '@negocio/featured-components';

@Component({
  selector: 'lib-home-feature',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UINavBarComponent,
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
      title: '¿Cuánto tiempo dura una cita?',
      content: 'Depende del servicio. Un corte hombre toma 30 minutos, un tinte hasta 2 horas.',
      expanded: false,
    },
    {
      title: '¿Puedo cancelar mi reserva?',
      content: 'Sí, hasta 24 horas antes sin costo. Contáctanos para gestionar.',
      expanded: false,
    },
  ];

  priceColumns: TableColumn[] = [
    { key: 'service', label: 'Servicio' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

  priceRows: TableRow[] = [
    { service: 'Corte Hombre', description: 'Corte personalizado', price: '15€' },
    { service: 'Corte Mujer', description: 'Estilo a medida', price: '25€' },
    { service: 'Manicura', description: 'Diseño básico o personalizado', price: '20€' },
  ];

  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Combo Corte + Tinte',
      description: 'Corte personalizado y tinte vibrante.',
      image: 'https://images.unsplash.com/photo-1608245447191-7b8af1f3c211',
      price: '50€',
      discount: '-20%',
      icon: 'heroStar',
      tooltip: '¡Ahorra con este combo especial!',
    },
    {
      title: 'Manicura Premium',
      description: 'Diseño de larga duración con arte.',
      image: 'https://images.unsplash.com/photo-1595876722061-d5c962e7de31',
      price: '30€',
      discount: 'Oferta',
      icon: 'heroStar',
      tooltip: 'Manicura de larga duración.',
    },
    {
      title: 'Tratamiento Capilar',
      description: 'Hidratación profunda para tu cabello.',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f',
      price: '35€',
      discount: 'Novedad',
      icon: 'heroStar',
      tooltip: 'Revitaliza tu cabello hoy.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: '/1029.png', alt: 'Salón 1' },
        { src: '/1090.png', alt: 'Corte 1' },
        { src: '/retro-stars.png', alt: 'Manicura 1' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Corte de Hombre',
      imageUrl: '/retro-stars.png',
      difficulty: 'Duración: 30 min',
      rating: 4.8,
      reviews: 150,
      duration: 0.5,
      distance: 0,
      ascent: 0,
      description: 'Un corte fresco y personalizado para un look moderno.',
      features: ['Corte con tijera', 'Lavado incluido'],
      link: '#forms',
    },
    {
      routeName: 'Tinte Vibrante',
      imageUrl: '/1029.png',
      difficulty: 'Duración: 2 horas',
      rating: 4.9,
      reviews: 89,
      duration: 2,
      distance: 0,
      ascent: 0,
      description: 'Colores vibrantes con productos de alta calidad.',
      features: ['Tinte sin amoníaco', 'Tratamiento protector'],
      link: '#forms',
    },
    {
      routeName: 'Manicura Artística',
      imageUrl: '/1090.png',
      difficulty: 'Duración: 1 hora',
      rating: 4.7,
      reviews: 120,
      duration: 1,
      distance: 0,
      ascent: 0,
      description: 'Diseños únicos para tus uñas con acabados duraderos.',
      features: ['Esmalte gel', 'Decoración personalizada'],
      link: '#forms',
    },
  ];

  products = [
    {
      name: 'Tinte Neón',
      image: '/1029.png',
      description: 'Colores vibrantes de larga duración, sin amoníaco.',
      price: '25€',
    },
    {
      name: 'Champú Hidratante',
      image: '/1029.png',
      description: 'Nutre y fortalece tu cabello con ingredientes naturales.',
      price: '18€',
    },
    {
      name: 'Plancha Profesional',
      image: '/1029.png',
      description: 'Tecnología iónica para un alisado perfecto.',
      price: '80€',
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