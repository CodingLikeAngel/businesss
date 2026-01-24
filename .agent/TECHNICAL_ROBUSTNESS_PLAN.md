# 🛡️ Plan de Robustez Técnica y Calidad para el MVP (Anto Studios Editor)

Este documento complementa el `MVP_PLAN.md` enfocándose en la ejecución técnica, la estabilidad del motor y los estándares de calidad necesarios para un lanzamiento comercial.

## 1. Arquitectura del Proyecto (Código)

| #   | Acción                                 | Archivo(s) objetivo                                                                              | Detalle                                                                                                                                                                           | Criterio de aceptación                                                                                           |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | **Crear `ExporterService`**            | `libs/shared-components/src/lib/services/exporter.service.ts`                                    | - Recibe el JSON de configuración de la página.<br>- Genera archivos HTML/CSS/TS limpios.<br>- Empaqueta el bundle en un `.zip` usando `jszip`.                                   | - Unit test que verifica la integridad del Zip.<br>- Generación de código compatible con Angular 17+.            |
| 2   | **Añadir `FirebaseService` (STUB)**    | `libs/shared-components/src/lib/services/firebase.service.ts`                                    | - Wrapper para `AngularFire` (Firestore, Auth).<br>- Métodos: `saveProject`, `loadProject`, `listProjects`.                                                                       | - Persistencia funcional de la estructura JSON.<br>- Documentación de configuración en `README`.                 |
| 3   | **Refactorizar `VisualEditorService`** | `libs/shared-components/src/lib/shared-components/variant-selector/visual-editor.service.ts`     | - Consolidar reglas CSS de aislamiento.<br>- Escopar estilos del canvas bajo `.builder-shell .frame-content`.<br>- Mantener el `isolation: isolate` para evitar fugas de z-index. | - La interfaz del editor no se "rompe" al editar componentes sticky.<br>- Cero colisiones CSS entre UI y Canvas. |
| 4   | **Refinar `UiStateService`**           | `libs/shared-components/src/lib/shared-components/variant-selector/ui-state.service.ts`          | - Añadir `resetAll()` para estados de edición.<br>- Sincronizar estado de tabs con la URL (opcional).                                                                             | - Los sujetos (Subjects) se limpian correctamente al cambiar de proyecto.                                        |
| 5   | **Sistema de "Presets"**               | `libs/shared-components/src/lib/shared-components/variant-selector/preset-selector.component.ts` | - Selector visual con 3 estilos: Agencia (Dark), Clínica (Minimal), Fitness (Contrast).                                                                                           | - Cambio de estética global en < 1 segundo.                                                                      |
| 6   | **Undo/Redo Avanzado**                 | `libs/shared-components/src/lib/services/undo-redo.service.ts`                                   | - Stack de estados con límite de memoria (50 acciones).                                                                                                                           | - Recuperación de cambios accidentales en tiempo real.                                                           |

## 2. Infraestructura y Despliegue

- **🔄 CI/CD (GitHub Actions)**: Validación automática de `lint`, `build` y `test` en cada PR.
- **🌐 Deploy Multi-Entorno**:
  - `preview.antostudios.com` (Netlify) para prototipos.
  - `app.antostudios.com` (Firebase) para producción con Auth.
- **📚 Documentación Técnica**: Generación automática de API Docs con `typedoc`.

## 3. Calidad y Garantía (QA)

- **🧪 Cobertura de Tests**: Asegurar >80% en `ExporterService` y `VisualEditorService`.
- **🏗️ Cypress E2E**: Grabación de flujos de usuario: "Seleccionar Plantilla -> Editar Texto -> Mover Icono -> Descargar ZIP".
- **⚡ Auditoría Lighthouse**: Mantener puntuación >90 en Performance y Accessibility para el editor.

## 4. Cronograma de Ejecución (4 Semanas)

- **Semana 1: Estabilidad Base**: Refactor de servicios core y aislamiento de estilos.
- **Semana 2: El Motor de Exportación**: Desarrollo de `ExporterService` y descarga de `.zip`.
- **Semana 3: UX y Presets**: Implementación de plantillas rápidas y edición de listas complejas.
- **Semana 4: Lanzamiento**: Configuración de Firebase, Landing Page y despliegue final.

---

_Documento técnico generado para Anto Studios por Antigravity AI._
