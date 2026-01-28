import { Component, HostListener, OnDestroy, signal, OnInit, Inject, PLATFORM_ID, TrackByFunction } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantRotationService } from '@negocio/shared-components';
import {
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
  UINavBarComponent as LibUINavBarComponent,
  UINavBarComponent
} from '@negocio/ui-components';
import {
  UIHeroSectionComponent,
  UIFaqSectionComponent,
  UIGallerySectionComponent,
  UIPricingTableSectionComponent,
  PromotionsSectionComponent,
  ReservationFormComponent,
  ServiceSectionComponent
} from '@negocio/featured-components';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
  'elegant',
  'luxury',
  'vintage'
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
    UIFaqSectionComponent,
    UIPricingTableSectionComponent,
    UIGallerySectionComponent,
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
  selectedVariant: CardVariant = 'elegant';
  isMobile = false;
  modalOpen = false;
  selectedService: any | null = null;
  private variantSub?: Subscription;
  selectedForestVariant = signal<VariantType>('enchanted');
  private variantIndex = 0;
  private intervalId?: any;

  navLinks = [
    { label: 'Inicio', href: '#hero', icon: '🏠' },
    { label: 'Servicios', href: '#servicios', icon: '🍽️' },
    { label: 'Reservas', href: '#forms', icon: '📅' },
    { label: 'Precios', href: '#precios', icon: '💰' },
    { label: 'Promociones', href: '#promociones', icon: '🎉' },
    { label: 'Productos', href: '#productos', icon: '🍷' },
  ];

  navLinkstabs = [
    { label: 'Inicio', sectionId: 'hero', icon: '🏠', active: true },
    { label: 'Servicios', sectionId: 'servicios', icon: '🍽️' },
    { label: 'Reservas', sectionId: 'forms', icon: '📅' },
    { label: 'Precios', sectionId: 'precios', icon: '💰' },
    { label: 'Promociones', sectionId: 'promociones', icon: '🎉' },
    { label: 'Productos', sectionId: 'productos', icon: '🍷' },
  ];

  navigationCards = [
    { icon: '🍽️', title: 'Menús', description: 'Platos exquisitos', animationDelay: '0.2s', sectionId: 'precios' },
    { icon: '🍷', title: 'Vinos', description: 'Selección premium', animationDelay: '0.4s', sectionId: 'faq' },
    { icon: '📅', title: 'Reservas', description: 'Agenda tu mesa', animationDelay: '0.6s', sectionId: 'forms' },
  ];

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
      imageUrl:'/retro-stars.png',
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
      imageUrl:  '/1090.png',
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

  scrollToSection(sectionId: string | Event) {
    const id = typeof sectionId === 'string' ? sectionId : (sectionId as any).target?.value || sectionId;
    if (typeof id === 'string' && id.startsWith('/')) {
      return;
    }
    if (typeof id === 'string') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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