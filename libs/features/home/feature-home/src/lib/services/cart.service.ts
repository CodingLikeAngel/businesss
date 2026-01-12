import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, ProductItem } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  addToCart(product: ProductItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.name === product.name);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItemsSubject.next([...currentItems]);
    } else {
      const newItem: CartItem = { ...product, quantity: 1 };
      this.cartItemsSubject.next([...currentItems, newItem]);
    }

    console.log(`Producto añadido al carrito: ${product.name}`);
  }

  removeFromCart(productName: string): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.name !== productName);
    this.cartItemsSubject.next(currentItems);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }
}