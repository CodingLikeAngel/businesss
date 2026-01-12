import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UITableComponent, CardVariant, TableColumn, TableRow, UITitleComponent } from '@negocio/ui-components';

@Component({
  selector: 'lib-pricing-section',
  standalone: true,
  imports: [CommonModule, UITableComponent, UITitleComponent],
  template: `
    <section id="precios" class="mb-12">

    <div class="">
    <lib-ui-components-title
      level="h2"
      text="Nuestros Precios"
      [variant]="variant"
      animation="pulse"
      align="center"
    ></lib-ui-components-title>
    </div>


      <lib-ui-components-table
        [variant]="variant"
        [size]="'md'"
        [rounded]="'md'"
        [dark]="true"
        [columns]="priceColumns"
        [rows]="priceRows"
      ></lib-ui-components-table>
    </section>
  `,
})
export class PricingSectionComponent {
  @Input() variant: CardVariant = 'default';
  @Input() priceColumns: TableColumn[] = [];
  @Input() priceRows: TableRow[] = [];
}