import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy, HostBinding } from '@angular/core';
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
}

@Component({
  selector: 'lib-ui-ui-gallery',
  standalone: true,
  imports: [CommonModule, UIImageComponent], // Agrega UIImageComponent aquí
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class UIGalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() images: GalleryImage[] = [
    { src: 'https://picsum.photos/200/300', alt: 'Image 1', caption: 'First Image' },
    { src: 'https://picsum.photos/200/300', alt: 'Image 2', caption: 'Second Image' },
    { src: 'https://picsum.photos/200/300', alt: 'Image 3', caption: 'Third Image' },
  ];
  @Input() variant = 'default'; // Relajamos el tipo para permitir personalizadas
  @Input() autoSlide = false;
  @Input() slideInterval = 3000;
  @Input() customStyles: GalleryCustomStyles = {};

  @ViewChild('slider', { static: false }) slider!: ElementRef<HTMLDivElement>;

  currentIndex = 0;
  private autoSlideInterval: any;
  private hammerManager?: HammerManager;

  ngOnInit() {
    if (this.autoSlide) {
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
    this.autoSlideInterval = setInterval(() => this.nextSlide(), this.slideInterval);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateSliderPosition();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
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
    return ['ui-gallery', `ui-gallery--${this.variant}`].filter(Boolean);
  }

  @HostBinding('style') get hostStyles() {
    return this.customStyles;
  }
}
