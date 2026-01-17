import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIAccordionComponent, CardVariant, AccordionItem, UITitleComponent } from '@negocio/ui-components';

@Component({
  selector: 'lib-faq-section',
  standalone: true,
  imports: [CommonModule, UIAccordionComponent, UITitleComponent],
  template: `
    <section id="faq" class="mb-16">
      <div class="container mx-auto px-4">
        <lib-ui-components-title
          level="h2"
          text="Preguntas Frecuentes"
          [variant]="variant"
          animation="bounce"
          align="center"
          class="text-4xl font-bold mb-8"
        ></lib-ui-components-title>
        <p class="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Encuentra respuestas a las preguntas más comunes sobre nuestros servicios y procesos.
        </p>
      </div>

      <div class="container mx-auto px-4">
        <lib-ui-components-accordion
          [variant]="variant"
          [size]="'md'"
          [rounded]="'md'"
          [singleExpand]="true"
          [items]="faqItems"
          class="faq-accordion"
        ></lib-ui-components-accordion>
      </div>
    </section>
  `,
  styles: [
    `
      .faq-accordion {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }
      
      .container {
        max-width: 1200px;
      }
      
      @media (max-width: 768px) {
        .container {
          padding: 0 1rem;
        }
      }
    `
  ]
})
export class FaqSectionComponent {
  @Input() variant: CardVariant = 'default';
  @Input() faqItems: AccordionItem[] = [];
}