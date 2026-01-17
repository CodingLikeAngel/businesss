import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
}

@Component({
  selector: 'lib-ui-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss']
})
export class UITestimonialsSectionComponent {
  title = input('Lo que dicen nuestros clientes');
  subtitle = input('Historias reales de éxito.');
  variant = input('default');
  testimonials = input<TestimonialItem[]>([
    { 
      quote: "Increíble atención al detalle y un diseño que supera todas las expectativas.", 
      author: "Ana García", 
      role: "CEO, TechFlow",
      avatar: "https://i.pravatar.cc/150?u=ana"
    },
    { 
      quote: "Nuestra conversión aumentó un 200% gracias a la nueva web.", 
      author: "Carlos Ruiz", 
      role: "Marketing Director", 
      avatar: "https://i.pravatar.cc/150?u=carlos"
    },
    { 
      quote: "Profesionales, rápidos y con una calidad estética insuperable.", 
      author: "Elena M.", 
      role: "Fundadora, EcoLife", 
      avatar: "https://i.pravatar.cc/150?u=elena"
    }
  ]);

  containerClasses = computed(() => `testimonials-container testimonials--${this.variant()}`);
}

