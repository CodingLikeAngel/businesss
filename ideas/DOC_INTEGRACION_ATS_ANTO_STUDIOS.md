# 🔗 Integración ATS + Anto Studios: Hub Automatizado y Producción

**Objetivo:** Definir cómo integrar **ATS (Automated Technical Scoring)** con **Anto Studios (editor visual)** para formar un **sistema automatizado** donde los desarrolladores controlen un **hub único** con visión 360 y capacidad de **trabajar y producir directamente en producción**.

**Documentos relacionados:** DOC_VISION_MODULARIZACION_IA_PRODUCCION.md, DOC_OPORTUNIDADES_NEGOCIO.md, DOC_MEJORAS.md.

---

## 1. Resumen de cada aplicación

### 1.1 ATS (Automated Technical Scoring) – `ats`

- **Qué es:** Sistema de análisis técnico y scoring de proyectos (repos y código).
- **Stack:** NestJS (API), Angular (frontend `codinglikeangel`), Nx, Gemini AI, SonarQube, simple-git, ts-morph.
- **Capacidades actuales:**
  - **Análisis de proyecto:** AST, métricas estructurales, calidad, seguridad, dependencias, CI/CD.
  - **SonarQube:** Integración para quality gates y métricas de código.
  - **Repo analyzer:** Clonado y análisis de repositorios (local y remoto).
  - **Gemini (IA):** Informes estratégicos agregando datos de todos los proyectos del workspace; informes de evaluación de código (score + markdown).
  - **Dashboard (visión 360):** Múltiples paneles: Repo (con **Hero Hub** como “base”), ATS/Project Summary, Sonar, CI, Security, LLM Report, Roadmap, Sprints, Bundle analysis, Cloud cost, Deps, DevEx, Feature flags, Licenses, Team culture, Web performance, Prompt optimizer.
  - **Arquitectura:** Clean/hexagonal (domain, application, infrastructure); módulos desacoplados.
- **Rol en la integración:** **Hub de control** para devs: un único entorno donde ver todo (métricas, IA, sprints, roadmap) y, en el futuro, actuar sobre builds, deploys y “activos de producción” (p. ej. sitios generados con Anto).

### 1.2 Anto Studios (editor visual) – `businesss`

- **Qué es:** Editor visual de páginas/sitios basado en secciones, layout flexible, variantes y componentes propios (UI + featured).
- **Capacidades actuales:**
  - **Editor:** Secciones arrastrables, modo aislado, variantes por sección, design tokens.
  - **Store:** Estado de página (secciones, visibilidad, estilos globales) persistido (p. ej. localStorage / variantes).
  - **Export:** Diseño de exportación a React, Angular, Vue, Web Components (arquitectura en COMPONENT_EXPORT_ARCHITECTURE).
  - **Schema de página:** JSON con secciones, contenido y estilos = contrato para render, export e IA.
- **Rol en la integración:** **Motor de producción de experiencias:** lo que se “construye” (landings, webs, componentes) y lo que puede **exportarse** o **desplegarse** a preview/staging/producción.

---

## 2. Visión del sistema integrado

### 2.1 Objetivo

- **Un hub (ATS)** donde el equipo tiene:
  - **Visión 360:** código (repos), calidad, seguridad, CI, deps, sprints, roadmap, costes, IA, etc.
  - **Visión de “activos vivos”:** sitios/landings/apps generados con Anto Studios (preview, staging, producción).
  - **Acciones directas:** lanzar análisis, ver informes IA, **publicar a producción** (o a staging) desde el mismo lugar, rollback, auditoría.
- **Anto Studios** como **herramienta de creación** que el hub puede:
  - **Orquestar:** “Crear nueva landing para proyecto X”, “Exportar proyecto Y a React”.
  - **Monitorizar:** Estado de builds/export, última publicación, versión en producción.
  - **Desplegar:** Disparar publicación (schema → export → deploy) desde ATS o desde Anto con flujo unificado.

### 2.2 Diagrama de alto nivel

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                    HUB ATS (Control Central)                   │
                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
                    │  │ Repo / Hero │  │ Sonar, CI, │  │ Anto Studios         │   │
                    │  │ Hub, ATS    │  │ Security   │  │ (Sitios / Landings)  │   │
                    │  │ Sprints     │  │ Deps, etc. │  │ - Lista proyectos    │   │
                    │  └─────────────┘  └─────────────┘  │ - Preview / Staging  │   │
                    │                                    │ - Publicar a Prod    │   │
                    │  ┌─────────────┐  ┌─────────────┐  │ - Rollback           │   │
                    │  │ Gemini / LLM│  │ Roadmap,    │  └──────────┬──────────┘   │
                    │  │ Reports     │  │ DevEx      │               │              │
                    │  └─────────────┘  └─────────────┘              │              │
                    └────────────────────────────────────────────────┼──────────────┘
                                                                     │
         ┌────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────┐
         │                                                            ▼                                                             │
         │  ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
         │  │                    ANTO STUDIOS (Motor de producción)                                                             │  │
         │  │  - Editor visual (diseño de páginas)                                                                               │  │
         │  │  - API headless (schema CRUD, export, preview)  ←── Consumida por ATS y/o IA                                      │  │
         │  │  - Export (React, Angular, Vue, Web Components)                                                                    │  │
         │  │  - Publicación (preview → staging → producción)                                                                   │  │
         │  └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
         │                                                            │                                                             │
         │                                                            ▼                                                             │
         │  ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
         │  │                    PRODUCCIÓN                                                                                    │  │
         │  │  - Sitios estáticos (Vercel, Netlify, S3)  -  Apps (React/Angular/Vue)  -  Versiones, rollback, auditoría        │  │
         │  └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
         └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Cómo se complementan las dos apps

