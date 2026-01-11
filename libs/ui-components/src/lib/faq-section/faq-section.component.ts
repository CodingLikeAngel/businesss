import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIAccordionComponent } from '../acordeon/accordion.component';

export interface FaqItem {
  title: string;
  content: string;
  expanded?: boolean;
}

@Component({
  selector: 'lib-ui-components-faq-section',
  standalone: true,
  imports: [CommonModule, UIAccordionComponent],
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss']
})
export class UIFaqSectionComponent {
  @Input() title = 'Preguntas Frecuentes';
  @Input() subtitle = 'Resolvemos tus dudas principales.';
  @Input() variant: 'default' | 'glass' = 'default';
  @Input() items: FaqItem[] = [
    { title: "¿Cuánto tardan en desarrollar mi web?", content: "Dependiendo de la complejidad, entre 2 y 4 semanas." },
    { title: "¿Incluye mantenimiento?", content: "Sí, ofrecemos planes de mantenimiento mensual adaptados a tus necesidades." },
    { title: "¿Es compatible con móviles?", content: "Absolutamente. Todos nuestros diseños son 100% responsivos." }
  ];

  get containerClasses(): string {
    return `faq-container faq--${this.variant}`;
  }
}
