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
} from '@negocio/ui-components';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';

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
  selector: 'lib-contact-feature',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UINavBarComponent,
    UITabsComponent,
    ContactFormComponent,
    BubbleAnimationComponent,
    ForestAnimationComponent,
    UITitleComponent
  ],
  templateUrl: './contact-feature.component.html',
  styles: [
    `
      /* Ensure navbar and tabs are above everything */
      lib-ui-components-nav-bar,
      lib-ui-components-tabs {
        position: relative;
        z-index: 20;
      }

      /* Style the bubble animation */
      lib-bubble-animation {
        position: relative;
        z-index: -1;
      }

      /* Main content container */
      .min-h-screen {
        position: relative;
        background: none;
      }

      /* Section background for readability */
      .section-bg {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(4px);
        padding: 20px;
        border-radius: 8px;
        position: relative;
        z-index: 10;
      }

      /* Contact section */
      #contacto {
        position: relative;
        z-index: 15;
        lib-contact-form {
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
          .ui-components-button {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 107, 157, 0.8);
            color: #fff;
          }
        }

        .mist-layer {
          opacity: 0.2 !important;
        }
      }

      /* Optimización para móviles */
      @media (max-width: 768px) {
        #contacto {
          .firefly,
          .spore-particle,
          .leaf {
            display: none;
          }
        }

        .section-bg {
          padding: 10px;
        }
      }

      .font-nintendo {
        font-family: 'Press Start 2P', cursive;
      }
    `
  ]
})
export class ContactFeatureComponent implements OnDestroy, OnInit {
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
    { label: 'Contacto', href: 'contact', icon: '📬' },
  ];

  navLinkstabs = [
    { label: 'Inicio', sectionId: '/home', icon: '🏠', active: false,  },
    { label: 'Servicios', sectionId: '/home#servicios', icon: '✂️', active: true },
    { label: 'Reservas', sectionId: '/home#reservas', icon: '📅' },
    { label: 'Precios', sectionId: '/home#precios', icon: '💰' },
    { label: 'Promociones', sectionId: '/home#promociones', icon: '🎉' },

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
    speed: 1,
    blur: 40,
    opacity: 0.8,
    variant: ''
  };

  scrollToSection(sectionId: string) {
    if (sectionId.startsWith('/')) {
      return; // Evitar scroll si es una ruta
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