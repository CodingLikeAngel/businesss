import { Component, HostListener, OnDestroy, OnInit, Inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { VariantRotationService } from '@negocio/shared-components';
import { CardVariant, BubbleConfig } from '@negocio/ui-components';
import { PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

const VARIANTS = [
  'jungle', 'enchanted', 'mystic', 'ancient', 'twilight',
  'frosty', 'desert', 'candy', 'oceanic', 'fiery'
] as const;

type VariantType = typeof VARIANTS[number];

@Component({
  selector: 'lib-feature-contact-base-page',
  template: `
  <router-outlet></router-outlet>

`,
  imports: [
    RouterModule,
    CommonModule,

  ],

})
export abstract class FeatureContactBasePageComponent implements OnInit, OnDestroy {

  headerConfig = {
    title: 'Anto Studios',
    subtitle: 'Soluciones tecnológicas que impulsan tu negocio',
    variant: 'primary' as const,
    align: 'center' as const,
    dark: false,
    navItems: [
      { label: 'Inicio', href: '/', active: false },
      { label: 'about', href: '/about', active: false },
      { label: 'Contacto', href: '/contact', active: true },
    ],
    customStyles: {
      // '--header-bg': 'linear-gradient(135deg, #0891b2, #22d3ee)',
      // '--header-color': '#ffffff',
      // '--header-border': 'none',
      // '--header-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
      // '--header-hover-bg': '#164e63',
      // '--header-hover-shadow': '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
  };
  
  selectedVariant: CardVariant = 'default';
  isMobile = false;
  selectedForestVariant = signal<VariantType>('enchanted');
  private variantIndex = 0;
  private intervalId?: any;
  private variantSub?: Subscription;

  navLinks = [
    { label: 'Inicio', href: '/home', icon: '🏠' },
    { label: 'Servicios', href: '/home#servicios', icon: '✂️' },
    { label: 'Reservas', href: '/home#reservas', icon: '📅' },
    { label: 'Precios', href: '/home#precios', icon: '💰' },
    { label: 'Promociones', href: '/home#promociones', icon: '🎉' },
    { label: 'Contacto', href: 'contact', icon: '📬' },
  ];

  navLinkstabs = [
    { label: 'Inicio', sectionId: '/home', icon: '🏠', active: false },
    { label: 'Servicios', sectionId: '/home#servicios', icon: '✂️', active: true },
    { label: 'Reservas', sectionId: '/home#reservas', icon: '📅' },
    { label: 'Precios', sectionId: '/home#precios', icon: '💰' },
    { label: 'Promociones', sectionId: '/home#promociones', icon: '🎉' },
  ];

  config: BubbleConfig = {
    speed: 1,
    blur: 40,
    opacity: 0.8,
    variant: ''
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private variantRotationService: VariantRotationService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.variantRotationService.startRotation();
      this.variantSub = this.variantRotationService.currentVariant$.subscribe(
        (variant) => (this.selectedVariant = variant as CardVariant)
      );
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startVariantRotation();
      this.isMobile = window.innerWidth < 768;
    }
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

  scrollToSection(sectionId: string) {
    if (sectionId.startsWith('/')) return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  startVariantRotation(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.intervalId) clearInterval(this.intervalId);
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