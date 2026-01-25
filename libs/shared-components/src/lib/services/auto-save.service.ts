import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export interface AutoSaveConfig {
  enabled: boolean;
  intervalMs: number;
  debounceMs: number;
}

export interface SaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: string | null;
}

/**
 * Service for auto-saving project state
 */
@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {
  private destroy$ = new Subject<void>();
  private changes$ = new Subject<any>();
  
  private config: AutoSaveConfig = {
    enabled: true,
    intervalMs: 30000, // 30 seconds
    debounceMs: 2000   // 2 seconds after last change
  };

  private state: SaveState = {
    lastSaved: null,
    isSaving: false,
    hasUnsavedChanges: false,
    error: null
  };

  // Observable for save state changes
  public saveState$ = new Subject<SaveState>();
  
  // Observable for save events
  public onSave$ = new Subject<any>();

  constructor() {
    this.setupAutoSave();
  }

  /**
   * Setup auto-save with debounce
   */
  private setupAutoSave(): void {
    // Debounced save - triggers after user stops making changes
    this.changes$
      .pipe(
        debounceTime(this.config.debounceMs),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (this.config.enabled) {
          this.save(data);
        }
      });

    // Periodic save - backup every N seconds if there are changes
    interval(this.config.intervalMs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.config.enabled && this.state.hasUnsavedChanges) {
          console.log('⏰ Periodic auto-save triggered');
          this.onSave$.next(null);
        }
      });
  }

  /**
   * Notify of a change (will trigger debounced save)
   */
  notifyChange(data: any): void {
    this.state.hasUnsavedChanges = true;
    this.emitState();
    this.changes$.next(data);
  }

  /**
   * Perform immediate save
   */
  save(data: any): void {
    this.state.isSaving = true;
    this.state.error = null;
    this.emitState();

    // Emit save event
    this.onSave$.next(data);

    // Simulate async save (in real app, this would be Firebase/API call)
    setTimeout(() => {
      this.state.isSaving = false;
      this.state.hasUnsavedChanges = false;
      this.state.lastSaved = new Date();
      this.state.error = null;
      this.emitState();
      
      console.log('💾 Auto-saved at', this.state.lastSaved.toLocaleTimeString());
    }, 500);
  }

  /**
   * Force save now
   */
  forceSave(data: any): void {
    console.log('💾 Force save triggered');
    this.save(data);
  }

  /**
   * Enable auto-save
   */
  enable(): void {
    this.config.enabled = true;
    console.log('✅ Auto-save enabled');
  }

  /**
   * Disable auto-save
   */
  disable(): void {
    this.config.enabled = false;
    console.log('⏸️ Auto-save disabled');
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AutoSaveConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('⚙️ Auto-save config updated:', this.config);
  }

  /**
   * Get current save state
   */
  getState(): SaveState {
    return { ...this.state };
  }

  /**
   * Get time since last save
   */
  getTimeSinceLastSave(): string {
    if (!this.state.lastSaved) return 'Never';
    
    const seconds = Math.floor((Date.now() - this.state.lastSaved.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }

  /**
   * Mark as saved (for manual saves)
   */
  markAsSaved(): void {
    this.state.hasUnsavedChanges = false;
    this.state.lastSaved = new Date();
    this.emitState();
  }

  /**
   * Handle save error
   */
  handleError(error: string): void {
    this.state.isSaving = false;
    this.state.error = error;
    this.emitState();
    console.error('❌ Auto-save error:', error);
  }

  /**
   * Emit current state
   */
  private emitState(): void {
    this.saveState$.next({ ...this.state });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
