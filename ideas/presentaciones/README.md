# Presentaciones · Ideas y planes

Presentación en HTML para clientes, CEOs, CTOs y jefes de desarrollo.

## Cómo usar

1. **Abrir en el navegador:** Abre `index.html` directamente (doble clic o arrastrar al navegador).
2. **Servir por HTTP (opcional):** Si quieres evitar restricciones de CORS al cargar fuentes o recursos:
   ```bash
   npx serve .
   # o: python -m http.server 8080
   ```
   Luego visita `http://localhost:3000` (o 8080).

## Contenido

- **Portada** — Título y índice.
- **Visión · IA y producción** — Para CEO/CTO. Modularización, schema de página, API headless, integración con IA, producción controlada. Ref: `DOC_VISION_MODULARIZACION_IA_PRODUCCION.md`.
- **Negocio integrado** — Para CEO/CTO. Sistema ATS + Anto Studios, segmentos, modelos SaaS, quality gate. Ref: `PLAN_OPORTUNIDADES_NEGOCIO_INTEGRADO.md`.
- **ATS como herramienta** — Para CEO/CTO. ATS (Automated Technical Scoring) como producto standalone: qué es, propuesta de valor, capacidades (análisis, SonarQube, IA Gemini, dashboard 360), stack técnico, para quién. Ref: proyecto `ats` (repositorio ATS).
- **Oportunidades Anto Studios** — Para CEO/CTO. Propuesta de valor, ventaja competitiva, líneas de negocio. Ref: `DOC_OPORTUNIDADES_NEGOCIO.md`.
- **Logs y flujos para IA** — Para **jefes de desarrollo** / tech leads. Logs por paso, export en tiempo real, flujos guardados, contexto para IA. Ref: `profundizar/DOC_LOGS_FLUJOS_IA.md`.
- **Cierre** — Resumen y próximos pasos.

## Exportar a PDF

Abre `index.html` en Chrome o Edge → Menú → Imprimir → **Guardar como PDF**. Ajusta márgenes si hace falta. La hoja de estilos incluye reglas `@media print` para una impresión más limpia.

## Audiencia

- **CEO / CTO:** Secciones Visión, Negocio integrado, Oportunidades Anto.
- **Jefes de desarrollo / tech leads:** Sección Logs y flujos (trazabilidad, depuración, IA, flujos guardados).
