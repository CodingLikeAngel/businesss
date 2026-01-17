import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-design-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="design-editor-v2">
      <!-- Header -->
      <header class="editor-header">
        <div class="header-main">
          <h2>Estilo & Refinado</h2>
          <span class="badge" *ngIf="selectedSection || selectedElement">
            {{ selectedSection ? 'SECCIÓN' : 'ELEMENTO' }}
          </span>
        </div>
        <p class="subtitle">Personaliza la estética visual en tiempo real.</p>
      </header>

      <!-- No Selection State -->
      <div *ngIf="!selectedElement && !selectedSection" class="empty-state">
        <div class="glow-icon">🎨</div>
        <h3>Sin selección</h3>
        <p>Toca cualquier elemento del lienzo para abrir sus herramientas de diseño.</p>
      </div>

      <!-- Editor Content -->
      <div class="editor-body" *ngIf="selectedSection || selectedElement">
        
        <!-- SECTION 1: VARIANTS -->
        <section class="edit-group">
          <div class="group-title">
            <span class="dot"></span>
            <h4>Variante Predefinida</h4>
          </div>
          <div class="variants-v2-grid">
            <button
              *ngFor="let variant of elementVariants"
              class="v2-chip"
              [class.active]="(selectedSection?.variant || selectedSection?.content?.variant || selectedElement?.variant) === variant.id"
              (click)="applyVariant(variant.id)"
            >
              <span class="v2-indicator"></span>
              {{ variant.name }}
            </button>
          </div>
        </section>

        <!-- SECTION 2: SPECIFIC ATTRIBUTES -->
        <div class="accordion-v2" *ngIf="targetStyles">
          
          <!-- COLORS & GLASS -->
          <div class="acc-item">
            <div class="acc-header">Aparencia & Efectos</div>
            <div class="acc-content">
               <div class="grid-2">
                  <div class="input-v2">
                    <label>Fondo</label>
                    <div class="color-picker-wrapper">
                       <input type="color" [ngModel]="targetStyles.backgroundColor || '#000000'" (ngModelChange)="updateColor('backgroundColor', $event)">
                       <span class="color-hex">{{ targetStyles.backgroundColor || '#000000' }}</span>
                    </div>
                  </div>
                  <div class="input-v2">
                    <label>Texto</label>
                    <div class="color-picker-wrapper">
                       <input type="color" [ngModel]="targetStyles.color || '#ffffff'" (ngModelChange)="updateColor('color', $event)">
                       <span class="color-hex">{{ targetStyles.color || '#ffffff' }}</span>
                    </div>
                  </div>
               </div>

               <div class="input-v2 mt-3" *ngIf="selectedSection">
                  <label>Imagen de Fondo (URL)</label>
                  <input type="text" class="text-v2" [(ngModel)]="selectedSection.styles.backgroundImage" (ngModelChange)="onStyleChange()" placeholder="url('...')">
               </div>

               <div class="grid-2 mt-3">
                  <div class="input-v2">
                    <label>Desenfoque (Blur)</label>
                    <input type="text" class="text-v2" [(ngModel)]="targetStyles.backdropFilter" (ngModelChange)="onStyleChange()" placeholder="blur(10px)">
                  </div>
                  <div class="input-v2">
                    <label>Redondeado</label>
                    <input type="text" class="text-v2" [(ngModel)]="targetStyles.borderRadius" (ngModelChange)="onStyleChange()" placeholder="12px">
                  </div>
               </div>
            </div>
          </div>

          <!-- TYPOGRAPHY -->
          <div class="acc-item" *ngIf="selectedElement">
            <div class="acc-header">Tipografía</div>
            <div class="acc-content">
              <div class="grid-2">
                <div class="input-v2">
                  <label>Tamaño</label>
                  <input type="text" class="text-v2" [(ngModel)]="selectedElement.styles.fontSize" (ngModelChange)="onStyleChange()" placeholder="16px">
                </div>
                <div class="input-v2">
                  <label>Peso</label>
                  <select class="select-v2" [(ngModel)]="selectedElement.styles.fontWeight" (ngModelChange)="onStyleChange()">
                      <option value="300">Fino</option>
                      <option value="normal">Normal</option>
                      <option value="600">Semibold</option>
                      <option value="900">Black</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- SPACING & LAYOUT -->
          <div class="acc-item">
            <div class="acc-header">Espaciado & Layout</div>
            <div class="acc-content">
               <div class="grid-2">
                  <div class="input-v2">
                    <label>Padding</label>
                    <input type="text" class="text-v2" [(ngModel)]="targetStyles.padding" (ngModelChange)="onStyleChange()" placeholder="2rem">
                  </div>
                  <div class="input-v2">
                    <label>Margin</label>
                    <input type="text" class="text-v2" [(ngModel)]="targetStyles.margin" (ngModelChange)="onStyleChange()" placeholder="0px">
                  </div>
               </div>
               <div class="input-v2 mt-3" *ngIf="selectedSection">
                  <label>Altura Mínima</label>
                  <input type="text" class="text-v2" [(ngModel)]="selectedSection.styles.minHeight" (ngModelChange)="onStyleChange()" placeholder="auto">
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .design-editor-v2 {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-bottom: 2rem;
    }

    .editor-header {
      .header-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        h2 { font-size: 1.25rem; font-weight: 800; color: white; margin: 0; }
        .badge {
          font-size: 0.6rem;
          font-weight: 900;
          background: rgba(99, 102, 241, 0.2);
          color: #6366f1;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }
      }
      .subtitle { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0; }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;

      .glow-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
      }
      h3 { font-size: 1rem; color: white; margin: 0; }
      p { font-size: 0.85rem; color: #64748b; margin: 0.5rem 0 0; }
    }

    .edit-group {
        margin-bottom: 1.5rem;
        .group-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            .dot { width: 6px; height: 6px; background: #6366f1; border-radius: 50%; box-shadow: 0 0 8px #6366f1; }
            h4 { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin: 0; letter-spacing: 0.05em; }
        }
    }

    .variants-v2-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;

        .v2-chip {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            padding: 0.6rem;
            color: #f8fafc;
            font-size: 0.7rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.4rem;

            .v2-indicator { width: 100%; height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; }

            &:hover { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.15); }
            &.active {
                background: rgba(99, 102, 241, 0.1);
                border-color: #6366f1;
                color: #6366f1;
                .v2-indicator { background: #6366f1; box-shadow: 0 0 10px #6366f1; }
            }
        }
    }

    .accordion-v2 {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .acc-item {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            overflow: hidden;
        }

        .acc-header {
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.02);
            font-size: 0.8rem;
            font-weight: 700;
            color: white;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .acc-content {
            padding: 1.25rem 1rem;
        }
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

    .input-v2 {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        label { font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .text-v2, .select-v2 {
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 0.5rem 0.75rem;
            color: white;
            font-size: 0.8rem;
            outline: none;
            &:focus { border-color: #6366f1; }
        }
    }

    .color-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 0.25rem 0.5rem;
        
        input[type="color"] {
            width: 24px;
            height: 24px;
            border: none;
            background: none;
            cursor: pointer;
            &::-webkit-color-swatch-wrapper { padding: 0; }
            &::-webkit-color-swatch { border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }
        }
        .color-hex { font-size: 0.7rem; font-family: monospace; color: white; flex: 1; text-align: right; }
    }

    .mt-3 { margin-top: 0.75rem; }
  `]
})
export class DesignEditorComponent {
  @Input() selectedElement: any = null;
  @Input() selectedSection: any = null;
  @Output() styleChanged = new EventEmitter<void>();
  @Output() variantApplied = new EventEmitter<string>();

  get targetStyles() {
    return this.selectedSection?._original?.styles || this.selectedSection?.styles || this.selectedElement?._original?.styles || this.selectedElement?.styles;
  }

  elementVariants = [
    { id: 'primary', name: 'Original' },
    { id: 'outline', name: 'Contorno' },
    { id: 'glass', name: 'Cristal' },
    { id: 'neon', name: 'Neón' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'retro', name: 'Retro' },
    { id: 'minimal', name: 'Minimal' }
  ];

  onStyleChange() {
    this.styleChanged.emit();
  }

  updateColor(property: string, color: string) {
    const styles = this.targetStyles;
    if (styles) {
      styles[property] = color;
      this.onStyleChange();
    }
  }

  applyVariant(variantId: string) {
    this.variantApplied.emit(variantId);
  }
}