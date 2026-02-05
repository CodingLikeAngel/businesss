# Plan de Mejora UX/UI para Plantillas de Negocio

Este documento detalla la estrategia para elevar la calidad visual y funcional de todos los templates de negocio, maximizando el uso de la librería `@negocio/ui-components`.

## Estrategia General

Cada plantilla debe sentirse única, no solo un cambio de texto. Utilizaremos las capacidades de "Theming" y "Variants" de nuestra librería para transformar radicalmente la atmósfera.

### Pilares de Diseño

1.  **Atmósfera Inmersiva**: El primer segundo debe comunicar el rubro sin leer.
2.  **Conversión Específica**: Los CTA (Call to Action) deben adaptarse al flujo del usuario (Reservar Mesa vs Agendar Clase vs Comprar Producto).
3.  **Micro-interacciones**: Feedback visual en hover, scroll y clicks.

---

## 1. Salud y Bienestar (Health & Wellness)

**Templates**: `clinic`, `pharmacy`, `wellness-center`, `gym`

### Clinic & Pharmacy

- **Vibe**: Confianza, Esterilidad Profesional, Tecnología, Calidez Humana.
- **UI Kit Variants**: `primary` (Clean Blue/White), `glass` (Modern).
- **Componentes Clave**:
  - `StatsSection`: "Pacientes Atendidos", "Años de Experiencia", "Doctores Certificados".
  - `FeaturesSection` (Cards): Especialidades médicas con iconos lineales y limpios.
  - `FaqSection`: Dudas sobre seguros, horarios y urgencias.
  - `ReservationForm`: Formulario serio, con selector de especialista.
- **Mejora UX**: Navegación clara, accesibilidad alta, contraste fuerte.

### Gym & Wellness Center

- **Vibe**: Energía, Dinamismo, Fuerza (Gym) vs Equilibrio, Zen, Naturaleza (Wellness).
- **UI Kit Variants**:
  - _Gym_: `neon`, `fiery` (Negro/Rojo/Amarillo). Tipografía Bold/Italic.
  - _Wellness_: `aqua`, `nature` (Verdes suaves, Tierras).
- **Componentes Clave**:
  - `HeroSection`: Video de fondo (Entrenamiento intenso o Yoga relajante).
  - `PricingTable`: Planes de membresía (Mensual, Anual, Pases). Destacar "Mejor Valor".
  - `GallerySection`: Masonry layout mostrando instalaciones y clases.
  - `Testimonials`: "Historias de Transformación" (Con fotos de antes/después si es posible/legal).

---

## 2. Belleza y Estilo (Beauty & Fashion)

**Templates**: `barber-shop`, `boutique`, `clothing-store`, `makeup-artist`, `peluqueria`, `tattoo`

### Barber Shop & Tattoo

- **Vibe**: Urbano, "Old School" o "Cyberpunk", Masculino/Rudo o Artístico.
- **UI Kit Variants**: `retro`, `cyberpunk`, `desert` (Cueros, Maderas oscuras).
- **Componentes Clave**:
  - `ServiceSection` (CardRutas): Lista de precios estilo "Menú de Bar".
  - `GallerySection`: Carousel de cortes/tatuajes recientes (Portafolio).
  - `TeamSection` (Nuevo/Features): Perfiles de los artistas/barberos.
  - `ReservationForm`: Simple y rápido desde el móvil.

### Boutique, Clothing Store & Makeup Artist

- **Vibe**: Elegancia, Tendencia, Editorial de Moda, Minimalismo.
- **UI Kit Variants**: `default` (B&W elegante), `candy` (Pop), `premium` (Gold/Serif).
- **Componentes Clave**:
  - `HeroSection`: Slider de pantalla completa con fotos de alta costura.
  - `PromotionsSection`: "Nueva Colección", "Rebajas de Temporada" (Cards grandes).
  - `ProductsSection`: Grid de productos destacados con hover rápido para "Quick View".
  - `NewsletterSection`: "Únete al club de estilo" (Esencial para retail).

### Peluqueria

- **Vibe**: Glamour, Transformación, Brillo.
- **UI Kit Variants**: `phoenix`, `purple-haze`.
- **Componentes Clave**: Similar a Boutique pero con fuerte énfasis en `Services` y `Reservation`.

---

## 3. Educación (Education)

**Templates**: `school`, `training-institute`, `tutoring-center`

- **Vibe**: Crecimiento, Futuro, Comunidad, Profesionalismo Académico.
- **UI Kit Variants**: `primary` (Classic Blue/Carmesí), `knowledge` (Libros, amarillos cálidos).
- **Componentes Clave**:
  - `StatsSection`: "Egresados", "Cursos Disponibles", "Tasa de Inserción Laboral".
  - `FeaturesSection`: Metodología, Campus, Certificaciones.
  - `PricingSection` (Training/Tutoring): Costos por semestre o por hora.
  - `GallerySection`: Vida estudiantil, eventos.
  - `Newsletter/LeadForm`: "Descarga el folleto informativo".

---

## 4. Servicios y Retail Especializado

**Templates**: `anto-studios` (Creative?), `electronics-shop`, `pet-grooming`, `real-estate`

### Real Estate

- **Vibe**: Lujo, Amplitud, Estilo de Vida, Solidez.
- **UI Kit Variants**: `luxury`, `clean`.
- **Componentes Clave**:
  - `HeroSection`: Buscador de propiedades integrado en el hero.
  - `GallerySection`: Tours virtuales o fotos HD de propiedades.
  - `FeaturesSection`: "Gestión Integral", "Asesoría Legal".
  - `StatsSection`: "Propiedades Vendidas", "Clientes Felices".

### Electronics Shop

- **Vibe**: Tech, Innovación, Futuro, "Geek".
- **UI Kit Variants**: `matrix`, `cyberpunk`, `neon`.
- **Componentes Clave**:
  - `ProductsSection`: Muy técnico, especificaciones claras.
  - `PromotionsSection`: Ofertas flash, bundles.
  - `FaqSection`: Garantías, Envíos, Soporte Técnico.

### Pet Grooming

- **Vibe**: Divertido, Tierno, Confiable, Limpio.
- **UI Kit Variants**: `oceanic` (Azul/Naranja), `candy`.
- **Componentes Clave**:
  - `GallerySection`: "Clientes Peludos" (Fotos de mascotas).
  - `ServicesSection`: Baño, Corte, Spa Canino.
  - `Testimonials`: Dueños felices.

---

## Plan de Acción Inmediato

1.  **Refactorizar Estructura de Datos**:

    - Crear interfaces de datos específicas en cada componente `home-feature.ts` (como se hizo en Restaurant/Spa).
    - Eliminar datos "Lorem Ipsum" y poner contenido realista del sector.

2.  **Estandarizar Imports**:

    - Asegurar que todos usen `@negocio/ui-components` correctamente.
    - Corregir selectores HTML (`lib-ui-...`).

3.  **Aplicar Variantes Visuales**:

    - Asignar la variante correcta (`variant="..."`) a cada componente en el HTML según la tabla de "Vibe" de arriba.

4.  **Habilitar Secciones Faltantes**:
    - Muchos templates no tienen `ProductsSection` o `PromotionsSection`. Agregarlos donde tenga sentido (e.g., Champús en Barber Shop, Accesorios en Gym).

## Próximo Lote Sugerido

Recomiendo comenzar con **Real Estate** y **Gym**, ya que permiten estilos visuales muy marcados y diferentes a lo que ya tenemos.

todos los componentes de las templates deben estar construidos con componentes de C:\Users\a.nietosu_vitaly\Desktop\cosas\business-template-main\libs\ui-components\src\lib
