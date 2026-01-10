import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UICardAnimatedComponent } from '../cards/card-animated/card-animated.component';

export const heroVariants = [
  'primary', 'secondary', 'cyberpunk', 'neon', 'matrix', 'stellar', 'retro', 'phoenix', 'glass', 'default'
] as const;

export type HeroVariant = typeof heroVariants[number];

export interface HeroCustomStyles {
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
}

interface CarouselItem {
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  title: string;
  description: string;
  section:string;
}

@Component({
  selector: 'lib-ui-components-hero',
  standalone: true,
  imports: [CommonModule, UICardAnimatedComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class UIHeroSectionComponent implements AfterViewInit, OnDestroy {
  @Input() showCta = true;
  @Input() ctaLabel = 'Reserva Ahora';
  @Input() businessName = 'Peluquería Estilo';
  @Input() title = 'Transforma tu Estilo';
  @Input() subtitle = 'Cortes, colores y tratamientos personalizados en un ambiente único.';
  @Input() variant = 'default';
  @Input() showDevelopmentMessage = false;
  @Input() showScrollIcon = true;
  @Input() videoBackground = true;

  @Input()  videoUrl = 'https://www.w3schools.com/tags/mov_bbb.mp4';
  @Input() videoPoster = 'https://dummyimage.com/200x300/000/fff&text=Hola+León3';
  @Input() customStyles: HeroCustomStyles = {};
  @Input() navigationCards: NavigationCard[] = [
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
  ];
  @Input() carouselItems: CarouselItem[] = [
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
  ];
  @Output() sectionSelected = new EventEmitter<string>();
  @Output() ctaClicked = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<string>();
  @Output() carouselItemClicked = new EventEmitter<CarouselItem>();
  @Output() galleryItemClicked = new EventEmitter<CarouselItem>();

  @ViewChild('matrixCanvas') matrixCanvas?: ElementRef<HTMLCanvasElement>;

  activeCarouselIndex = 0;
  activeRetroIndex = 0;
  private matrixInterval: any;



  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    
}
  get heroClasses(): string[] {
    return ['hero-section', `hero-section--${this.variant}`];
  }

  get showParticles(): boolean {
    return !['matrix', 'cyberpunk', 'neon', 'stellar', 'retro', 'phoenix', 'default'].includes(this.variant);
  }

  get overlayClass(): string {
    return `overlay--${this.variant}`;
  }

  get particleClass(): string {
    return `particle--${this.variant}`;
  }

  get particleIcon1(): string {
    const icons: { [key: string]: string } = {
      primary: '✨',
      secondary: '🌟',
      neon: '⚡️',
      phoenix: '🔥',
      retro: '🎮',
      stellar: '⭐',
    };
    return icons[this.variant] || '✨';
  }

  get particleIcon2(): string {
    const icons: { [key: string]: string } = {
      primary: '🌟',
      secondary: '✨',
      neon: '💡',
      phoenix: '✨',
      retro: '🕹️',
      stellar: '🌌',
    };
    return icons[this.variant] || '🌟';
  }

  get contentClass(): string {
    return `content--${this.variant}`;
  }

  get titleClass(): string {
    return `title--${this.variant}`;
  }

  get subtitleClass(): string {
    return `subtitle--${this.variant}`;
  }

  get ctaClass(): string {
    return `cta--${this.variant}`;
  }

  get videoClass(): string {
    const classes: { [key: string]: string } = {
      secondary: 'video-fullscreen',
      cyberpunk: 'video-neon',
      neon: 'video-overlay',
      stellar: 'video-starfield',
      retro: 'video-pixelated',
      phoenix: 'video-flame',
      default: 'video-gallery',
    };
    return classes[this.variant] || 'video-standard';
  }

  get inputClass(): string {
    return `input--${this.variant}`;
  }

  get formButtonClass(): string {
    return `form-button--${this.variant}`;
  }

  get scrollIconClass(): string {
    return `scroll-icon--${this.variant}`;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.variant === 'matrix' && this.matrixCanvas) {
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
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
    this.activeCarouselIndex = (this.activeCarouselIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
  }

  nextCarouselItem(): void {
    this.activeCarouselIndex = (this.activeCarouselIndex + 1) % this.carouselItems.length;
  }

  prevRetroItem(): void {
    this.activeRetroIndex = (this.activeRetroIndex - 1 + this.navigationCards.length) % this.navigationCards.length;
  }

  nextRetroItem(): void {
    this.activeRetroIndex = (this.activeRetroIndex + 1) % this.navigationCards.length;
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