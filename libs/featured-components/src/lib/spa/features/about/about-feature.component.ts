import { Component, HostListener, OnDestroy, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantRotationService } from '@negocio/shared-components';
import {
  UINavBarComponent,
  UITabsComponent,
  CardVariant,
  BubbleAnimationComponent,
  ForestAnimationComponent,
  BubbleConfig,
  UITitleComponent,
  UIButtonComponent,
} from '@negocio/ui-components';
import { GallerySectionComponent } from '../home/components/gallery-section/gallery-section.component';

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
  selector: 'lib-about-feature',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UINavBarComponent,
    // UITabsComponent,
    GallerySectionComponent,
    BubbleAnimationComponent,
    // ForestAnimationComponent,
    UITitleComponent,
    UIButtonComponent
  ],
  templateUrl: './about-feature.component.html',
  styles: [
    `
      :host {
        --neon-glow: 0 0 10px rgba(255, 30, 86, 0.8), 0 0 20px rgba(255, 30, 86, 0.4);
        --gradient-bg: linear-gradient(135deg, #0D0211, #2A0F3A);
      }

      /* Navegación Futurista */
      .futuristic-nav {
        transition: all 0.3s ease;
      }

      /* Partículas Animadas */
      .particle-layer {
        position: absolute;
        inset: 0;
        background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"%3E%3Ccircle cx="100" cy="100" r="5" fill="rgba(255,30,86,0.3)"%3E%3Canimate attributeName="cy" values="100;1100" dur="10s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="300" cy="200" r="4" fill="rgba(250,204,21,0.2)"%3E%3Canimate attributeName="cy" values="200;1100" dur="12s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="500" cy="50" r="6" fill="rgba(255,30,86,0.4)"%3E%3Canimate attributeName="cy" values="50;1100" dur="8s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="700" cy="150" r="5" fill="rgba(250,204,21,0.3)"%3E%3Canimate attributeName="cy" values="150;1100" dur="11s" repeatCount="indefinite"/%3E%3C/circle%3E%3C/svg%3E');
        animation: particle-drift 20s linear infinite;
        z-index: 1;
      }

      /* Animaciones */
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

      /* Estilos Responsivos */
      @media (max-width: 768px) {
        .particle-layer {
          background-size: 50%;
        }

        section {
          padding: 1rem;
        }

        h2 {
          font-size: 2rem;
        }

        .text-lg {
          font-size: 1rem;
        }
      }

      @font-face {
  font-family: 'Comic Neue';
  src: url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap');
}
.animate-slogan::before {
  content: 'Corta como héroe';
  animation: slogan-change 9s infinite;
}
@keyframes slogan-change {
  0%, 25% { content: 'Corta como héroe'; }
  33%, 58% { content: 'Colorea tu destino'; }
  66%, 100% { content: 'Estilo sin límites'; }
}
.world-layer {
  background: linear-gradient(180deg, #FF6F61, #FFB88C);
  animation: sky-shift 30s ease-in-out infinite;
}


    `
  ]
})
export class AboutFeatureComponent implements OnDestroy, OnInit {
  selectedVariant: CardVariant = 'default';
  isMobile = false;
  private variantSub?: Subscription;
  selectedForestVariant = signal<VariantType>('enchanted');
  private variantIndex = 0;
  private intervalId?: any;

  navLinks = [
    { label: 'Inicio', href: '/home', icon: '🏠' },
    { label: 'Servicios', href: '/home#servicios', icon: '✂️' },
    { label: 'Reservas', href: '/home#reservas', icon: '📅' },
    { label: 'Precios', href: '/home#precios', icon: '💰' },
    { label: 'Promociones', href: '/home#promociones', icon: '🎉' },
    { label: 'Contacto', href: '/contact', icon: '📬' },
    { label: 'Sobre Nosotros', href: '/about', icon: 'ℹ️' },
  ];

  navLinkstabs = [
    { label: 'Inicio', sectionId: '/home', icon: '🏠', active: false },
    { label: 'Servicios', sectionId: '/home#servicios', icon: '✂️' },
    { label: 'Reservas', sectionId: '/home#reservas', icon: '📅' },
    { label: 'Precios', sectionId: '/home#precios', icon: '💰' },
    { label: 'Promociones', sectionId: '/home#promociones', icon: '🎉' },
    { label: 'Contacto', sectionId: '/contact', icon: '📬' },
    { label: 'Sobre Nosotros', sectionId: '/about', icon: 'ℹ️', active: true },
  ];

  teamImages = [
    { src: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef', alt: 'Estilista Ana' },
    { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', alt: 'Estilista Lucía' },
    { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', alt: 'Estilista Marta' },
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


  openStyleGame() {
    // Abrir modal con canvas para microjuego
    console.log('Iniciando microjuego de estilo');
  }
  
  startParticles(event: MouseEvent) {
    // Configurar partículas con particles.js
    console.log('Iniciando partículas en hover');
  }

  scrollToSection(sectionId: string) {
    if (sectionId.startsWith('/')) {
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
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