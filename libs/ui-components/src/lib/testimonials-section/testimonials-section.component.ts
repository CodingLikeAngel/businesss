import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
}

@Component({
  selector: 'lib-ui-components-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss']
})
export class UITestimonialsSectionComponent {
  @Input() title = 'Lo que dicen nuestros clientes';
  @Input() subtitle = 'Historias reales de éxito.';
  @Input() variant: 'default' | 'glass' = 'default';
  @Input() testimonials: TestimonialItem[] = [
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
  ];

  get containerClasses(): string {
    return `testimonials-container testimonials--${this.variant}`;
  }
}
