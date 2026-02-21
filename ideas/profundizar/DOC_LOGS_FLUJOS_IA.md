# 📋 Logs, flujos exportables y contexto para IA

**Objetivo:** Profundizar en buenas prácticas para **logs a nivel de cualquier paso de la app**, **exportables en tiempo real**, que permitan a la **IA captar contexto de cualquier flujo**, y en la capacidad de **guardar y reutilizar flujos**.

**Contexto:** Tanto ATS como Anto Studios (y el sistema integrado futuro) se benefician de trazabilidad, depuración y uso de IA; los logs y los flujos guardados son la base.

---

## 1. Por qué logs en cada paso

### 1.1 Beneficios

- **Depuración:** Saber en qué paso falló un análisis, un export o una publicación.
- **Auditoría:** Quién hizo qué y cuándo (importante para “trabajar directo en producción”).
- **Contexto para IA:** La IA puede leer un stream o un dump de logs de un flujo concreto (ej. “análisis de repo X”, “publicación del sitio Y”) y dar recomendaciones, resumir o sugerir el siguiente paso.
- **Observabilidad:** Métricas derivadas (duración por paso, tasa de error, volumen de operaciones).
- **Reproducibilidad:** Con logs estructurados se puede reconstruir un flujo para reproducir un bug o re-ejecutar un escenario.

### 1.2 “Cualquier paso” de la app

Entender **paso** como cualquier unidad significativa de trabajo:

- **ATS:** Inicio/fin de análisis de repo, llamada a SonarQube, generación de informe Gemini, cálculo de score, guardado de resultados, error en un adapter.
- **Anto Studios:** Carga de página, cambio de sección (añadir/editar/eliminar), cambio de variante, guardado de variante, inicio/fin de export (por framework), inicio/fin de publicación, fallo de validación de schema.
- **Sistema integrado:** Llamada desde hub a API de Anto, comprobación de quality gate, disparo de deploy, rollback.

Cada uno de estos puede emitir al menos: **timestamp**, **paso/acción**, **entidad (repo, proyecto, sitio, versión)**, **resultado (ok/error)**, **payload mínimo (ids, opciones)** y opcionalmente **usuario/sesión**.

---

## 2. Buenas prácticas para logs

### 2.1 Logs estructurados (JSON)

- **Formato:** Una línea por evento en JSON (JSON Lines / NDJSON) para poder parsear y filtrar por herramientas o por IA.
- **Campos sugeridos (comunes):**
  - `ts`: ISO 8601.
  - `level`: `debug` | `info` | `warn` | `error`.
  - `app`: `ats` | `anto-studios` | `hub`.
  - `flow`: Identificador del flujo (ej. `repo-analysis`, `export-react`, `publish-production`).
  - `step`: Nombre del paso dentro del flujo (ej. `sonar.analyze`, `gemini.report`, `export.generate`).
  - `entity`: Tipo + id (ej. `repo:github.com/org/repo`, `site:project-xyz`).
  - `result`: `ok` | `error` | `skipped`.
  - `duration_ms`: Opcional.
  - `message`: Texto legible.
  - `payload`: Objeto opcional (ids, opciones, resumen de error) sin datos sensibles.
  - `user_id` / `session_id`: Opcional, para auditoría.

Ejemplo:

```json
{"ts":"2026-02-20T10:00:01.000Z","level":"info","app":"ats","flow":"repo-analysis","step":"sonar.analyze","entity":"repo:github.com/org/repo","result":"ok","duration_ms":12000,"message":"SonarQube analysis completed"}
```

### 2.2 Niveles y filtrado

- **debug:** Detalle interno (parámetros, tamaños); desactivable en producción.
- **info:** Pasos completados correctamente (flujos, hitos).
- **warn:** Degradación (timeout, fallback, dato faltante).
- **error:** Fallo de un paso (con código o tipo de error y mensaje).

Poder filtrar por `flow` + `entity` permite “todos los logs de este análisis” o “todos los logs de esta publicación” para dar contexto a la IA o a un humano.

### 2.3 Sin datos sensibles

- No loguear tokens, contraseñas, API keys ni PII en claro.
- Para auditoría de “quién”, usar `user_id` o identificador opaco; los datos sensibles quedan en el sistema de auth, no en el log.

