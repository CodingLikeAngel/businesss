# 🚀 Quick Start: UI Components Enhancement

**Objetivo**: Comenzar con 3 componentes piloto para establecer el patrón estándar

---

## 📦 Componentes Piloto Seleccionados

### 1. **UIButtonComponent** (Alta Prioridad)

**Razón**: Componente fundamental usado en toda la aplicación

**Estado Actual**: Revisar implementación existente
**Ubicación**: `libs/ui-components/src/lib/button/`

**Mejoras Requeridas**:

- [ ] Estandarizar props (`variant`, `size`, `icon`, `loading`, `disabled`)
- [ ] Implementar variantes: `primary`, `secondary`, `outline`, `ghost`, `danger`, `glass`, `neon`
- [ ] Agregar sizes: `xs`, `sm`, `md`, `lg`, `xl`
- [ ] Loading state con spinner
- [ ] Icon support (left/right)
- [ ] Ripple effect animation
- [ ] Full width option
- [ ] Disabled state
- [ ] Custom styles support

**Isolated Mode**: No requiere (componente atómico)

---

### 2. **UICardComponent** (Alta Prioridad)

**Razón**: Base para múltiples tipos de cards

**Estado Actual**: Revisar implementación existente
**Ubicación**: `libs/ui-components/src/lib/cards/`

**Mejoras Requeridas**:

- [ ] Props base: `title`, `description`, `image`, `variant`, `customStyles`
- [ ] Variantes: `default`, `glass`, `neon`, `cyberpunk`, `elevated`, `bordered`
- [ ] Hover effects configurables
- [ ] Click handlers
- [ ] Slots para header, body, footer
- [ ] Image position: `top`, `left`, `right`, `background`
- [ ] Padding/spacing configurables
- [ ] Border radius configurables

**Isolated Mode**: Sí (para featured components que lo usen)

---

### 3. **HeroSectionComponent** (Featured Component)

**Razón**: Componente featured completo para probar el sistema end-to-end

**Estado Actual**: Revisar implementación existente
**Ubicación**: `libs/featured-components/src/lib/hero/`

**Mejoras Requeridas**:

- [ ] Integración con visual editing
- [ ] Modo aislado premium
- [ ] Quick actions toolbar
- [ ] Double-click support
- [ ] Controles de: título, subtítulo, CTA, imagen de fondo, overlay
- [ ] Variantes: `centered`, `left-aligned`, `split`, `fullscreen`
- [ ] Background: `image`, `video`, `gradient`, `solid`
- [ ] Height configurables: `auto`, `screen`, `custom`

**Isolated Mode**: Sí (implementación completa)

---

## 🎯 Pasos de Implementación

### Paso 1: Auditoría de Componentes Existentes

```bash
# Explorar estructura actual
cd libs/ui-components/src/lib/button
ls -la

cd ../cards
ls -la

cd ../../featured-components/src/lib/hero
ls -la
```

**Tareas**:

1. Revisar archivos existentes
2. Documentar props actuales
3. Identificar código a mantener
4. Listar breaking changes necesarios

---

### Paso 2: Crear Interfaces y Types

**Archivo**: `libs/ui-components/src/lib/models/component-types.ts`

```typescript
// Variantes estándar para todos los componentes
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'glass' | 'neon' | 'cyberpunk' | 'outline' | 'ghost' | 'danger';

// Tamaños estándar
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Props base para todos los componentes UI
export interface BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  customStyles?: Record<string, string>;
  disabled?: boolean;
  className?: string;
}

// Props específicas de Button
export interface ButtonProps extends BaseComponentProps {
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Props específicas de Card
export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  image?: string;
  imagePosition?: 'top' | 'left' | 'right' | 'background';
  hoverable?: boolean;
  clickable?: boolean;
}

// Props específicas de Hero Section
export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundType?: 'image' | 'video' | 'gradient' | 'solid';
  variant?: 'centered' | 'left-aligned' | 'split' | 'fullscreen';
  height?: 'auto' | 'screen' | number;
  overlay?: boolean;
  overlayOpacity?: number;
}
```

---

### Paso 3: Refactorizar UIButtonComponent

