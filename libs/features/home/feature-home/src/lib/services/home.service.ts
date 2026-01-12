import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HomeSection, HomeState, ModalState, CartItem } from '../models/home.model';
import { PageSection } from '@negocio/shared-components';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private sectionsSubject = new BehaviorSubject<PageSection[]>([]);
  private homeStateSubject = new BehaviorSubject<HomeState>({
    isMobile: false,
    modalState: { isOpen: false, selectedItem: null },
    cartItems: []
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);

  sections$: Observable<PageSection[]> = this.sectionsSubject.asObservable();
  homeState$: Observable<HomeState> = this.homeStateSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  setSections(sections: PageSection[]): void {
    this.sectionsSubject.next(sections);
  }

  updateHomeState(state: Partial<HomeState>): void {
    const currentState = this.homeStateSubject.value;
    this.homeStateSubject.next({ ...currentState, ...state });
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  getCurrentHomeState(): HomeState {
    return this.homeStateSubject.value;
  }
}