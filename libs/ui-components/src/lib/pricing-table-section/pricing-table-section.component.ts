import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UITableComponent, TableColumn, TableRow } from '../table/table.component';

@Component({
  selector: 'lib-ui-components-pricing-table-section',
  standalone: true,
  imports: [CommonModule, UITableComponent],
  templateUrl: './pricing-table-section.component.html',
  styleUrls: ['./pricing-table-section.component.scss']
})
export class UIPricingTableSectionComponent {
  @Input() title = 'Planes y Precios';
  @Input() subtitle = 'Elige el plan perfecto para ti.';
  @Input() variant: string = 'default';
  
  @Input() columns: TableColumn[] = [
      { key: 'plan', label: 'Plan' },
      { key: 'features', label: 'Características' },
      { key: 'price', label: 'Precio' },
  ];

  @Input() rows: TableRow[] = [
      { plan: 'Básico', features: 'Web simple, SEO básico', price: '500€' },
      { plan: 'Pro', features: 'Tienda online, SEO avanzado', price: '1200€' },
      { plan: 'Enterprise', features: 'A medida, Soporte 24/7', price: 'Consultar' },
  ];

  get containerClasses(): string {
    return `pricing-container pricing--${this.variant}`;
  }

  get tableVariant(): any {
      return this.variant;
  }
}
