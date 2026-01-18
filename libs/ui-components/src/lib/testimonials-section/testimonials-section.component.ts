import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomStyles } from '../models/custom-styles.interface';

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
  styleUrls: ['./testimonials-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UITestimonialsSectionComponent {
  title = input('Lo que dicen nuestros clientes');
  subtitle = input('Historias reales de éxito.');
  variant = input('default');
  customStyles = input<CustomStyles>({});
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

