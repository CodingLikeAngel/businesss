# 🧩 Visión: Modularización, IA y Despliegue a Producción

**Objetivo:** Esbozar cómo convertir esta aplicación en un sistema modular completo que pueda integrarse con una IA (propia o existente) para generar aplicaciones desde cero a partir de componentes y un framework propios, y cómo llevar cambios de forma controlada hasta producción.

**Referencias:** Plan Maestro MVP, COMPONENT_EXPORT_ARCHITECTURE.md, MVP_BUSINESS_PLAN.md, ideas de negocio y ejecución existentes.

---

## 1. Visión general

### 1.1 Estado actual

- **Editor visual** con secciones, layout flexible, modo aislado y variantes.
- **Librería de componentes UI** (`ui-components`) y **componentes de negocio** (`featured-components`).
- **Store** (estado de página, secciones, estilos globales) y **exportación** (multi-framework en diseño).
- **Monolito Nx:** varias apps y libs en un solo repo; la “fuente de verdad” es el estado en memoria/localStorage y el JSON de variantes.

### 1.2 Objetivo a futuro

- **Sistema modular:** núcleo del builder desacoplado, reutilizable por UI humana o por agentes IA.
- **IA como “diseñador/desarrollador”:** una IA (propia o externa) que, dado un brief o especificación, elija componentes, los configure y genere o actualice la estructura de la app (schema de página + datos).
- **Framework propio:** el conjunto de componentes, reglas de composición y design tokens como “framework” que tanto humanos como IA usan para generar experiencias.
- **Producción controlada:** preview, staging y despliegue directo a producción con rollback y auditoría.

---

## 2. Modularización para una app completa

### 2.1 Capas objetivo

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CAPA DE PRESENTACIÓN (Humanos o IA)                                     │
│  - Editor visual (Angular)  -  Chat/API para IA  -  Dashboard / CLI       │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  API DEL BUILDER (Headless)                                              │
│  - Crear/actualizar/eliminar páginas y secciones                          │
│  - Aplicar variantes y estilos  -  Validar schema  -  Generar preview     │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  NÚCLEO DE NEGOCIO                                                       │
│  - Modelo de página (schema)  -  Registro de componentes  -  Export       │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  FRAMEWORK PROPIOS (Componentes + Design Tokens)                         │
│  - ui-components  -  featured-components  -  variantes y temas           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Schema de página como contrato

- **Página** = lista de **secciones** ordenadas; cada sección tiene:
  - `type` (hero, features, pricing, testimonials, etc.)
  - `id`, `visible`, `variant`
  - `content` / `config` (textos, imágenes, ítems, etc.)
  - `styles` / `layout` (dimensiones, estilos inline si aplica)
- **Estilos globales** (tema, fuentes, colores) como parte del mismo schema.
- Este **schema en JSON** es:
  - Lo que el editor persiste y carga.
  - Lo que un exportador usa para generar HTML/React/Angular/etc.
  - Lo que una IA puede **generar o modificar** vía API.

### 2.3 Registro de componentes como catálogo

- **Catálogo maquinaable:** lista de tipos de sección/componente con:
  - nombre, descripción, props/configuración (schema JSON), variantes disponibles, preview (thumbnail o URL).
- Ya existe un **section-type-registry** (con carga lazy); extenderlo a un **API de registro** (REST o in-process) que devuelva:
  - Tipos disponibles.
  - Schema de configuración por tipo.
  - Validación de `content`/`config` para cada tipo.
- Así tanto el editor como un agente IA pueden “saber qué se puede colocar” y “qué campos tiene cada bloque”.

### 2.4 Separación de runtimes

- **Runtime de edición:** Angular app actual (editor + preview con estado en tiempo real).
- **Runtime de solo lectura (producción):** puede ser:
  - La misma app Angular sirviendo solo la “vista preview” con datos inyectados (schema desde API o estático), o
  - Sitio estático generado por export (HTML/CSS/JS), o
  - App desplegada que lee el schema desde un CMS/API.
- **Modularizar** implica que el “motor” que interpreta el schema y renderiza secciones pueda usarse en ambos contextos (edición y producción) sin depender de la UI del editor.

---

## 3. Integración con IA (propia o existente)

### 3.1 Idea central

- La IA **no pinta píxeles**: genera o modifica **datos** (schema de página + contenido).
- El “framework propio” son los **componentes registrados** + **design tokens** + **reglas de composición** (qué secciones existen, cómo se configuran).
- La IA recibe:
  - Descripción del negocio / brief / “hazme una web de restaurante” / “añade una sección de precios”.
  - (Opcional) Contexto: página actual, historial de cambios.
- La IA devuelve:
  - **Acciones concretas** sobre el schema: crear sección, editar contenido, cambiar variante, reordenar, eliminar.
  - O el **schema completo** de la página (o diff respecto al actual).

