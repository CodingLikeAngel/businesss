
import { Component, Input } from '@angular/core';
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
  @Input() product: { 
    image: string; 
    name: string; 
    description: string; 
    price: string 
  } = { image: '', name: '', description: '', price: '' };
  
  @Input() variant = 'title';
}