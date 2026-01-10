import { Component, HostListener, OnDestroy, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
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
  CardPremiumConfig,
  UIModalComponent,
  UICardRutasComponent,
  BubbleAnimationComponent,
  BubbleConfig,
} from '@negocio/ui-components';
import { FaqSectionComponent } from '../home/components/faq-section/faq-section.component';
import { GallerySectionComponent } from '../home/components/gallery-section/gallery-section.component';
import { PricingSectionComponent } from '../home/components/pricing-section/pricing-section.component';
import { PromotionsSectionComponent } from '../home/components/promotions-section/promotions-section.component';
import { ReservationFormComponent } from '../home/components/reservation-form/reservation-form.component';
import { ServiceSectionComponent } from '../home/components/service-section/service-section.component';


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
  selector: 'lib-tattoo-home-feature',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UINavBarComponent,
    UIHeroSectionComponent,
    UITabsComponent,
    ReservationFormComponent,
    ServiceSectionComponent,
    FaqSectionComponent,
    PricingSectionComponent,
    GallerySectionComponent,
    PromotionsSectionComponent,
    UIModalComponent,
    UICardRutasComponent,
    BubbleAnimationComponent
  ],
  templateUrl: './tattoo-home-feature.component.html',
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

      /* Tatuaje Animado */
      .tattoo-container {
        cursor: pointer;
      }

      .tattoo-style.traditional {
        stroke: #000;
        stroke-width: 4;
        fill: none;
      }

      .tattoo-style.geometric {
        stroke: #FF1E56;
        stroke-width: 2;
        fill: rgba(255, 30, 86, 0.2);
      }

      .tattoo-style.watercolor {
        stroke: none;
        fill: url(#watercolorGradient);
      }

      /* Tatuajes */
      .tattoo-card {
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
        #forms, #tatuajes {
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

        .tattoo-card {
          margin: 0 auto;
          max-width: 300px;
        }

        .tattoo-container {
          width: 200px;
          height: 200px;
        }
      }

      .font-nintendo {
        font-family: 'Press Start 2P', cursive;
      }
    `
  ]
})
export class TattooHomeFeatureComponent implements OnDestroy, OnInit {
  selectedVariant: CardVariant = 'default';
  isMobile = false;
  modalOpen = false;
  selectedService: any | null = null;
  private variantSub?: Subscription;
  selectedForestVariant = signal<VariantType>('enchanted');
  private variantIndex = 0;
  private intervalId?: any;
  currentTattooStyle = 'traditional';

  navLinks = [
    { label: 'Inicio', href: '#hero', icon: '🏠' },
    { label: 'Servicios', href: '#servicios', icon: '🖌️' },
    { label: 'Reservas', href: '#forms', icon: '📅' },
    { label: 'Precios', href: '#precios', icon: '💰' },
    { label: 'Promociones', href: '#promociones', icon: '🎉' },
    { label: 'Tatuajes', href: '#tatuajes', icon: '💉' },
  ];

  navLinkstabs = [
    { label: 'Inicio', sectionId: 'hero', icon: '🏠', active: true },
    { label: 'Servicios', sectionId: 'servicios', icon: '🖌️' },
    { label: 'Reservas', sectionId: 'forms', icon: '📅' },
    { label: 'Precios', sectionId: 'precios', icon: '💰' },
    { label: 'Promociones', sectionId: 'promociones', icon: '🎉' },
    { label: 'Tatuajes', sectionId: 'tatuajes', icon: '💉' },
  ];

  navigationCards = [
    { icon: '🖌️', title: 'Tatuajes', description: 'Diseños personalizados', animationDelay: '0.2s', sectionId: 'precios' },
    { icon: '✨', title: 'Retoques', description: 'Perfecciona tu arte', animationDelay: '0.4s', sectionId: 'faq' },
    { icon: '📅', title: 'Reservas', description: 'Agenda tu sesión', animationDelay: '0.6s', sectionId: 'forms' },
  ];

  faqItems: AccordionItem[] = [
    {
      title: '¿Duele hacerse un tatuaje?',
      content: 'El dolor varía según la zona y tu tolerancia. ¡Hablamos contigo para que estés cómodo!',
      expanded: false,
    },
    {
      title: '¿Cuánto tarda en sanar?',
      content: 'Generalmente, 2-4 semanas con los cuidados adecuados.',
      expanded: false,
    },
  ];

  priceColumns: TableColumn[] = [
    { key: 'service', label: 'Servicio' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

  priceRows: TableRow[] = [
    { service: 'Tatuaje Pequeño', description: 'Hasta 10 cm', price: '50€' },
    { service: 'Tatuaje Mediano', description: '10-20 cm', price: '100€' },
    { service: 'Sesión Completa', description: 'Diseño grande', price: '200€+' },
  ];

  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Tatuaje + Retoque',
      description: 'Tatuaje mediano con retoque gratis.',
      image: 'https://images.unsplash.com/photo-1532636875308-81c7807747a8',
      price: '120€',
      discount: '-10%',
      icon: 'heroStar',
      tooltip: '¡Perfecto para tu primer tatuaje!',
    },
    {
      title: 'Sesión Personalizada',
      description: 'Diseño exclusivo con consulta previa.',
      image: 'https://images.unsplash.com/photo-1512529920731-e8aba8da44a8',
      price: '250€',
      discount: 'Oferta',
      icon: 'heroStar',
      tooltip: 'Tu visión, nuestro arte.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: 'https://images.unsplash.com/photo-1532636875308-81c7807747a8', alt: 'Tatuaje 1' },
        { src: 'https://images.unsplash.com/photo-1512529920731-e8aba8da44a8', alt: 'Tatuaje 2' },
        { src: 'https://images.unsplash.com/photo-1566140967404-b8b6c4b49dce', alt: 'Tatuaje 3' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Tatuaje Tradicional',
      imageUrl: 'https://images.unsplash.com/photo-1532636875308-81c7807747a8',
      difficulty: 'Duración: 2-4 horas',
      rating: 4.9,
      reviews: 200,
      duration: 3,
      distance: 0,
      ascent: 0,
      description: 'Estilo clásico con líneas gruesas y colores vivos.',
      features: ['Diseño personalizado', 'Consulta previa'],
      link: '#forms',
    },
    {
      routeName: 'Tatuaje Geométrico',
      imageUrl: 'https://images.unsplash.com/photo-1512529920731-e8aba8da44a8',
      difficulty: 'Duración: 2-5 horas',
      rating: 4.8,
      reviews: 150,
      duration: 3.5,
      distance: 0,
      ascent: 0,
      description: 'Formas precisas y simétricas para un look moderno.',
      features: ['Alta precisión', 'Estilo minimalista'],
      link: '#forms',
    },
    {
      routeName: 'Tatuaje Acuarela',
      imageUrl: 'https://images.unsplash.com/photo-1566140967404-b8b6c4b49dce',
      difficulty: 'Duración: 3-6 horas',
      rating: 4.7,
      reviews: 100,
      duration: 4,
      distance: 0,
      ascent: 0,
      description: 'Colores suaves y efectos fluidos como una pintura.',
      features: ['Colores vibrantes', 'Efecto artístico'],
      link: '#forms',
    },
  ];

  tattoos = [
    {
      name: 'Dragón Tradicional',
      image: 'https://images.unsplash.com/photo-1532636875308-81c7807747a8',
      description: 'Un diseño clásico con detalles en negro y rojo.',
      price: '100€',
    },
    {
      name: 'Mandala Geométrica',
      image: 'https://images.unsplash.com/photo-1512529920731-e8aba8da44a8',
      description: 'Patrones simétricos para un look elegante.',
      price: '80€',
    },
    {
      name: 'Flores Acuarela',
      image: 'https://images.unsplash.com/photo-1566140967404-b8b6c4b49dce',
      description: 'Colores suaves con efecto de pincelada.',
      price: '120€',
    },
  ];

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

  changeTattooStyle(style: string) {
    this.currentTattooStyle = style;
    const svg = document.getElementById('tattooSvg')?.querySelector('.tattoo-style');
    if (svg) {
      svg.className = `tattoo-style ${style}`;
      if (style === 'watercolor') {
        let defs = svg.querySelector('defs');
        if (!defs) {
          defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
          svg.prepend(defs);
        }
        defs.innerHTML = `
          <linearGradient id="watercolorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF1E56;stop-opacity:0.8"/>
            <stop offset="50%" style="stop-color:#FACC15;stop-opacity:0.6"/>
            <stop offset="100%" style="stop-color:#4B0082;stop-opacity:0.7"/>
          </linearGradient>
        `;
      }
    }
  }
}