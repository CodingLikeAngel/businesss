import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UITableComponent, TableColumn, TableRow } from '../table/table.component';

@Component({
  selector: 'lib-ui-pricing-table-section',
  standalone: true,
  imports: [CommonModule, UITableComponent],
  templateUrl: './pricing-table-section.component.html',
  styleUrls: ['./pricing-table-section.component.scss']
})
export class UIPricingTableSectionComponent {
  title = input('Planes y Precios');
  subtitle = input('Elige el plan perfecto para ti.');
  variant = input('default');
  
  columns = input<TableColumn[]>([
      { key: 'plan', label: 'Plan' },
      { key: 'features', label: 'Características' },
      { key: 'price', label: 'Precio' },
  ]);

  rows = input<TableRow[]>([
      { plan: 'Básico', features: 'Web simple, SEO básico', price: '500€' },
      { plan: 'Pro', features: 'Tienda online, SEO avanzado', price: '1200€' },
      { plan: 'Enterprise', features: 'A medida, Soporte 24/7', price: 'Consultar' },
  ]);

  containerClasses = computed(() => `pricing-container pricing--${this.variant()}`);
  tableVariant = computed(() => this.variant());
}