**Archivo**: `libs/ui-components/src/lib/button/button.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonProps, ComponentVariant, ComponentSize } from '../models/component-types';

@Component({
  selector: 'lib-ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [type]="type" [disabled]="disabled || loading" [class]="computedClasses()" [style]="computedStyles()" (click)="handleClick($event)">
      <span *ngIf="loading" class="button-spinner"></span>

      <span *ngIf="icon && iconPosition === 'left' && !loading" class="button-icon-left">
        {{ icon }}
      </span>

      <span class="button-content">
        <ng-content></ng-content>
      </span>

      <span *ngIf="icon && iconPosition === 'right' && !loading" class="button-icon-right">
        {{ icon }}
      </span>
    </button>
  `,
  styleUrl: './button.component.scss',
})
export class UIButtonComponent implements ButtonProps {
  @Input() variant: ComponentVariant = 'default';
  @Input() size: ComponentSize = 'md';
  @Input() customStyles?: Record<string, string>;
  @Input() disabled = false;
  @Input() className?: string;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<MouseEvent>();

  public computedClasses = computed(() => {
    return ['ui-button', `variant-${this.variant}`, `size-${this.size}`, this.fullWidth ? 'full-width' : '', this.loading ? 'loading' : '', this.disabled ? 'disabled' : '', this.className || ''].filter(Boolean).join(' ');
  });

  public computedStyles = computed(() => {
    return {
      ...this.getVariantStyles(),
      ...this.customStyles,
    };
  });

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  private getVariantStyles(): Record<string, string> {
    // Estilos base por variante
    const variantStyles: Record<ComponentVariant, Record<string, string>> = {
      default: {},
      primary: { backgroundColor: '#6366f1', color: '#ffffff' },
      secondary: { backgroundColor: '#64748b', color: '#ffffff' },
      glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
      neon: {
        backgroundColor: '#000',
        color: '#0ff',
        boxShadow: '0 0 10px #0ff, 0 0 20px #0ff',
      },
      cyberpunk: {
        backgroundColor: '#ff00ff',
        color: '#000',
        clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)',
      },
      outline: {
        backgroundColor: 'transparent',
        border: '2px solid currentColor',
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
      },
    };

