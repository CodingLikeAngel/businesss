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
    BubbleAnimationComponent,
    UITitleComponent,
    UICardRutasComponent,
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
      title: '¿Cuánto tiempo toma una reparación?',
      content: 'Depende del problema. Un cambio de aceite toma 30 minutos, una reparación mayor hasta 2 días.',
      expanded: false,
    },
    {
      title: '¿Ofrecen garantía en las reparaciones?',
      content: 'Sí, todas nuestras reparaciones tienen garantía de 1 año. Contáctanos para detalles.',
      expanded: false,
    },
  ];

  priceColumns: TableColumn[] = [
    { key: 'service', label: 'Servicio' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

  priceRows: TableRow[] = [
    { service: 'Cambio de Aceite', description: 'Aceite sintético y filtro', price: '40€' },
    { service: 'Revisión General', description: 'Chequeo completo del vehículo', price: '80€' },
    { service: 'Cambio de Frenos', description: 'Pastillas y discos delanteros', price: '150€' },
  ];

  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Diagnóstico Completo',
      description: 'Análisis computarizado de todos los sistemas.',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
      price: '50€',
      discount: '-10%',
      icon: 'heroStar',
      tooltip: '¡Detecta problemas antes!',
    },
    {
      title: 'Mantenimiento Anual',
      description: 'Paquete completo de mantenimiento preventivo.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
      price: '200€',
      discount: 'Oferta',
      icon: 'heroStar',
      tooltip: 'Ahorra en reparaciones futuras.',
    },
    {
      title: 'Reparación de Motor',
      description: 'Servicio especializado para motores.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      price: '300€',
      discount: 'Novedad',
      icon: 'heroStar',
      tooltip: 'Expertos en motores.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: '/1029.png', alt: 'Taller 1' },
        { src: '/1090.png', alt: 'Reparación 1' },
        { src: '/retro-stars.png', alt: 'Equipo 1' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Cambio de Aceite',
      imageUrl: '/retro-stars.png',
      difficulty: 'Duración: 30 min',
      rating: 4.8,
      reviews: 400,
      duration: 0.5,
      distance: 0,
      ascent: 0,
      description: 'Cambio de aceite y filtro con productos de calidad.',
      features: ['Aceite sintético', 'Filtro original'],
      link: '#forms',
    },
    {
      routeName: 'Revisión General',
      imageUrl: '/1029.png',
      difficulty: 'Duración: 1 hora',
      rating: 4.9,
      reviews: 350,
      duration: 1,
      distance: 0,
      ascent: 0,
      description: 'Chequeo completo de frenos, suspensión y fluidos.',
      features: ['Informe detallado', 'Recomendaciones'],
      link: '#forms',
    },
    {
      routeName: 'Reparación de Frenos',
      imageUrl: '/1090.png',
      difficulty: 'Duración: 2 horas',
      rating: 4.7,
      reviews: 280,
      duration: 2,
      distance: 0,
      ascent: 0,
      description: 'Cambio de pastillas y discos para seguridad máxima.',
      features: ['Materiales premium', 'Garantía incluida'],
      link: '#forms',
    },
  ];

  products = [
    {
      name: 'Aceite Sintético',
      image: '/1029.png',
      description: 'Aceite de alta calidad para motores modernos.',
      price: '25€',
    },
    {
      name: 'Filtro de Aire',
      image: '/1029.png',
      description: 'Filtro de aire para mejor rendimiento del motor.',
      price: '15€',
    },
    {
      name: 'Batería de Auto',
      image: '/1029.png',
      description: 'Batería de larga duración para tu vehículo.',
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

  getVariant(componentId: string): any {
    const variant = this.componentVariants[componentId] || this.globalVariant;
    const validVariants = [
      'default', 'primary', 'secondary', 'outline', 'ghost', 'link', 'neon', 'cyberpunk', 'gradient', 'glass',
      'retro', 'pulse-gradient', 'holo', 'matrix', 'quantum', 'cybernetic', 'danger', 'success', 'nano',
      'stellar', 'phoenix', 'galactic', 'orbitron', 'cartoon', 'luma', 'platform', 'hero', 'coin', 'cloud',
      'fire', 'water', 'leaf', 'amber-glow', 'minimal-white', 'mario', 'zelda', 'kirby', 'rayman', 'lum',
      'river', 'minimal', 'hex-teal', 'purple-edge', 'rose-radial', 'yellow-pulse', 'green-inset', 'blue-skew',
      'orange-dash', 'indigo-dots', 'bubble', 'electoon', 'jungle', 'joycon', 'neomorph', 'glitch', 'portal',
      'bioshock', 'super-meat-boy', 'pokemon', 'animal-crossing', 'assassins-creed', 'far-cry', 'watch-dogs',
      'bioshock-enhanced', 'lol', 'overwatch', 'minecraft', 'fortnite', 'ice', 'metal', 'energy', 'void',
      'cosmic', 'plasma', 'arcade', 'pixel', 'chaos', 'vortex', 'stone', 'donkeykong', 'supermeatboy', 'aqua',
      'vaporwave', 'aurora', 'trailblazer', 'elegant', 'vintage', 'luxury', 'rockstar', 'ubisoft', 'morphing-blob',
      'liquid-metal', 'crystal-prism', 'neural-network', 'quantum-field', 'holographic-matrix', 'plasma-storm',
      'cyber-circuit', 'organic-growth', 'fractal-dimension', 'time-warp', 'dimensional-shift', 'nano-swarm',
      'energy-web', 'void-portal', 'cosmic-dust', 'stellar-nova', 'aurora-borealis', 'lava-flow', 'ice-crystal',
      'thunder-storm', 'water-ripple', 'black-hole', 'wormhole', 'dna-helix', 'crystal', 'gear', 'star', 'hexagon'
    ];
    return validVariants.includes(variant) ? variant : 'default';
  }
}