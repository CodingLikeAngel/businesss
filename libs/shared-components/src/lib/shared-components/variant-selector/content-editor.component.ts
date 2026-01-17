import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-content-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="content-editor-v2">
      <!-- Header -->
      <header class="editor-header">
        <div class="header-main">
          <h2>Redacción & Contenido</h2>
          <span class="badge" *ngIf="selectedSection || selectedElement">
            {{ selectedSection ? 'SECCIÓN' : 'ELEMENTO' }}
          </span>
        </div>
        <p class="subtitle">Gestiona los textos y activos multimedia de tu página.</p>
      </header>

      <!-- No Selection State -->
      <div *ngIf="!selectedElement && !selectedSection" class="empty-state">
        <div class="glow-icon">📝</div>
        <h3>Laboratorio de Ideas</h3>
        <p>Selecciona un bloque en el lienzo para empezar a escribir su historia.</p>
      </div>

      <!-- Editor Content -->
      <div class="editor-body" *ngIf="selectedSection || selectedElement">
        
        <!-- SECTION 1: TEXT FIELDS -->
        <section class="edit-group">
            <div class="group-title">
                <span class="dot"></span>
                <h4>Campos Principales</h4>
            </div>

            <div class="form-v2">
                <!-- Title Field -->
                <div class="input-v2" *ngIf="(selectedSection?.content?.title !== undefined) || (selectedElement?.content?.title !== undefined)">
                    <label>Título principal</label>
                    <input type="text" 
                           class="text-v2" 
                           [(ngModel)]="selectedSection ? selectedSection.content.title : selectedElement.content.title" 
                           (ngModelChange)="onContentChange()" 
                           placeholder="Ingresa un título impactante...">
                </div>

                <!-- Subtitle / Value Field -->
                <div class="input-v2 mt-3" *ngIf="(selectedSection?.content?.subtitle !== undefined) || (selectedElement?.content?.subtitle !== undefined)">
                    <label>Subtítulo o Valor</label>
                    <input type="text" 
                           class="text-v2" 
                           [(ngModel)]="selectedSection ? selectedSection.content.subtitle : selectedElement.content.subtitle" 
                           (ngModelChange)="onContentChange()" 
                           placeholder="Información secundaria...">
                </div>

                <!-- Description / Text Field -->
                <div class="input-v2 mt-3" *ngIf="(selectedSection?.content?.description !== undefined) || (selectedElement?.content?.description !== undefined) || (selectedSection?.content?.text !== undefined) || (selectedElement?.content?.text !== undefined)">
                    <label>Cuerpo del Mensaje</label>
                    <textarea class="textarea-v2" 
                              [(ngModel)]="selectedSection ? (selectedSection.content.description || selectedSection.content.text) : (selectedElement.content.description || selectedElement.content.text)" 
                              (ngModelChange)="onContentChange()" 
                              rows="4" 
                              placeholder="Escribe aquí el contenido detallado..."></textarea>
                </div>
            </div>
        </section>

        <!-- SECTION 2: ACTIONS & LINKS -->
        <section class="edit-group" *ngIf="(selectedSection?.content?.label !== undefined) || (selectedElement?.content?.label !== undefined) || (selectedSection?.content?.link !== undefined) || (selectedElement?.content?.link !== undefined)">
            <div class="group-title">
                <span class="dot"></span>
                <h4>Llamada a la Acción</h4>
            </div>
            
            <div class="grid-2">
                <div class="input-v2">
                    <label>Texto del Botón</label>
                    <input type="text" class="text-v2" [(ngModel)]="selectedSection ? selectedSection.content.label : selectedElement.content.label" (ngModelChange)="onContentChange()" placeholder="Ej: Comprar ahora">
                </div>
                <div class="input-v2">
                    <label>URL de Destino</label>
                    <input type="text" class="text-v2" [(ngModel)]="selectedSection ? selectedSection.content.link : selectedElement.content.link" (ngModelChange)="onContentChange()" placeholder="https://...">
                </div>
            </div>
        </section>

        <!-- SECTION 3: MEDIA -->
        <section class="edit-group" *ngIf="(selectedSection?.content?.image !== undefined) || (selectedElement?.content?.image !== undefined)">
            <div class="group-title">
                <span class="dot"></span>
                <h4>Media & Multimedia</h4>
            </div>
            <div class="input-v2">
                <label>URL de Imagen o Recurso</label>
                <div class="media-input-wrapper">
                    <input type="text" class="text-v2" [(ngModel)]="selectedSection ? selectedSection.content.image : selectedElement.content.image" (ngModelChange)="onContentChange()" placeholder="https://...">
                    <div class="media-preview-v2" *ngIf="selectedSection ? selectedSection.content.image : selectedElement.content.image">
                        <img [src]="selectedSection ? selectedSection.content.image : selectedElement.content.image" alt="Preview">
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 4: ITERABLES / LIST ITEMS -->
        <section class="edit-group" *ngIf="selectedSection?.content?.items?.length !== undefined">
            <div class="group-title space-between">
                <div class="flex-row">
                    <span class="dot"></span>
                    <h4>Colección de Elementos</h4>
                </div>
                <button class="add-btn-v2" (click)="addItem(selectedSection.content.items)">
                    <span class="plus">+</span> AÑADIR
                </button>
            </div>

            <div class="items-v2-container">
                <div *ngFor="let item of selectedSection.content.items; let i = index" class="item-v2-card">
                    <div class="item-v2-header">
                        <span class="index">#{{ i + 1 }}</span>
                        <div class="item-actions">
                            <button class="icon-btn-v2" (click)="removeItem(selectedSection.content.items, i)">🗑️</button>
                        </div>
                    </div>
                    <div class="item-v2-body">
                        <input type="text" class="item-input-v2" [(ngModel)]="item.title" (ngModelChange)="onContentChange()" placeholder="Título del item...">
                        <textarea class="item-textarea-v2" [(ngModel)]="item.description" (ngModelChange)="onContentChange()" rows="2" placeholder="Descripción breve..."></textarea>
                    </div>
                </div>
                
                <div *ngIf="selectedSection.content.items?.length === 0" class="empty-list-v2">
                    <p>La lista está vacía. Añade tu primer elemento.</p>
                </div>
            </div>
        </section>

        <!-- SECTION 5: SPECIAL (CHART) -->
        <section class="edit-group" *ngIf="selectedSection?.type === 'chart'">
            <div class="group-title">
                <span class="dot"></span>
                <h4>Configuración de Gráficos</h4>
            </div>
            <div class="input-v2">
                <label>Tipo de Visualización</label>
                <select class="select-v2" [(ngModel)]="selectedSection.content.chartType" (ngModelChange)="onContentChange()">
                    <option value="bar">Gráfico de Barras</option>
                    <option value="line">Gráfico de Líneas</option>
                    <option value="pie">Gráfico Circular</option>
                    <option value="doughnut">Tipo Dona</option>
                    <option value="radar">Gráfico de Radar</option>
                    <option value="area">Gráfico de Área</option>
                </select>
            </div>
        </section>

      </div>
    </div>
  `,
  styles: [`
    .content-editor-v2 {
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
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
      }
      .subtitle { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0; line-height: 1.4; }
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
        text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
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
            &.space-between { justify-content: space-between; }
            .flex-row { display: flex; align-items: center; gap: 0.5rem; }
            .dot { width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 8px #3b82f6; }
            h4 { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin: 0; letter-spacing: 0.05em; }
        }
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

    .input-v2 {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        label { font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .text-v2, .select-v2, .textarea-v2 {
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 0.6rem 0.75rem;
            color: white;
            font-size: 0.85rem;
            outline: none;
            width: 100%;
            transition: all 0.2s;
            &:focus { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
        }
        .textarea-v2 { resize: vertical; min-height: 80px; }
    }

    .media-input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        .media-preview-v2 {
            height: 120px;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: #000;
            img { width: 100%; height: 100%; object-fit: cover; }
        }
    }

    .add-btn-v2 {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        border: 1px solid rgba(59, 130, 246, 0.2);
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 0.65rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
        &:hover { background: rgba(59, 130, 246, 0.2); transform: translateY(-1px); }
    }

    .items-v2-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .item-v2-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 0.75rem;
        transition: all 0.2s;
        &:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.1); }
        
        .item-v2-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
            .index { font-size: 0.6rem; font-weight: 800; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 2px 6px; border-radius: 4px; }
            .icon-btn-v2 { background: none; border: none; font-size: 0.8rem; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; &:hover { opacity: 1; } }
        }

        .item-v2-body {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            .item-input-v2 {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                padding: 0.4rem 0.6rem;
                color: white;
                font-size: 0.8rem;
                font-weight: 600;
                outline: none;
                &:focus { border-color: #3b82f6; }
            }
            .item-textarea-v2 {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                padding: 0.4rem 0.6rem;
                color: #94a3b8;
                font-size: 0.75rem;
                outline: none;
                resize: none;
                &:focus { border-color: #3b82f6; color: white; }
            }
        }
    }

    .empty-list-v2 {
        text-align: center;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.01);
        border: 1px dashed rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        p { font-size: 0.75rem; color: #475569; margin: 0; }
    }

    .mt-3 { margin-top: 0.75rem; }
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