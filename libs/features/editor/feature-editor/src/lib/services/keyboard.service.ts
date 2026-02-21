import { Injectable, HostListener, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { HistoryService } from './history.service';
import { executeShortcut } from '../store/actions/ui.actions';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
  description: string;
  preventDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private store = inject(Store<AppState>);
  private historyService = inject(HistoryService);

  private shortcuts: KeyboardShortcut[] = [
    {
      key: 'z',
      ctrl: true,
      action: 'undo',
      description: 'Deshacer última acción',
      preventDefault: true
    },
    {
      key: 'y',
      ctrl: true,
      action: 'redo',
      description: 'Rehacer última acción deshecha',
      preventDefault: true
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      action: 'redo',
      description: 'Rehacer (alternativa)',
      preventDefault: true
    },
    {
      key: 'a',
      ctrl: true,
      action: 'select-all',
      description: 'Seleccionar todos los elementos',
      preventDefault: true
    },
    {
      key: 'g',
      ctrl: true,
      action: 'group-elements',
      description: 'Agrupar elementos seleccionados',
      preventDefault: true
    },
    {
      key: 'g',
      ctrl: true,
      shift: true,
      action: 'ungroup-elements',
      description: 'Desagrupar elementos',
      preventDefault: true
    },
    {
      key: 'Escape',
      action: 'clear-selection',
      description: 'Cancelar selección',
      preventDefault: false
    },
    {
      key: 'Delete',
      action: 'delete-selected',
      description: 'Eliminar elementos seleccionados',
      preventDefault: true
    },
    {
      key: 'Backspace',
      action: 'delete-selected',
      description: 'Eliminar elementos seleccionados (alternativa)',
      preventDefault: true
    },
    {
      key: '/',
      shift: true,
      action: 'toggle-shortcuts',
      description: 'Abrir esta guía de atajos',
      preventDefault: true
    },
    {
      key: '?',
      action: 'toggle-shortcuts',
      description: 'Abrir esta guía de atajos',
      preventDefault: true
    }
  ];

  private isEnabled = true;

  constructor() {
    // Listen for keyboard events on document
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  /**
   * Enable keyboard shortcuts
   */
  enable(): void {
    this.isEnabled = true;
  }

  /**
   * Disable keyboard shortcuts
   */
  disable(): void {
    this.isEnabled = false;
  }

  /**
   * Check if shortcuts are enabled
   */
  isShortcutsEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Add a custom keyboard shortcut
   */
  addShortcut(shortcut: KeyboardShortcut): void {
    // Remove existing shortcut with same key combination
    this.shortcuts = this.shortcuts.filter(s =>
      !(s.key === shortcut.key &&
        s.ctrl === shortcut.ctrl &&
        s.shift === shortcut.shift &&
        s.alt === shortcut.alt)
    );

    this.shortcuts.push(shortcut);
  }

  /**
   * Remove a keyboard shortcut
   */
  removeShortcut(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean): void {
    this.shortcuts = this.shortcuts.filter(s =>
      !(s.key === key && s.ctrl === ctrl && s.shift === shift && s.alt === alt)
    );
  }

  /**
   * Get all registered shortcuts
   */
  getShortcuts(): KeyboardShortcut[] {
    return [...this.shortcuts];
  }

  /**
   * Handle keyboard events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) {
      return;
    }

    // Find matching shortcut
    const shortcut = this.shortcuts.find(s =>
      s.key.toLowerCase() === event.key.toLowerCase() &&
      !!s.ctrl === event.ctrlKey &&
      !!s.shift === event.shiftKey &&
      !!s.alt === event.altKey
    );

    if (shortcut) {
      if (shortcut.preventDefault !== false) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.executeShortcut(shortcut);
    }
  }

  /**
   * Execute a shortcut action
   */
  private executeShortcut(shortcut: KeyboardShortcut): void {
    // Handle built-in actions
    switch (shortcut.action) {
      case 'undo':
        this.historyService.undo();
        break;

      case 'redo':
        this.historyService.redo();
        break;

      default:
        // Dispatch custom shortcut action
        this.store.dispatch(executeShortcut({ shortcut: shortcut.action }));
        break;
    }

    // Log for debugging
    console.log(`Keyboard shortcut executed: ${shortcut.description} (${shortcut.action})`);
  }

  /**
   * Get shortcut display string
   */
  getShortcutDisplay(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];

    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');

    parts.push(shortcut.key.toUpperCase());

    return parts.join('+');
  }

  /**
   * Get shortcuts by category
   */
  getShortcutsByCategory(): { [category: string]: KeyboardShortcut[] } {
    const categories: { [cat: string]: string[] } = {
      'Historial': ['undo', 'redo'],
      'Selección': ['select-all', 'clear-selection'],
      'Agrupación': ['group-elements', 'ungroup-elements'],
      'Edición': ['delete-selected'],
      'Ayuda': ['toggle-shortcuts']
    };

    const result: { [category: string]: KeyboardShortcut[] } = {};

    Object.entries(categories).forEach(([category, actions]) => {
      const list = this.shortcuts.filter(s => actions.includes(s.action));
      if (list.length) result[category] = list;
    });

    return result;
  }

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }
}