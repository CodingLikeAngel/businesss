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
        <section class="edit-group" *ngIf="shouldShowTextFields">
            <div class="group-title">
                <span class="dot"></span>
                <h4>Campos Principales</h4>
            </div>

            <div class="form-v2">
                <!-- Title Field -->
                <div class="input-v2" *ngIf="hasProperty('title')">
                    <label>Título principal</label>
                    <input type="text" 
                           class="text-v2" 
                           [ngModel]="targetContent.title" 
                           (ngModelChange)="updateProperty('title', $event)" 
                           placeholder="Ingresa un título impactante...">
                </div>

                <!-- Subtitle / Value Field -->
                <div class="input-v2 mt-3" *ngIf="hasProperty('subtitle') && !isAccordion">
                    <label>Subtítulo o Valor</label>
                    <input type="text" 
                           class="text-v2" 
                           [ngModel]="targetContent.subtitle" 
                           (ngModelChange)="updateProperty('subtitle', $event)" 
                           placeholder="Información secundaria...">
                </div>

                <!-- Description / Text Field -->
                <div class="input-v2 mt-3" *ngIf="hasProperty('description') || hasProperty('text')">
                    <label>Cuerpo del Mensaje</label>
                    <textarea class="textarea-v2" 
                               [ngModel]="targetDescription" 
                               (ngModelChange)="updateProperty(targetContent.description !== undefined ? 'description' : 'text', $event)" 
                               rows="4" 
                               placeholder="Escribe aquí el contenido detallado..."></textarea>
                </div>
            </div>
        </section>

        <!-- SECTION 2: ACTIONS & LINKS -->
        <section class="edit-group" *ngIf="shouldShowActions">
            <div class="group-title">
                <span class="dot"></span>
                <h4>Llamada a la Acción</h4>
            </div>
            
            <div class="grid-2">
                <div class="input-v2" *ngIf="hasProperty('label')">
                    <label>Texto del Botón</label>
                    <input type="text" class="text-v2" [ngModel]="targetContent.label" (ngModelChange)="updateProperty('label', $event)" placeholder="Ej: Comprar ahora">
                </div>
                <div class="input-v2" *ngIf="hasProperty('link')">
                    <label>URL de Destino</label>
                    <input type="text" class="text-v2" [ngModel]="targetContent.link" (ngModelChange)="updateProperty('link', $event)" placeholder="https://...">
                </div>
            </div>
        </section>

        <!-- SECTION 3: MEDIA -->
        <section class="edit-group" *ngIf="shouldShowMedia">
            <div class="group-title">
                <span class="dot"></span>
                <h4>Media & Multimedia</h4>
            </div>
            <div class="input-v2" *ngIf="hasProperty('image') || hasProperty('imageUrl')">
                <label>URL de Imagen</label>
                <div class="media-input-wrapper">
                    <input type="text" class="text-v2" [ngModel]="targetContent.image || targetContent.imageUrl" (ngModelChange)="updateProperty(hasProperty('image') ? 'image' : 'imageUrl', $event)" placeholder="https://...">
                    <div class="media-preview-v2" *ngIf="targetContent.image || targetContent.imageUrl">
                        <img [src]="targetContent.image || targetContent.imageUrl" alt="Preview">
                    </div>
                </div>
            </div>

            <div class="input-v2 mt-3" *ngIf="hasProperty('videoUrl')">
                <label>URL de Video (MP4/WebM)</label>
                <input type="text" class="text-v2" [ngModel]="targetContent.videoUrl" (ngModelChange)="updateProperty('videoUrl', $event)" placeholder="https://...mp4">
            </div>

            <div class="input-v2 mt-3" *ngIf="hasProperty('videoPoster')">
                <label>Imagen Poster (Previsualización)</label>
                <div class="media-input-wrapper">
                    <input type="text" class="text-v2" [ngModel]="targetContent.videoPoster" (ngModelChange)="updateProperty('videoPoster', $event)" placeholder="https://...">
                    <div class="media-preview-v2" *ngIf="targetContent.videoPoster">
                        <img [src]="targetContent.videoPoster" alt="Poster Preview">
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 4: ITERABLES / LIST ITEMS -->
        <section class="edit-group" *ngIf="shouldShowItems">
            <div class="group-title space-between">
                <div class="flex-row">
                    <span class="dot"></span>
                    <h4>{{ isAccordion ? 'Items del Acordeón' : 'Colección de Elementos' }}</h4>
                </div>
                <button class="add-btn-v2" (click)="addItem()">
                    <span class="plus">+</span> AÑADIR
                </button>
            </div>

            <div class="items-v2-container">
                <div *ngFor="let item of targetContent.items; let i = index" class="item-v2-card">
                    <div class="item-v2-header">
                        <span class="index">#{{ i + 1 }}</span>
                        <div class="item-actions">
                            <button class="icon-btn-v2" (click)="removeItem(i)">🗑️</button>
                        </div>
                    </div>
                    <div class="item-v2-body">
                        <!-- Generic Title -->
                        <input type="text" class="item-input-v2" [ngModel]="item.title" (ngModelChange)="updateItemProperty(i, 'title', $event)" placeholder="Título del item...">
                        
                        <!-- Description/Text -->
                        <textarea *ngIf="item.description !== undefined && !isAccordion" class="item-textarea-v2" [ngModel]="item.description" (ngModelChange)="updateItemProperty(i, 'description', $event)" rows="2" placeholder="Descripción breve..."></textarea>
                        
                        <!-- Content (Specific for Accordion) -->
                        <textarea *ngIf="isAccordion || item.content !== undefined" class="item-textarea-v2" [ngModel]="item.content" (ngModelChange)="updateItemProperty(i, 'content', $event)" rows="4" placeholder="Contenido del acordeón..."></textarea>
                    </div>
                </div>
                
                <div *ngIf="!targetContent.items || targetContent.items.length === 0" class="empty-list-v2">
                    <p>La lista está vacía. Añade tu primer elemento.</p>
                </div>
            </div>
        </section>

        <!-- HINT: No content fields for this type -->
        <section class="edit-group hint-box" *ngIf="hasNoContentFields">
            <div class="group-title">
                <span class="dot"></span>
                <h4>Edición de este bloque</h4>
            </div>
            <p class="hint-text">No hay campos de redacción aquí para este tipo. Usa el botón <strong>Editar</strong> (Modo Aislado) en la sección del lienzo para más opciones.</p>
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
        &.hint-box {
            background: rgba(99, 102, 241, 0.06);
            border: 1px solid rgba(99, 102, 241, 0.15);
            border-radius: 12px;
            padding: 1rem;
            .hint-text { margin: 0.5rem 0 0; font-size: 0.85rem; color: #94a3b8; line-height: 1.5; }
        }
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

  get targetContent() {
    // Prioritize mutable content (editing state) over original content (store state)
    // allowing immediate UI updates when modifying nested arrays like items
    return this.selectedSection?.content || this.selectedSection?._original?.content || this.selectedElement?.content || this.selectedElement?._original?.content;
  }

  get targetDescription(): string {
    const content = this.targetContent;
    if (!content) return '';
    return content.description !== undefined ? content.description : (content.text || '');
  }

  set targetDescription(val: string) {
    const content = this.targetContent;
    if (!content) return;
    if (content.description !== undefined) {
      content.description = val;
    } else {
      content.text = val;
    }
  }

  get componentType(): string {
    if (this.selectedElement) return this.selectedElement.type || 'element';
    if (this.selectedSection) return this.selectedSection.type || 'section';
    return '';
  }

  get isAccordion(): boolean {
    const type = this.componentType;
    const id = this.selectedElement?.id || this.selectedSection?.id || '';
    return type === 'accordion' || type.includes('accordion') || id.includes('accordion');
  }

  hasProperty(prop: string): boolean {
    if (!this.targetContent) return false;
    
    // Allow hiding specific fields via configuration in selection object
    const excluded = (this.selectedElement && this.selectedElement.excludedFields) || [];
    if (excluded.includes(prop)) return false;

    return this.targetContent[prop] !== undefined;
  }

  get shouldShowTextFields(): boolean {
    // Accordion shouldn't show main text fields if it doesn't have them explicitly
    if (this.isAccordion) {
        // For accordion, we typically only support Title and maybe Description. Subtitle is not standard.
        // We ensure we check if 'title' exists, but we can be strict about hiding subtitle.
        return this.hasProperty('title') || this.hasProperty('text') || this.hasProperty('description');
    }
    
    return this.hasProperty('title') || 
           this.hasProperty('subtitle') || 
           this.hasProperty('description') || 
           this.hasProperty('text');
  }

  get shouldShowActions(): boolean {
    if (this.isAccordion) return false;
    return this.hasProperty('label') || this.hasProperty('link') || this.hasProperty('cta');
  }

  get shouldShowMedia(): boolean {
    if (this.isAccordion) return false;
    return this.hasProperty('image') || 
           this.hasProperty('imageUrl') || 
           this.hasProperty('icon') || 
           this.hasProperty('videoUrl') || 
           this.hasProperty('videoPoster');
  }

  get shouldShowItems(): boolean {
    // Always show items for accordion, even if empty
    if (this.isAccordion) return true;
    // Otherwise check if items array exists
    return this.targetContent && Array.isArray(this.targetContent.items);
  }

  /** True when selection has no content fields shown in this panel; show hint to use isolated mode. */
  get hasNoContentFields(): boolean {
    if (!this.selectedSection && !this.selectedElement) return false;
    const hasChart = this.selectedSection?.type === 'chart';
    return !this.shouldShowTextFields && !this.shouldShowActions && !this.shouldShowMedia && !this.shouldShowItems && !hasChart;
  }

  // HELPER TO UPDATE ANY PROPERTY SAFELY
  updateProperty(key: string, value: any) {
    if (!this.targetContent) return;

    // Clone the entire content object to break immutability
    const newContent = { ...this.targetContent };
    
    // Update the specific key
    newContent[key] = value;
    
    // Push the update back to the main state holder
    this.pushContentUpdate(newContent);
  }

  // HELPER TO UPDATE NESTED ITEMS SAFELY
  updateItemProperty(index: number, key: string, value: any) {
    if (!this.targetContent?.items) return;

    // Clone items array and the specific item
    const newItems = [...this.targetContent.items];
    newItems[index] = { ...newItems[index], [key]: value };
    
    // Update content with new items array
    const newContent = { ...this.targetContent, items: newItems };
    
    this.pushContentUpdate(newContent);
  }

  // CORE UPDATE LOGIC
  private pushContentUpdate(newContent: any) {
    if (this.selectedSection) {
        this.selectedSection.content = newContent;
    } else if (this.selectedElement) {
        this.selectedElement.content = newContent;
    }
    
    // Emit notification to parent components
    this.onContentChange();
  }

  onContentChange() {
    this.emitContentUpdate();
  }

  private emitContentUpdate() {
    this.contentChanged.emit();
  }

  addItem() {
    const currentItems = this.targetContent?.items ? [...this.targetContent.items] : [];
    
    let newItem;
    if (currentItems.length > 0) {
      newItem = JSON.parse(JSON.stringify(currentItems[0]));
      if (typeof newItem.title === 'string') newItem.title = 'Nuevo Elemento';
      if (typeof newItem.description === 'string') newItem.description = 'Descripción...';
      if (typeof newItem.content === 'string') newItem.content = 'Contenido...';
    } else {
      if (this.isAccordion) {
        newItem = { title: 'Nuevo Item', content: 'Contenido del acordeón...' };
      } else {
        newItem = { title: 'Nuevo Elemento', description: 'Descripción de ejemplo', icon: 'star' };
      }
    }

    if (newItem.id) newItem.id = `item_${new Date().getTime()}`;
    
    currentItems.push(newItem);
    
    // Clone content and assign new items
    const newContent = { ...(this.targetContent || {}), items: currentItems };
    this.pushContentUpdate(newContent);
  }

  removeItem(index: number) {
    if (!this.targetContent?.items) return;
    
    const currentItems = [...this.targetContent.items];
    if (currentItems.length <= index) return;
    
    currentItems.splice(index, 1);
    
    const newContent = { ...this.targetContent, items: currentItems };
    this.pushContentUpdate(newContent);
  }
}
