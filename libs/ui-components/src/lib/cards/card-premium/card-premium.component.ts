import { Component, input, computed, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { variants as baseVariants } from '../../models/ui-components-data.model';

// Definición de íconos con solo los valores de 'path'
export const heroIconPaths = {
  heroStar: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z',
  heroArrowRight: 'M14 5l7 7m0 0l-7 7m7-7H3',
  heroRocketLaunch: 'M13 10V3L4 14h7v7l9-11h-7z',
} as const;

// Definición de íconos completos como SVG (si aún los necesitas)
export const heroIcons = {
  heroStar: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${heroIconPaths.heroStar}" />
    </svg>
  `,
  heroArrowRight: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${heroIconPaths.heroArrowRight}" />
    </svg>
  `,
  heroRocketLaunch: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${heroIconPaths.heroRocketLaunch}" />
    </svg>
  `,
} as const;

export type HeroIcon = keyof typeof heroIconPaths;

export const cardPremiumVariants = [
  ...baseVariants,
  'glowing', 'nintendo', 'rayman', 'onepiece', 'limbo', 'bioshock', 'supermeatboy', 'zelda', 'sonic', 'default'
] as const;

export type CardPremiumVariant = typeof cardPremiumVariants[number];

export interface CardPremiumConfig {
  icon: HeroIcon;
  title: string;
  description: string;
  gradient?: string;
  image: string;
  price: string;
  discount: string;
  tooltip: string;
  variant?: string;
  styles?: { [key: string]: string };
}

export interface CardPremiumCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--card-bg'?: string;
  '--card-color'?: string;
  '--card-border'?: string;
  '--card-shadow'?: string;
  '--card-hover-bg'?: string;
  '--card-hover-shadow'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-card-premium',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="hostClasses()" [ngStyle]="hostStyles()" [style.background]="safeGradient()">
      <div class="icon">
        <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path [attr.d]="safeIconPath()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </div>
      <div class="content">
        <h2>{{ safeTitle() }}</h2>
        <p>{{ safeDescription() }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./card-premium.component.scss'],
})
export class UICardPremiumComponent {
  config = input<CardPremiumConfig>({
    icon: 'heroStar',
    title: 'Card Title',
    description: 'This is a premium card description.',
    image: '',
    price: '',
    discount: '',
    tooltip: ''
  });

  variant = input('primary');

  customStyles = input<CardPremiumCustomStyles>({});

  constructor(private sanitizer: DomSanitizer) {}

  hostClasses = computed(() => ['card', `card--${this.variant()}`]);

  hostStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });
    
    return styles;
  });

  @HostBinding('class') get hostClass() {
    return this.hostClasses();
  }

  @HostBinding('style') get hostStyle() {
    return this.hostStyles();
  }

  safeGradient = computed(() => {
    return this.config()?.gradient || '';
  });

  safeIconPath = computed(() => {
    const icon = this.config()?.icon || 'heroStar';
    return heroIconPaths[icon as HeroIcon] || heroIconPaths['heroStar'];
  });

  safeTitle = computed(() => {
    return this.config()?.title || 'Card Title';
  });

  safeDescription = computed(() => {
    return this.config()?.description || '';
  });

  // helper if needed
  getIconSvg() {
    // Only used conceptually, safeIconPath handles path d.
    // If full SVG is needed, use sanitizer and another computed.
    const icon = this.config()?.icon || 'heroStar';
    return this.sanitizer.bypassSecurityTrustHtml(heroIcons[icon as HeroIcon] || heroIcons['heroStar']);
  }
}
