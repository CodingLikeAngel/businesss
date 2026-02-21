# 🏢 Línea de Negocio y Oportunidades con la Herramienta Anto Studios

**Objetivo:** Definir las líneas de negocio, segmentos de cliente y oportunidades de monetización que permite esta herramienta (editor visual + componentes + exportación de código).

**Referencias:** MVP_BUSINESS_PLAN.md, analisis_mvp_y_negocio.md, PLAN_MAESTRO_MVP_DETALLADO.md.

---

## 1. Propuesta de valor central

**"Diseña una vez, usa en todas partes"**

- Editor visual que **no solo diseña webs**, sino que **exporta componentes nativos** para varios entornos (React, Angular, Vue, Web Components, HTML/CSS).
- Estética **premium/cyberpunk/glass** por defecto: diferenciación frente a constructores genéricos (Wix, Elementor).
- **Componentes de nicho** (gimnasio, restaurante, spa, portfolio, etc.) que permiten verticales específicas y menor tiempo de entrega.

---

## 2. Ventaja competitiva resumida

| Capacidad              | Wix | Figma | Storybook | **Anto Studios** |
|------------------------|-----|-------|-----------|------------------|
| Editor visual          | ✅  | ✅    | ❌        | ✅               |
| Design tokens          | ❌  | ✅    | ❌        | ✅               |
| Export React/Angular/Vue | ❌ | ❌    | ❌        | ✅               |
| Export Web Components  | ❌  | ❌    | ❌        | ✅               |
| No-code + código real  | ❌  | ❌    | ❌        | ✅               |

**Component-as-Code:** Lo que se diseña en el editor se puede entregar como código listo para integrar en proyectos reales, no como HTML estático cerrado.

---

## 3. Líneas de negocio y modelos de ingreso

### 3.1 SaaS Web Builder (B2C)

- **Target:** Pequeños negocios, emprendedores, profesionales.
- **Precio orientativo:** €29–49/mes.
- **Propuesta:** "Tu web profesional en 30 minutos".
- **Incluye:** Plantillas por industria, editor drag-and-drop, hosting (si se ofrece), SEO básico.
- **Oportunidad:** Competir en **nicho** (no en masa tipo Wix): negocios que valoran imagen (restaurantes, gimnasios, spas, estudios creativos).

### 3.2 Component Builder Pro (B2B – Dev Tools)

- **Target:** Agencias, product companies, dev shops.
- **Precio orientativo:** €99–299/mes por seat.
- **Propuesta:** "Construye tu design system sin escribir boilerplate".
- **Incluye:** Export sin marca de agua, React/Angular/Vue/Web Components, API, preview para clientes, clonado de plantillas, inyección de CSS/JS custom, colaboración multi-usuario, integración tipo Storybook.
- **Oportunidad:** Quienes ya usan React/Angular/Vue y buscan velocidad y consistencia; el export de código es el argumento de venta principal.

### 3.3 Template Marketplace (B2C + B2B)

- **Target:** Freelancers, desarrolladores, pequeñas empresas.
- **Modelo:** Revenue share (ej. 70% creador, 30% plataforma).
- **Precios sugeridos:** Basic €49, Industry €99–149, Full Business €199.
- **Oportunidad:** Monetizar el ecosistema: plantillas y bloques premium que se construyen y venden con la misma herramienta.

### 3.4 Licencia Enterprise

- **Target:** Grandes empresas, equipos de diseño/ingeniería.
- **Precio orientativo:** €5.000–50.000/año.
- **Propuesta:** "Design system centralizado para tu organización".
- **Incluye:** Instancia dedicada, SSO/SAML, integraciones a medida, soporte prioritario, formación.
- **Oportunidad:** Empresas que quieren una única fuente de verdad para componentes y que ya invierten en design systems.

### 3.5 SaaS vertical por industria (recomendado en análisis)

- **Productos tipo:** "Anto Gyms", "Anto Resto", "Anto Spas".
- **Precio orientativo:** €29–49/mes por vertical.
- **Incluye:** Hosting, editor, plantillas específicas del sector, funcionalidades de dominio (reservas, horarios, menús).
- **Ventaja:** Nichos pagan más y rotan menos si el producto resuelve su problema concreto (no un “constructor genérico”).

### 3.6 Lifetime Deal (LTD) para validación

- **Uso:** Validar MVP en plataformas tipo AppSumo.
- **Precio orientativo:** €69–129 pago único.
- **Ventaja:** Entrada de capital y feedback de power users antes de escalar a modelos recurrentes.

---

## 4. Segmentos de cliente prioritarios

### Tier 1: Agencias de desarrollo

