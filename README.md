# business-template

Plantilla de negocio para comercios locales.

---

## Anto Studios Editor (MVP)

Editor visual para montar páginas con bloques (hero, precios, contacto, etc.) y publicar como ZIP (HTML/CSS).

### Quick start

```bash
# Instalar dependencias
npm ci --legacy-peer-deps

# Levantar el editor en desarrollo
npx nx run antoStudios:serve
```

Abre la URL que indique Nx (p. ej. `http://localhost:4200`). En el editor: añade secciones, edita en modo aislado (Contenido | Estilo | Avanzado) y usa **Publicar** para descargar el ZIP. **Ctrl+S** guarda el estado en el navegador.

### Comandos útiles

| Comando | Descripción |
|--------|-------------|
| `npx nx run antoStudios:serve` | Desarrollo (editor + preview) |
| `npx nx run antoStudios:build` | Build de producción |
| `npx nx run feature-editor:test` | Tests del editor |
| `npx nx run shared-components:test` | Tests de export/publicación |
| `npx nx affected -t lint test build` | Lint, tests y build (solo afectados) |

### Estructura

- **apps/antoStudios** – App del editor (rutas, layout, header/footer).
- **libs/features/editor** – Lógica del editor (secciones, slots, modo aislado, store).
- **libs/shared-components** – VariantService, export ZIP, selector de plantillas.
- **libs/ui-components** – Componentes UI (botón, card, título, imagen, etc.).

Documentación de mejoras y estado: `ideas/mejoras/DOC_MEJORAS.md`.
