import { Component, input, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy, HostBinding, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { variants as baseVariants } from '../models/ui-components-data.model';
import { UIImageComponent } from '../image/image.component';

// Variantes específicas del componente hijo
const specificGalleryVariants = [
  'rayman', 'nintendo', 'limbo', 'one-piece', 'bioshock', 'super-meat-boy'
] as const;

// Combinamos variantes globales con específicas
export const galleryVariants = [...baseVariants, ...specificGalleryVariants] as const;
export type GalleryVariant = typeof galleryVariants[number];

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--container-bg'?: string;
  '--container-border'?: string;
  '--container-shadow'?: string;
  '--container-radius'?: string;
  '--image-object-fit'?: string;
  '--caption-bg'?: string;
  '--caption-color'?: string;
  '--caption-font-size'?: string;
  '--nav-bg'?: string;
  '--nav-color'?: string;
  '--nav-shadow'?: string;
  '--dot-bg'?: string;
  '--dot-active-bg'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-ui-gallery',
  standalone: true,
  imports: [CommonModule, UIImageComponent], // Agrega UIImageComponent aquí
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class UIGalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  images = input<GalleryImage[]>([
    { src: 'https://picsum.photos/200/300', alt: 'Image 1', caption: 'First Image' },
    { src: 'https://picsum.photos/200/300', alt: 'Image 2', caption: 'Second Image' },
    { src: 'https://picsum.photos/200/300', alt: 'Image 3', caption: 'Third Image' },
  ]);
  variant = input<GalleryVariant | string>('default');
  autoSlide = input(false);
  slideInterval = input(3000);
  customStyles = input<GalleryCustomStyles>({});

  @ViewChild('slider', { static: false }) slider!: ElementRef<HTMLDivElement>;

  currentIndex = 0;
  private autoSlideInterval: any;
  private hammerManager?: HammerManager;

  ngOnInit() {
    if (this.autoSlide()) {
      this.startAutoSlide();
    }
  }

  ngAfterViewInit() {
    this.initHammer();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.hammerManager?.destroy();
  }

  private async initHammer() {
    if (typeof window !== 'undefined' && this.slider?.nativeElement) {
      const HammerModule = await import('hammerjs');
      
      this.hammerManager = new Hammer(this.slider.nativeElement);
      this.hammerManager.on('swipeleft', () => this.nextSlide());
      this.hammerManager.on('swiperight', () => this.prevSlide());
    }
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => this.nextSlide(), this.slideInterval());
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images().length) % this.images().length;
    this.updateSliderPosition();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images().length;
    this.updateSliderPosition();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.updateSliderPosition();
  }

  updateSliderPosition() {
    const sliderEl = this.slider.nativeElement;
    sliderEl.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  onKeyNav(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if ((event.target as HTMLElement).classList.contains('ui-gallery__nav--prev')) {
        this.prevSlide();
      } else if ((event.target as HTMLElement).classList.contains('ui-gallery__nav--next')) {
        this.nextSlide();
      }
    }
  }

  onKeyDot(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.goToSlide(index);
    }
  }

  trackByFn(index: number, image: GalleryImage): string {
    return image.src;
  }

  @HostBinding('class') get hostClasses() {
    return ['ui-gallery', `ui-gallery--${this.variant()}`].filter(Boolean);
  }

  @HostBinding('style') get hostStyles() {
    return this.galleryStyles();
  }

  galleryStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--container-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--caption-color'] = customStyles['color'];
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
}
