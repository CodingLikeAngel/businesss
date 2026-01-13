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
import { FaqSectionComponent } from '../../components/faq-section/faq-section.component';
import { GallerySectionComponent } from '../../components/gallery-section/gallery-section.component';
import { PricingSectionComponent } from '../../components/pricing-section/pricing-section.component';
import { PromotionsSectionComponent } from '../../components/promotions-section/promotions-section.component';
import { ReservationFormComponent } from '../../components/reservation-form/reservation-form.component';
import { ServiceSectionComponent } from '../../components/service-section/service-section.component';

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
  //  ServiceSectionComponent,
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
// image: '/1029.png',
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
    { label: 'Servicios', href: '#servicios', icon: '✂️' },
    { label: 'Reservas', href: '#forms', icon: '📅' },
    { label: 'Precios', href: '#precios', icon: '💰' },
    { label: 'Promociones', href: '#promociones', icon: '🎉' },
    { label: 'Productos', href: '#productos', icon: '🧴' },
  ];

  navLinkstabs = [
    { label: 'Inicio', sectionId: 'hero', icon: '🏠', active: true },
    { label: 'Servicios', sectionId: 'servicios', icon: '✂️' },
    { label: 'Reservas', sectionId: 'forms', icon: '📅' },
    { label: 'Precios', sectionId: 'precios', icon: '💰' },
    { label: 'Promociones', sectionId: 'promociones', icon: '🎉' },
    { label: 'Productos', sectionId: 'productos', icon: '🧴' },
  ];

  navigationCards = [
    { icon: '✂️', title: 'Cortes', description: 'Estilo personalizado', animationDelay: '0.2s', sectionId: 'precios' },
    { icon: '💅', title: 'Manicura', description: 'Diseños únicos', animationDelay: '0.4s', sectionId: 'faq' },
    { icon: '📅', title: 'Reservas', description: 'Agenda tu cita', animationDelay: '0.6s', sectionId: 'forms' },
  ];

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
      imageUrl:'/retro-stars.png',
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
      imageUrl:  '/1090.png',
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
      // image: '/1029.png',
      image: '/1029.png',
      description: 'Colores vibrantes de larga duración, sin amoníaco.',
      price: '25€',
    },
    {
      name: 'Champú Hidratante',
      // image: '/1090.png',
      image: '/1029.png',
      description: 'Nutre y fortalece tu cabello con ingredientes naturales.',
      price: '18€',
    },
    {
      name: 'Plancha Profesional',
      // image: '/retro-stars.png',
      image: '/1029.png',
      description: 'Tecnología iónica para un alisado perfecto.',
      price: '80€',
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