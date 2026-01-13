import { Component, HostListener, OnDestroy, signal, OnInit, Inject, PLATFORM_ID, TrackByFunction } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantRotationService } from '@negocio/shared-components';
import {
  UINavBarComponent,
  UIHeroSectionComponent,
  UITabsComponent,
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
  BubbleConfig,
  UIButtonComponent,
} from '@negocio/ui-components';
import { FaqSectionComponent, GallerySectionComponent, PricingSectionComponent, PromotionsSectionComponent, ReservationFormComponent, ServiceSectionComponent } from '@negocio/featured-components';

const VARIANTS = [
  'jungle',
  'enchanted',
  'mystic',
  'ancient',
  'twilight',
  'frosty',
  'desert',
  'candy',
  'oceanic',
  'fiery',
] as const;

type VariantType = typeof VARIANTS[number];

@Component({
  selector: 'lib-home-feature',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UINavBarComponent,
    UIHeroSectionComponent,
    UITabsComponent,
    ReservationFormComponent,
    // ServiceSectionComponent,
    FaqSectionComponent,
    PricingSectionComponent,
    GallerySectionComponent,
    PromotionsSectionComponent,
    UIModalComponent,
    UICardRutasComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UIButtonComponent
  ],
  templateUrl: './home-feature.component.html',
  styles: [
    `
      :host {
        --neon-glow: 0 0 10px rgba(255, 30, 86, 0.8), 0 0 20px rgba(255, 30, 86, 0.4);
      }

      /* Hero, Navbar y Tabs */
      #hero,
      lib-ui-components-nav-bar,
      lib-ui-components-tabs {
        position: relative;
        z-index: 20;
      }

      /* Bubble Animation */
      lib-bubble-animation {
        --hero-height: 100vh;
        position: relative;
        z-index: -1;
      }

      lib-bubble-animation .gradient-bg {
        top: var(--hero-height);
      }

      /* Contenedor Principal */
      .min-h-screen {
        position: relative;
        background: none;
      }

      /* Secciones */
      .section-bg {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(4px);
        padding: 20px;
        border-radius: 8px;
        position: relative;
        z-index: 10;
      }

      /* Formularios */
      #forms {
        position: relative;
        z-index: 15;
        lib-reservation-form {
          form {
            background: rgba(255, 30, 86, 0.4) !important;
            backdrop-filter: blur(8px);
            color: #fff;
            border: 2px solid rgba(255, 107, 157, 0.8);
            box-shadow: 0 0 15px rgba(255, 107, 157, 0.7);
          }

          h2 {
            text-shadow: 0 0 10px rgba(255, 204, 21, 0.8);
          }

          .ui-components-input,
          .ui-components-button,
          .ui-components-chip {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 107, 157, 0.8);
            color: #fff;
          }
        }

        .mist-layer {
          opacity: 0.2 !important;
        }
      }

      /* Modal */
      lib-ui-components-modal {
        z-index: 30;
      }

      /* Productos */
      .product-card {
        transition: all 0.5s ease;
      }

      .particle-layer {
        background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"%3E%3Ccircle cx="100" cy="100" r="5" fill="rgba(255,30,86,0.3)"%3E%3Canimate attributeName="cy" values="100;1100" dur="10s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="300" cy="200" r="4" fill="rgba(250,204,21,0.2)"%3E%3Canimate attributeName="cy" values="200;1100" dur="12s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="500" cy="50" r="6" fill="rgba(255,30,86,0.4)"%3E%3Canimate attributeName="cy" values="50;1100" dur="8s" repeatCount="indefinite"/%3E%3C/circle%3E%3C/svg%3E');
        animation: particle-drift 20s linear infinite;
        z-index: 1;
      }

      @keyframes particle-drift {
        from { transform: translateY(0); }
        to { transform: translateY(-1000px); }
      }

      @keyframes neon-glow {
        0%, 100% { text-shadow: var(--neon-glow); }
        50% { text-shadow: 0 0 15px rgba(255, 30, 86, 1), 0 0 30px rgba(255, 30, 86, 0.6); }
      }

      @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-neon {
        animation: neon-glow 2s ease-in-out infinite;
      }

      .animate-fade-in {
        animation: fade-in 1s ease-out forwards;
      }

      /* Responsividad */
      @media (max-width: 768px) {
        #forms, #productos {
          .firefly,
          .spore-particle,
          .leaf {
            display: none;
          }
        }

        .section-bg {
          padding: 10px;
        }

        lib-bubble-animation {
          --hero-height: 80vh;
        }

        .product-card {
          margin: 0 auto;
          max-width: 300px;
        }
      }

      .font-nintendo {
        font-family: 'Press Start 2P', cursive;
      }
    `
  ]
})
export class HomeMobileFeatureComponent implements OnDestroy, OnInit {
  addToCart(_t55: {
    name: string;
    image: string; description: string; price: string;
  }) {
    throw new Error('Method not implemented.');
  }
  selectedVariant: CardVariant = 'default';
  isMobile = false;
  modalOpen = false;
  selectedService: any | null = null;
  private variantSub?: Subscription;
  selectedForestVariant = signal<VariantType>('enchanted');
  private variantIndex = 0;
  private intervalId?: any;

