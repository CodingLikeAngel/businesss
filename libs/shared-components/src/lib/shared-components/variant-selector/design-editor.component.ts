import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ALL_VARIANTS, getEditableProperties, detectComponentType, VariantCategory } from './variant-registry';

interface PropertyGroup {
  name: string;
  properties: PropertyConfig[];
}

interface PropertyConfig {
  key: string;
  label: string;
  type: 'color' | 'text' | 'number' | 'select' | 'range';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  unit?: string;
}

@Component({
  selector: 'lib-design-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="design-editor-v3">
      <!-- Header -->
      <header class="editor-header">
        <div class="header-main">
          <h2>🎨 Diseño Avanzado</h2>
          <span class="badge" *ngIf="selectedSection || selectedElement">
            {{ selectedSection ? 'SECCIÓN' : componentType.toUpperCase() }}
          </span>
        </div>
        <p class="subtitle">Personalización completa con control total de propiedades</p>
      </header>

      <!-- No Selection State -->
      <div *ngIf="!selectedElement && !selectedSection" class="empty-state">
        <div class="glow-icon">🎨</div>
        <h3>Sin selección</h3>
        <p>Selecciona un elemento o sección para comenzar a editar</p>
      </div>

      <!-- Editor Content -->
      <div class="editor-body" *ngIf="selectedSection || selectedElement">
        
        <!-- VARIANT SELECTOR CON DROPDOWN COMPLETO -->
        <section class="edit-group variant-section">
          <div class="group-title">
            <span class="dot"></span>
            <h4>Variante Predefinida</h4>
          </div>
          
          <!-- Dropdown de variantes -->
          <div class="variant-dropdown-wrapper">
            <select 
              class="variant-select" 
              [ngModel]="currentVariant" 
              (ngModelChange)="applyVariant($event)"
            >
              <option value="">-- Seleccionar Variante --</option>
              <optgroup *ngFor="let category of variantCategories" [label]="category">
                <option 
                  *ngFor="let variant of getVariantsByCategory(category)" 
                  [value]="variant.id"
                >
                  {{ variant.name }}
                </option>
              </optgroup>
            </select>
          </div>

          <!-- Grid de variantes rápidas (favoritas) -->
          <div class="variants-quick-grid">
            <button
              *ngFor="let variant of quickVariants"
              class="v2-chip"
              [class.active]="currentVariant === variant.id"
              (click)="applyVariant(variant.id)"
              [title]="variant.name"
            >
              <span class="v2-indicator"></span>
              {{ variant.name }}
            </button>
          </div>
        </section>

        <!-- PROPIEDADES ESPECÍFICAS DEL COMPONENTE -->
        <div class="properties-container" *ngIf="targetStyles">
          
          <!-- Colores -->
          <div class="property-group">
            <div class="group-header" (click)="toggleGroup('colors')">
              <span class="icon">🎨</span>
              <h4>Colores</h4>
              <span class="toggle-icon">{{ groupStates['colors'] ? '▼' : '▶' }}</span>
            </div>
            <div class="group-content" *ngIf="groupStates['colors']">
              <div class="color-grid">
                <div class="color-input-group">
                  <label>Fondo</label>
                  <div class="color-picker-enhanced">
                    <input 
                      type="color" 
                      [ngModel]="getStyleValue('backgroundColor') || '#000000'" 
                      (ngModelChange)="updateStyle('backgroundColor', $event)"
                    >
                    <input 
                      type="text" 
                      class="color-hex-input"
                      [ngModel]="getStyleValue('backgroundColor') || '#000000'" 
                      (ngModelChange)="updateStyle('backgroundColor', $event)"
                      placeholder="#000000"
                    >
                  </div>
                </div>

                <div class="color-input-group">
                  <label>Texto</label>
                  <div class="color-picker-enhanced">
                    <input 
                      type="color" 
                      [ngModel]="getStyleValue('color') || '#ffffff'" 
                      (ngModelChange)="updateStyle('color', $event)"
                    >
                    <input 
                      type="text" 
                      class="color-hex-input"
                      [ngModel]="getStyleValue('color') || '#ffffff'" 
                      (ngModelChange)="updateStyle('color', $event)"
                      placeholder="#ffffff"
                    >
                  </div>
                </div>

                <div class="color-input-group" *ngIf="hasProperty('borderColor')">
                  <label>Borde</label>
                  <div class="color-picker-enhanced">
                    <input 
                      type="color" 
                      [ngModel]="getStyleValue('borderColor') || '#cccccc'" 
                      (ngModelChange)="updateStyle('borderColor', $event)"
                    >
                    <input 
                      type="text" 
                      class="color-hex-input"
                      [ngModel]="getStyleValue('borderColor') || '#cccccc'" 
                      (ngModelChange)="updateStyle('borderColor', $event)"
                      placeholder="#cccccc"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Efectos Visuales -->
          <div class="property-group" *ngIf="hasProperty('backdropFilter') || hasProperty('boxShadow')">
            <div class="group-header" (click)="toggleGroup('effects')">
              <span class="icon">✨</span>
              <h4>Efectos Visuales</h4>
              <span class="toggle-icon">{{ groupStates['effects'] ? '▼' : '▶' }}</span>
            </div>
            <div class="group-content" *ngIf="groupStates['effects']">
              <div class="property-item" *ngIf="hasProperty('backdropFilter')">
                <label>Desenfoque (Blur)</label>
                <input 
                  type="text" 
                  class="text-input"
                  [ngModel]="getStyleValue('backdropFilter')" 
                  (ngModelChange)="updateStyle('backdropFilter', $event)"
                  placeholder="blur(10px)"
                >
              </div>

              <div class="property-item" *ngIf="hasProperty('boxShadow')">
                <label>Sombra</label>
                <input 
                  type="text" 
                  class="text-input"
                  [ngModel]="getStyleValue('boxShadow')" 
                  (ngModelChange)="updateStyle('boxShadow', $event)"
                  placeholder="0 4px 6px rgba(0,0,0,0.1)"
                >
              </div>

              <div class="property-item" *ngIf="hasProperty('opacity')">
                <label>Opacidad</label>
                <div class="range-input-group">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    [ngModel]="getStyleValue('opacity') || 1" 
                    (ngModelChange)="updateStyle('opacity', $event)"
                  >
                  <span class="range-value">{{ getStyleValue('opacity') || 1 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tipografía -->
          <div class="property-group" *ngIf="hasProperty('fontSize') || hasProperty('fontWeight')">
            <div class="group-header" (click)="toggleGroup('typography')">
              <span class="icon">📝</span>
              <h4>Tipografía</h4>
              <span class="toggle-icon">{{ groupStates['typography'] ? '▼' : '▶' }}</span>
            </div>
            <div class="group-content" *ngIf="groupStates['typography']">
              <div class="grid-2">
                <div class="property-item" *ngIf="hasProperty('fontSize')">
                  <label>Tamaño</label>
                  <input 
                    type="text" 
                    class="text-input"
                    [ngModel]="getStyleValue('fontSize')" 
                    (ngModelChange)="updateStyle('fontSize', $event)"
                    placeholder="16px"
                  >
                </div>

                <div class="property-item" *ngIf="hasProperty('fontWeight')">
                  <label>Peso</label>
                  <select 
                    class="select-input"
                    [ngModel]="getStyleValue('fontWeight')" 
                    (ngModelChange)="updateStyle('fontWeight', $event)"
                  >
                    <option value="300">Fino</option>
                    <option value="normal">Normal</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                    <option value="900">Black</option>
                  </select>
                </div>
              </div>

              <div class="property-item" *ngIf="hasProperty('textTransform')">
                <label>Transformación</label>
                <select 
                  class="select-input"
                  [ngModel]="getStyleValue('textTransform')" 
                  (ngModelChange)="updateStyle('textTransform', $event)"
                >
                  <option value="none">Ninguna</option>
                  <option value="uppercase">MAYÚSCULAS</option>
                  <option value="lowercase">minúsculas</option>
                  <option value="capitalize">Capitalizar</option>
                </select>
              </div>

              <div class="property-item" *ngIf="hasProperty('letterSpacing')">
                <label>Espaciado de Letras</label>
                <input 
                  type="text" 
                  class="text-input"
                  [ngModel]="getStyleValue('letterSpacing')" 
                  (ngModelChange)="updateStyle('letterSpacing', $event)"
                  placeholder="normal"
                >
              </div>
            </div>
          </div>

          <!-- Espaciado y Layout -->
          <div class="property-group">
            <div class="group-header" (click)="toggleGroup('spacing')">
              <span class="icon">📐</span>
              <h4>Espaciado & Layout</h4>
              <span class="toggle-icon">{{ groupStates['spacing'] ? '▼' : '▶' }}</span>
            </div>
            <div class="group-content" *ngIf="groupStates['spacing']">
              <div class="grid-2">
                <div class="property-item" *ngIf="hasProperty('padding')">
                  <label>Padding</label>
                  <input 
                    type="text" 
                    class="text-input"
                    [ngModel]="getStyleValue('padding')" 
                    (ngModelChange)="updateStyle('padding', $event)"
                    placeholder="1rem"
                  >
                </div>

                <div class="property-item" *ngIf="hasProperty('margin')">
                  <label>Margin</label>
                  <input 
                    type="text" 
                    class="text-input"
                    [ngModel]="getStyleValue('margin')" 
                    (ngModelChange)="updateStyle('margin', $event)"
                    placeholder="0"
                  >
                </div>
              </div>

              <div class="grid-2">
                <div class="property-item" *ngIf="hasProperty('width')">
                  <label>Ancho</label>
                  <input 
                    type="text" 
                    class="text-input"
                    [ngModel]="getStyleValue('width')" 
                    (ngModelChange)="updateStyle('width', $event)"
                    placeholder="auto"
                  >
                </div>

                <div class="property-item" *ngIf="hasProperty('height')">
                  <label>Alto</label>
                  <input 
                    type="text" 
                    class="text-input"
                    [ngModel]="getStyleValue('height')" 
                    (ngModelChange)="updateStyle('height', $event)"
                    placeholder="auto"
                  >
                </div>
              </div>

              <div class="grid-2" *ngIf="hasProperty('minHeight') || hasProperty('minWidth')">
                <div class="property-item" *ngIf="hasProperty('minWidth')">
                  <label>Ancho Mínimo</label>
                  <input 
                    type="text" 
                    class="text-input"
                    [ngModel]="getStyleValue('minWidth')" 
                    (ngModelChange)="updateStyle('minWidth', $event)"
                    placeholder="auto"
                  >
                </div>

                <div class="property-item" *ngIf="hasProperty('minHeight')">
                  <label>Alto Mínimo</label>
                  <input 
                    type="text" 
                    class="text-input"
                    [ngModel]="getStyleValue('minHeight')" 
                    (ngModelChange)="updateStyle('minHeight', $event)"
                    placeholder="auto"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Bordes -->
          <div class="property-group" *ngIf="hasProperty('border') || hasProperty('borderRadius')">
            <div class="group-header" (click)="toggleGroup('borders')">
              <span class="icon">⬜</span>
              <h4>Bordes</h4>
              <span class="toggle-icon">{{ groupStates['borders'] ? '▼' : '▶' }}</span>
            </div>
            <div class="group-content" *ngIf="groupStates['borders']">
              <div class="property-item" *ngIf="hasProperty('border')">
                <label>Borde</label>
                <input 
                  type="text" 
                  class="text-input"
                  [ngModel]="getStyleValue('border')" 
                  (ngModelChange)="updateStyle('border', $event)"
                  placeholder="1px solid #ccc"
                >
              </div>

              <div class="property-item" *ngIf="hasProperty('borderRadius')">
                <label>Redondeado</label>
                <input 
                  type="text" 
                  class="text-input"
                  [ngModel]="getStyleValue('borderRadius')" 
                  (ngModelChange)="updateStyle('borderRadius', $event)"
                  placeholder="8px"
                >
              </div>
            </div>
          </div>

          <!-- Fondo (Background) -->
          <div class="property-group" *ngIf="hasProperty('backgroundImage')">
            <div class="group-header" (click)="toggleGroup('background')">
              <span class="icon">🖼️</span>
              <h4>Fondo</h4>
              <span class="toggle-icon">{{ groupStates['background'] ? '▼' : '▶' }}</span>
            </div>
            <div class="group-content" *ngIf="groupStates['background']">
              <div class="property-item">
                <label>Imagen de Fondo (URL)</label>
                <input 
                  type="text" 
                  class="text-input"
                  [ngModel]="getStyleValue('backgroundImage')" 
                  (ngModelChange)="updateStyle('backgroundImage', $event)"
                  placeholder="url('...')"
                >
              </div>

              <div class="grid-2" *ngIf="hasProperty('backgroundSize')">
                <div class="property-item">
                  <label>Tamaño</label>
                  <select 
                    class="select-input"
                    [ngModel]="getStyleValue('backgroundSize')" 
                    (ngModelChange)="updateStyle('backgroundSize', $event)"
                  >
                    <option value="cover">Cubrir</option>
                    <option value="contain">Contener</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div class="property-item" *ngIf="hasProperty('backgroundPosition')">
                  <label>Posición</label>
                  <select 
                    class="select-input"
                    [ngModel]="getStyleValue('backgroundPosition')" 
                    (ngModelChange)="updateStyle('backgroundPosition', $event)"
                  >
                    <option value="center">Centro</option>
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Flexbox (si aplica) -->
          <div class="property-group" *ngIf="hasProperty('display') && isFlexContainer()">
            <div class="group-header" (click)="toggleGroup('flexbox')">
              <span class="icon">📦</span>
              <h4>Flexbox</h4>
              <span class="toggle-icon">{{ groupStates['flexbox'] ? '▼' : '▶' }}</span>
            </div>
            <div class="group-content" *ngIf="groupStates['flexbox']">
              <div class="grid-2">
                <div class="property-item" *ngIf="hasProperty('flexDirection')">
                  <label>Dirección</label>
                  <select 
                    class="select-input"
                    [ngModel]="getStyleValue('flexDirection')" 
                    (ngModelChange)="updateStyle('flexDirection', $event)"
                  >
                    <option value="row">Fila</option>
                    <option value="column">Columna</option>
                    <option value="row-reverse">Fila Inversa</option>
                    <option value="column-reverse">Columna Inversa</option>
                  </select>
                </div>

                <div class="property-item" *ngIf="hasProperty('justifyContent')">
                  <label>Justificar</label>
                  <select 
                    class="select-input"
                    [ngModel]="getStyleValue('justifyContent')" 
                    (ngModelChange)="updateStyle('justifyContent', $event)"
                  >
                    <option value="flex-start">Inicio</option>
                    <option value="center">Centro</option>
                    <option value="flex-end">Final</option>
                    <option value="space-between">Espaciado Entre</option>
                    <option value="space-around">Espaciado Alrededor</option>
                  </select>
                </div>
              </div>

              <div class="grid-2">
                <div class="property-item" *ngIf="hasProperty('alignItems')">
                  <label>Alinear</label>
                  <select 
                    class="select-input"
                    [ngModel]="getStyleValue('alignItems')" 
                    (ngModelChange)="updateStyle('alignItems', $event)"
                  >
                    <option value="flex-start">Inicio</option>
                    <option value="center">Centro</option>
                    <option value="flex-end">Final</option>
                    <option value="stretch">Estirar</option>
                  </select>
                </div>

                <div class="property-item" *ngIf="hasProperty('gap')">
                  <label>Espacio</label>
                  <input 
                    type="text" 
                    class="text-input"
                    [ngModel]="getStyleValue('gap')" 
                    (ngModelChange)="updateStyle('gap', $event)"
                    placeholder="1rem"
                  >
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Botón de Reset -->
        <div class="editor-actions">
          <button class="btn-reset" (click)="resetStyles()">
            🔄 Restablecer Estilos
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .design-editor-v3 {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-bottom: 2rem;
      color: white;
    }

    .editor-header {
      .header-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      h2 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .badge {
        background: rgba(102, 126, 234, 0.2);
        color: #a5b4fc;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      .subtitle {
        font-size: 0.85rem;
        color: rgba(255,255,255,0.6);
        margin: 0;
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      .glow-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
      }
      h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: white;
      }
      p {
        color: rgba(255,255,255,0.6);
        font-size: 0.9rem;
      }
    }

    .editor-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .edit-group {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 1.25rem;
      
      .group-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        
        .dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
        }
        h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0;
          color: white;
        }
      }
    }

    .variant-dropdown-wrapper {
      margin-bottom: 1rem;
    }

    .variant-select {
      width: 100%;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 0.75rem;
      color: white;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(102, 126, 234, 0.5);
        background: rgba(0,0,0,0.4);
      }

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      option, optgroup {
        background: #1a1a2e;
        color: white;
      }
    }

    .variants-quick-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.5rem;
    }

    .v2-chip {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
      color: rgba(255,255,255,0.7);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;

      .v2-indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transition: all 0.3s ease;
      }

      &:hover {
        background: rgba(255,255,255,0.08);
        border-color: rgba(102, 126, 234, 0.5);
        color: white;
        transform: translateY(-2px);
      }

      &.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
        border-color: #667eea;
        color: white;
        
        .v2-indicator {
          background: #667eea;
          box-shadow: 0 0 10px #667eea;
        }
      }
    }

    .properties-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .property-group {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(255,255,255,0.1);
      }
    }

    .group-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255,255,255,0.03);
      }

      .icon {
        font-size: 1.2rem;
      }

      h4 {
        flex: 1;
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0;
        color: white;
      }

      .toggle-icon {
        color: rgba(255,255,255,0.4);
        font-size: 0.8rem;
        transition: transform 0.3s ease;
      }
    }

    .group-content {
      padding: 0 1rem 1rem 1rem;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .property-item {
      margin-bottom: 0.75rem;

      &:last-child {
        margin-bottom: 0;
      }

      label {
        display: block;
        font-size: 0.8rem;
        font-weight: 500;
        color: rgba(255,255,255,0.7);
        margin-bottom: 0.4rem;
      }
    }

    .text-input, .select-input {
      width: 100%;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      padding: 0.6rem;
      color: white;
      font-size: 0.85rem;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(255,255,255,0.2);
      }

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        background: rgba(0,0,0,0.4);
      }

      &::placeholder {
        color: rgba(255,255,255,0.3);
      }
    }

    .select-input {
      cursor: pointer;
      
      option {
        background: #1a1a2e;
        color: white;
      }
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.75rem;
    }

    .color-input-group {
      label {
        display: block;
        font-size: 0.8rem;
        font-weight: 500;
        color: rgba(255,255,255,0.7);
        margin-bottom: 0.4rem;
      }
    }

    .color-picker-enhanced {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      padding: 0.4rem;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(255,255,255,0.2);
      }

      &:focus-within {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      input[type="color"] {
        width: 32px;
        height: 32px;
        border: none;
        background: none;
        cursor: pointer;
        border-radius: 4px;
        
        &::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        
        &::-webkit-color-swatch {
          border-radius: 4px;
          border: 2px solid rgba(255,255,255,0.2);
        }
      }

      .color-hex-input {
        flex: 1;
        background: transparent;
        border: none;
        color: white;
        font-size: 0.85rem;
        font-family: 'Courier New', monospace;
        padding: 0;

        &:focus {
          outline: none;
        }
      }
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .range-input-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      input[type="range"] {
        flex: 1;
        height: 4px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        outline: none;
        cursor: pointer;

        &::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #667eea;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }

        &::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #667eea;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }
      }

      .range-value {
        min-width: 40px;
        text-align: right;
        font-size: 0.85rem;
        color: rgba(255,255,255,0.7);
        font-family: 'Courier New', monospace;
      }
    }

    .editor-actions {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .btn-reset {
      width: 100%;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 0.75rem;
      color: #fca5a5;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.5);
        color: #fef2f2;
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  `]
})
export class DesignEditorComponent implements OnChanges {
  @Input() selectedElement: any = null;
  @Input() selectedSection: any = null;
  @Output() styleChanged = new EventEmitter<void>();
  @Output() variantApplied = new EventEmitter<string>();

  // Todas las variantes disponibles
  allVariants = ALL_VARIANTS;
  
  // Categorías de variantes
  variantCategories: VariantCategory[] = ['Básicas', 'Modernas', 'Temáticas', 'Avanzadas', 'Premium'];
  
  // Variantes rápidas (favoritas)
  quickVariants = ALL_VARIANTS.filter(v => 
    ['primary', 'glass', 'neon', 'cyberpunk', 'retro', 'minimal'].includes(v.id)
  );

  // Estado de grupos colapsables
  groupStates: { [key: string]: boolean } = {
    colors: true,
    effects: false,
    typography: false,
    spacing: false,
    borders: false,
    background: false,
    flexbox: false
  };

  // Propiedades editables del componente actual
  editableProperties: string[] = [];
  componentType: string = 'common';
  currentVariant: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedElement'] || changes['selectedSection']) {
      this.updateEditableProperties();
      this.updateCurrentVariant();
    }
  }

  get targetStyles() {
    return this.selectedSection?._original?.styles || 
           this.selectedSection?.styles || 
           this.selectedElement?._original?.styles || 
           this.selectedElement?.styles || {};
  }

  updateEditableProperties() {
    const target = this.selectedElement || this.selectedSection;
    if (target) {
      this.componentType = detectComponentType(target);
      this.editableProperties = getEditableProperties(target);
    } else {
      this.editableProperties = [];
      this.componentType = 'common';
    }
  }

  updateCurrentVariant() {
    const target = this.selectedElement || this.selectedSection;
    if (target) {
      this.currentVariant = target.variant || target.content?.variant || '';
    } else {
      this.currentVariant = '';
    }
  }

  hasProperty(property: string): boolean {
    return this.editableProperties.includes(property);
  }

  getStyleValue(property: string): any {
    return this.targetStyles[property];
  }

  updateStyle(property: string, value: any) {
    if (this.targetStyles) {
      this.targetStyles[property] = value;
      this.styleChanged.emit();
    }
  }

  toggleGroup(groupName: string) {
    this.groupStates[groupName] = !this.groupStates[groupName];
  }

  getVariantsByCategory(category: VariantCategory) {
    return this.allVariants.filter(v => v.category === category);
  }

  applyVariant(variantId: string) {
    this.currentVariant = variantId;
    this.variantApplied.emit(variantId);
  }

  isFlexContainer(): boolean {
    const display = this.getStyleValue('display');
    return display === 'flex' || display === 'inline-flex';
  }

  resetStyles() {
    if (confirm('¿Estás seguro de que quieres restablecer todos los estilos?')) {
      const target = this.selectedElement || this.selectedSection;
      if (target && target.styles) {
        // Limpiar todos los estilos
        Object.keys(target.styles).forEach(key => {
          delete target.styles[key];
        });
        this.styleChanged.emit();
      }
    }
  }
}