### 3.2 Flujos posibles

**A) IA como “asistente dentro del editor”**

- Usuario en el editor; escribe en un chat o da instrucciones en lenguaje natural.
- La IA traduce a operaciones sobre el store: “Añadir sección tipo Pricing después del Hero”, “Cambiar el título del Hero a X”, “Poner variante dark en la sección Testimonials”.
- El editor aplica esos cambios al estado; el usuario ve el resultado al instante y puede corregir.

**B) IA que genera la app desde cero**

- Input: “Crea una landing para un gimnasio boutique en Madrid”.
- La IA:
  - Elige tipos de sección (hero, servicios, horarios, precios, contacto).
  - Rellena contenido (textos, CTAs, imágenes placeholder o enlaces).
  - Asigna variantes (p. ej. dark/neon para gym).
- Output: schema de página completo.
- El sistema:
  - Persiste el schema (proyecto nuevo).
  - Muestra preview (editor o vista solo lectura).
  - Opcionalmente exporta a código o publica.

**C) IA que modifica una app existente**

- Input: “Añade una sección de ofertas debajo del hero” o “Traduce todos los textos al inglés”.
- La IA devuelve un **diff** o un **nuevo schema**.
- El sistema aplica el diff al schema guardado y actualiza preview/export.

### 3.3 Qué necesita la IA para poder “crear apps”

1. **Documentación del catálogo:** Tipos de sección, qué hace cada uno, qué campos tiene (nombre, descripción, tipos de datos). Esto puede ser generado a partir del registro de componentes + metadatos.
2. **Schema de página bien definido:** JSON Schema o equivalente para validar página completa y por sección.
3. **API estable:** Endpoints (o funciones) para:
   - Listar tipos de sección y sus configs.
   - Crear/actualizar/eliminar sección.
   - Obtener/actualizar página completa.
   - (Opcional) Generar preview o export.
4. **Ejemplos de páginas:** Varias páginas de ejemplo (por nicho: gym, restaurante, spa) como JSON para few-shot o fine-tuning.
5. **Reglas de buen diseño (opcional):** “Un hero suele ir primero”, “Pricing suele tener 3 columnas”, etc., para que la IA genere estructuras coherentes.

### 3.4 IA propia vs existente

- **IA existente (GPT, Claude, etc.):**
  - Se usa vía API (OpenAI, Anthropic, etc.).
  - Se le pasa contexto (catálogo, schema actual, instrucción) y se parsea la respuesta a operaciones sobre el schema.
  - No requiere entrenar modelo propio; sí requiere buenos prompts y un “adapter” que convierta texto/JSON de la IA en llamadas al builder.
- **IA propia (modelo fine-tuned o pequeño):**
  - Entrenada con ejemplos de (brief, schema) o (instrucción, diff).
  - Ventaja: control total, privacidad, coste predecible.
  - Requiere datos de calidad (muchas páginas/schemas generados con la herramienta) y pipeline de entrenamiento.
- En ambos casos, el **contrato** es el mismo: schema de página + catálogo de componentes; la IA solo produce o modifica datos, no código arbitrario.

---

## 4. API del builder (headless) para IA e integraciones

### 4.1 Objetivo

- Exponer las operaciones del editor como **API** (REST o GraphQL) o como **servicio in-process** que otra capa (UI alternativa, IA, CLI, CI) pueda usar.
- La UI del editor actual sería un **cliente** de esta API, no la única forma de modificar la página.

### 4.2 Endpoints / capacidades sugeridas

- `GET /api/components` (o equivalente): listar tipos de sección con schema de config.
- `GET /api/pages/:id`: obtener schema de la página.
- `PUT /api/pages/:id`: reemplazar schema completo (con validación).
- `PATCH /api/pages/:id/sections`: añadir/actualizar/eliminar/reordenar secciones.
- `POST /api/pages/:id/preview`: devolver URL o HTML de preview (si el sistema lo soporta).
- `POST /api/pages/:id/export`: disparar export (ZIP, React, etc.) y devolver enlace o contenido.
- `POST /api/pages/:id/publish`: registrar “esta versión es la que quiero en producción” (ver sección 5).

### 4.3 Autenticación y permisos

- Para IA o integraciones externas: API keys o OAuth; permisos por proyecto/espacio.
- Para “cambios directos a producción”: solo usuarios/roles con permiso de publicación; el resto solo edición y preview.

---

## 5. Integración de cambios directos a producción

### 5.1 Objetivo

- Que una vez el usuario (o la IA) tenga la versión deseada, se pueda **publicar** con un flujo claro: preview → staging (opcional) → producción, con posibilidad de **rollback** y trazabilidad.

### 5.2 Flujo típico

