import { Injectable } from '@angular/core';

/**
 * Servicio de Undo/Redo simple con límite de 50 acciones.
 * Cada acción es un objeto arbitrario que el editor debe interpretar.
 */
@Injectable({
  providedIn: 'root',
})
export class UndoRedoService {
  private undoStack: any[] = [];
  private redoStack: any[] = [];
  private maxSize = 50;

  /** Añade una nueva acción al historial */
  push(action: any): void {
    this.undoStack.push(action);
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift(); // eliminar la más antigua
    }
    // Al crear una nueva acción, el redo se invalida
    this.redoStack = [];
  }

  /** Deshace la última acción y la coloca en el stack de redo */
  undo(): any | null {
    if (!this.canUndo()) return null;
    const action = this.undoStack.pop();
    this.redoStack.push(action);
    return action;
  }

  /** Rehace la última acción deshecha */
  redo(): any | null {
    if (!this.canRedo()) return null;
    const action = this.redoStack.pop();
    this.undoStack.push(action);
    return action;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Limpia todo el historial */
  reset(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
