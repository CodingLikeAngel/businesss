import { Component, input, computed, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TestimonialsCardCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

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

  customStyles = input<TestimonialsCardCustomStyles>({});

  hostClasses = computed(() => ['testimonial-card', `testimonial-card--${this.variant()}`].join(' '));
  
  hostStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  @HostBinding('class') get hostClass() {
    return this.hostClasses();
  }

  @HostBinding('style') get hostStyle() {
    return this.hostStyles();
  }
}