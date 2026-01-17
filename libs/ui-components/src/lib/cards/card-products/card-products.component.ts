
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIButtonComponent } from '../../button/button.component';

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
}