    return variantStyles[this.variant] || {};
  }
}
```

**Archivo**: `libs/ui-components/src/lib/button/button.component.scss`

```scss
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(.disabled):not(.loading) {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:active:not(.disabled):not(.loading) {
    transform: translateY(0);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.loading {
    cursor: wait;

    .button-content {
      opacity: 0.5;
    }
  }

  &.full-width {
    width: 100%;
  }

  // Sizes
  &.size-xs {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }

  &.size-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  &.size-md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  &.size-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  &.size-xl {
    padding: 1rem 2rem;
    font-size: 1.25rem;
  }

  .button-spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
```

---

### Paso 4: Crear Isolated Mode para Hero Section

**Archivo**: `libs/features/editor/feature-editor/src/lib/pages/editor/components/hero/editor-hero-isolated-mode.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-hero-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎨 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">HERO SECTION</span>
          </div>
          <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
        </div>

        <!-- Body -->
        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              <!-- CONTENT SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>

                <div class="control-group">
                  <label>Título Principal</label>
                  <input type="text" [(ngModel)]="editableContent.title" class="premium-input" />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea [(ngModel)]="editableContent.subtitle" class="premium-input h-24"></textarea>
                </div>

                <div class="control-group">
                  <label>Texto del CTA</label>
                  <input type="text" [(ngModel)]="editableContent.ctaText" class="premium-input" />
                </div>

                <div class="control-group">
                  <label>Link del CTA</label>
                  <input type="text" [(ngModel)]="editableContent.ctaLink" class="premium-input" />
                </div>
              </div>

              <!-- BACKGROUND SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🖼️</span>
                  <h4>FONDO</h4>
                </div>

                <div class="control-group">
                  <label>Tipo de Fondo</label>
                  <select [(ngModel)]="editableContent.backgroundType" class="premium-input">
                    <option value="image">Imagen</option>
                    <option value="video">Video</option>
                    <option value="gradient">Gradiente</option>
                    <option value="solid">Color Sólido</option>
                  </select>
                </div>

                <div class="control-group" *ngIf="editableContent.backgroundType === 'image'">
                  <label>URL de Imagen</label>
                  <input type="text" [(ngModel)]="editableContent.backgroundImage" class="premium-input" />
                </div>

                <div class="control-group" *ngIf="editableContent.backgroundType === 'video'">
                  <label>URL de Video</label>
                  <input type="text" [(ngModel)]="editableContent.backgroundVideo" class="premium-input" />
                </div>

                <div class="control-group">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="editableContent.overlay" class="w-4 h-4" />
                    <span>Overlay Oscuro</span>
                  </label>
                </div>

                <div class="control-group" *ngIf="editableContent.overlay">
                  <label>Opacidad del Overlay</label>
                  <input type="range" min="0" max="100" [(ngModel)]="editableContent.overlayOpacity" class="w-full" />
                  <span class="text-white text-sm">{{ editableContent.overlayOpacity }}%</span>
                </div>
              </div>

              <!-- LAYOUT SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>LAYOUT</h4>
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="editableContent.variant" class="premium-input">
                    <option value="centered">Centrado</option>
                    <option value="left-aligned">Alineado Izquierda</option>
                    <option value="split">Split (Dividido)</option>
                    <option value="fullscreen">Pantalla Completa</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Altura</label>
                  <select [(ngModel)]="editableContent.height" class="premium-input">
                    <option value="auto">Automática</option>
                    <option value="screen">Pantalla Completa</option>
                    <option value="custom">Personalizada</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div class="preview-hero" [style.height]="editableContent.height === 'screen' ? '100vh' : 'auto'">
                <!-- Preview del Hero -->
                <div class="hero-content">
                  <h1>{{ editableContent.title || 'Título Principal' }}</h1>
                  <p>{{ editableContent.subtitle || 'Subtítulo descriptivo' }}</p>
                  <button class="hero-cta">{{ editableContent.ctaText || 'Call to Action' }}</button>
                </div>
              </div>
            </div>

            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ editableContent.variant || 'centered' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">BACKGROUND</span>
                <span class="value">{{ editableContent.backgroundType || 'image' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Personaliza tu sección hero con controles avanzados.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-hero-isolated-mode.component.scss',
})
export class EditorHeroIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public editableContent: any = {};
  public editableStyles: any = {};

  ngOnInit() {
    this.editableContent = { ...this.config.content };
    this.editableStyles = { ...this.config.styles };
  }

  ngOnDestroy() {
    // Cleanup
  }

  public close() {
    this.closed.emit();
  }
  public cancel() {
    this.closed.emit();
  }
  public onOverlayClick(e: Event) {
    this.closed.emit();
  }

  public apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
      styles: { ...this.editableStyles },
    });
  }
}
```

---

## 📝 Checklist de Validación

### UIButtonComponent

- [ ] Props estandarizadas implementadas
- [ ] Todas las variantes funcionando
- [ ] Todos los tamaños funcionando
- [ ] Loading state funcional
- [ ] Icon support (left/right)
- [ ] Disabled state
- [ ] Hover/Active states
- [ ] Custom styles aplicándose
- [ ] Tests unitarios pasando
- [ ] Documentación actualizada

### UICardComponent

- [ ] Props base implementadas
- [ ] Variantes funcionando
- [ ] Image positions funcionando
- [ ] Slots configurados
- [ ] Hover effects
- [ ] Click handlers
- [ ] Custom styles aplicándose
- [ ] Tests unitarios pasando
- [ ] Documentación actualizada

### HeroSectionComponent

- [ ] Isolated mode implementado
- [ ] Quick actions toolbar
- [ ] Double-click support
- [ ] Todos los controles funcionando
- [ ] Preview en tiempo real
- [ ] Apply/Cancel funcionando
- [ ] Variantes funcionando
- [ ] Background types funcionando
- [ ] Tests de integración pasando
- [ ] Documentación actualizada

---

## 🚀 Comandos de Desarrollo

```bash
# Servir la aplicación
npx nx run antoStudios:serve

# Ejecutar tests
npx nx test ui-components
npx nx test featured-components
npx nx test feature-editor

# Build de producción
npx nx build ui-components
npx nx build featured-components

# Linting
npx nx lint ui-components
npx nx lint featured-components
```

---

**Próximo paso**: Comenzar con la auditoría de UIButtonComponent
