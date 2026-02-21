# 🏢 Plan: Oportunidades de negocio del sistema integrado (ATS + Anto Studios)

**Objetivo:** Definir oportunidades de negocio y modelos de ingreso específicos del **sistema integrado** (hub ATS + Anto Studios como motor de producción), más allá de las oportunidades de cada app por separado.

**Referencias:** DOC_OPORTUNIDADES_NEGOCIO.md, DOC_INTEGRACION_ATS_ANTO_STUDIOS.md, MVP_BUSINESS_PLAN.md.

---

## 1. Propuesta de valor del sistema integrado

### 1.1 En una frase

**“Un solo hub donde ves todo tu código, tus métricas, tu IA y tus sitios en vivo, y publicas a producción con un clic y con control.”**

- **ATS** aporta: visión 360 (repos, calidad, seguridad, CI, dependencias, sprints, roadmap, informes IA).
- **Anto Studios** aporta: creación de sitios/landings y export a código o publicación.
- **Integración** aporta: un único lugar para **controlar** (métricas + activos vivos) y **actuar** (analizar, publicar, hacer rollback, auditar), con opción de quality gates y trazabilidad completa.

### 1.2 Evolución natural: Wix + Trello + Figma + CI/CD, todo en uno

El sistema integrado es la **evolución natural** de herramientas que hoy están separadas:

- **Wix** (crear sitios) + **Trello** (gestión de tareas y sprints) + **Figma** (diseño y componentes) + **CI/CD** (análisis, calidad, despliegue), unificados en un solo producto.
- Objetivo: que **un agente pueda hacer lo que hoy hace un desarrollador** (diseñar, configurar, analizar, publicar), y que **los devs centren sus esfuerzos en mejorar la IA propia de la empresa** para construir productos, en lugar de repartir su tiempo entre muchas herramientas y tareas repetitivas.

Así el cliente no compra "otra herramienta más", sino **el lugar donde el equipo y la IA trabajan juntos** con código, diseño, sprints y producción en un solo flujo.

### 1.3 Diferenciación frente a productos por separado

| Aspecto | Solo ATS | Solo Anto | **Sistema integrado** |
|---------|----------|-----------|------------------------|
| Visión de código y calidad | ✅ | ❌ | ✅ |
| Creación de sitios/landings | ❌ | ✅ | ✅ |
| Publicación controlada desde un hub | ❌ | Parcial | ✅ (centralizado) |
| Quality gate antes de publicar | N/A | ❌ | ✅ |
| Logs y flujos exportables para IA | Parcial | ❌ | ✅ (unificado) |
| Un solo producto comercial | No | No | **Sí** |

El **cliente integrado** compra “control total + producción desde un solo sitio”, no dos herramientas sueltas.

---

## 2. Segmentos de cliente para el sistema integrado

### 2.1 Agencias y dev shops (prioritario)

- **Necesidad:** Entregar sitios y apps a clientes con rapidez, manteniendo calidad y trazabilidad. Gestionar varios proyectos (repos + landings) desde un solo panel.
- **Propuesta:** “Hub único: analizas el repo, ves métricas e IA, diseñas o ajustas la landing en Anto, y publicas a producción (o staging) desde el mismo lugar, con quality gate y auditoría.”
- **Precio orientativo:** €199–499/mes por equipo (incluye análisis ilimitado de repos del workspace + N sitios Anto + publicación controlada).
- **Upsell:** Más sitios, más repos, informes IA premium, flujos guardados y automatización.

### 2.2 Product companies con marketing y dev

- **Necesidad:** Equipos de producto que quieren landings y páginas de marketing sin depender solo de dev; pero que exigen que el código del producto (repo) cumpla estándares antes de desplegar nada.
- **Propuesta:** “Marketing diseña en Anto; ingeniería ve en el hub el estado del repo y de las publicaciones; nadie publica a prod sin pasar quality gate.”
- **Precio orientativo:** €2.000–8.000/mes (por volumen de repos, sitios y usuarios).

### 2.3 Empresas con múltiples marcas o verticales

- **Necesidad:** Muchas landings o micrositios (una por marca, evento o región) con un control centralizado y métricas de calidad y coste.
- **Propuesta:** “Todos los sitios (Anto) y todos los repos en un hub; publicación y rollback desde un solo lugar; informes IA agregados por marca o por proyecto.”
- **Precio orientativo:** Por volumen (sitios + repos + usuarios); enterprise (€10k–50k/año).

### 2.4 Freelancers y equipos pequeños que quieren “parecer grandes”

- **Necesidad:** Ofrecer a clientes no solo “una web” sino “una web con métricas, calidad y posibilidad de ver cómo se publica”.
- **Propuesta:** “Dashboard profesional: muestras al cliente el hub (solo vista si quieres), publicas con un clic y tienes historial y rollback.”
- **Precio orientativo:** €49–99/mes (plan “Pro integrado”).

---

## 3. Modelos de ingreso del sistema integrado

### 3.1 SaaS por niveles (recomendado)

- **Tier “Starter” (€49–79/mes):**
  - 1–2 repos analizados, 1–2 sitios Anto, publicación a staging y producción básica.
  - Logs exportables; sin flujos guardados avanzados.
- **Tier “Agency” (€199–299/mes):**
  - Repos ilimitados (o por límite alto), 5–10 sitios Anto, quality gate configurable, historial de publicaciones y rollback.
  - Flujos guardados como templates; export de logs para IA.
