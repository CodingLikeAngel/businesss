import { Component, OnInit, input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  UICardPremiumComponent,
  UIChipComponent,
  UITooltipComponent,
} from '../../index';
import { CardPremiumConfig } from '@negocio/shared-components';
import { CustomStyles } from '../models/custom-styles.interface';

@Component({
  selector: 'lib-promotions-section',
  standalone: true,
  imports: [
    CommonModule,
    UICardPremiumComponent,
    UIChipComponent,
    UITooltipComponent
  ],
  templateUrl: './promotions-section.component.html',
  styleUrls: ['./promotions-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PromotionsSectionComponent implements OnInit {
  title = input('Ofertas Especiales');
  description = input('Descubre nuestras promociones exclusivas y ahorra en tus tratamientos favoritos.');
  variant = input('default'); 
  
  // Standard pattern uses signals 'input()'
  items = input<CardPremiumConfig[]>([]);
  
  // Standard pattern styles
  customStyles = input<CustomStyles>({});

  promotionsStyles = computed(() => {
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
  });

  containerClasses = computed(() => `promotions-wrapper promotions--${this.variant()}`);

  // Internal signal for default cards if items is empty
  defaultItems = computed(() => {
    const provided = this.items();
    if (provided && provided.length > 0) return provided;

    const defaultCard: CardPremiumConfig = {
      title: 'Promoción',
      description: 'Descripción de la oferta especial.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop',
      price: '29.99€',
      discount: '-20%',
      icon: 'heroStar',
      tooltip: '¡Ahorra con este combo especial!'
    };

    return [
      { ...defaultCard, title: 'Combo Relax', discount: '-25%' },
      { ...defaultCard, title: 'Manicura Pro', discount: 'OFERTA', price: '19.99€' },
      { ...defaultCard, title: 'Tinte & Corte', discount: 'NUEVO', price: '45.00€' }
    ];
  });

  ngOnInit(): void {
    // No longer strictly needed but kept for safety
  }
}
