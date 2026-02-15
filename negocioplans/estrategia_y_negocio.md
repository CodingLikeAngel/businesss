# Análisis Estratégico: Anto Studios Editor

## 1. Visión de Producto: El Cerebro con Criterio (Weighted AI)

Anto Studios no solo "recuerda", sino que **prioriza**. Introducimos un sistema de pesos estadísticos para que la IA tome decisiones basadas en la recurrencia y el éxito.

### El Concepto: Weighted Design Memory

Cada interacción del usuario con la IA genera un "voto" de confianza o desconfianza en el Design System:

- **Afinidad Cuantificada**: Si el usuario acepta 5 veces un `borderRadius` de `24px`, ese valor gana un peso alto. Si lo deshace (Reject), el peso baja.
- **Influencia en el Prompt**: Gemini recibirá instrucciones específicas basadas en estos pesos (ej: "Prioriza bordes redondeados (Peso: 0.9) y evita sombras pesadas (Peso: 0.1)").
- **Evolución del Perfil**: El "cerebro" interno se vuelve más preciso con cada click, reduciendo la necesidad de correcciones manuales.

---

## 2. Ventaja Competitiva: Personalización Profunda

Mientras que otras IAs intentan ser un "promedio" de Internet, Anto Studios se convierte en un **reflejo del gusto del usuario**:

1.  **Perfil Estadístico**: No basamos el diseño en corazonadas, sino en la frecuencia de uso exitoso.
2.  **Consistencia Predictiva**: Al conocer los pesos favoritos, la IA puede predecir qué variantes de componentes encajarán mejor con la línea visual del proyecto actual.

---

## 3. Hoja de Ruta del MVP: "The Weighted Phase"

1.  **Weight Score Engine**: Implementar la lógica de puntuación en `AIMemoryService`.
2.  **Top-Tier Context**: Solo las preferencias con pesos altos se envían a Gemini para evitar "ruido" en el prompt.
3.  **Visual Dashboard (Opcional)**: Mostrar al usuario qué está aprendiendo la IA sobre él.

---

## 4. Monetización: Adaptive AI Models

- **Tier Pro**: Pesos básicos por proyecto.
- **Tier Unlimited (Cross-Project Memory)**: La IA lleva sus pesos aprendidos de un proyecto a otro, manteniendo una identidad de marca global para el usuario o agencia.

---

> **Conclusión**: El sistema de pesos es la diferencia entre una IA que "repite" y una que "entiende". Estamos dotando a Anto Studios de un criterio estético basado en datos reales del usuario.
