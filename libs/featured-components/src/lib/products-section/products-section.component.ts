import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardComponent } from '@negocio/ui-components';
import { CustomStyles } from '../models/custom-styles.interface';

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
  imports: [CommonModule, UICardComponent],
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

  get componentStyles() {
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
  }
}