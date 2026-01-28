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
    UIStatsLibSectionComponent,
    UIFeaturesSectionComponent,
    UITestimonialsSectionComponent,
    UINewsletterSectionComponent,
    ProductsSectionComponent
  ],
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
      title: '¿Necesito llevar algo especial?',
      content: 'Nosotros proporcionamos albornoz, toallas y zapatillas. Solo necesitas traer tu traje de baño.',
      expanded: false,
    },
    {
      title: '¿Con cuánta antelación debo llegar?',
      content: 'Recomendamos llegar 15 minutos antes de tu cita para completar el formulario de bienestar y relajarte.',
      expanded: false,
    },
  ];

  priceColumns: TableColumn[] = [
    { key: 'service', label: 'Servicio' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

  priceRows: TableRow[] = [
    { service: 'Masaje Sueco', description: '60 min. de relajación profunda con aceites esenciales', price: '65€' },
    { service: 'Circuito Hidrotermal', description: 'Acceso a sauna, baño turco y piscinas térmicas', price: '45€' },
    { service: 'Ritual Facial Oro', description: 'Tratamiento rejuvenecedor con partículas de oro 24k', price: '120€' },
    { service: 'Exfoliación de Sal Marina', description: 'Renovación celular completa con sales del Mar Muerto', price: '55€' },
    { service: 'Reflexología Podal', description: 'Técnica milenaria para el equilibrio energético', price: '50€' },
  ];

  spaStats = [
    { label: 'Rituales Realizados', value: '10,000+', icon: '💆' },
    { label: 'Especialistas', value: '15', icon: '🤲' },
    { label: 'Puntuación Cliente', value: '4.9/5', icon: '⭐' },
    { label: 'Años de Serenidad', value: '12', icon: '🕊️' },
  ];

  spaFeatures = [
    {
      title: 'Aceites Orgánicos',
      description: 'Utilizamos exclusivamente extractos naturales y aceites esenciales de primera presión en frío.',
      icon: '🌿'
    },
    {
      title: 'Cabinas Insonorizadas',
      description: 'Espacios diseñados para el silencio absoluto y la desconexión total del mundo exterior.',
      icon: '🔇'
    },
    {
      title: 'Terapeutas Certificados',
      description: 'Nuestro equipo domina técnicas milenarias combinadas con la tecnología más avanzada.',
      icon: '🧘'
    },
    {
      title: 'Atención Holística',
      description: 'Tratamos cuerpo, mente y espíritu como un todo unido en perfecta armonía.',
      icon: '☯️'
    }
  ];

  spaTestimonials = [
    {
      author: 'Laura Méndez',
      role: 'Directiva de Finanzas',
      quote: 'Mi refugio semanal. Logran que desconecte el teléfono y la mente en cuestión de minutos.',
      avatar: 'https://i.pravatar.cc/150?u=laura'
    },
    {
      author: 'Roberto Gómez',
      role: 'Atleta Profesional',
      quote: 'Sus masajes deportivos son clave para mi recuperación. Conocimiento técnico excepcional.',
      avatar: 'https://i.pravatar.cc/150?u=roberto'
    },
    {
      author: 'Carmen Vega',
      role: 'Emprendedora',
      quote: 'El circuito de aguas es el mejor que he probado en todo el país. La higiene y el trato son de 10.',
      avatar: 'https://i.pravatar.cc/150?u=carmen'
    }
  ];

  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Día de Lujo Total',
      description: 'Circuito completo, masaje de 90 min y cena gourmet.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80',
      price: '210€',
      discount: '-10%',
      icon: 'heroStar',
      tooltip: 'La experiencia definitiva de bienestar.',
    },
    {
      title: 'Escapada en Pareja',
      description: 'Masaje dual en cabina VIP con champán y frutas.',
      image: 'https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?auto=format&fit=crop&q=80',
      price: '150€',
      discount: 'Oferta',
      icon: 'heroStar',
      tooltip: 'Regala un momento inolvidable.',
    },
    {
      title: 'Ritual Detox',
      description: 'Tratamiento corporal con algas y envoltura térmica.',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80',
      price: '85€',
      discount: 'Nuevo',
      icon: 'heroStar',
      tooltip: 'Elimina toxinas y renueva tu energía.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: 'https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?auto=format&fit=crop&q=80', alt: 'Piscina Spa' },
        { src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80', alt: 'Masaje' },
        { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80', alt: 'Relajación' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Masajes Ancestrales',
      imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80',
      difficulty: 'Duración: 60-90 min',
      rating: 4.9,
      reviews: 450,
      duration: 1.5,
      distance: 0,
      ascent: 0,
      description: 'Técnicas orientales y occidentales para liberar tensiones profundas.',
      features: ['Aceites bio', 'Música zen'],
      link: '#reserva',
    },
    {
      routeName: 'Belleza Facial',
      imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80',
      difficulty: 'Duración: 45 min',
      rating: 4.8,
      reviews: 320,
      duration: 0.75,
      distance: 0,
      ascent: 0,
      description: 'Tratamientos rejuvenecedores con cosmética de alta gama.',
      features: ['Análisis dérmico', 'Mascarilla VIP'],
      link: '#reserva',
    },
    {
      routeName: 'Circuito Spa',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?auto=format&fit=crop&q=80',
      difficulty: 'Duración: Ilimitada',
      rating: 5.0,
      reviews: 580,
      duration: 3,
      distance: 0,
      ascent: 0,
      description: 'El poder del agua para renovar tu salud y vitalidad.',
      features: ['Sauna finlandesa', 'Jacuzzi'],
      link: '#reserva',
    },
  ];

  products = [
    {
      name: 'Aceite de Lavanda',
      image: 'https://images.unsplash.com/photo-1608245447191-7b8af1f3c211?auto=format&fit=crop&q=80',
      description: 'Esencia pura para relajación nocturna.',
      price: '25€',
    },
    {
      name: 'Sales del Himalaya',
      image: 'https://images.unsplash.com/photo-1595876722061-d5c962e7de31?auto=format&fit=crop&q=80',
      description: 'Sales minerales para un baño desintoxicante.',
      price: '15€',
    },
    {
      name: 'Crema Hidratante Bio',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80',
      description: 'Nutrición profunda con base de aloe vera.',
      price: '35€',
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