import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIAccordionComponent } from '../acordeon/accordion.component';

export interface FaqItem {
  title: string;
  content: string;
  expanded?: boolean;
}

export interface FaqCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
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
  customStyles = input<FaqCustomStyles>({});
  items = input<FaqItem[]>([
    { title: "¿Cuánto tardan en desarrollar mi web?", content: "Dependiendo de la complejidad, entre 2 y 4 semanas." },
    { title: "¿Incluye mantenimiento?", content: "Sí, ofrecemos planes de mantenimiento mensual adaptados a tus necesidades." },
    { title: "¿Es compatible con móviles?", content: "Absolutamente. Todos nuestros diseños son 100% responsivos." }
  ]);

  faqStyles = computed(() => {
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

  containerClasses = computed(() => `faq-container faq--${this.variant()}`);
}