- **Por qué:** Ya trabajan con React/Angular/Vue; necesitan velocidad y reutilización.
- **Problema que resolvemos:** Mantener design systems y entregar código consistente sin reimplementar cada vez.
- **Precio orientativo:** €199–499/seat/mes.

### Tier 2: Product companies

- **Por qué:** Handoff diseño–desarrollo es costoso; design systems son difíciles de mantener.
- **Propuesta:** Single source of truth: diseñar en el editor, exportar a código.
- **Precio orientativo:** €2.000–20.000/mes según tamaño.

### Tier 3: Freelancers

- **Por qué:** Clientes piden "el código" y entregas con aspecto profesional.
- **Propuesta:** Entregar componentes reales, no solo maquetas o HTML estático.
- **Precio orientativo:** €29–99/mes.

### Tier 4: Dueños de negocios "de imagen"

- **Ejemplos:** Restaurantes de autor, estudios de fitness boutique, clínicas estéticas, spas, DJs/eventos.
- **Por qué:** Necesitan web sofisticada sin contratar agencia a €10k; la estética premium del editor encaja.
- **Precio orientativo:** €29–49/mes (SaaS vertical o builder básico).

---

## 5. Casos de uso concretos

- **Agencia → App del cliente:** Diseño en Anto Studios → Export a React/Next.js → Integración en el proyecto del cliente → El cliente puede mantener el código.
- **Equipo de design system:** Diseño de componentes en el editor → Export como librería (NPM) → Distribución interna.
- **Empresa SaaS multi-producto:** Componentes reutilizables diseñados una vez → Export y uso en varios productos → Consistencia total.
- **Freelancer:** Entrega de componentes reales y código limpio → Cliente valora el entregable → Posibilidad de upsell (mantenimiento, nuevas secciones).
- **Restaurante / Gym / Spa:** Elección de plantilla de nicho → Personalización en el editor → Publicación (o export) para web y reservas/horarios.

---

## 6. Oportunidades de integración y ecosistema

- **Vercel / Netlify:** Publicación directa desde el editor (deploy de estático o SSR si en el futuro se soporta).
- **Figma:** Plugin de importación (diseño en Figma → componentes en Anto Studios) o flujo inverso (export para documentar en Figma).
- **Storybook:** Addon o generación de `.stories` en el export para documentar componentes.
- **GitHub / GitLab:** Integración para commit de código generado, ramas de preview, CI/CD.
- **Pasarelas de pago:** Para planes premium, marketplace de plantillas y funcionalidades verticales (reservas, pagos).

---

## 7. Quick wins de negocio (según plan existente)

1. **Export sin watermark** → Habilitar venta a agencias.
2. **Preview links para clientes** → Freelancers y agencias pueden cobrar más por presentaciones profesionales.
3. **Clonado de plantillas** → Clientes con múltiples sitios o múltiples proyectos.
4. **Export React (y después Angular/Vue)** → Mercado más grande y adopción en equipos técnicos.
5. **Design tokens en export** → Valor para compradores enterprise y equipos de design system.

---

## 8. Riesgos y mitigación

- **Calidad del código exportado:** Desarrolladores son exigentes → Tests automáticos de export, opciones strict/flexible, feedback de comunidad.
- **Soporte multi-framework:** Más superficie de testing → Priorizar 1–2 frameworks al inicio (p. ej. React + Angular) y documentar límites.
- **No competir en precio con Wix en masa:** Enfocarse en nicho y en valor (código, estética, verticales) en lugar de precio bajo.

---

## 9. Resumen ejecutivo

La herramienta permite **varias líneas de negocio** en paralelo:

1. **B2C:** Builder SaaS por vertical (gym, resto, spa) y/o builder general con plantillas.
2. **B2B:** Herramienta de productividad para agencias y empresas (export de código, design system).
3. **Marketplace:** Venta de plantillas y componentes premium.
4. **Enterprise:** Licencia y servicios para grandes organizaciones.

La **ventaja diferencial** es la combinación de editor visual, design tokens y **exportación a código real** (React, Angular, Vue, Web Components), lo que posiciona el producto entre el no-code y el código profesional y abre oportunidades de integración con IA, pipelines de producción y ecosistema dev (ver documento de visión modularización e IA).

---

## 10. Sistema integrado (ATS + Anto Studios)

Para **oportunidades de negocio del sistema integrado** (hub ATS + Anto Studios como un solo producto), ver:

- **ideas/PLAN_OPORTUNIDADES_NEGOCIO_INTEGRADO.md** – Segmentos, modelos de ingreso, go-to-market y métricas del producto integrado.

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0
