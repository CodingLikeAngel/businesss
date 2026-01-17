# 🐛 Problemas Conocidos y Soluciones

## Problema: Cambios de Contenido No Se Reflejan en UI

### Descripción

Cuando se edita el contenido (título, subtítulo, descripción) de secciones locales (Headers añadidos, Accordions, etc.) en el "Editor de Contenido", los cambios NO se reflejan visualmente en el canvas, aunque SÍ se están guardando en el modelo de datos.

### Causa Raíz

Angular no detecta cambios en objetos anidados cuando se modifican por referencia. La arquitectura actual:

```typescript
// En editor-feature.component.html:
<lib-ui-header
  [variant]="section.content['variant'] || getVariant(section.id)"
  [title]="section.content['title'] || 'Encabezado'"
  [subtitle]="section.content['subtitle'] || ''"
/>

// En syncElementBack():
const source = this.selectedElement._original; // Apunta a section.content
source.title = content.title; // Modifica por referencia
// ❌ Angular NO detecta este cambio porque `section` sigue siendo la misma referencia
```

###Soluciones Implementadas (Parciales)

#### ✅ 1. Variantes Funcionan Correctamente

- `setComponentVariant()` dispara el observable `componentVariants$`
- Binding: `[variant]="section.content['variant'] || getVariant(section.id)"`
- Cuando cambias la variante, `getVariant()` devuelve el nuevo valor → UI se actualiza

#### ⚠️ 2. Contenido NO Funciona Completamente

- `syncElementBack()` modifica `source.title`, `source.subtitle`, etc.
- Estos cambios SÍ se guardan en el objeto `section.content`
- PERO Angular no re-renderiza porque no hay emisión de observable

### Soluciones Posibles

#### Solución A: Estrategia Inmutable (RECOMENDADO)

Modificar `VariantService` para que tenga un BehaviorSubject de secciones y métodos para actualizarlas:

```typescript
// En VariantService:
private sectionsSubject = new BehaviorSubject<PageSection[]>([]);
sections$ = this.sectionsSubject.asObservable();

updateSection(sectionId: string, updates: Partial<PageSection>) {
  const sections = this.sectionsSubject.value;
  const index = sections.findIndex(s => s.id === sectionId);
  if (index !== -1) {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      content: {
        ...newSections[index].content,
        ...updates.content
      }
    };
    this.sectionsSubject.next(newSections);
  }
}

// En syncElementBack():
if (this.selectedElement['sectionId']) {
  this.variantService.updateSection(this.selectedElement['sectionId'], {
    content: this.selectedElement.content
  });
}
```

#### Solución B: ChangeDetectorRef (TEMPORAL)

Inyectar `ChangeDetectorRef` en `EditorFeatureComponent` y forzar detección:

```typescript
// En editor-feature.component.ts:
constructor(private cdr: ChangeDetectorRef) {}

// Escuchar eventos de contenido y forzar:
ngDoCheck() {
  this.cdr.detectChanges();
}
```

**⚠️ Advertencia**: Esta solución es ineficiente y puede causar problemas de rendimiento.

#### Solución C: OnPush + Observables (MEJOR PRÁCTICA)

Cambiar la estrategia de detección de cambios a `OnPush` y usar solo observables:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class EditorDesktopFeatureComponent {
  sections$ = this.variantService.sections$; // Observable
  // Nunca acceder directamente a arrays, solo via async pipe
}
```

### Estado Actual

**✅ FUNCIONA:**

- Variantes de todos los componentes
- Adición/eliminación de secciones
- Selección de elementos
- Editor de diseño (estilos)

**❌ NO FUNCIONA:**

- Cambios de contenido (title, subtitle, description) en Headers locales
- Cambios de contenido en otros componentes añadidos como secciones

**🔧 WORKAROUND TEMPORAL:**

1. Edita el contenido en el "Editor de Contenido"
2. Cambia la variante del elemento (aunque sea a la misma)
3. Esto dispara `setComponentVariant` → El UI se actualiza con el nuevo contenido

### Implementación Recomendada

#### Paso 1: Agregar gestión de secciones al VariantService

```typescript
// variant.service.ts
export class VariantService {
  private sectionsSubject = new BehaviorSubject<PageSection[]>([]);
  sections$ = this.sectionsSubject.asObservable();

  private sections: PageSection[] = [];

  initializeSections(sections: PageSection[]) {
    this.sections = sections;
    this.sectionsSubject.next([...this.sections]);
  }

  getSections(): PageSection[] {
    return this.sections;
  }

  updateSection(sectionId: string, updates: Partial<PageSection>): void {
    const index = this.sections.findIndex((s) => s.id === sectionId);
    if (index !== -1) {
      this.sections[index] = {
        ...this.sections[index],
        ...updates,
        content: {
          ...this.sections[index].content,
          ...(updates.content || {}),
        },
      };
      this.sectionsSubject.next([...this.sections]);
    }
  }

  addSection(section: PageSection): void {
    this.sections.push(section);
    this.sectionsSubject.next([...this.sections]);
  }

  removeSection(sectionId: string): void {
    this.sections = this.sections.filter((s) => s.id !== sectionId);
    this.sectionsSubject.next([...this.sections]);
  }
}
```

#### Paso 2: Actualizar syncElementBack

```typescript
// variant-selector.component.ts - syncElementBack()
syncElementBack() {
  if (!this.selectedElement || !this.selectedElement._original) return;

  const content = this.selectedElement.content;
  const styles = this.selectedElement.styles;
  const variant = this.selectedElement.variant;

  if (this.selectedElement['sectionId']) {
    this.variantService.updateSection(this.selectedElement['sectionId'], {
      content: {
        ...content,
        variant
      },
      styles
    });
  }

  // Handle global components...
}
```

#### Paso 3: Usar sections$ en el template

```typescript
// editor-feature.component.ts
export class EditorDesktopFeatureComponent {
  sections$ = this.variantService.sections$;
  // ...
}
```

```html
<!-- editor-feature.component.html -->
<ng-container *ngFor="let section of sections$ | async">
  <!-- Existing template -->
</ng-container>
```

### Prioridad

🔴 **ALTA** - Afecta la funcionalidad core del editor

### Esfuerzo Estimado

⏱️ **2-3 horas** para implementar la solución completa

---

**Última actualización:** 2026-01-17 01:18  
**Responsable:** Equipo de Angular  
**Estado:** 🟡 Documentado - Pendiente implementación
