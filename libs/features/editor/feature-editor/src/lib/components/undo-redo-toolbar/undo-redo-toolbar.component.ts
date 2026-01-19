import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HistoryService } from '../../services/history.service';
import { HistoryState } from '../../models/editor.model';

@Component({
  selector: 'lib-undo-redo-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="undo-redo-toolbar">
      <button
        class="toolbar-btn undo-btn"
        [disabled]="!canUndo"
        (click)="undo()"
        title="Undo (Ctrl+Z)"
        [class.active]="canUndo">
        <span class="icon">↶</span>
        <span class="label">Undo</span>
      </button>

      <button
        class="toolbar-btn redo-btn"
        [disabled]="!canRedo"
        (click)="redo()"
        title="Redo (Ctrl+Y)"
        [class.active]="canRedo">
        <span class="icon">↷</span>
        <span class="label">Redo</span>
      </button>

      <div class="history-info" *ngIf="showHistoryInfo">
        <span class="history-count">{{ historyStats.totalCommands }} operations</span>
        <span class="memory-usage">{{ historyStats.memoryUsage | number:'1.0-0' }} KB</span>
      </div>
    </div>
  `,
  styles: [`
    .undo-redo-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }

    .toolbar-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 80px;
      justify-content: center;
    }

    .toolbar-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.9);
    }

    .toolbar-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .toolbar-btn.active {
      background: rgba(99, 102, 241, 0.2);
      border-color: rgba(99, 102, 241, 0.4);
      color: #ffffff;
    }

    .toolbar-btn.active:hover {
      background: rgba(99, 102, 241, 0.3);
    }

    .icon {
      font-size: 16px;
      font-weight: bold;
    }

    .label {
      font-weight: 500;
    }

    .history-info {
      margin-left: 16px;
      padding-left: 16px;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    .history-count {
      font-weight: 500;
    }

    .memory-usage {
      font-size: 11px;
      opacity: 0.7;
    }

    @media (max-width: 768px) {
      .undo-redo-toolbar {
        padding: 6px;
        gap: 4px;
      }

      .toolbar-btn {
        padding: 6px 8px;
        min-width: 60px;
        font-size: 13px;
      }

      .label {
        display: none;
      }

      .history-info {
        display: none;
      }
    }
  `]
})
export class UndoRedoToolbarComponent implements OnInit, OnDestroy {
  canUndo = false;
  canRedo = false;
  historyStats = { totalCommands: 0, memoryUsage: 0 };
  showHistoryInfo = false; // Set to true to show debug info

  private subscription?: Subscription;

  constructor(private historyService: HistoryService) {}

  ngOnInit() {
    this.subscription = this.historyService.historyState.subscribe((state: HistoryState) => {
      this.canUndo = state.canUndo;
      this.canRedo = state.canRedo;
      this.historyStats = this.historyService.getStats();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  undo() {
    this.historyService.undo();
  }

  redo() {
    this.historyService.redo();
  }
}