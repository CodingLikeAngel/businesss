import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-content-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="content-editor">
      <div class="config-group">
        <div class="group-header">
          <h3>Editor de Contenido</h3>
          <p class="helper-text">
            Edita el contenido de texto de los elementos seleccionados.
          </p>
        </div>

        <div *ngIf="!selectedElement && !selectedSection" class="no-selection">
          <div class="no-selection-icon">📝</div>
          <h4>Selecciona un elemento</h4>
          <p>Haz clic en un elemento del canvas para editar su contenido.</p>
        </div>

        <!-- Element Content Editor -->
        <div *ngIf="selectedElement" class="content-section">
          <h4>Contenido del Elemento</h4>
          <div class="content-form">
            <div class="form-group" *ngIf="selectedElement.content.title !== undefined">
              <label>Título:</label>
              <input
                type="text"
                [(ngModel)]="selectedElement.content.title"
                (ngModelChange)="onContentChange()"
                placeholder="Ingresa el título..."
              />
            </div>

            <div class="form-group" *ngIf="selectedElement.content.subtitle !== undefined">
              <label>Subtítulo / Valor:</label>
              <input
                type="text"
                [(ngModel)]="selectedElement.content.subtitle"
                (ngModelChange)="onContentChange()"
                placeholder="Ingresa el subtítulo..."
              />
            </div>

            <div class="form-group" *ngIf="selectedElement.content.description !== undefined">
              <label>Descripción:</label>
              <textarea
                [(ngModel)]="selectedElement.content.description"
                (ngModelChange)="onContentChange()"
                rows="3"
                placeholder="Ingresa la descripción..."
              ></textarea>
            </div>

            <div class="form-group" *ngIf="selectedElement.content.text !== undefined">
              <label>Texto:</label>
              <textarea
                [(ngModel)]="selectedElement.content.text"
                (ngModelChange)="onContentChange()"
                rows="3"
                placeholder="Ingresa el texto..."
              ></textarea>
            </div>

            <div class="form-group" *ngIf="selectedElement.content.label !== undefined">
              <label>Etiqueta / Botón:</label>
              <input
                type="text"
                [(ngModel)]="selectedElement.content.label"
                (ngModelChange)="onContentChange()"
                placeholder="Texto del botón o etiqueta..."
              />
            </div>

            <div class="form-group" *ngIf="selectedElement.content.link !== undefined">
              <label>Enlace / URL:</label>
              <input
                type="text"
                [(ngModel)]="selectedElement.content.link"
                (ngModelChange)="onContentChange()"
                placeholder="https://ejemplo.com"
              />
            </div>

            <div class="form-group" *ngIf="selectedElement.content.image !== undefined">
              <label>URL de Imagen:</label>
              <input
                type="text"
                [(ngModel)]="selectedElement.content.image"
                (ngModelChange)="onContentChange()"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
        </div>

        <!-- Section Content Editor -->
        <div *ngIf="selectedSection" class="content-section">
          <h4>Contenido de la Sección</h4>
          <div class="content-form">
            <div class="form-group" *ngIf="selectedSection.content.title !== undefined">
              <label>Título:</label>
              <input
                type="text"
                [(ngModel)]="selectedSection.content.title"
                (ngModelChange)="onContentChange()"
                placeholder="Ingresa el título..."
              />
            </div>

            <div class="form-group" *ngIf="selectedSection.content.subtitle !== undefined">
              <label>Subtítulo:</label>
              <input
                type="text"
                [(ngModel)]="selectedSection.content.subtitle"
                (ngModelChange)="onContentChange()"
                placeholder="Ingresa el subtítulo..."
              />
            </div>

            <div class="form-group" *ngIf="selectedSection.content.description !== undefined">
              <label>Descripción:</label>
              <textarea
                [(ngModel)]="selectedSection.content.description"
                (ngModelChange)="onContentChange()"
                rows="4"
                placeholder="Ingresa la descripción..."
              ></textarea>
            </div>

            <div class="form-group" *ngIf="selectedSection.content.text !== undefined">
              <label>Texto Adicional:</label>
              <textarea
                [(ngModel)]="selectedSection.content.text"
                (ngModelChange)="onContentChange()"
                rows="3"
                placeholder="Ingresa texto adicional..."
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group" *ngIf="selectedSection.content.link !== undefined">
                <label>Enlace (Botón/Link):</label>
                <input
                  type="text"
                  [(ngModel)]="selectedSection.content.link"
                  (ngModelChange)="onContentChange()"
                  placeholder="https://..."
                />
              </div>
              <div class="form-group" *ngIf="selectedSection.content.label !== undefined">
                <label>Texto del Botón:</label>
                <input
                  type="text"
                  [(ngModel)]="selectedSection.content.label"
                  (ngModelChange)="onContentChange()"
                  placeholder="Saber más"
                />
              </div>
            </div>

            <div class="form-group" *ngIf="selectedSection.content.image !== undefined">
              <label>Imagen de la Sección (URL):</label>
              <input
                type="text"
                [(ngModel)]="selectedSection.content.image"
                (ngModelChange)="onContentChange()"
                placeholder="https://..."
              />
            </div>

            <!-- List Items Editor (for features, testimonials, etc.) -->
            <div *ngIf="selectedSection.content.items?.length !== undefined" class="items-editor mt-6">
              <div class="flex justify-between items-center mb-4">
                <h5>Elementos de Lista ({{ selectedSection.content.items?.length || 0 }})</h5>
                <button class="add-mini-btn px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-md text-[10px] font-bold hover:bg-primary/40 transition-colors"
                        (click)="addItem(selectedSection.content.items)">
                  ✚ AÑADIR
                </button>
              </div>

              <div *ngIf="selectedSection.content.items?.length === 0" class="text-center py-4 bg-white/5 rounded-lg border border-dashed border-white/10 mb-4">
                <p class="text-[10px] text-white/40">Sin elementos. Haz clic en "Añadir".</p>
              </div>

              <div *ngFor="let item of selectedSection.content.items; let i = index" class="item-edit-box p-4 bg-white/5 rounded-lg mb-4 border border-white/10 relative group">
                <button class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all p-1"
                        (click)="removeItem(selectedSection.content.items, i)">
                  🗑️
                </button>
                
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-bold text-primary">ITEM #{{ i + 1 }}</span>
                </div>
                <div class="form-group mb-2">
                  <label class="text-[10px]">Título / Nombre:</label>
                  <input type="text" [(ngModel)]="item.title" (ngModelChange)="onContentChange()" placeholder="Título..." class="text-xs !p-2" />
                  <input *ngIf="item.name !== undefined" type="text" [(ngModel)]="item.name" (ngModelChange)="onContentChange()" placeholder="Nombre..." class="text-xs !p-2 mt-1" />
                  <input *ngIf="item.author !== undefined" type="text" [(ngModel)]="item.author" (ngModelChange)="onContentChange()" placeholder="Autor..." class="text-xs !p-2 mt-1" />
                </div>
                <div class="form-group mb-0" *ngIf="item.description !== undefined || item.quote !== undefined || item.text !== undefined">
                  <label class="text-[10px]">Descripción / Cita:</label>
                  <textarea [(ngModel)]="item.description || item.quote || item.text" (ngModelChange)="onContentChange()" rows="2" class="text-xs !p-2"></textarea>
                </div>
              </div>
            </div>

            <!-- Chart Data Editor -->
            <div *ngIf="selectedSection.type === 'chart'" class="chart-editor mt-6">
               <h5>Configuración del Gráfico</h5>
               <div class="form-group">
                 <label>Tipo de Gráfico:</label>
                 <select [(ngModel)]="selectedSection.content.chartType" (ngModelChange)="onContentChange()">
                   <option value="bar">Barras</option>
                   <option value="line">Líneas</option>
                   <option value="pie">Circular</option>
                   <option value="doughnut">Doughnut</option>
                   <option value="radar">Radar</option>
                   <option value="area">Área</option>
                 </select>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content-editor {
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

      .content-section {
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

      .content-form {
        h5 {
          font-size: 0.8rem;
          color: var(--color-primary);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-left: 3px solid var(--color-primary);
          padding-left: 10px;
        }

        .items-editor {
          .item-edit-box {
            transition: all 0.2s ease;
            &:hover {
              background: rgba(255, 255, 255, 0.08);
              border-color: var(--color-primary);
            }
          }
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;

          .form-group {
            margin-bottom: 0;
          }
        }

        .form-group {
          margin-bottom: 1.5rem;

          label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--color-text-inverse);
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          input, textarea {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--color-text-inverse);
            font-family: inherit;
            font-size: 0.9rem;
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
    }
  `]
})
export class ContentEditorComponent {
  @Input() selectedElement: any = null;
  @Input() selectedSection: any = null;
  @Output() contentChanged = new EventEmitter<void>();

  onContentChange() {
    this.contentChanged.emit();
  }

  addItem(items: any[]) {
    if (!items) return;
    
    // Create a generic item based on existing ones or a default one
    const newItem = items.length > 0 
      ? JSON.parse(JSON.stringify(items[0]))
      : { title: 'Nuevo Elemento', description: 'Descripción de ejemplo', icon: 'star' };
      
    if (newItem.id) {
       newItem.id = `item_${new Date().getTime()}`;
    }
    
    items.push(newItem);
    this.onContentChange();
  }

  removeItem(items: any[], index: number) {
    if (!items || items.length <= index) return;
    items.splice(index, 1);
    this.onContentChange();
  }
}