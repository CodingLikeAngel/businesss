import { Component, input, computed, ViewEncapsulation, signal, effect, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UITitleComponent } from '@negocio/ui-components';
import { CustomStyles } from '../models/custom-styles.interface';

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

@Component({
  selector: 'lib-ui-testimonials-section',
  standalone: true,
  imports: [CommonModule, UITitleComponent],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UITestimonialsSectionComponent {
  private elementRef = inject(ElementRef);

  title = input('Lo que dicen nuestros clientes');
  subtitle = input('Historias reales de éxito.');
  variant = input('default');
  customStyles = input<CustomStyles>({});
  testimonials = input<TestimonialItem[]>([
    {
      quote: "Increíble atención al detalle y un diseño que supera todas las expectativas.",
      author: "Ana García",
      role: "CEO, TechFlow",
      avatar: "https://i.pravatar.cc/150?u=ana",
      rating: 5
    },
    {
      quote: "Nuestra conversión aumentó un 200% gracias a la nueva web.",
      author: "Carlos Ruiz",
      role: "Marketing Director",
      avatar: "https://i.pravatar.cc/150?u=carlos",
      rating: 5
    },
    {
      quote: "Profesionales, rápidos y con una calidad estética insuperable.",
      author: "Elena M.",
      role: "Fundadora, EcoLife",
      avatar: "https://i.pravatar.cc/150?u=elena",
      rating: 4
    }
  ]);

  // Carousel state
  currentIndex = signal(0);
  isAnimating = signal(false);
  typewriterText = signal('');
  private typewriterInterval: any;

  // Typewriter effect
  private startTypewriterEffect(testimonial: TestimonialItem) {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }

    this.typewriterText.set('');
    const text = testimonial.quote;
    let index = 0;

    this.typewriterInterval = setInterval(() => {
      if (index < text.length) {
        this.typewriterText.set(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(this.typewriterInterval);
      }
    }, 50);
  }

  constructor() {
    effect(() => {
      const testimonials = this.testimonials();
      if (testimonials.length > 0) {
        this.startTypewriterEffect(testimonials[this.currentIndex()]);
      }
    });
  }

  // Carousel navigation
  nextTestimonial() {
    if (this.isAnimating()) return;

    this.isAnimating.set(true);
    const testimonials = this.testimonials();
    this.currentIndex.set((this.currentIndex() + 1) % testimonials.length);

    setTimeout(() => this.isAnimating.set(false), 500);
  }

  prevTestimonial() {
    if (this.isAnimating()) return;

    this.isAnimating.set(true);
    const testimonials = this.testimonials();
    this.currentIndex.set((this.currentIndex() - 1 + testimonials.length) % testimonials.length);

    setTimeout(() => this.isAnimating.set(false), 500);
  }

  goToTestimonial(index: number) {
    if (this.isAnimating() || index === this.currentIndex()) return;

    this.isAnimating.set(true);
    this.currentIndex.set(index);

    setTimeout(() => this.isAnimating.set(false), 500);
  }

  // Touch/swipe handling
  private touchStartX = 0;
  private touchEndX = 0;

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        this.nextTestimonial();
      } else {
        this.prevTestimonial();
      }
    }
  }

  // Computed properties for carousel
  currentTestimonial = computed(() => this.testimonials()[this.currentIndex()]);

  visibleTestimonials = computed(() => {
    const testimonials = this.testimonials();
    const current = this.currentIndex();
    const total = testimonials.length;

    // Return 3 testimonials: previous, current, next (with wraparound)
    const prev = (current - 1 + total) % total;
    const next = (current + 1) % total;

    return [testimonials[prev], testimonials[current], testimonials[next]];
  });

  testimonialTransform = computed(() => {
    return `translateX(-${this.currentIndex() * 100}%)`;
  });

  testimonialsStyles = computed(() => {
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

  containerClasses = computed(() => `testimonials-container testimonials--${this.variant()}`);
}

