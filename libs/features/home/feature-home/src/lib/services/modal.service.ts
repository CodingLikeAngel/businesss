import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalState, ServiceItem, ProductItem } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalStateSubject = new BehaviorSubject<ModalState>({
    isOpen: false,
    selectedItem: null
  });

  modalState$: Observable<ModalState> = this.modalStateSubject.asObservable();

  openModal(item: ServiceItem | ProductItem): void {
    this.modalStateSubject.next({
      isOpen: true,
      selectedItem: item
    });
  }

  closeModal(): void {
    this.modalStateSubject.next({
      isOpen: false,
      selectedItem: null
    });
  }

  getCurrentModalState(): ModalState {
    return this.modalStateSubject.value;
  }
}