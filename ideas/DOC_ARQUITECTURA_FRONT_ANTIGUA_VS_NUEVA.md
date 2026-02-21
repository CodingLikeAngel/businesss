# Por qué la arquitectura del front antiguo era peor (y la nueva es mejor para todos)

**Contexto:** Comparación entre el front antiguo (Biosstel: Next.js + Atomic Design mal aplicado) y la nueva arquitectura (Nx + Angular, libs separadas). Sirve para explicar a equipo y stakeholders por qué el cambio no es capricho sino mejora de mantenibilidad, onboarding y trabajo en equipo.

---

## 1. Por qué el front antiguo (atoms, molecules, “todo mezclado”) era peor

El proyecto de referencia (`front-biosstel-developer`) usaba **Next.js** y una estructura de **Atomic Design** (carpetas `atoms`, `molecules`, `organisms`, `templates`). La idea de Atomic Design es buena en teoría, pero en la práctica aquel front sufría de:

### 1.1 Mezcla de capas: dominio dentro de “átomos” y “moléculas”

- En **atoms** había componentes que no son átomos reutilizables sino **conceptos de negocio**: por ejemplo `DepartmentBadge`, `PendingTaskItem`, `ClockArc`. Un átomo debería ser un botón, un input, un badge genérico; no un “badge de departamento” ni un “ítem de tarea pendiente”.
- En **molecules** había componentes fuertemente acoplados al dominio: `ObjectiveCircle`, `FamilyObjectiveCard`, `AssignmentCard`, que dependen de interfaces como `Objective`, constantes de negocio (`OBJECTIVE_COLOR_MAP`), y utils de dominio (`getCurrentMonthKey`). Eso son **componentes de feature**, no moléculas de diseño reutilizables.

**Consecuencia:** No se podía reutilizar ese “design system” en otro producto sin arrastrar lógica de negocio. La frontera entre “UI genérica” y “lógica de la app” no existía.

### 1.2 Explosión de variantes como componentes separados

- En **molecules/buttons** había muchos componentes distintos: `ButtonPrimary`, `ButtonPrimaryLg`, `ButtonPrimaryMini`, `ButtonCancel`, `ButtonCancelLg`, `ButtonCancelMini`, `ButtonAddPrimary`, `ButtonAddSecondary`, etc. Eso es **un concepto (Button) fragmentado en decenas de componentes** en lugar de un solo componente con props/variantes (tamaño, tipo, estado).
- Mantenimiento costoso: cambiar el estilo de “todos los botones primarios” obliga a tocar muchos archivos. No hay una única fuente de verdad.

### 1.3 Dos estructuras paralelas que se solapan

- Por un lado: **atoms / molecules / organisms / templates**.
- Por otro: una carpeta **design-system** con `ButtonsSection`, `CardsSection`, `InputsSection`, `TypographySection`, etc., que muestran esos mismos componentes en una página de diseño.
- No estaba claro si el “origen de verdad” era la carpeta atómica o el design-system; ambas convivían y generaban **duplicación mental y de código**.

### 1.4 Falta de separación por responsabilidad

- No había una separación clara entre:
  - **Componentes de UI puros** (sin lógica de negocio).
  - **Componentes de feature** (con dominio: objetivos, tareas, departamentos).
  - **Secciones/páginas** (organismos o templates).
- Todo vivía bajo el mismo techo de “atoms/molecules”, así que **cualquier dev que entraba tenía que adivinar** si un componente era reutilizable o solo para esa app.

En resumen: **Atomic Design por carpetas sin reglas claras + dominio mezclado + variantes como componentes separados + dos “design systems”** hacían que el front antiguo fuera difícil de mantener, de extender y de explicar a alguien nuevo. No era solo “cosas raras”, era **arquitectura inconsistente y acoplamiento alto**.

---

## 2. Por qué una arquitectura Next (React) es peor para un equipo Angular (y para unificar)

### 2.1 Stack distinto = fricción para devs Angular

- Un desarrollador que trabaja en **Angular** está acostumbrado a: módulos o standalone components, inyección de dependencias, RxJS, servicios, directivas, decoradores, ciclo de vida propio, testing con Jasmine/Karma o Jest en contexto Angular.
- **Next.js** es el ecosistema **React**: componentes funcionales, hooks, contexto, mentalidad “todo componente”, App Router, Server Components, etc. Son **modelos mentales y APIs distintas**.
- Que el front sea Next implica que un dev Angular tenga que **cambiar de framework** para tocar ese proyecto: formación, tiempo de productividad menor, más errores hasta asimilar React/Next. No es “un detalle”, es otro stack completo.