1. **Edición:** Cambios en el editor (o vía API por IA); se guardan como **borrador** (base de datos o almacenamiento asociado al proyecto).
2. **Preview:** Cada borrador puede tener una **URL de preview** (ej. `preview.antostudios.com/proyecto/xyz?version=abc`) que sirve el mismo runtime (o estático) con el schema de esa versión. No es producción.
3. **Staging (opcional):** Versión “lista para revisar” desplegada en un entorno estable (staging.antostudios.com/proyecto/xyz). Cliente o equipo revisa antes de producción.
4. **Producción:** Acción explícita “Publicar” o “Deploy to production”:
   - Marca una versión concreta (schema + assets) como “live”.
   - El sistema de despliegue (propio o integrado) actualiza el sitio en producción con esa versión.
5. **Rollback:** Si algo falla, “volver a la versión anterior” = marcar otra versión como live y redesplegar.

### 5.3 Opciones técnicas de despliegue

- **Hosting estático (Vercel, Netlify, S3+CDN):**
  - El “export” genera HTML/CSS/JS (y assets).
  - CI/CD: al hacer “Publicar”, se dispara un job que ejecuta el export, sube los artefactos al bucket o al repo que conecta con Vercel/Netlify, y despliega.
- **Backend que sirve schema:**
  - Producción no es estático: una app (Angular u otra) lee el schema “live” desde una API/CMS.
  - “Publicar” = guardar el schema en la tabla/colección “production” y opcionalmente invalidar caché; la app de producción siempre lee desde ahí.
- **Híbrido:** Export estático para sitios simples; para sitios con lógica (reservas, formularios), backend que sirve schema + formularios.

### 5.4 Seguridad y auditoría

- **Solo ciertos roles** pueden hacer “Publicar a producción”.
- **Registro de publicaciones:** quién, cuándo, qué versión (id o tag); útil para rollback y auditoría.
- **Aprobaciones (enterprise):** Flujo de doble aprobación (ej. diseñador publica a staging, responsable publica a producción).

### 5.5 Integración con IA

- La IA puede **proponer** cambios (nuevo schema o diff); un humano aprueba y luego se publica.
- O en un flujo “supervisado”: la IA genera borrador → humano revisa en preview → humano pulsa “Publicar”.
- En un flujo más autónomo (con riesgos): la IA tiene permiso de publicar en staging; producción sigue siendo manual o con reglas estrictas.

---

## 6. Roadmap sugerido (visión a futuro)

### Fase 1: Consolidar núcleo (3–6 meses)

- Schema de página estable y documentado (JSON Schema).
- Registro de componentes como catálogo maquinaable (metadatos + config por tipo).
- Export estable (HTML/CSS o un framework) y flujo “Descargar ZIP” o “Preview enlace” desde el editor.
- (Opcional) API interna: servicios que operan sobre el schema sin depender de la UI; el editor los usa.

### Fase 2: API y preparación para IA (6–12 meses)

- API REST (o equivalente) para: leer/actualizar página, listar componentes, generar preview.
- Documentación del schema y del catálogo para consumo por IA (OpenAPI + descripciones).
- Adapter “IA → acciones”: prompt + parser que convierta respuesta de un LLM en operaciones sobre el schema (añadir sección, editar texto, etc.).
- Pruebas con un LLM existente (GPT/Claude) vía chat en el editor o script externo.

### Fase 3: Producción y despliegue (en paralelo o después)

- Flujo “Publicar”: elegir versión, disparar export y deploy (Vercel/Netlify/propio).
- Preview y staging con URLs estables.
- Rollback y registro de publicaciones.
- Permisos y roles para publicación.

### Fase 4: IA como productor de apps (12+ meses)

- Flujo “Generar app desde brief” usando IA + catálogo + ejemplos.
- Fine-tuning o pipeline propio si se quiere un modelo específico para “generación de schemas”.
- Integración con flujo de aprobación y publicación (IA propone, humano publica o IA publica en staging).

---

## 7. Resumen

- **Modularización:** Separar núcleo (schema, registro, export) de la UI del editor; exponer operaciones vía API para que cualquier cliente (humano o IA) pueda crear y modificar páginas.
- **Framework propio:** Componentes + design tokens + reglas de composición como base común; la “creación” es generación/modificación de **datos** (schema), no de código libre.
- **IA:** Propia o existente puede “crear apps” generando o modificando el schema de página; necesita catálogo documentado, schema claro y API estable; el editor (o otra UI) aplica los cambios y muestra el resultado.
- **Producción:** Preview → (staging) → publicación explícita → despliegue automático (estático o backend) con rollback y auditoría; la IA puede proponer o publicar en staging, con producción controlada por reglas y permisos.

Con esto, la app puede evolucionar hacia una **plataforma** donde tanto humanos como agentes IA construyen experiencias sobre el mismo framework de componentes y el mismo flujo hasta producción.

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0