---

## 3. Exportables en tiempo real

### 3.1 Qué significa “exportable en tiempo real”

- **Stream de logs:** Mientras un flujo corre (análisis, export, publicación), los eventos se pueden:
  - **Consumir en vivo** por un cliente (hub, CLI, otra app) vía WebSocket, SSE o long-polling.
  - **Escribir** en un buffer o cola asociado a ese flujo (en memoria o persistido) para luego “exportar” ese flujo completo.
- **Exportar:** Obtener un artefacto (archivo, respuesta HTTP) con todos los logs de un flujo (o de un rango de tiempo, o de una entidad) en formato legible por humanos y por IA (JSON Lines, JSON array, o texto con marcas claras).

### 3.2 Implementación sugerida

- **Backend (ATS / Anto / BFF):**
  - Cada flujo largo tiene un `flowId` (UUID).
  - Los pasos del flujo emiten logs con ese `flowId`.
  - Opción A: Los logs se escriben a un almacén (fichero, BD, cola) con índice por `flowId` y tiempo; un endpoint `GET /flows/:flowId/logs` (o con stream) devuelve los eventos en tiempo real o ya completos.
  - Opción B: Además (o en lugar de), un **event bus** (WebSocket/SSE) donde el cliente se suscribe a `flowId` y recibe eventos en vivo; al terminar el flujo se puede generar el “export” del flujo (logs + resultado).
- **Frontend (hub):** En la pantalla de “Análisis en curso” o “Publicación en curso”, un panel que muestra el stream de logs en vivo y un botón “Descargar log del flujo” (export) al finalizar.
- **Formato de export:** JSON Lines (una línea por evento) o JSON array; opcionalmente un resumen en texto/markdown al inicio (flujo, entidad, resultado global, duración total) para que la IA tenga un “resumen + detalle”.

### 3.3 Export enriquecido: imágenes y Markdown (más contexto para la IA)

Para que **la IA tenga cada vez más contexto**, los flujos de log pueden generar además de JSON:

- **Imágenes:** Capturas o renders en hitos clave del flujo (ej. preview del sitio tras un paso de export, screenshot del estado del editor antes/después de una acción, gráficos de métricas en un análisis). El export del flujo incluye referencias a estas imágenes (URLs o IDs) o las embebe; la IA multimodal puede "ver" qué pasó, no solo leer texto.
- **Markdown:** Resúmenes estructurados en .md por paso o por flujo (qué se hizo, resultado, enlaces a logs/imágenes). Así el contexto que se pasa a la IA es "resumen ejecutivo + detalle técnico + evidencia visual", lo que mejora resúmenes, diagnósticos y recomendaciones.

Objetivo: **aumentar el contexto disponible para la IA** en cada export, de modo que las IAs especializadas (por app o por cliente) puedan dar respuestas más precisas sin depender solo de logs crudos.

### 3.4 Uso por IA

- **Input a la IA:** Se le pasa el export del flujo (o el stream ya terminado) como contexto: “Aquí están los logs del último análisis del repo X” o “Logs de la última publicación del sitio Y”.
- **Prompt típico:** “Con estos logs, resume qué pasó, si hubo errores y qué recomiendas.”
- La IA puede así **entender cualquier flujo** sin tener que tener el código; el contrato es “logs estructurados + resumen de entidad”.

---

## 4. Guardar flujos

### 4.1 Qué es un “flujo guardado”

- **Definición:** Secuencia de pasos (y opciones) que el usuario o el sistema ejecutó en el pasado y que se puede **nombrar**, **guardar** y **re-ejecutar** (total o parcial).
- **Ejemplos:**
  - “Análisis completo de repo” = fetch repo + análisis ATS + Sonar + informe Gemini (con opciones: branch, sonar project key).
  - “Publicar sitio a producción” = validar schema + export + deploy a prod (con opciones: proyecto, versión).
  - “Export React + ZIP” = export a React + empaquetar en ZIP (con opciones: proyecto, opciones de export).

Un “flujo” puede ser un **template** (solo definición de pasos y parámetros) o un **flujo ejecutado** (instancia con flowId, logs, resultado, timestamp).

### 4.2 Guardar como template

