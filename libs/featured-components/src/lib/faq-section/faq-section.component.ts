import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIAccordionComponent } from '@negocio/ui-components';
import { CustomStyles } from '../models/custom-styles.interface';
import { applySectionStyles } from '../utils/section-styles.util';

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
  styleUrls: ['./faq-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UIFaqSectionComponent {
  title = input('Preguntas Frecuentes');
  subtitle = input('Resolvemos tus dudas principales.');
  variant = input('default');
  customStyles = input<CustomStyles>({});
  items = input<FaqItem[]>([
    { title: "¿Cuánto tardan en desarrollar mi web?", content: "Dependiendo de la complejidad, entre 2 y 4 semanas." },
    { title: "¿Incluye mantenimiento?", content: "Sí, ofrecemos planes de mantenimiento mensual adaptados a tus necesidades." },
    { title: "¿Es compatible con móviles?", content: "Absolutamente. Todos nuestros diseños son 100% responsivos." }
  ]);

  faqStyles = computed(() => applySectionStyles(this.customStyles()));

  containerClasses = computed(() => `faq-container faq--${this.variant()}`);
}

