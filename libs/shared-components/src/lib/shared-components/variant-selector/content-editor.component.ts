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
}