- El usuario (o un admin) define un flujo: lista de pasos + parámetros (obligatorios/opcionales) y lo guarda con nombre (ej. “Análisis estándar para PR”).
- En el hub o en Anto, al elegir “Ejecutar flujo” se selecciona el template y se rellenan los parámetros; al ejecutar se genera una instancia (flowId) y se registran logs.
- Ventaja: Misma secuencia repetible, menos errores, onboarding más rápido.

### 4.3 Guardar como historial de ejecución

- Cada ejecución (flowId) queda guardada con: template o tipo de flujo, parámetros usados, resultado global, timestamps, enlace a logs (o logs embebidos si son pequeños).
- El usuario puede “Ver flujo pasado” y **re-ejecutar** con los mismos parámetros (o editados), o **exportar los logs** de esa ejecución para IA o soporte.
- Ventaja: Reproducibilidad y auditoría (“la última vez que publicamos a prod, estos fueron los pasos y logs”).

### 4.4 Integración con IA

- **IA sugiere flujos:** “Para este repo te recomiendo ejecutar el flujo ‘Análisis completo + informe Gemini’.”
- **IA resume flujos guardados:** “Los últimos 5 análisis de este repo fallaron en el paso Sonar; revisa la configuración de quality gate.”
- **IA genera un flujo nuevo:** El usuario describe “quiero que cada viernes se analice el repo X y se publique el sitio Y a staging”; la IA propone un flujo (o un job programado) que el usuario guarda y activa.

### 4.5 Automatizar tests y escribirlos con un agente

El sistema de logs es muy útil para **testing** porque un flujo real queda registrado paso a paso. Con ese registro se puede:

- **Automatizar tests:** Re-ejecutar el mismo flujo en CI (o en un test de integración/E2E) y comparar los logs (o los resultados) con un flujo de referencia. Así se detectan regresiones sin escribir asserts manuales para cada paso; el "contrato" es la secuencia de pasos y resultados esperados derivada del flujo real.
- **Escribir tests con un agente:** Un agente (IA) recibe el export de un flujo real como contexto y **genera tests** (p. ej. E2E o de integración) que reproducen ese flujo. Por ejemplo: "Este flujo pasó en producción; genera un test que lo replique." El agente conoce los pasos (step), la entidad (entity), el resultado (result) y opcionalmente el payload; puede generar código de test (Playwright, Cypress, Jest, etc.) que ejecute la misma secuencia y valide los mismos hitos.

Logs estructurados + `flowId` = contrato claro para humanos, para IA y para la pipeline de tests.

### 4.6 IA especializada por app y bot del cliente (visión)

- **IA especializada por app:** Cada aplicación (ATS, Anto Studios, hub integrado) puede tener una **IA propia** entrenada o afinada con el contexto de esa app: catálogo de componentes, tipos de flujo, esquemas, logs y exports enriquecidos (JSON + MD + imágenes). Así la IA de Anto entiende "secciones", "variantes" y "schema de página"; la IA de ATS entiende "repos", "Sonar", "sprints" y "informes". El cliente se beneficia de un asistente que habla el lenguaje de cada herramienta.
- **Bot propio del cliente (tipo Claude):** Una capa por **cliente o por workspace** que actúa como **gestor de la app del cliente**: conoce su proyecto, su historial de flujos, sus publicaciones y su contexto (logs + MD + imágenes). Ese bot puede:
  - Recibir **comandos por voz** (o por texto): "Cambia el botón del hero a azul", "Pon esta imagen de fondo en la sección de contacto", "Sustituye el título por…", "Publica a staging".
  - Traducir la intención en acciones sobre el schema (Anto) o en órdenes al hub (ATS): el bot gestiona la app del cliente y el cliente solo da instrucciones en lenguaje natural.
  - **Clonarse y llevar conocimiento a otros proyectos:** El bot se puede clonar (o exportar su contexto y reglas) y "traer" ese conocimiento a proyectos nuevos o a otros proyectos de la empresa; así las mejores prácticas, flujos y preferencias se reutilizan entre equipos o entre clientes.
  - **Dar tareas a agentes:** El bot puede delegar trabajo en agentes (análisis de repo, generación de contenido, revisión de métricas, ejecución de flujos); el usuario da una orden de alto nivel y el bot orquesta qué agente hace qué.
  - **Analizar datos y métricas de negocio:** Con acceso a logs, flujos, publicaciones y métricas del hub (ATS, Anto, integrado), el bot puede analizar datos técnicos y de negocio: tiempos de publicación, tasas de error, uso de componentes, salud de repos, tendencias; y responder en lenguaje natural o generar informes.
