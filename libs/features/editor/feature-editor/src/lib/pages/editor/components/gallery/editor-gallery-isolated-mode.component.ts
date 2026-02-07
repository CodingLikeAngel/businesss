import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIGallerySectionComponent } from '@negocio/featured-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-gallery-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIGallerySectionComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🖼️ GALLERY EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">GALERÍA MULTIMEDIA PRO</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <div class="sidebar-tabs">
                <button [class.active]="activeTab === 'media'" (click)="activeTab = 'media'">MEDIA</button>
                <button [class.active]="activeTab === 'layout'" (click)="activeTab = 'layout'">LAYOUT</button>
              </div>

              <!-- MEDIA SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'media'">
                <div class="section-header">
                  <span class="section-icon">📷</span>
                  <h4>IMÁGENES / VIDEOS</h4>
                </div>
                
                <div class="media-grid">
                  <div *ngFor="let item of editableItems; let i = index" 
                       class="media-item-card" 
                       [class.active]="selectedIndex === i"
                       (click)="selectedIndex = i">
                    <img [src]="item.src" class="media-thumb">
                    <div class="media-info">
                       <span class="media-title">{{ item.title || 'Sin Título' }}</span>
                       <button (click)="removeItem(i, $event)" class="delete-btn">✕</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="editableItems[selectedIndex]" class="item-editor-panel animate-fade-in mt-6">
                   <div class="control-group">
                      <label>URL de Imagen</label>
                      <input type="text" [(ngModel)]="editableItems[selectedIndex].src" (ngModelChange)="onPartialChange()" class="premium-input-mini">
                   </div>
                   <div class="control-group">
                      <label>Título (Hover)</label>
                      <input type="text" [(ngModel)]="editableItems[selectedIndex].title" (ngModelChange)="onPartialChange()" class="premium-input-mini">
                   </div>
                   <div class="control-group">
                      <label>Descripción</label>
                      <textarea [(ngModel)]="editableItems[selectedIndex].description" (ngModelChange)="onPartialChange()" class="premium-input-mini h-16"></textarea>
                   </div>
                </div>

                <button (click)="addItem()" class="add-btn-mini mt-4">+ Añadir Multimedia</button>
              </div>

              <!-- LAYOUT SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'layout'">
                <div class="section-header">
                  <span class="section-icon">🧩</span>
                  <h4>GRID & DISEÑO</h4>
                </div>
                
                <div class="control-group">
                  <label>Columnas (Grid)</label>
                  <input type="range" min="1" max="6" [(ngModel)]="editableContent.columns" class="w-full">
                  <div class="text-right text-[10px] text-white/50">{{ editableContent.columns }} columnas</div>
                </div>

                <div class="control-group">
                  <label>Espaciado (Gap)</label>
                  <input type="range" min="0" max="100" step="5" [(ngModel)]="editableContent.gap" class="w-full">
                  <div class="text-right text-[10px] text-white/50">{{ editableContent.gap }}px</div>
                </div>

                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" class="premium-input">
                    <option value="grid">Grid Estándar</option>
                    <option value="masonry">Masonry (Dinámico)</option>
                    <option value="slider">Carrusel (Slider)</option>
                    <option value="justified">Justificado</option>
                  </select>
                </div>

                <div class="control-group">
                   <label class="checkbox-label">
                      <input type="checkbox" [(ngModel)]="editableContent.lightbox"> Activar Lightbox (Zoom)
                   </label>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas area -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
               <div class="draggable-wrapper"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y">
                
                  <lib-ui-gallery-section
                    [galleryConfig]="getGalleryConfig()"
                  ></lib-ui-gallery-section>

               </div>
            </div>

            <div class="modern-position-dock">
               <div class="dock-item"><span class="label">COLS</span><span class="value text-indigo-400">{{ editableContent.columns }}</span></div>
               <div class="dock-divider"></div>
               <div class="dock-item"><span class="label">ITEMS</span><span class="value text-blue-400">{{ editableItems.length }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Galería Pro: Crea experiencias visuales inmersivas en segundos.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Confirmar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.95); backdrop-filter: blur(12px); z-index: 9999999; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .isolated-mode-container { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
    .isolated-mode-header { height: 64px; padding: 0 1.5rem; background: #1e293b; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; }
    .mode-badge { font-size: 10px; font-weight: 800; color: #8b5cf6; background: rgba(139, 92, 246, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(139, 92, 246, 0.2); }
    .component-name { color: white; font-size: 13px; font-weight: 600; margin-left: 8px; letter-spacing: 0.5px; }
    .close-main-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .close-main-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }

    .isolated-mode-body {
      flex: 1;
      display: flex;
      flex-direction: row; /* Explicit row */
      overflow: hidden;
    }

    .controls-sidebar {
      width: 380px;
      min-width: 380px; /* Safety */
      flex-shrink: 0; /* Prevent shrinking */
      background: #020617;
      border-right: 1px solid rgba(255,255,255,0.1);
      overflow-y: auto;
    }

    .sidebar-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; }
    .sidebar-tabs button { flex: 1; padding: 1rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .sidebar-tabs button.active { color: #8b5cf6; border-bottom-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); }

    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; }
    .section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    
    .media-grid { display: grid; grid-cols: 2; gap: 8px; }
    .media-item-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
    .media-item-card:hover { border-color: #8b5cf6; }
    .media-item-card.active { border-color: #8b5cf6; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
    .media-thumb { width: 100%; height: 80px; object-fit: cover; }
    .media-info { padding: 6px; display: flex; justify-content: space-between; align-items: center; }
    .media-title { font-size: 9px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }

    .item-editor-panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 12px; }

    .control-group { margin-bottom: 1rem; }
    .control-group label { display: block; font-size: 10px; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; font-weight: 700; }
    
    .premium-input { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 11px; }

    .delete-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 20px; height: 20px; border-radius: 6px; cursor: pointer; font-size: 10px; }
    .add-btn-mini { width: 100%; background: transparent; border: 1px dashed rgba(139, 92, 246, 0.4); color: #8b5cf6; padding: 10px; border-radius: 12px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
    .add-btn-mini:hover { background: rgba(139, 92, 246, 0.1); }

    .checkbox-label { display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 11px; cursor: pointer; }

    .isolated-canvas { flex: 1; background: #0f172a; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 30px 30px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; padding: 40px; }
    .draggable-wrapper { position: relative; width: 100%; max-width: 900px; max-height: 80vh; overflow-y: auto; padding: 10px; border: 1.5px dashed #8b5cf6; border-radius: 12px; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1.5rem; color: white; font-size: 11px; }
    .dock-divider { width: 1px; background: rgba(255,255,255,0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.6rem; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #8b5cf6; color: #fff; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }

    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EditorGalleryIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  activeTab: 'media' | 'layout' = 'media';
  selectedIndex = 0;
  
  editableContent: any = {};
  editableItems: any[] = [];
  
  currentPosition = { x: 0, y: 0 };

  ngOnInit() {
    this.editableContent = { 
        ...this.config.content,
        columns: this.config.content.columns || 3,
        gap: this.config.content.gap || 20,
        variant: this.config.content.variant || 'grid',
        lightbox: this.config.content.lightbox !== false
    };
    this.editableItems = [...(this.config.content['items'] || [])];
    this.currentPosition = { ...this.config.position };
  }

  ngOnDestroy() {}

  addItem() {
    this.editableItems.push({
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      title: 'Nueva Imagen',
      description: 'Hermoso paisaje natural'
    });
    this.selectedIndex = this.editableItems.length - 1;
  }

  removeItem(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedIndex >= this.editableItems.length) {
      this.selectedIndex = Math.max(0, this.editableItems.length - 1);
    }
  }

  getGalleryConfig() {
    return {
      images: this.editableItems,
      ...this.editableContent
    };
  }

  onPartialChange() {}
  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }
  onOverlayClick(e: Event) { this.closed.emit(); }

  apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.editableContent, 
        items: this.editableItems
      },
      position: { ...this.currentPosition }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close();
  }
}
