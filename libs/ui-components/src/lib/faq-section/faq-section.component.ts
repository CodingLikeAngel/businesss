import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIAccordionComponent } from '../acordeon/accordion.component';

export interface FaqItem {
  title: string;
  content: string;
  expanded?: boolean;
}

@Component({
  selector: 'lib-ui-faq-section',
  standalone: true,
  imports: [CommonModule, UIAccordionComponent],
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss']
})
export class UIFaqSectionComponent {
  title = input('Preguntas Frecuentes');
  subtitle = input('Resolvemos tus dudas principales.');
  variant = input('default');
  items = input<FaqItem[]>([
    { title: "¿Cuánto tardan en desarrollar mi web?", content: "Dependiendo de la complejidad, entre 2 y 4 semanas." },
    { title: "¿Incluye mantenimiento?", content: "Sí, ofrecemos planes de mantenimiento mensual adaptados a tus necesidades." },
    { title: "¿Es compatible con móviles?", content: "Absolutamente. Todos nuestros diseños son 100% responsivos." }
  ]);

  containerClasses = computed(() => `faq-container faq--${this.variant()}`);
}

