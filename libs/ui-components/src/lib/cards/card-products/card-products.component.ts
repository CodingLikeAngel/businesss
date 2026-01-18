
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIButtonComponent } from '../../button/button.component';

export interface CardProductsCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-card-products',
  standalone: true,
  imports: [CommonModule, UIButtonComponent],
  templateUrl: './card-products.component.html',
  styleUrls: ['./card-products.component.scss']
})
export class UiCardProductsComponent {
  product = input<{ 
    image: string; 
    name: string; 
    description: string; 
    price: string 
  }>({ image: '', name: '', description: '', price: '' });
  
  variant = input('title');
  customStyles = input<CardProductsCustomStyles>({});

  cardProductsStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });
}