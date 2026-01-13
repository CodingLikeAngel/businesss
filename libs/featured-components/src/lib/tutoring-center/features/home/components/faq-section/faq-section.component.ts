import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIAccordionComponent, CardVariant, AccordionItem, UITitleComponent } from '@negocio/ui-components';

@Component({
  selector: 'lib-faq-section',
  standalone: true,
  imports: [CommonModule, UIAccordionComponent, UITitleComponent],
  template: `
    <section id="faq" class="mb-12">
      <div class="">
    <lib-ui-components-title
      level="h2"
      text="Preguntas Frecuentes"
      [variant]="variant"
      animation="bounce"
      align="center"
    ></lib-ui-components-title>
    </div>

      <lib-ui-components-accordion
        [variant]="variant"
        [size]="'md'"
        [rounded]="'md'"
        [singleExpand]="true"
        [items]="faqItems"
      ></lib-ui-components-accordion>
    </section>
  `,
})
export class FaqSectionComponent {
  @Input() variant: CardVariant = 'default';
  @Input() faqItems: AccordionItem[] = [];
}