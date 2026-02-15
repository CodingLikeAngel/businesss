import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface BackgroundSettings {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundAttachment?: 'scroll' | 'fixed';
  patternType?: 'none' | 'stripes' | 'dots' | 'grid';
  patternOpacity?: string;
}

@Component({
  selector: 'lib-background-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="background-editor-container">
      <!-- Color & Image Row -->
      <div class="editor-row">
        <div class="control-group color-group">
          <label>Color de Fondo</label>
          <div class="color-picker-wrapper">
            <div class="preview-box" [style.backgroundColor]="settings.backgroundColor || '#ffffff'">
              <input 
                type="color" 
                [ngModel]="settings.backgroundColor || '#ffffff'" 
                (ngModelChange)="update('backgroundColor', $event)"
              >
            </div>
            <input 
              type="text" 
              class="hex-input"
              [ngModel]="settings.backgroundColor || '#ffffff'" 
              (ngModelChange)="update('backgroundColor', $event)"
              placeholder="#ffffff"
            >
          </div>
        </div>
      </div>

      <!-- Image URL -->
      <div class="editor-row">
        <div class="control-group">
          <label>Imagen de Fondo (URL)</label>
          <div class="input-with-clear">
            <input 
              type="text" 
              class="text-input"
              [ngModel]="settings.backgroundImage" 
              (ngModelChange)="update('backgroundImage', $event)"
              placeholder="url('https://...')"
            >
            <button class="clear-btn" *ngIf="settings.backgroundImage" (click)="update('backgroundImage', '')">✕</button>
          </div>
        </div>
      </div>

      <!-- Patterns -->
      <div class="editor-row">
        <div class="control-group">
          <label>Patrón Decorativo</label>
          <div class="pattern-grid">
            <button 
              *ngFor="let p of patterns" 
              class="pattern-btn"
              [class.active]="settings.patternType === p.id"
              (click)="update('patternType', p.id)"
              [title]="p.name"
            >
              <div class="pattern-preview" [class]="'pattern-' + p.id"></div>
              <span>{{ p.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pattern Opacity -->
      <div class="editor-row" *ngIf="settings.patternType && settings.patternType !== 'none'">
        <div class="control-group">
          <div class="label-with-value">
            <label>Opacidad del Patrón</label>
            <span class="value">{{ (settings.patternOpacity || '0.05') }}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="0.5" 
            step="0.01"
            [ngModel]="settings.patternOpacity || '0.05'" 
            (ngModelChange)="update('patternOpacity', $event)"
          >
        </div>
      </div>

      <!-- Advanced Image Settings -->
      <div class="editor-row" *ngIf="settings.backgroundImage">
        <div class="grid-2">
          <div class="control-group">
            <label>Tamaño</label>
            <select [ngModel]="settings.backgroundSize || 'cover'" (ngModelChange)="update('backgroundSize', $event)">
              <option value="cover">Auto-Ajustar (Cover)</option>
              <option value="contain">Contener (Contain)</option>
              <option value="original">Original (Auto)</option>
            </select>
          </div>
          <div class="control-group">
            <label>Efecto</label>
            <select [ngModel]="settings.backgroundAttachment || 'scroll'" (ngModelChange)="update('backgroundAttachment', $event)">
              <option value="scroll">Normal</option>
              <option value="fixed">Fijo (Parallax)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .background-editor-container {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 0.5rem 0;
    }

    .editor-row {
      width: 100%;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-size: 0.75rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .label-with-value {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .value {
        font-size: 0.75rem;
        font-family: monospace;
        color: #6366f1;
      }
    }

    .color-picker-wrapper {
      display: flex;
      gap: 0.75rem;
      align-items: center;

      .preview-box {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;

        input[type="color"] {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          cursor: pointer;
          opacity: 0;
        }
      }

      .hex-input {
        flex: 1;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
        color: white;
        font-family: monospace;
        font-size: 0.9rem;

        &:focus {
          outline: none;
          border-color: #6366f1;
        }
      }
    }

    .input-with-clear {
      position: relative;
      display: flex;
      align-items: center;

      .text-input {
        width: 100%;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 0.6rem 0.75rem;
        padding-right: 2.5rem;
        color: white;
        font-size: 0.85rem;

        &:focus {
          outline: none;
          border-color: #6366f1;
        }
      }

      .clear-btn {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.4);
        cursor: pointer;
        padding: 0.25rem;
        font-size: 0.8rem;

        &:hover {
          color: white;
        }
      }
    }

    .pattern-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
    }

    .pattern-btn {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      transition: all 0.2s ease;

      span {
        font-size: 0.65rem;
        color: rgba(255, 255, 255, 0.6);
      }

      &:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      &.active {
        background: rgba(99, 102, 241, 0.1);
        border-color: #6366f1;
        span { color: #818cf8; }
      }
    }

    .pattern-preview {
      width: 100%;
      height: 24px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.1);
      
      &.pattern-none { background-image: none; }
      &.pattern-stripes {
        background: repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px);
      }
      &.pattern-dots {
        background-image: radial-gradient(rgba(255,255,255,0.3) 1px, transparent 0);
        background-size: 6px 6px;
      }
      &.pattern-grid {
        background-size: 8px 8px;
        background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
      }
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    select {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.5rem;
      color: white;
      font-size: 0.85rem;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: #6366f1;
      }
    }

    input[type="range"] {
      width: 100%;
      accent-color: #6366f1;
      cursor: pointer;
    }
  `]
})
export class BackgroundEditorComponent {
  @Input() settings: BackgroundSettings = {};
  @Output() settingsChange = new EventEmitter<BackgroundSettings>();

  patterns = [
    { id: 'none', name: 'None' },
    { id: 'stripes', name: 'Lines' },
    { id: 'dots', name: 'Dots' },
    { id: 'grid', name: 'Grid' }
  ];

  update(key: keyof BackgroundSettings, value: any) {
    this.settings = { ...this.settings, [key]: value };
    this.settingsChange.emit(this.settings);
  }
}
