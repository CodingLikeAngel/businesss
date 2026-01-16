import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-design-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="design-editor">
      <div class="config-group">
        <div class="group-header">
          <h3>Editor de Estilos</h3>
          <p class="helper-text">
            Personaliza los estilos y variantes de los elementos seleccionados.
          </p>
        </div>

        <div *ngIf="!selectedElement && !selectedSection" class="no-selection">
          <div class="no-selection-icon">🎨</div>
          <h4>Selecciona un elemento</h4>
          <p>Haz clic en un elemento del canvas para editar sus estilos.</p>
        </div>

        <!-- Section or Element Variants Section -->
        <div class="config-group" *ngIf="selectedSection || selectedElement">
          <div class="group-header">
            <h3>Variante del Componente</h3>
            <p class="helper-text">Aplica un estilo predefinido.</p>
          </div>

          <div class="variants-grid">
            <button
              *ngFor="let variant of elementVariants"
              class="variant-btn"
              [class.active]="(selectedSection?.variant || selectedSection?.content?.variant || selectedElement?.variant) === variant.id"
              (click)="applyVariant(variant.id)"
            >
              {{ variant.name }}
            </button>
          </div>
        </div>

        <!-- Element Style Editor -->
        <div *ngIf="selectedElement" class="style-section mt-8">
          <h4>Estilos del Elemento</h4>
          <div class="style-form">
            <!-- Typography -->
            <div class="style-group">
              <h5>Tipografía</h5>
              <div class="form-row">
                <div class="form-group">
                  <label>Tamaño:</label>
                  <input
                    type="text"
                    [(ngModel)]="selectedElement.styles.fontSize"
                    (ngModelChange)="onStyleChange()"
                    placeholder="16px"
                  />
                </div>
                <div class="form-group">
                  <label>Peso:</label>
                  <select [(ngModel)]="selectedElement.styles.fontWeight" (ngModelChange)="onStyleChange()">
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="600">Semi-bold</option>
                    <option value="300">Light</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Colors -->
            <div class="style-group">
              <h5>Colores</h5>
              <div class="form-row">
                <div class="form-group">
                  <label>Texto:</label>
                  <input
                    type="color"
                    [ngModel]="selectedElement.styles.color || '#ffffff'"
                    (ngModelChange)="selectedElement.styles.color = $event; onStyleChange()"
                  />
                </div>
                <div class="form-group">
                  <label>Fondo:</label>
                  <input
                    type="color"
                    [ngModel]="selectedElement.styles.backgroundColor || '#000000'"
                    (ngModelChange)="selectedElement.styles.backgroundColor = $event; onStyleChange()"
                  />
                </div>
              </div>
            </div>
            
            <div class="style-group">
              <h5>Espaciado</h5>
              <div class="form-row">
                <div class="form-group">
                  <label>Padding:</label>
                  <input type="text" [(ngModel)]="selectedElement.styles.padding" (ngModelChange)="onStyleChange()" />
                </div>
                <div class="form-group">
                  <label>Margin:</label>
                  <input type="text" [(ngModel)]="selectedElement.styles.margin" (ngModelChange)="onStyleChange()" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Style Editor -->
        <div *ngIf="selectedSection" class="style-section mt-8">
          <h4>Estilos de la Sección</h4>
          <div class="style-form">
            <!-- Background -->
            <div class="style-group">
              <h5>Fondo</h5>
              <div class="form-row">
                <div class="form-group">
                  <label>Color de Fondo:</label>
                  <input
                    type="color"
                    [ngModel]="selectedSection.styles.backgroundColor || '#111111'"
                    (ngModelChange)="selectedSection.styles.backgroundColor = $event; onStyleChange()"
                  />
                </div>
                <div class="form-group">
                  <label>Imagen de Fondo (URL):</label>
                  <input
                    type="text"
                    [(ngModel)]="selectedSection.styles.backgroundImage"
                    (ngModelChange)="onStyleChange()"
                    placeholder="url(...)"
                  />
                </div>
              </div>
            </div>

            <!-- Layout -->
            <div class="style-group">
              <h5>Diseño</h5>
              <div class="form-row">
                <div class="form-group">
                  <label>Altura mínima:</label>
                  <input
                    type="text"
                    [(ngModel)]="selectedSection.styles.minHeight"
                    (ngModelChange)="onStyleChange()"
                    placeholder="auto"
                  />
                </div>
                <div class="form-group">
                  <label>Padding:</label>
                  <input
                    type="text"
                    [(ngModel)]="selectedSection.styles.padding"
                    (ngModelChange)="onStyleChange()"
                    placeholder="4rem 0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .design-editor {
      .no-selection {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--color-text-inverse-secondary);

        .no-selection-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        h4 {
          margin: 0 0 0.5rem 0;
          color: var(--color-text-inverse);
        }

        p {
          margin: 0;
          font-size: 0.9rem;
        }
      }

      .style-section {
        margin-bottom: 2rem;

        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-inverse);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      }

      .style-form {
        .style-group {
          margin-bottom: 2rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);

          h5 {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--color-text-inverse);
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;

          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          label {
            display: block;
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--color-text-inverse-secondary);
            margin-bottom: 0.5rem;
          }

          input, select, textarea {
            width: 100%;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: var(--color-text-inverse);
            font-family: inherit;
            font-size: 0.85rem;
            transition: all 0.2s ease;

            &:focus {
              outline: none;
              border-color: var(--color-primary);
              background: rgba(255, 255, 255, 0.08);
            }

            &::placeholder {
              color: rgba(255, 255, 255, 0.4);
            }
          }

          textarea {
            resize: vertical;
            min-height: 80px;
          }
        }
      }

      .variants-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.75rem;

        .variant-btn {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          color: var(--color-text-inverse-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.1);
          }

          &.active {
            background: var(--color-primary);
            border-color: var(--color-primary);
            color: white;
          }
        }
      }
    }
  `]
})
export class DesignEditorComponent {
  @Input() selectedElement: any = null;
  @Input() selectedSection: any = null;
  @Output() styleChanged = new EventEmitter<void>();
  @Output() variantApplied = new EventEmitter<string>();

  elementVariants = [
    { id: 'default', name: 'Default' },
    { id: 'primary', name: 'Primary' },
    { id: 'secondary', name: 'Secondary' },
    { id: 'success', name: 'Success' },
    { id: 'warning', name: 'Warning' },
    { id: 'danger', name: 'Danger' },
    { id: 'glass', name: 'Glass' },
    { id: 'neon', name: 'Neon' },
    { id: 'cyberpunk', name: 'Cyberpunk' }
  ];

  onStyleChange() {
    this.styleChanged.emit();
  }

  applyVariant(variantId: string) {
    this.variantApplied.emit(variantId);
  }
}