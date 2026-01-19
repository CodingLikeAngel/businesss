import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Command, HistoryState } from '../models/editor.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { undo, redo, executeCommand, clearHistory } from '../store/actions/ui.actions';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private readonly MAX_HISTORY_SIZE = 50; // Configurable limit
  private historyState$ = new BehaviorSubject<HistoryState>({
    past: [],
    present: null,
    future: [],
    canUndo: false,
    canRedo: false
  });

  constructor(private store: Store<AppState>) {
    // Subscribe to store changes to keep local state in sync
    this.store.select(state => state.editor.history).subscribe(historyState => {
      this.historyState$.next(historyState);
    });
  }

  get historyState(): Observable<HistoryState> {
    return this.historyState$.asObservable();
  }

  get currentState(): HistoryState {
    return this.historyState$.value;
  }

  /**
   * Execute a command and add it to history
   */
  execute(command: Command): void {
    this.store.dispatch(executeCommand({ command }));
  }

  /**
   * Undo the last command
   */
  undo(): void {
    if (this.canUndo) {
      this.store.dispatch(undo());
    }
  }

  /**
   * Redo the next command
   */
  redo(): void {
    if (this.canRedo) {
      this.store.dispatch(redo());
    }
  }

  /**
   * Check if undo is available
   */
  get canUndo(): boolean {
    return this.currentState.canUndo;
  }

  /**
   * Check if redo is available
   */
  get canRedo(): boolean {
    return this.currentState.canRedo;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.store.dispatch(clearHistory());
  }

  /**
   * Get the last executed command
   */
  getLastCommand(): Command | null {
    return this.currentState.present;
  }

  /**
   * Get all past commands
   */
  getPastCommands(): Command[] {
    return [...this.currentState.past];
  }

  /**
   * Get all future commands (available for redo)
   */
  getFutureCommands(): Command[] {
    return [...this.currentState.future];
  }

  /**
   * Get command by ID from history
   */
  getCommandById(id: string): Command | null {
    const allCommands = [
      ...this.currentState.past,
      this.currentState.present,
      ...this.currentState.future
    ].filter(cmd => cmd !== null) as Command[];

    return allCommands.find(cmd => cmd.id === id) || null;
  }

  /**
   * Undo specific command by ID
   */
  undoToCommand(commandId: string): boolean {
    const command = this.getCommandById(commandId);
    if (!command) return false;

    // Find index in past commands
    const pastIndex = this.currentState.past.findIndex(cmd => cmd.id === commandId);
    if (pastIndex === -1) return false;

    // Calculate how many undos needed to reach this command
    const undoCount = this.currentState.past.length - pastIndex;

    for (let i = 0; i < undoCount; i++) {
      this.undo();
    }

    return true;
  }

  /**
   * Redo to specific command by ID
   */
  redoToCommand(commandId: string): boolean {
    const command = this.getCommandById(commandId);
    if (!command) return false;

    // Find index in future commands
    const futureIndex = this.currentState.future.findIndex(cmd => cmd.id === commandId);
    if (futureIndex === -1) return false;

    // Redo up to and including this command
    for (let i = 0; i <= futureIndex; i++) {
      this.redo();
    }

    return true;
  }

  /**
   * Get history statistics
   */
  getStats() {
    return {
      totalCommands: this.currentState.past.length + (this.currentState.present ? 1 : 0) + this.currentState.future.length,
      pastCount: this.currentState.past.length,
      futureCount: this.currentState.future.length,
      canUndo: this.canUndo,
      canRedo: this.canRedo,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * Estimate memory usage of history (rough approximation)
   */
  private estimateMemoryUsage(): number {
    const commands = [
      ...this.currentState.past,
      this.currentState.present,
      ...this.currentState.future
    ].filter(cmd => cmd !== null) as Command[];

    // Rough estimate: 1KB per command
    return commands.length * 1024;
  }

  /**
   * Compress history by merging similar consecutive commands
   */
  compressHistory(): void {
    // This would be implemented to merge similar operations
    // For example, multiple consecutive style changes on the same element
    // could be merged into a single command
    console.log('History compression not yet implemented');
  }

  /**
   * Set maximum history size
   */
  setMaxHistorySize(size: number): void {
    (this as any).MAX_HISTORY_SIZE = Math.max(10, size);
  }

  /**
   * Export history for debugging or persistence
   */
  exportHistory(): any {
    return {
      past: this.currentState.past.map(cmd => ({
        id: cmd.id,
        type: cmd.type,
        timestamp: cmd.timestamp,
        description: cmd.description
      })),
      present: this.currentState.present ? {
        id: this.currentState.present.id,
        type: this.currentState.present.type,
        timestamp: this.currentState.present.timestamp,
        description: this.currentState.present.description
      } : null,
      future: this.currentState.future.map(cmd => ({
        id: cmd.id,
        type: cmd.type,
        timestamp: cmd.timestamp,
        description: cmd.description
      })),
      stats: this.getStats()
    };
  }
}