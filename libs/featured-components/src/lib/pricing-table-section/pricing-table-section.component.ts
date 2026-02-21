import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UITableComponent, UITitleComponent, TableColumn, TableRow } from '@negocio/ui-components';
import { CustomStyles } from '../models/custom-styles.interface';
import { applySectionStyles } from '../utils/section-styles.util';

@Component({
  selector: 'lib-ui-pricing-table-section',
  standalone: true,
  imports: [CommonModule, UITableComponent, UITitleComponent],
  templateUrl: './pricing-table-section.component.html',
  styleUrls: ['./pricing-table-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UIPricingTableSectionComponent {
  title = input('Planes y Precios');
  subtitle = input('Elige el plan perfecto para ti.');
  variant = input('default');
  customStyles = input<CustomStyles>({});
  
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

  pricingStyles = computed(() => applySectionStyles(this.customStyles()));

  containerClasses = computed(() => `pricing-container pricing--${this.variant()}`);
  tableVariant = computed(() => this.variant());
}

