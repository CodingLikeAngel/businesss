// card-rutas.component.ts (Hijo - UICardRutasComponent)
import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

// Variante específica del componente hijo
const specificCardVariants = ['trailblazer'] as const;

// Combinamos variantes globales con específicas
export const cardRutasVariants = [...baseVariants, ...specificCardVariants] as const;
export type CardVariantType = typeof cardRutasVariants[number] | (string & {});

export interface CardItem {
  routeName: string;
  imageUrl: string;
  difficulty: string;
  rating: number;
  reviews: number;
  duration: number;
  distance: number;
  ascent: number;
  description: string;
  features: string[];
  link: string;
}

interface CardCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--card-bg'?: string;
  '--card-text-color'?: string;
  '--card-accent-color'?: string;
  '--card-border'?: string;
  '--card-shadow'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-card-rutas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-rutas.component.html',
  styleUrl: './card-rutas.component.scss',
})
export class UICardRutasComponent implements AfterViewInit, OnDestroy {
  items = input<CardItem[]>([
    {
      routeName: 'Ruta del Cares',
      imageUrl: './cares.jpg',
      difficulty: 'Dificultad Alta',
      rating: 4.9,
      reviews: 128,
      duration: 5,
      distance: 12,
      ascent: 850,
      description: 'Ascenso panorámico con vistas a los valles leoneses.',
      features: ['Guía GPS descargable', '3 puntos de avituallamiento'],
      link: '/ruta/ruta-del-cares',
    },
  ]);
  variant = input<CardVariantType>('default');
  backgroundColor = input<string>('rgba(255,255,255,0.05)');
  textColor = input<string>('#f8fafc');
  accentColor = input<string>('#22d3ee');
  animation = input<'pulse' | 'fade' | 'slide' | 'bounce' | 'glitch' | 'none'>('pulse');
  isMobile = input<boolean>(false);
  customStyles = input<CardCustomStyles>({}); // Soporte para estilos personalizados

  currentRouteIndex = 0;
  private hammerManager?: HammerManager;

  @ViewChild('postCard', { static: false }) postCard!: ElementRef;

  cardClasses = computed(() => {
    const baseClasses = [
      'ui-card-rutas',
      `ui-card-rutas--${this.variant()}`,
      this.isMobile() ? 'ui-card-rutas--mobile' : 'ui-card-rutas--desktop',
    ];
    if (this.animation() !== 'none') {
      baseClasses.push(`animate-${this.animation()}`);
    }
    return baseClasses.join(' ');
  });

  titleClasses = computed(() => {
    const classes = [
      'ui-card-rutas__title',
      this.isMobile() ? 'ui-card-rutas__title--mobile' : 'ui-card-rutas__title--desktop',
      this.animation() !== 'none' ? `animate-${this.animation()}` : '',
    ];
    return classes.join(' ');
  });

  cardStyles = computed(() => {
    const styles: Record<string, any> = {
      ...this.customStyles(),
      '--accent-color': this.accentColor(), // Variable CSS para usar en SCSS
    };

    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--card-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    } else {
       styles['background'] = this.backgroundColor();
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--card-text-color'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    } else {
      styles['color'] = this.textColor();
    }

    return styles;
  });

  ngAfterViewInit() {
    this.initHammer();
  }

  ngOnDestroy() {
    this.hammerManager?.destroy();
  }

  private async initHammer() {
    if (typeof window !== 'undefined' && this.isMobile() && this.postCard?.nativeElement) {
      const HammerModule = await import('hammerjs');
      this.hammerManager = new Hammer(this.postCard.nativeElement);
      this.hammerManager.on('swipeleft', () => this.changeItem(1));
      this.hammerManager.on('swiperight', () => this.changeItem(-1));
    }
  }

  get currentItem(): CardItem {
    return this.items()[this.currentRouteIndex] || this.items()[0];
  }

  changeItem(direction: number) {
    const newIndex = this.currentRouteIndex + direction;
    if (newIndex >= 0 && newIndex < this.items().length) {
      this.currentRouteIndex = newIndex;
      if (this.isMobile() && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  }
}