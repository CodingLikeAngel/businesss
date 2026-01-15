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
    <lib-ui-title
      level="h2"
      text="Preguntas Frecuentes"
      [variant]="variant"
      animation="bounce"
      align="center"
    ></lib-ui-title>
    </div>

      <lib-ui-accordion
        [variant]="variant"
        [size]="'md'"
        [rounded]="'md'"
        [singleExpand]="true"
        [items]="faqItems"
      ></lib-ui-accordion>
    </section>
  `,
})
export class FaqSectionComponent {
  @Input() variant: CardVariant = 'default';
  @Input() faqItems: AccordionItem[] = [];
}