  navLinks = [
    { label: 'Inicio', href: '#hero', icon: '🏠' },
    { label: 'Servicios', href: '#servicios', icon: '💪' },
    { label: 'Reservas', href: '#forms', icon: '📅' },
    { label: 'Precios', href: '#precios', icon: '💰' },
    { label: 'Promociones', href: '#promociones', icon: '🎉' },
    { label: 'Productos', href: '#productos', icon: '🏋️' },
  ];

  navLinkstabs = [
    { label: 'Inicio', sectionId: 'hero', icon: '🏠', active: true },
    { label: 'Servicios', sectionId: 'servicios', icon: '💪' },
    { label: 'Reservas', sectionId: 'forms', icon: '📅' },
    { label: 'Precios', sectionId: 'precios', icon: '💰' },
    { label: 'Promociones', sectionId: 'promociones', icon: '🎉' },
    { label: 'Productos', sectionId: 'productos', icon: '🏋️' },
  ];

  navigationCards = [
    { icon: '💪', title: 'Entrenamientos', description: 'Fuerza y resistencia', animationDelay: '0.2s', sectionId: 'precios' },
    { icon: '🏋️', title: 'Equipos', description: 'Máquinas modernas', animationDelay: '0.4s', sectionId: 'faq' },
    { icon: '📅', title: 'Reservas', description: 'Agenda tu sesión', animationDelay: '0.6s', sectionId: 'forms' },
  ];

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
      imageUrl:'/retro-stars.png',
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
      imageUrl:  '/1090.png',
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
  trackByProductId!: TrackByFunction<{ name: string; image: string; description: string; price: string; }>;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private variantRotationService: VariantRotationService) {
    this.variantSub = this.variantRotationService.currentVariant$.subscribe(
      (variant) => (this.selectedVariant = variant as CardVariant)
    );
  }

  ngOnInit() {
    this.startVariantRotation();
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnDestroy() {
    this.variantSub?.unsubscribe();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  config: BubbleConfig = {
    speed: 0.8,
    blur: 30,
    opacity: 0.7,
    variant: ''
  };

  scrollToSection(sectionId: string) {
    if (sectionId.startsWith('/')) {
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
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

  startVariantRotation(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.intervalId = setInterval(() => {
        this.variantIndex = (this.variantIndex + 1) % VARIANTS.length;
        this.selectedForestVariant.set(VARIANTS[this.variantIndex]);
      }, 5000);
    }
  }

  rotateVariantManually(): void {
    this.variantIndex = (this.variantIndex + 1) % VARIANTS.length;
    this.selectedForestVariant.set(VARIANTS[this.variantIndex]);
  }
}