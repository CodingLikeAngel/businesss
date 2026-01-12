import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EditorSection, EditorState, ModalState, CartItem } from '../models/editor.model';
import { PageSection } from '@negocio/shared-components';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private sectionsSubject = new BehaviorSubject<PageSection[]>([]);
  private editorStateSubject = new BehaviorSubject<EditorState>({
    isMobile: false,
    modalState: { isOpen: false, selectedItem: null },
    cartItems: []
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);

  sections$: Observable<PageSection[]> = this.sectionsSubject.asObservable();
  editorState$: Observable<EditorState> = this.editorStateSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  setSections(sections: PageSection[]): void {
    this.sectionsSubject.next(sections);
  }

  updateEditorState(state: Partial<EditorState>): void {
    const currentState = this.editorStateSubject.value;
    this.editorStateSubject.next({ ...currentState, ...state });
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  getCurrentEditorState(): EditorState {
    return this.editorStateSubject.value;
  }
}