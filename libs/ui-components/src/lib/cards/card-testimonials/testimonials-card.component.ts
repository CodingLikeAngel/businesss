import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-testimonials-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-card.component.html',
  styleUrls: ['./testimonials-card.component.scss']
})
export class UiTestimonialsCardComponent {
  @Input() testimonial: { quote: string; author: string } = { quote: '', author: '' };
  @Input() variant: any = 'default';

  @HostBinding('class') get hostClasses() {
    return [
      'testimonial-card',
      `testimonial-card--${this.variant}`
    ].join(' ');
  }
}