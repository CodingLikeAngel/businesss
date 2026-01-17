import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UITableComponent, CardVariant, TableColumn, TableRow, UITitleComponent } from '@negocio/ui-components';

@Component({
  selector: 'lib-pricing-section',
  standalone: true,
  imports: [CommonModule, UITableComponent, UITitleComponent],
  template: `
    <section id="precios" class="mb-16">
      <div class="container mx-auto px-4">
        <lib-ui-components-title
          level="h2"
          text="Nuestros Precios"
          [variant]="variant"
          animation="pulse"
          align="center"
          class="text-4xl font-bold mb-8"
        ></lib-ui-components-title>
        <p class="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Descubre nuestros planes y precios competitivos para todos tus servicios de belleza.
        </p>
      </div>

      <div class="container mx-auto px-4">
        <div class="pricing-table-wrapper">
          <lib-ui-components-table
            [variant]="variant"
            [size]="'md'"
            [rounded]="'md'"
            [dark]="true"
            [columns]="priceColumns"
            [rows]="priceRows"
            class="pricing-table"
          ></lib-ui-components-table>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .pricing-table-wrapper {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      }

      .pricing-table {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      .container {
        max-width: 1200px;
      }

      @media (max-width: 768px) {
        .container {
          padding: 0 1rem;
        }

        .pricing-table-wrapper {
          padding: 1rem;
        }
      }
    `
  ]
})
export class PricingSectionComponent {
  @Input() variant: CardVariant = 'default';
  @Input() priceColumns: TableColumn[] = [];
  @Input() priceRows: TableRow[] = [];
}