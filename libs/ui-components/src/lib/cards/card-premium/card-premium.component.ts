import { Component, input, computed, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { variants as baseVariants } from '../../models/ui-components-data.model';

// Definición de íconos con solo los valores de 'path'
export const heroIconPaths = {
  heroStar: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z',
  heroArrowRight: 'M14 5l7 7m0 0l-7 7m7-7H3',
  heroRocketLaunch: 'M13 10V3L4 14h7v7l9-11h-7z',
  heroSparkles: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
  heroBolt: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  heroFire: 'M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a5.5 5.5 0 011.49-3.064l2.13-2.13a.4.4 0 01.566 0l1.242 1.242a.4.4 0 00.566 0l2.13-2.13a.4.4 0 01.566 0l1.242 1.242a.4.4 0 010 .566l-2.13 2.13a.4.4 0 000 .566l.566.566zm-1.89 1.89a3.5 3.5 0 000-4.95l-.141-.141h-.707a3.5 3.5 0 00-4.95 0l-2.828 2.828a3.5 3.5 0 000 4.95l.141.141h.707a3.5 3.5 0 004.95 0l2.828-2.828z',
  heroHeart: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
} as const;

// Definición de íconos completos como SVG
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
  heroSparkles: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${heroIconPaths.heroSparkles}" />
    </svg>
  `,
  heroBolt: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${heroIconPaths.heroBolt}" />
    </svg>
  `,
  heroFire: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${heroIconPaths.heroFire}" />
    </svg>
  `,
  heroHeart: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${heroIconPaths.heroHeart}" />
    </svg>
  `,
} as const;

export type HeroIcon = keyof typeof heroIconPaths;

export const cardPremiumVariants = [
  ...baseVariants,
  'glowing', 'nintendo', 'rayman', 'onepiece', 'limbo', 'bioshock', 'supermeatboy', 'zelda', 'sonic', 'default', 'glass', 'neon', 'cyberpunk', 'luxury'
] as const;

export type CardPremiumVariant = typeof cardPremiumVariants[number] | (string & {});

export interface CardPremiumConfig {
  icon: HeroIcon;
  title: string;
  description: string;
  gradient?: string;
  image: string;
  price: string;
  discount: string;
  tooltip: string;
  variant?: CardPremiumVariant;
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
    <div [ngClass]="hostClasses()" [ngStyle]="hostStyles()">
      <div class="card-image-bg" *ngIf="config().image">
        <img [src]="config().image" [alt]="safeTitle()" />
        <div class="image-overlay"></div>
      </div>
      
      <div class="card-badge" *ngIf="config().discount">
        {{ config().discount }}
      </div>

      <div class="card-inner">
        <div class="icon-box" *ngIf="config().icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path [attr.d]="safeIconPath()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </div>
        
        <div class="card-content">
          <h2 class="card-title">{{ safeTitle() }}</h2>
          <p class="card-description">{{ safeDescription() }}</p>
        </div>

        <div class="card-footer" *ngIf="config().price">
          <span class="price-tag">{{ config().price }}</span>
          <button class="action-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
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
