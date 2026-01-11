import { Component, Input, HostBinding } from '@angular/core';
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
  tooltip:string;
}

export interface CardPremiumCustomStyles {
  '--card-bg'?: string;
  '--card-color'?: string;
  '--card-border'?: string;
  '--card-shadow'?: string;
  '--card-hover-bg'?: string;
  '--card-hover-shadow'?: string;
}

@Component({
  selector: 'lib-ui-components-card-premium',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="hostClasses" [style.background]="config.gradient">
      <div class="icon">
        <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path [attr.d]="getIconPath(config.icon || 'heroStar')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </div>
      <div class="content">
        <h2>{{ config.title }}</h2>
        <p>{{ config.description }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./card-premium.component.scss'],
})
export class UICardPremiumComponent {
  @Input() config: CardPremiumConfig = {
    icon: 'heroStar',
    title: 'Card Title',
    description: 'This is a premium card description.',
    image: '',
    price: '',
    discount: '',
    tooltip: ''
  };

  @Input() variant = 'primary';

  @Input() customStyles: CardPremiumCustomStyles = {};

  constructor(private sanitizer: DomSanitizer) {}

  @HostBinding('class') get hostClasses() {
    return ['card', `card--${this.variant}`];
  }

  @HostBinding('style') get hostStyles() {
    return this.customStyles;
  }

  getIconPath(icon: HeroIcon): string {
    return heroIconPaths[icon] || heroIconPaths['heroStar']; // Default a 'heroStar' si no coincide
  }

  getIconSvg(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(heroIcons[this.config.icon]);
  }
}