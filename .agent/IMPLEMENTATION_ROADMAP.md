# 🎯 Plan de Implementación Inmediata - Editor Robusto para MVP

**Fecha**: 2026-01-25  
**Objetivo**: Hacer el editor visual production-ready en 1 semana

## ✅ Estado Actual (Completado)

### Servicios Core

- ✅ `ExporterService` - Generación de ZIP con proyecto Angular
- ✅ `DownloadService` - Descarga de archivos
- ✅ `UndoRedoService` - Historial de cambios (50 acciones)
- ✅ `FirebaseService` - Persistencia de proyectos
- ✅ `VariantService` - Gestión de temas y variantes
- ✅ `VisualEditorService` - Motor de edición visual

### Componentes UI

- ✅ `VariantSelectorComponent` - Sidebar de edición con tabs
- ✅ `PresetSelectorComponent` - Selector de plantillas
- ✅ `PageManagementComponent` - Gestión de páginas
- ✅ `SectionStructureComponent` - Árbol de secciones
- ✅ `ContentEditorComponent` - Editor de contenido
- ✅ `DesignEditorComponent` - Editor de estilos

## 🚀 Tareas Prioritarias (Próximas 48h)

### 1. Mejorar el Sistema de Exportación

**Archivo**: `libs/shared-components/src/lib/services/exporter.service.ts`

#### Mejoras Necesarias:

- [ ] Generar componentes Angular standalone completos (no solo HTML)
- [ ] Incluir todas las dependencias de `@negocio/ui-components` en el export
- [ ] Crear estructura de carpetas correcta (`src/app/components/`)
- [ ] Generar archivos de configuración completos (angular.json, tsconfig.app.json)
- [ ] Agregar assets (imágenes, fuentes) al ZIP
- [ ] Implementar export de múltiples páginas (routing)

#### Código a Agregar:

```typescript
// Método para generar componentes standalone
private generateStandaloneComponent(section: any): string {
  return `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI${section.type}Component } from '@negocio/ui-components';

