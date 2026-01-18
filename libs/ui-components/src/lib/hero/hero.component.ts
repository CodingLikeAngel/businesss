import { Component, input, output, computed, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { variants } from '../models/ui-components-data.model';

export const heroVariants = variants;

export type HeroVariant = typeof heroVariants[number];

export interface HeroCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--hero-bg'?: string;
  '--hero-color'?: string;
  '--hero-border'?: string;
  '--hero-shadow'?: string;
  '--hero-hover-bg'?: string;
  '--hero-hover-shadow'?: string;
  '--business-bg-image'?: string;
  [key: string]: string | undefined;
}

interface NavigationCard {
  icon: string;
  title: string;
  description: string;
  animationDelay?: string;
  sectionId: string;
  videoUrl?: string;
  posterUrl?: string;
  variant?: string;
  styles?: { [key: string]: string };
}

interface CarouselItem {
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  title: string;
  description: string;
  section: string;
  variant?: string;
  styles?: { [key: string]: string };
}

@Component({
  selector: 'lib-ui-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class UIHeroSectionComponent implements AfterViewInit, OnDestroy {
  showCta = input(true);
  ctaLabel = input('Reserva Ahora');
  businessName = input('Peluquería Estilo');
  title = input('Transforma tu Estilo');
  subtitle = input('Cortes, colores y tratamientos personalizados en un ambiente único.');
  variant = input('default');
  showDevelopmentMessage = input(false);
  showScrollIcon = input(true);
  videoBackground = input(true);

  videoUrl = input('https://www.w3schools.com/tags/mov_bbb.mp4');
  videoPoster = input('https://dummyimage.com/200x300/000/fff&text=Hola+León3');
  customStyles = input<HeroCustomStyles>({});
  navigationCards = input<NavigationCard[]>([
    {
      icon: '✂️',
      title: 'Cortes',
      description: 'Estilos personalizados para todas las edades.',
      sectionId: 'cortes',
      videoUrl : 'https://www.w3schools.com/tags/mov_bbb.mp4',
      posterUrl :'https://dummyimage.com/200x300/000/fff&text=Hola+León3',
    },
    {
      icon: '🎨',
      title: 'Coloración',
      description: 'Colores vibrantes y técnicas modernas.',
      sectionId: 'coloracion',
      videoUrl : 'https://www.w3schools.com/tags/mov_bbb.mp4',
      posterUrl :'https://dummyimage.com/200x300/000/fff&text=Hola+León3',
    }
  ]);
  carouselItems = input<CarouselItem[]>([
    {
      videoUrl : 'https://www.w3schools.com/tags/mov_bbb.mp4',
      posterUrl :'https://dummyimage.com/200x300/000/fff&text=Hola+León3',
      title: 'Corte Moderno',
      description: 'Un corte fresco y personalizado para cualquier estilo.',
      section: 'servicios',
    },
    {
      videoUrl : 'https://www.w3schools.com/tags/mov_bbb.mp4',
      posterUrl :'https://dummyimage.com/200x300/000/fff&text=Hola+León3',
      title: 'Color Vibrante',
      description: 'Tonos únicos que resaltan tu personalidad.',
      section: 'precios',
    }
  ]);

  sectionSelected = output<string>();
  ctaClicked = output<void>();
  formSubmitted = output<string>();
  carouselItemClicked = output<CarouselItem>();
  galleryItemClicked = output<CarouselItem>();

  @ViewChild('matrixCanvas') matrixCanvas?: ElementRef<HTMLCanvasElement>;

  activeCarouselIndex = 0;
  activeRetroIndex = 0;
  private matrixInterval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  trackByFn(index: number, item: any): any { return index; }

  heroClasses = computed(() => ['hero-section', `hero-section--${this.variant()}`]);

  heroStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--hero-bg'] = customStyles['backgroundColor'];
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--hero-color'] = customStyles['color'];
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

  layout = computed(() => {
    const v = this.variant();
    const matrixLayout = ['matrix', 'bioshock', 'quantum', 'holo', 'neomorph'];
    const retroLayout = ['retro', 'super-meat-boy', 'portal', 'glitch', 'joycon', 'arcade', 'pixel'];
    const stellarLayout = ['stellar', 'cosmic', 'galactic'];
    const phoenixLayout = ['phoenix', 'fire', 'jungle', 'electoon'];
    const secondaryLayout = ['secondary', 'video', 'carousel'];
    const glassLayout = ['glass', 'frosted'];
    const cyberpunkLayout = ['cyberpunk', 'neon-pulse'];
    const neonLayout = ['neon', 'sparkle'];

    if (matrixLayout.includes(v)) return 'matrix';
    if (retroLayout.includes(v)) return 'retro';
    if (stellarLayout.includes(v)) return 'stellar';
    if (phoenixLayout.includes(v)) return 'phoenix';
    if (secondaryLayout.includes(v)) return 'secondary';
    if (glassLayout.includes(v)) return 'glass';
    if (cyberpunkLayout.includes(v)) return 'cyberpunk';
    if (neonLayout.includes(v)) return 'neon';
    
    return 'primary';
  });

  showParticles = computed(() => {
    return !['matrix', 'cyberpunk', 'neon', 'stellar', 'retro', 'phoenix', 'default'].includes(this.variant());
  });

  overlayClass = computed(() => `overlay--${this.variant()}`);
  particleClass = computed(() => `particle--${this.variant()}`);

  particleIcon1 = computed(() => {
    const icons: { [key: string]: string } = {
      primary: '✨',
      secondary: '🌟',
      neon: '⚡️',
      phoenix: '🔥',
      retro: '🎮',
      stellar: '⭐',
    };
    return icons[this.variant()] || '✨';
  });

  particleIcon2 = computed(() => {
    const icons: { [key: string]: string } = {
      primary: '🌟',
      secondary: '✨',
      neon: '💡',
      phoenix: '✨',
      retro: '🕹️',
      stellar: '🌌',
    };
    return icons[this.variant()] || '🌟';
  });

  contentClass = computed(() => `content--${this.variant()}`);
  titleClass = computed(() => `title--${this.variant()}`);
  subtitleClass = computed(() => `subtitle--${this.variant()}`);
  ctaClass = computed(() => `cta--${this.variant()}`);

  videoClass = computed(() => {
    const classes: { [key: string]: string } = {
      secondary: 'video-fullscreen',
      cyberpunk: 'video-neon',
      neon: 'video-overlay',
      stellar: 'video-starfield',
      retro: 'video-pixelated',
      phoenix: 'video-flame',
      default: 'video-gallery',
    };
    return classes[this.variant()] || 'video-standard';
  });

  inputClass = computed(() => `input--${this.variant()}`);
  formButtonClass = computed(() => `form-button--${this.variant()}`);
  scrollIconClass = computed(() => `scroll-icon--${this.variant()}`);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.variant() === 'matrix' && this.matrixCanvas) {
        this.initMatrixEffect();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
    }
  }

  onCtaClick(): void {
    this.ctaClicked.emit();
  }

  onFormSubmit(): void {
    this.formSubmitted.emit('Form submitted');
  }

  scrollToSection(sectionId: string): void {
    this.sectionSelected.emit(sectionId);
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  onCarouselItemClick(item: CarouselItem): void {
    this.carouselItemClicked.emit(item);
  }

  onGalleryItemClick(item: CarouselItem): void {
    this.galleryItemClicked.emit(item);
    this.scrollToSection(item.section);
  }

  prevCarouselItem(): void {
    this.activeCarouselIndex = (this.activeCarouselIndex - 1 + this.carouselItems().length) % this.carouselItems().length;
  }

  nextCarouselItem(): void {
    this.activeCarouselIndex = (this.activeCarouselIndex + 1) % this.carouselItems().length;
  }

  prevRetroItem(): void {
    this.activeRetroIndex = (this.activeRetroIndex - 1 + this.navigationCards().length) % this.navigationCards().length;
  }

  nextRetroItem(): void {
    this.activeRetroIndex = (this.activeRetroIndex + 1) % this.navigationCards().length;
  }

  onInteractiveKeydown(event: KeyboardEvent, callback: (...args: any[]) => void, ...args: any[]): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback(...args);
    }
  }

  private initMatrixEffect(): void {
    if (!this.matrixCanvas) return;
    const canvas = this.matrixCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (typeof window !== 'undefined') {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    if (typeof window !== 'undefined') {
      this.matrixInterval = setInterval(draw, 33);
    }
  }
}