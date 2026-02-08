# Análisis de Estado de Producto, Roadmap MVP y Estrategia de Negocio

**Fecha:** 8 de Febrero, 2026  
**Elaborado por:** Antigravity (AI Assistant)

Este documento presenta una evaluación honesta y realista del estado actual del proyecto "Anto Studios Editor", identificando brechas críticas para alcanzar un Producto Mínimo Viable (MVP) comercializable, y propone líneas estratégicas de negocio.

---

## 1. Impresiones del Producto: Estado Actual

### 🟢 Puntos Fuertes (Assets)

1.  **Estética Visual de Alta Gama:** A diferencia de constructores genéricos (Wix, Elementor), este editor apuesta por una estética "Cyberpunk/Premium/Glass" por defecto. Esto es un diferenciador fuerte: las webs salen "bonitas" y modernas de la caja.
2.  **Arquitectura Modular (Nx):** La estructura de librerías (`features`, `shared`, `ui-components`) es profesional y escalable. Permite añadir nuevas verticales (ej. Inmobiliaria) sin romper el núcleo.
3.  **Concepto "Modo Aislado":** La idea de separar la edición de contenido/estilo (en un canvas limpio) del layout general es brillante para evitar romper la web mientras se edita. Es una UX superior a la edición in-line tradicional si se ejecuta bien.
4.  **Componentes de Nicho:** Ya existen bases para Gimnasios, Restaurantes y Spas. Esto indica un camino claro hacia la especialización.

### 🔴 Puntos Críticos y Riesgos (La Realidad)

1.  **La "Grieta" Layout vs. Edit:** El mayor desafío técnico actual es la traducción entre lo que el usuario ve en el "Modo Aislado" (coordenadas absolutas, libertad total) y cómo se renderiza en la web final (CSS Grid/Flex responsuve).
    - _Realidad:_ Acabamos de solucionar esto para el Acordeón (haciendo que el contenedor se adapte), pero si esto no se aplica **impecablemente** a TODOS los componentes (Texto, Cards, Listas), la experiencia de usuario será frustrante ("¿Por qué se corta mi texto?", "¿Por qué esto se ve diferente?").
2.  **Estabilidad del Build:** Los errores recientes de importación (`services/export/index`) sugieren que hay partes del sistema de exportación/publicación que están a medio construir o refactorizar. Un editor visual sin un "Publicar" fiable no sirve.
3.  **Responsividad Móvil:** El editor actual se enfoca mucho en Desktop. La adaptación automática de estos diseños complejos a móvil es el punto donde suelen fallar estos builders. El sistema de columas flexibles ayuda, pero necesita testeo intensivo.

### 🟡 Veredicto para MVP

El producto está al **70-75%** de un MVP comercializable.

- **Falta:** Consistencia total en el comportamiento de layout (Plan de Extensión Smart-Adapt), un flujo de "Publicación" sólido, y limpieza de deuda técnica en los módulos compartidos.

---

## 2. Roadmap Crítico para MVP (Prioridades)

Para lanzar una versión 1.0 funcional, se deben cerrar obligatoriamente estos hitos:

### Fase 1: Consistencia de Lógica (2 semanas)

- **Objetivo:** Que el usuario confíe en el editor.
- **Tarea:** Ejecutar el `plan_extension_isolated_mode.md`. Aplicar la lógica de "Altura Automática" y "Contención Segura" a Textos, Tarjetas, Listas y Chips. Si el usuario edita algo, debe verse entero en el layout. Sin excepciones.

### Fase 2: Motor de Publicación (1-2 semanas)

- **Objetivo:** Que la web sirva para algo.
- **Tarea:** Reparar y finalizar el módulo `export`. Generar un HTML/CSS estático limpio o un JSON que un renderizador ligero pueda mostrar al visitante final.

### Fase 3: Hardening Móvil (1 semana)

- **Objetivo:** Que no se rompa en el teléfono.
- **Tarea:** Verificar cómo se comportan los `min-height` y `styles` fijos en viewport móvil. Implementar una conversión automática de "Grid N Columnas" a "Stack Vertical" robusta.

---

## 3. Estrategia de Negocio y Posibles Clientes

Dado el carácter "Premium/Visual" del editor, competir contra Wix (mercado masivo, barato) es un error. La estrategia debe ser **Nicho Primum** o **Herramienta B2B**.

### A. Segmento: "Dueños de Negocios de Estilo" (B2C / B2B Small)

Clientes que venden imagen y experiencia, no productos masivos. Valoran que su web se vea sofisticada sin contratar una agencia de $10k.

- **Clientes Potenciales:**
  - **Restaurantes de Autor / Alta Cocina:** Necesitan menús visuales, reservas (ya hay componentes), estética oscura/elegante.
  - **Studios de Fitness Boutique / Crossfit / Yoga:** Necesitan horarios, entrenadores, estética enérgica.
  - **Clínicas Estéticas / Spas:** Necesitan tarjetas de servicios, precios, estética limpia/glass.
  - **DJs / Artistas / Eventos Nocturnos:** La estética Neon/Cyberpunk actual encaja perfectamente aquí.

### B. Segmento: "Agencias Aceleradas" (B2B)

Freelancers o pequeñas agencias que necesitan entregar webs "con pinta de caras" en tiempo récord.

- **Propuesta de Valor:** "Crea una web con animaciones y estilo Awwwards en 2 horas, cobra $2000".
- **Modelo:** Licencia PRO del editor con marca blanca.

---

## 4. Modelos de Monetización Sugeridos

1.  **Modelo SaaS Vertical (Recomendado):**

    - "Anto Gyms", "Anto Resto".
    - Precio: **$29 - $49 / mes**.
    - Incluye: Hosting, Editor, Plantillas específicas del nicho.
    - _Por qué:_ Los nichos pagan más y rotan menos si la herramienta resuelve su problema específico (ej. Reservas incluídas).

2.  **Modelo "Lifetime Deal" (LTD) para Validación:**

    - Lanzar en plataformas como AppSumo para validar el MVP.
    - Precio: **$69 - $129 pago único**.
    - _Ventaja:_ Inyección de capital rápido y feedback de usuarios "power users" para pulir el editor antes de ir al mercado masivo.

3.  **Marketplace de Componentes:**
    - El editor es gratis (Freemium).
    - Los componentes "Premium" (Card 3D, Hero Animado, Galería Avanzada) se pagan aparte o requieren plan PRO.

## 5. Conclusión

Tienes una tecnología de UI muy potente. El peligro es quedarse en un "juguete técnico" que hace cosas bonitas pero rotas.
**La prioridad absoluta es la robustez del layout.** Si logras que la edición sea fiable (WYSIWYG real), tienes un producto muy vendible en el sector de **Hostelería y Bienestar de lujo**, donde la imagen lo es todo.