### 3.1 ATS aporta al sistema

- **Un solo lugar para “ver todo”:** Repos, calidad, seguridad, CI, dependencias, sprints, roadmap, costes, informes IA. El dev no cambia de herramienta para el día a día técnico.
- **Contexto para decisiones de publicación:** Score ATS, estado de Sonar, seguridad y deps pueden condicionar o bloquear “Publicar a producción” (p. ej. solo si quality gate pasa).
- **IA estratégica:** Gemini ya agrega datos de proyectos; puede extenderse a “recomendar publicar” o “alertar antes de publicar” según métricas.
- **Trazabilidad:** Si desde ATS se dispara una publicación de un sitio Anto, queda registrado en el hub (quién, cuándo, qué versión), alineado con la idea de auditoría y trabajo directo en producción.

### 3.2 Anto Studios aporta al sistema

- **Activos listos para producción:** Páginas, landings, componentes exportables y desplegables. El “qué” se publica tiene formato claro (schema + export).
- **API del builder (cuando exista):** Permite al hub (o a un agente IA) crear/editar páginas por API, generar preview y disparar export/publicación sin pasar solo por la UI del editor.
- **IA generativa (futuro):** Según DOC_VISION_MODULARIZACION_IA_PRODUCCION, la IA puede generar o modificar el schema de página; ese flujo puede orquestarse desde el hub (ej. “Generar landing para evento X” → IA produce schema → Anto exporta → hub muestra preview y opción “Publicar”).

### 3.3 Flujo “trabajar y producir directamente en producción”

1. **Desde el hub (ATS):**
   - El dev ve el panel de “Anto Studios” (lista de sitios/proyectos, estado: borrador, staging, producción).
   - Elige un proyecto, ve preview y/o enlace a staging.
   - Pulsa “Publicar a producción” (o “Promover staging → prod”). El hub llama a la API de Anto (o al servicio de deploy) con la versión elegida.
   - El resultado (éxito/error, URL, versión) se muestra en el hub y queda registrado.
2. **Desde Anto Studios:**
   - El dev diseña en el editor, guarda, genera preview/staging.
   - Desde el mismo flujo de Anto (o desde un botón “Abrir en Hub”) puede ir al hub para ver métricas del repo asociado, informes IA, y desde ahí ejecutar “Publicar a producción” si se desea centralizar todas las publicaciones en ATS.
3. **Reglas y seguridad:** Solo ciertos roles pueden publicar; el hub puede exigir que el repo pase quality gate (Sonar/ATS) antes de permitir publicar. Rollback y auditoría se gestionan en un solo lugar (hub).

---

## 4. Integración técnica (opciones)

### 4.1 Nivel 1: Dashboard unificado (visor)

- **En ATS:** Nuevo módulo o panel “Anto Studios” / “Sitios”.
  - Lista de proyectos/sitios (origen: API de Anto o fichero de configuración que apunte a proyectos conocidos).
  - Por cada uno: nombre, última versión, enlace a preview, enlace a staging, enlace a producción (si existe), última publicación.
  - Enlaces a “Abrir en editor” (Anto Studios) y “Ver en Hub” (quedarse en ATS).
- **Comunicación:** ATS lee datos vía **API REST** expuesta por un backend de Anto (o por un servicio compartido que persista “proyectos Anto” y su estado de publicación). No es obligatorio que Anto y ATS compartan monorepo; pueden ser dos despliegues con API en común.

### 4.2 Nivel 2: Acciones desde el hub

- **Publicar a staging / producción:** El hub (ATS) tiene botones que llaman a la API de Anto (o al pipeline de deploy):
  - Ejemplo: `POST /api/anto/publish` con `{ projectId, versionId, target: 'staging' | 'production' }`.
  - Anto (o un servicio de deploy) ejecuta export + deploy y devuelve URL y estado.
- **Rollback:** Desde el hub se elige una versión anterior y se llama a `POST /api/anto/rollback` (o equivalente). El historial de versiones puede vivir en Anto o en un servicio compartido.
- **Disparar export:** “Exportar a React” (o Angular/Vue) desde el hub, descargar ZIP o ver enlace a artefacto. Útil para equipos que quieren el código en el repo; el hub centraliza la acción.

### 4.3 Nivel 3: Condiciones de publicación (quality gate)