@Component({
  selector: 'app-${section.id}',
  standalone: true,
  imports: [CommonModule, UI${section.type}Component],
  template: \`
    <lib-ui-${section.type}
      [variant]="${section.variant}"
      [data]="${JSON.stringify(section.data)}"
    ></lib-ui-${section.type}>
  \`
})
export class ${this.toPascalCase(section.id)}Component {}`;
}
```

### 2. Implementar Undo/Redo en el Editor Visual

**Archivo**: `libs/shared-components/src/lib/shared-components/variant-selector/visual-editor.service.ts`

#### Integración:

```typescript
import { UndoRedoService } from '../../services/undo-redo.service';

// En cada acción de edición:
this.undoRedo.pushState(this.getCurrentPageState(), 'Moved section');

// Agregar shortcuts de teclado:
@HostListener('window:keydown.control.z')
handleUndo() {
  const state = this.undoRedo.undo();
  if (state) this.restoreState(state.data);
}

@HostListener('window:keydown.control.shift.z')
handleRedo() {
  const state = this.undoRedo.redo();
  if (state) this.restoreState(state.data);
}
```

### 3. Mejorar el Sistema de Presets

**Archivo**: `libs/shared-components/src/lib/shared-components/variant-selector/preset-selector.component.ts`

#### Presets a Crear:

```typescript
presets = [
  {
    id: 'prestige-corporate',
    name: 'Prestige Corporate',
    variant: 'glass',
    description: 'Elegante y profesional',
    preview: '/assets/presets/prestige.png',
    config: {
      globalVariant: 'glass',
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
      },
    },
  },
  {
    id: 'quantum-fitness',
    name: 'Quantum Fitness',
    variant: 'neon',
    description: 'Energético y dinámico',
    preview: '/assets/presets/fitness.png',
    config: {
      globalVariant: 'neon',
      colors: {
        primary: '#ef4444',
        secondary: '#f59e0b',
        accent: '#10b981',
      },
    },
  },
  {
    id: 'midnight-agency',
    name: 'Midnight Agency',
    variant: 'cyberpunk',
    description: 'Oscuro y moderno',
    preview: '/assets/presets/agency.png',
    config: {
      globalVariant: 'cyberpunk',
      colors: {
        primary: '#06b6d4',
        secondary: '#8b5cf6',
        accent: '#f43f5e',
      },
    },
  },
];
```

### 4. Agregar Validación y Mensajes de Error

**Nuevo Archivo**: `libs/shared-components/src/lib/services/validation.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class ValidationService {
  validateProject(config: any): ValidationResult {
    const errors: string[] = [];

    if (!config.pages || config.pages.length === 0) {
      errors.push('El proyecto debe tener al menos una página');
    }

    config.pages?.forEach((page: any, index: number) => {
      if (!page.name) {
        errors.push(`La página ${index + 1} necesita un nombre`);
      }
      if (!page.sections || page.sections.length === 0) {
        errors.push(`La página "${page.name}" está vacía`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

### 5. Implementar Sistema de Notificaciones

**Nuevo Archivo**: `libs/shared-components/src/lib/services/notification.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications$ = new Subject<Notification>();

  success(message: string) {
    this.show({ type: 'success', message });
  }

  error(message: string) {
    this.show({ type: 'error', message });
  }

  info(message: string) {
    this.show({ type: 'info', message });
  }

  private show(notification: Notification) {
    this.notifications$.next(notification);
    setTimeout(() => this.dismiss(), 3000);
  }
}
```

## 📋 Checklist de Calidad para MVP

### Funcionalidad Core

- [ ] Crear proyecto nuevo desde preset
- [ ] Editar contenido de texto inline
- [ ] Cambiar colores y estilos
- [ ] Agregar/eliminar secciones
- [ ] Reordenar secciones (drag & drop)
- [ ] Deshacer/Rehacer cambios
- [ ] Guardar proyecto (localStorage + Firebase)
- [ ] Exportar como ZIP
- [ ] Exportar como HTML standalone

### UX/UI

- [ ] Loading states en todas las acciones async
- [ ] Mensajes de error claros
- [ ] Confirmación antes de acciones destructivas
- [ ] Tooltips en todos los controles
- [ ] Keyboard shortcuts documentados
- [ ] Responsive design del editor

### Performance

- [ ] Lazy loading de componentes pesados
- [ ] Debounce en inputs de texto
- [ ] Virtual scrolling en listas largas
- [ ] Optimización de re-renders

### Testing

- [ ] Unit tests para servicios core (>80% coverage)
- [ ] E2E test del flujo completo
- [ ] Test de exportación de código
- [ ] Test de persistencia

## 🎨 Mejoras Visuales del Editor

### Sidebar

- Agregar animaciones suaves en transiciones de tabs
- Mejorar contraste de texto en modo oscuro
- Agregar preview thumbnails en preset selector

### Canvas

- Agregar grid de alineación
- Mostrar dimensiones al redimensionar
- Highlight de sección seleccionada más visible
- Agregar zoom controls

### Toolbar

- Agregar botones de Undo/Redo con contador
- Mostrar estado de guardado ("Guardado", "Guardando...", "Error")
- Agregar botón de preview en nueva ventana

## 📦 Dependencias a Instalar

```bash
npm install jszip @types/jszip
npm install firebase @angular/fire
npm install @angular/cdk  # Para drag & drop
```

## 🚢 Criterios de Lanzamiento MVP

1. ✅ **Exportación funcional**: El código generado debe compilar sin errores
2. ✅ **Persistencia estable**: Proyectos se guardan y cargan correctamente
3. ✅ **3 Presets completos**: Agencia, Clínica, Fitness
4. ✅ **Undo/Redo**: Mínimo 20 acciones en historial
5. ✅ **Documentación**: README con guía de uso
6. ✅ **Performance**: Editor carga en <2 segundos
7. ✅ **Mobile**: Editor funcional en tablets (1024px+)

## 📅 Timeline

### Día 1-2: Exportación Robusta

- Mejorar ExporterService
- Generar componentes standalone
- Testing de código exportado

### Día 3-4: UX y Presets

- Implementar Undo/Redo
- Crear 3 presets completos
- Agregar validaciones

### Día 5-6: Polish y Testing

- Mensajes de error
- Loading states
- E2E tests

### Día 7: Launch Prep

- Documentación
- Video demo
- Deploy a producción

---

**Próximo paso inmediato**: Mejorar el `ExporterService` para generar componentes standalone completos.