- **Flujos + contexto enriquecido:** Al generar imágenes y MD en los exports de flujo, el bot (y las IAs especializadas) tienen cada vez más contexto para entender qué hizo el usuario, qué ve la app y qué cambiar; así se habilita una experiencia "comando por voz / chat para cambiar un botón, un fondo, una imagen" sin tocar el editor manualmente.

---

## 5. Resumen de capacidades objetivo

| Capacidad | Descripción |
|-----------|-------------|
| **Logs por paso** | Cada paso significativo (análisis, export, publicación, etc.) emite un evento estructurado (JSON) con ts, flow, step, entity, result, opcional duration y payload. |
| **Flujo identificado** | Flujos largos tienen un `flowId`; todos los pasos del flujo llevan ese id para agrupar. |
| **Stream en tiempo real** | Cliente (hub, CLI) puede suscribirse a los eventos de un flowId y ver logs en vivo (WebSocket/SSE o polling). |
| **Export de logs** | Endpoint o acción “Descargar logs de este flujo” en formato JSON Lines o JSON, con o sin resumen en texto. |
| **Export enriquecido (imágenes + MD)** | Los flujos pueden generar imágenes (capturas, previews, gráficos) y resúmenes en Markdown para que la IA tenga más contexto (multimodal y resumen ejecutivo + detalle). |
| **Contexto para IA** | Se puede pasar a la IA el export de un flujo (o varios) para que resuma, diagnostique o recomiende. |
| **IA especializada por app** | Cada app (ATS, Anto, hub) puede tener una IA propia afinada con su contexto; asistente que habla el lenguaje de cada herramienta. |
| **Bot del cliente (voz/texto)** | Bot tipo Claude por cliente/workspace: comandos voz/texto, clonable (llevar conocimiento a otros proyectos/empresa), dar tareas a agentes, analizar datos y métricas de negocio, y más. |
| **Automatizar tests** | Re-ejecutar el flujo en CI y comparar logs/resultados con el de referencia; detectar regresiones sin asserts manuales por paso. |
| **Escribir tests con un agente** | Un agente (IA) recibe el export de un flujo real y genera tests (E2E, integración) que reproducen esa secuencia. |
| **Guardar flujos como template** | Definir secuencias reutilizables (pasos + parámetros) y ejecutarlas por nombre. |
| **Historial de ejecuciones** | Guardar cada ejecución (flowId, parámetros, resultado, enlace a logs) y permitir re-ejecutar o exportar. |

---

## 6. Orden de implementación sugerido

1. **Fase 1:** Estandarizar logs estructurados (JSON) en al menos un flujo piloto (ej. análisis de repo en ATS o export en Anto); incluir `flowId` y `step` en cada evento.
2. **Fase 2:** Persistir o bufferizar eventos por flowId y exponer `GET /flows/:flowId/logs` (y opcionalmente stream en vivo).
3. **Fase 3:** En el hub (o en cada app), UI para “Ver logs en vivo” y “Exportar logs del flujo” al finalizar.
4. **Fase 4:** Definir “tipos de flujo” (análisis, export, publicación) y guardar ejecuciones en historial con enlace a logs.
5. **Fase 5:** Flujos guardados como templates (definición + parámetros) y re-ejecución desde el hub.
6. **Fase 6:** Integración con IA: enviar export de logs como contexto a Gemini (u otro) y respuestas en el hub (resumen, diagnóstico, sugerencia de siguiente paso o de flujo).
7. **Fase 7 (opcional):** Usar flujos guardados como **oráculo para tests**: re-ejecutar en CI y comparar logs; y/o alimentar un agente que **genere tests** (E2E/integración) a partir del export de un flujo real.
8. **Fase 8 (visión):** Export enriquecido (generar imágenes y MD en hitos del flujo); IAs especializadas por app; bot del cliente (voz/texto) que gestiona la app y traduce comandos naturales a acciones.

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0