- ATS ya tiene scores (ATS, Sonar, seguridad, deps). Se puede definir una **política:** “Solo permitir Publicar a producción si el repo asociado tiene ATS score > X y Sonar quality gate passed”.
- El hub consulta las métricas (ya disponibles en ATS) y habilita o deshabilita el botón “Publicar a producción” y muestra el motivo (ej. “Sonar: 2 bugs abiertos”).

### 4.4 Nivel 4: IA y automatización

- **Gemini (o otra IA)** en ATS ya genera informes a partir de datos agregados. Se puede ampliar el contexto con “estado de sitios Anto” (última publicación, errores de build, etc.) para que el informe incluya recomendaciones sobre publicación o contenido.
- **Generación de contenido (Anto):** Si Anto expone una API headless para crear/actualizar schema (DOC_VISION_MODULARIZACION_IA_PRODUCCION), el hub puede invocar “Generar landing para X” → IA produce schema → Anto guarda y devuelve preview URL → el hub muestra el resultado y ofrece “Publicar” cuando el humano apruebe.

### 4.5 Despliegue y entorno

- **Opción A – Dos apps separadas:** ATS y Anto Studios son dos aplicaciones desplegadas por separado. Se comunican por API (HTTPS). El hub (ATS) tiene una “sección” que consume la API de Anto (o un BFF que agregue ATS + Anto).
- **Opción B – Monorepo único:** Si en el futuro ATS y Anto viven en el mismo Nx monorepo, se puede tener una app “Portal” que agrupe el dashboard ATS y embeba o enlace el editor Anto, y un único backend que exponga tanto métricas ATS como endpoints de Anto (schema, export, publish).
- **Opción C – Microservicios:** Servicio “Anto API” (schema, export, publish) y servicio “ATS API” (análisis, métricas, IA); un frontend “Hub” que consume ambos. Permite escalar y desplegar de forma independiente.

---

## 5. Visión 360 en el hub

### 5.1 Lo que ATS ya ofrece (360 de “código y proceso”)

- Repo (incl. Hero Hub como base visual del repo).
- ATS / Project Summary (scoring y métricas del proyecto).
- SonarQube (calidad, bugs, vulnerabilidades, code smells).
- CI (pipelines, builds).
- Security (análisis de seguridad).
- Dependencies.
- Roadmap, Sprints.
- Bundle analysis, Cloud cost, DevEx, Feature flags, Licenses, Team culture, Web performance.
- Informes LLM (Gemini).
- Prompt optimizer.

### 5.2 Lo que se añade con Anto Studios (360 de “activos y producción”)

- **Panel “Sitios / Landings” (Anto):**
  - Lista de proyectos/sitios creados con Anto.
  - Estado: borrador, en staging, en producción.
  - Última publicación (fecha, versión, quien).
  - Acciones: Abrir editor, Ver preview, Ver staging, **Publicar a producción**, Rollback, Export (React/Angular/Vue).
- **Reglas de publicación:** Indicadores que bloquean o advierten (ej. “Quality gate no pasado”) usando datos que ATS ya tiene.
- **Auditoría:** Historial de publicaciones (desde el hub) con usuario, fecha, versión, entorno (staging/prod).

Con esto, el hub pasa a ser **360 de código + activos vivos + producción**: el dev controla análisis, IA, sprints y también qué está publicado y qué puede publicar o revertir.

---

## 6. Roadmap de integración sugerido

| Fase | Objetivo | ATS | Anto Studios |
|------|----------|-----|----------------|
| **1** | Visión en el hub | Nuevo panel “Sitios Anto” (lista + enlaces a preview/prod si existen). | Exponer API básica de “lista de proyectos” y estado de publicación (o mock/fichero). |
| **2** | Publicar desde el hub | Botón “Publicar a producción” que llama a API de Anto. | API `POST /publish` (o integración con pipeline) y registro de versión publicada. |
| **3** | Quality gate | Comprobar métricas ATS/Sonar antes de permitir publicar; mostrar motivo si está bloqueado. | (Opcional) API que reciba webhook o consulta de “¿puedo publicar?” con repo/proyecto. |
| **4** | Rollback y auditoría | Botón “Rollback”, historial de publicaciones en el hub. | API de rollback y almacén de versiones/historial. |
| **5** | IA y automatización | Incluir estado de sitios Anto en contexto de Gemini; recomendaciones de publicación. | API headless para crear/actualizar schema (para IA o automatización). |

---

## 7. Resumen

- **ATS** = hub de control con visión 360 (repos, calidad, seguridad, CI, IA, sprints, roadmap, etc.) y, con la integración, **visión de activos Anto y control de publicación**.
- **Anto Studios** = motor de creación y publicación (editor, schema, export, preview, staging, producción).
- **Integración:** Panel en ATS para “Sitios Anto”, APIs para listar, publicar y hacer rollback, y opcionalmente quality gates y IA que recomienden o condicionen la publicación.
- **Resultado:** Los devs trabajan desde **un solo entorno (hub)** con visión completa y capacidad de **producir directamente en producción** (publicar, revertir, auditar) sin dejar de usar el editor Anto para diseñar; el sistema queda más automatizado y trazable.

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0
