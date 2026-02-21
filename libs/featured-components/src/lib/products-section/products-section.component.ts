import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardComponent, UITitleComponent, UIButtonComponent } from '@negocio/ui-components';
import { CustomStyles } from '../models/custom-styles.interface';
import { applySectionStyles } from '../utils/section-styles.util';

export interface Product {
  name: string;
  image: string;
  description: string;
  price?: string;
  variant?: string;
  styles?: { [key: string]: string };
}

@Component({
  selector: 'lib-products-section',
  standalone: true,
  imports: [CommonModule, UICardComponent, UITitleComponent, UIButtonComponent],
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsSectionComponent {
  title = input('Nuestros Productos');
  subtitle = input('Descubre nuestra selección premium');
  variant = input('default');
  customStyles = input<CustomStyles>({});
  products = input<Product[]>([
    {
      name: 'Producto Premium',
      image: 'https://dummyimage.com/200x300/000/fff&text=Producto+1',
      description: 'Descripción del producto premium.',
      price: '99€',
      styles: {}
    },
    {
      name: 'Producto Estándar',
      image: 'https://dummyimage.com/200x300/000/fff&text=Producto+2',
      description: 'Descripción del producto estándar.',
      price: '49€',
      styles: {}
    },
    {
      name: 'Producto Básico',
      image: 'https://dummyimage.com/200x300/000/fff&text=Producto+3',
      description: 'Descripción del producto básico.',
      price: '29€',
      styles: {}
    }
  ]);

  componentStyles = computed(() => applySectionStyles(this.customStyles()));

  onLoadMore(): void {
    // Hook for infinite scroll / load more; parent can override via output if needed.
  }

  onResetFilters(): void {
    // Hook for resetting filters; parent can override via output if needed.
  }
}