### 2.2 Dos stacks = dos formas de hacer las cosas

- Si una app es Next y otra (o el editor, o el negocio) es Angular, el equipo debe mantener **dos convenciones**: estructura de carpetas, testing, estado (Redux/Zustand vs servicios + signals/store), formularios (Formik vs reactive forms), etc.
- Onboarding: un nuevo dev tiene que elegir “¿en qué stack me formo primero?” y el conocimiento no es totalmente transferible entre proyectos.

### 2.3 Next no es “mejor” ni “peor” en abstracto

- Next es muy bueno para **React**: SSR, App Router, ecosistema React. El problema no es Next en sí, sino **usar un stack (Next/React) cuando el resto del producto o el equipo ya apuesta por Angular**. Ahí la arquitectura Next se vuelve **peor para ese contexto** porque fragmenta el conocimiento y la base de código.

---

## 3. Por qué la nueva arquitectura es mejor para todos (común a todos)

La nueva arquitectura (monorepo Nx, Angular, libs bien delimitadas) soluciona los problemas anteriores y es **común a todo el equipo**:

### 3.1 Un solo framework: Angular

- **Todo el mundo trabaja en el mismo stack**: Angular. Quien ya sabe Angular puede trabajar en cualquier app (negocio, antoStudios) o en cualquier lib (ui-components, featured-components, editor). No hay “proyecto Next” y “proyecto Angular”; hay **un solo lenguaje de componentes y servicios**.
- Onboarding más simple: “Aquí todo es Nx + Angular; las apps consumen libs; las libs tienen responsabilidades claras.”

### 3.2 Separación clara por responsabilidad (libs, no carpetas “atómicas” mezcladas)

- **ui-components:** componentes de UI reutilizables (atoms/molecules): botones, inputs, cards, tabs, modales, etc., **sin lógica de negocio**. Una sola familia por concepto (por ejemplo `button` con variantes -1, -2, -3), no 20 componentes “ButtonAlgo”.
- **featured-components:** secciones/organismos que **componen** ui-components (heros, galerías, newsletters, FAQs, etc.). Siguen siendo presentacionales o con contrato claro, no mezclados con dominio de una app concreta.
- **feature-editor / feature-editor-shell:** lógica del editor (arrastrar, configurar, preview). Feature acotada.
- **Apps (negocio, antoStudios):** consumen las mismas libs. No hay “copia” de componentes por app; hay **una base común**.

Así, **no hay “átomos con dominio”**: el dominio vive en features y en apps; las libs de componentes son reutilizables y entendibles por cualquier dev.

### 3.3 Monorepo Nx: dependencias explícitas y builds reproducibles

- Nx deja claro **quién depende de quién** (por ejemplo: `featured-components` → `ui-components`; apps → libs). No hay que adivinar; el grafo de proyectos lo muestra.
- Builds y tests por proyecto: se puede construir o testear solo lo afectado. Un cambio en `ui-components` no obliga a reconstruir todo; Nx cachea y orquesta.
- Esto es **común a todos**: todo el mundo usa los mismos comandos (`nx build negocio`, `nx test ui-components`) y la misma estructura.

### 3.4 Una sola forma de trabajar

- Convenciones únicas: estructura de libs, path aliases (`@negocio/ui-components`, etc.), testing (Jest), lint (ESLint). No hay “en Next hacemos así y en Angular asá”.
- Cualquier dev (Angular o que se incorpore aprendiendo Angular) **contribuye al mismo ecosistema** y entiende dónde va cada cosa: UI genérica en ui-components, secciones en featured-components, flujos de editor en feature-editor, apps que orquestan.

---

## 4. Resumen en una frase

- **Front antiguo:** Atomic Design mal aplicado (átomos/moléculas con dominio mezclado, variantes como componentes sueltos, doble “design system”) + stack Next/React separado del resto → difícil de mantener y de unificar con un equipo Angular.
- **Next como “la” arquitectura:** Fricción para devs Angular; dos stacks y dos formas de hacer las cosas; no es común a todos.
- **Nueva arquitectura:** Un solo stack (Angular), libs con responsabilidades claras (UI vs secciones vs features), monorepo Nx con dependencias explícitas → **común a todos**, más fácil de mantener, de explicar y de escalar con cualquier dev (Angular o que se una al equipo).

Este documento se puede usar en presentaciones o en decisiones de arquitectura para justificar por qué se abandona el front antiguo y por qué la nueva estructura es mejor para todo el equipo.
