import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { ComponentCatalogItem } from './layout-section.interfaces';

export interface LayoutPickerState {
  isOpen: boolean;
  slotIndex: number;
  onSelect: ((comp: ComponentCatalogItem) => void) | null;
}

@Injectable({ providedIn: 'root' })
export class LayoutComponentPickerService {
  private state$ = new BehaviorSubject<LayoutPickerState>({
    isOpen: false,
    slotIndex: -1,
    onSelect: null,
  });

  /** Single observable instance for template async pipe */
  readonly stateAsObservable = this.state$.asObservable();

  get state(): LayoutPickerState {
    return this.state$.value;
  }

  open(slotIndex: number, onSelect: (comp: ComponentCatalogItem) => void): void {
    this.state$.next({
      isOpen: true,
      slotIndex,
      onSelect,
    });
  }

  close(): void {
    this.state$.next({
      isOpen: false,
      slotIndex: -1,
      onSelect: null,
    });
  }

  selectComponent(comp: ComponentCatalogItem): void {
    const s = this.state$.value;
    if (s.onSelect) {
      s.onSelect(comp);
    }
    this.close();
  }
}
