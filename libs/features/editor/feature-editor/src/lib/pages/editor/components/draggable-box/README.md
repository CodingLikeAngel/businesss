# 📦 Draggable Box Editor - Mejoras Implementadas

## 🎯 Características Principales

### 1. **Persistencia de Posición y Tamaño**

El componente draggable-box ahora guarda automáticamente su posición y tamaño en el store de NgRx.

**Cómo funciona:**

- Cuando arrastras o redimensionas el box, los cambios se guardan automáticamente
- La posición se persiste en `section.styles` con las propiedades: `left`, `top`, `width`, `height`
- Al recargar la página, el box aparece en la última posición guardada

**Código relevante:**

```typescript
private persistPositionToStore() {
  const updatedStyles = {
    ...this.section.styles,
    left: `${this.boxLeft}px`,
    top: `${this.boxTop}px`,
    width: `${this.boxWidth}px`,
    height: `${this.boxHeight}px`,
    position: 'absolute'
  };

  this.store.dispatch(PageActions.updateSection({
    sectionId: this.section.id,
    changes: { styles: updatedStyles }
  }));
}
```

### 2. **Modo Aislado (Isolated Mode)** 🎯

Un modo de edición especial que te permite editar el draggable-box sin afectar el resto de la página.

**Cómo activarlo:**

- **Opción 1:** Haz hover sobre la sección y haz clic en el botón "🎯 Modo Aislado"
- **Opción 2:** Selecciona el box y presiona la tecla `I`

**Características del Modo Aislado:**

- ✅ Canvas dedicado con fondo oscuro
- ✅ Grid opcional para alineación precisa
- ✅ Snap to grid (magnetismo a la cuadrícula)
- ✅ Información en tiempo real de posición y tamaño
- ✅ Controles de reseteo de posición
- ✅ Vista previa aislada sin distracciones
- ✅ Aplicar o cancelar cambios

**Controles disponibles:**

- `↺` - Resetear posición a valores por defecto
- `#` - Toggle grid (mostrar/ocultar cuadrícula)
- `⊞` - Snap to grid (magnetismo)
- `✕` - Cerrar (también con tecla `Esc`)

### 3. **Información de Debug en Tiempo Real**

Un panel de información que muestra la posición y tamaño actual del box:

```
X: 150px  Y: 200px  W: 300px  H: 200px
```

**Ubicación:** Esquina inferior izquierda de la sección

### 4. **Mejoras Visuales**

- **Hover Effects:** El box se escala ligeramente al hacer hover
- **Smooth Transitions:** Animaciones suaves en todas las interacciones
- **Visual Feedback:** Indicadores visuales claros del estado de edición

## 🚀 Uso

### Edición Básica

1. **Seleccionar:** Haz clic en el draggable-box
2. **Mover:** Arrastra el box a la posición deseada
3. **Redimensionar:** Usa los handles (círculos) en los bordes
4. **Guardar:** Los cambios se guardan automáticamente

### Edición en Modo Aislado

1. **Abrir Modo Aislado:**

   - Hover sobre la sección → Click en "🎯 Modo Aislado"
   - O selecciona el box y presiona `I`

2. **Editar:**

   - Arrastra y redimensiona libremente
   - Activa el grid para alineación precisa
   - Usa snap to grid para magnetismo

3. **Finalizar:**
   - Click en "Aplicar Cambios" para guardar
   - O "Cancelar" para descartar
   - O presiona `Esc` para cerrar sin guardar

## 🔧 Arquitectura Técnica

### Componentes

1. **EditorDraggableBoxSectionComponent**

   - Componente principal del editor
   - Maneja la persistencia al store
   - Integra el modo aislado

2. **EditorDraggableBoxIsolatedModeComponent**
   - Modal de edición aislada
   - Canvas dedicado para edición
   - Controles avanzados

### Servicios Utilizados

- **SimpleVisualEditorService:** Maneja drag & drop y resize
- **Store (NgRx):** Persistencia de estado
- **UiStateService:** Estado de UI y selección

### Flujo de Datos

```
Usuario arrastra box
    ↓
SimpleVisualEditorService emite evento
    ↓
EditorDraggableBoxSectionComponent escucha evento
    ↓
Actualiza estado local (boxLeft, boxTop, etc.)
    ↓
Persiste al Store con PageActions.updateSection
    ↓
Store actualiza el estado
    ↓
Componente se re-renderiza con nueva posición
```

## 🐛 Solución de Problemas

### El box no mantiene su posición al recargar

**Causa:** El store no está persistiendo correctamente

**Solución:**

1. Verifica que `PageActions.updateSection` esté funcionando
2. Revisa que el reducer esté actualizando `section.styles`
3. Comprueba que el selector `selectCurrentPageSections` devuelva los datos correctos

### El modo aislado no se abre

**Causa:** Falta importar el componente

**Solución:**

```typescript
imports: [CommonModule, EditorDraggableBoxIsolatedModeComponent];
```

### Los eventos de drag no se detectan

**Causa:** El atributo `data-visual-editable` no está configurado

**Solución:**

```html
[attr.data-visual-editable]="section.id + '_box'"
```

## 📝 Próximas Mejoras

- [ ] Undo/Redo para cambios de posición
- [ ] Múltiples boxes en la misma sección
- [ ] Alineación automática entre boxes
- [ ] Guías de alineación (smart guides)
- [ ] Copiar/pegar posición entre boxes
- [ ] Presets de posiciones comunes
- [ ] Animaciones de transición entre posiciones
- [ ] Modo de edición colaborativa en tiempo real

## 🎨 Personalización

### Cambiar colores del modo aislado

Edita los estilos en `editor-draggable-box-isolated-mode.component.ts`:

```css
.isolated-mode-header {
  background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
}

.mode-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Ajustar tamaño del grid

```css
.isolated-canvas.show-grid {
  background-size: 20px 20px; /* Cambia este valor */
}
```

## 📚 Referencias

- [SimpleVisualEditorService](../../../../../../shared-components/src/services/simple-visual-editor.service.ts)
- [NgRx Store Actions](../../../../store/actions/page.actions.ts)
- [Base Editor Component](../base-editor-section.component.ts)
