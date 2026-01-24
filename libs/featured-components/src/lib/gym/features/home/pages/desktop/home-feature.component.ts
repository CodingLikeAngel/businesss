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
  UIStatsLibSectionComponent,
  StatItem,
  UIStepsSectionComponent,
  UIAccordionComponent,
  UIChartComponent
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
    UIStatsLibSectionComponent,
    UIModalComponent,
    UICardRutasComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UIFooterComponent,
    UIStatsLibSectionComponent,
    UIStepsSectionComponent,
    UIAccordionComponent,
    UIChartComponent
  ],
  templateUrl: './home-feature.component.html',
  styleUrl: './home-feature.component.scss',
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
      title: '¿Cuánto tiempo dura una sesión?',
      content: 'Las sesiones varían de 45 minutos a 2 horas, dependiendo del tipo de entrenamiento.',
      expanded: false,
    },
    {
      title: '¿Puedo cancelar mi membresía?',
      content: 'Sí, con 30 días de antelación. Contáctanos para gestionar.',
      expanded: false,
    },
  ];

  priceColumns: TableColumn[] = [
    { key: 'membership', label: 'Membresía' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

  priceRows: TableRow[] = [
    { membership: 'Básica', description: 'Acceso ilimitado', price: '30€/mes' },
    { membership: 'Premium', description: 'Acceso + clases', price: '50€/mes' },
    { membership: 'VIP', description: 'Todo incluido + entrenador', price: '80€/mes' },
  ];

  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Entrenamiento Personal',
      description: 'Sesiones personalizadas con entrenador experto.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      price: '60€',
      discount: '-10%',
      icon: 'heroStar',
      tooltip: '¡Mejora tu rendimiento!',
    },
    {
      title: 'Clases Grupales',
      description: 'Yoga, pilates y más en grupo.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      price: '20€/clase',
      discount: 'Oferta',
      icon: 'heroStar',
      tooltip: 'Únete a la comunidad.',
    },
    {
      title: 'Plan Nutricional',
      description: 'Dieta personalizada para tus objetivos.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
      price: '40€',
      discount: 'Novedad',
      icon: 'heroStar',
      tooltip: 'Alimenta tu cuerpo.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: '/1029.png', alt: 'Gimnasio 1' },
        { src: '/1090.png', alt: 'Entrenamiento 1' },
        { src: '/retro-stars.png', alt: 'Equipo 1' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Entrenamiento Funcional',
      imageUrl: '/retro-stars.png',
      difficulty: 'Duración: 1 hora',
      rating: 4.8,
      reviews: 300,
      duration: 1,
      distance: 0,
      ascent: 0,
      description: 'Mejora tu fuerza y resistencia con ejercicios funcionales.',
      features: ['Equipos modernos', 'Entrenadores certificados'],
      link: '#forms',
    },
    {
      routeName: 'Yoga y Pilates',
      imageUrl: '/1029.png',
      difficulty: 'Duración: 45 min',
      rating: 4.9,
      reviews: 250,
      duration: 0.75,
      distance: 0,
      ascent: 0,
      description: 'Relájate y fortalece tu mente y cuerpo.',
      features: ['Clases guiadas', 'Ambiente tranquilo'],
      link: '#forms',
    },
    {
      routeName: 'CrossFit',
      imageUrl: '/1090.png',
      difficulty: 'Duración: 1.5 horas',
      rating: 4.7,
      reviews: 180,
      duration: 1.5,
      distance: 0,
      ascent: 0,
      description: 'Entrenamiento de alta intensidad para atletas.',
      features: ['Comunidad activa', 'Competencias'],
      link: '#forms',
    },
  ];

  products = [
    {
      name: 'Proteína Whey',
      image: '/1029.png',
      description: 'Suplemento de alta calidad para recuperación muscular.',
      price: '25€',
    },
    {
      name: 'Botella Deportiva',
      image: '/1029.png',
      description: 'Mantén la hidratación durante tus entrenamientos.',
      price: '15€',
    },
    {
      name: 'Mancuernas Ajustables',
      image: '/1029.png',
      description: 'Pesas versátiles para ejercicios en casa.',
      price: '50€',
    },
  ];

  gymStats: StatItem[] = [
    { icon: '💪', label: 'Fuerza Total', value: '1.2M', description: 'Kilos levantados este mes', progress: 85, trend: 'up' },
    { icon: '🔥', label: 'Calorías', value: '450k', description: 'Quemadas por socios', progress: 92, trend: 'up' },
    { icon: '👥', label: 'Comunidad', value: '5k+', description: 'Socios activos', trend: 'stable' },
    { icon: '🏆', label: 'Podios', value: '120', description: 'Medallas en CrossFit', progress: 100 }
  ];

  gymSteps = [
    { title: 'Evaluación', description: 'Medimos tu nivel actual y objetivos de salud.', icon: '⚖️', state: 'completed' },
    { title: 'Planificación', description: 'Diseñamos tu rutina personalizada de entrenamiento.', icon: '📋', state: 'current' },
    { title: 'Transformación', description: 'Ejecutamos el plan y escalamos tus límites.', icon: '⚡', state: 'pending' }
  ];

  gymFaq: AccordionItem[] = [
    { title: '¿Ofrecéis pases de un día?', content: '¡Claro! Ven a probar nuestras instalaciones por solo 10€.' },
    { title: '¿Hay clases colectivas?', content: 'Todas nuestras suscripciones incluyen acceso ilimitado a Yoga, HIIT y CrossFit.' }
  ];

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