- **Tier “Company” (€799–1.999/mes):**
  - Múltiples workspaces, SSO, roles (solo vista, publicar, admin), integraciones (GitHub, Vercel, Netlify), informes IA incluidos.
  - API del hub para integrar con CI/CD o herramientas propias.
- **Tier “Enterprise” (€10.000–50.000/año):**
  - Instancia dedicada o VPC, SLA, soporte prioritario, formación, flujos y políticas a medida.

### 3.2 Add-ons sobre la base integrada

- **Más sitios Anto** (por paquete).
- **Más análisis de repos** (por repo o por ejecución).
- **Informes IA premium** (más profundos o más frecuentes).
- **Flujos automatizados** (ej. “cada merge a main → análisis + si pasa gate → publicar sitio X a staging”).
- **Almacenamiento de logs y flujos** (retención larga, export masivo).

### 3.3 Marketplace y servicios

- **Plantillas Anto** vendidas dentro del hub (revenue share con creadores).
- **Servicios profesionales:** Configuración del hub, diseño de quality gates, formación, integración con sistemas del cliente (CRM, analytics).

---

## 4. Oportunidades concretas por capacidad

### 4.1 Visión 360 + publicación desde el hub

- **Oportunidad:** Vender “un solo panel” como producto premium; el cliente paga por la integración, no solo por ATS o Anto por separado.
- **Métrica de valor:** Reducción de tiempo “de decisión a producción” y menos errores por publicar desde múltiples herramientas.

### 4.2 Quality gate antes de publicar

- **Oportunidad:** Empresas reguladas o con alta exigencia de calidad pagan por “no poder publicar si el repo no pasa”.
- **Posicionamiento:** “Compliance y control en un solo producto.”

### 4.3 Logs y flujos para IA

- **Oportunidad:** Ofrecer “contexto exportable en tiempo real para tu IA” (logs de cualquier flujo) como feature diferenciador para equipos que usan IA interna o externa.
- **Monetización:** Incluido en tiers altos; en tiers bajos como add-on (ej. “Export de flujos para IA” o “N consultas IA/mes sobre tus flujos”).

### 4.4 Flujos guardados y automatización

- **Oportunidad:** “Automatiza análisis + publicación” como flujo guardado o job programado; el cliente paga por automatización y ahorro de tiempo.
- **Precio:** Incluido en Agency/Company; límite de flujos automáticos por tier o add-on.

### 4.5 Auditoría y cumplimiento

- **Oportunidad:** Historial de “quién publicó qué y cuándo” + logs exportables = valor para auditoría y compliance.
- **Target:** Empresas que necesitan demostrar controles de cambio (finanzas, salud, sector público).

---

## 5. Go-to-market del sistema integrado

### 5.1 Mensaje principal

- **Headline:** “Controla tu código, tus sitios y tu producción desde un solo hub.”
- **Subhead:** “Análisis técnico, calidad, IA y publicación de sitios en un único panel. Publica con un clic cuando todo esté en verde.”
- **Proof points:** “Quality gate integrado”, “Logs exportables para IA”, “Rollback en un clic”, “Visión 360 de repos y sitios”.

### 5.2 Canales

- **Desarrolladores y tech leads:** Reddit, Hacker News, dev.to, LinkedIn (casos de uso “hub único”).
- **Agencias:** LinkedIn, partnerships con plataformas de hosting (Vercel, Netlify), eventos de agencias.
- **Product companies:** Product Hunt (relanzamiento como “sistema integrado”), contenido “cómo unificar dev y marketing”.

### 5.3 Packaging

- **Opción A:** Un solo producto “Angel Hub” (o nombre de marca) que incluye ATS + Anto + integración; precios por tier como arriba.
- **Opción B:** ATS y Anto se venden por separado pero con un “bridge” o “Hub” como add-on que une ambos y habilita publicación centralizada y quality gate; el cliente paga ATS + Anto + Hub.
- **Recomendación inicial:** Opción A (un solo producto integrado) para simplificar mensaje y venta; opción B si ya hay clientes que solo quieren una de las dos piezas.

---

## 6. Métricas de éxito del negocio integrado

- **Adopción:** Número de workspaces que usan al menos 1 análisis ATS y 1 sitio Anto en el mismo periodo.
- **Publicaciones desde el hub:** % de publicaciones a prod que se hacen desde el hub (vs desde Anto solo).
- **Uso de quality gate:** Número de publicaciones bloqueadas por gate y número de clientes que activan gate.
- **Uso de logs/flujos para IA:** Número de exports de logs y de flujos guardados por cliente.
- **Ingresos:** MRR/ARR por tier; % de ingresos por add-ons (más sitios, más repos, IA, automatización).

---

## 7. Resumen

- El **sistema integrado** se vende como **un producto**: hub único con visión 360 (código + sitios) y capacidad de publicar (y hacer rollback) con control y trazabilidad.
- **Segmentos clave:** Agencias, product companies, empresas multi-marca, freelancers que quieren ofrecer “hub profesional”.
- **Modelo:** SaaS por niveles (Starter, Agency, Company, Enterprise) + add-ons (más sitios/repos, IA, flujos, retención de logs).
- **Oportunidades diferenciadas:** Quality gate, logs exportables para IA, flujos guardados, auditoría y compliance.
- **Go-to-market:** Un solo nombre/producto (“Angel Hub” o similar), mensaje “control + producción en un solo lugar”, canales dev y agencias.

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0
