import { Component, input, computed, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-testimonials-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-card.component.html',
  styleUrls: ['./testimonials-card.component.scss']
})
export class UiTestimonialsCardComponent {
  testimonial = input<{ quote: string; author: string }>({ quote: '', author: '' });
  variant = input<any>('default');

  hostClasses = computed(() => ['testimonial-card', `testimonial-card--${this.variant()}`].join(' '));
  
  @HostBinding('class') get hostClass() {
    return this.hostClasses();
  }
}