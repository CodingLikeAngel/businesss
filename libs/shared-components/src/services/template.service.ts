import { Injectable } from '@angular/core';
import {
  HeaderConfig,
  FooterConfig,
  NavBarConfig,
  HeroConfig,
  BubbleConfig,
  CardConfig,
  TitleConfig,
  ServiceCardsConfig,
  FaqConfig,
  PricingConfig,
  PromotionsConfig,
  GalleryConfig,
  ProductsConfig,
  TestimonialsConfig,
  PageSection,
} from './variant.service';

export interface BusinessTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  header: HeaderConfig;
  footer: FooterConfig;
  navBar: NavBarConfig;
  hero: HeroConfig;
  bubble: BubbleConfig;
  card: CardConfig;
  title: TitleConfig;
  serviceCards: ServiceCardsConfig;
  faq: FaqConfig;
  pricing: PricingConfig;
  promotions: PromotionsConfig;
  gallery: GalleryConfig;
  products: ProductsConfig;
  testimonials: TestimonialsConfig;
  sections: PageSection[];
  globalVariant: string;
  componentVariants: { [key: string]: string };
}

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private templates: BusinessTemplate[] = [];

  constructor() {
    this.initializeTemplates();
  }

  getAllTemplates(): BusinessTemplate[] {
    return this.templates;
  }

  getTemplateById(id: string): BusinessTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  getTemplatesByCategory(category: string): BusinessTemplate[] {
    return this.templates.filter((t) => t.category === category);
  }

  private initializeTemplates(): void {
    // Template 1: Peluquería
    this.templates.push({
      id: 'peluqueria',
      name: 'Peluquería',
      description: 'Template para salones de belleza y peluquerías',
      icon: '💇',
      category: 'Belleza',
      header: {
        variant: 'glass',
        title: 'Salón de Belleza',
        subtitle: 'Tu estilo, nuestra pasión',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Inicio', href: '/home', active: true },
          { label: 'Servicios', href: '/home#servicios' },
          { label: 'Precios', href: '/home#precios' },
          { label: 'Contacto', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'Salón de Belleza',
        description: 'Transformamos tu estilo con técnicas profesionales',
        exploreLinks: [
          { label: 'Cortes', href: '#servicios', icon: '✂️' },
          { label: 'Coloración', href: '#servicios', icon: '🎨' },
          { label: 'Manicura', href: '#servicios', icon: '💅' },
          { label: 'Tratamientos', href: '#servicios', icon: '✨' },
        ],
        trendLinks: [
          { label: 'Reservar', href: '#reservas', icon: '📅' },
          { label: 'Precios', href: '#precios', icon: '💰' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 Salón de Belleza. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Salón',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Servicios', href: '/home#servicios', icon: '✂️' },
          { label: 'Precios', href: '/home#precios', icon: '💰' },
          { label: 'Galería', href: '/home#galeria', icon: '🖼️' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Bienvenido a nuestro Salón',
        subtitle: 'Estilo, elegancia y profesionalidad en cada servicio',
        showCta: true,
        ctaLabel: 'Reservar Cita',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '',
        navigationCards: [
          {
            icon: '✂️',
            title: 'Cortes',
            description: 'Tendencias actuales',
            sectionId: 'servicios',
          },
          {
            icon: '🎨',
            title: 'Coloración',
            description: 'Tonos únicos',
            sectionId: 'servicios',
          },
          {
            icon: '💅',
            title: 'Manicura',
            description: 'Diseños exclusivos',
            sectionId: 'servicios',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'neon',
        speed: 1,
        blur: 30,
        opacity: 0.7,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(255,255,255,0.05)',
        textColor: '#ffffff',
        accentColor: '#FF69B4',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(255, 105, 180, 0.3)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'Nuestros Servicios',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#FF69B4',
        },
      },
      serviceCards: {
        items: [
          {
            routeName: 'Corte Hombre',
            imageUrl: '/retro-stars.png',
            difficulty: 'Duración: 30 min',
            rating: 4.8,
            reviews: 120,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Cortes modernos y clásicos adaptados a tu estilo',
            features: ['Estilo personalizado', 'Consulta previa', 'Productos de calidad'],
            link: '#reservas',
          },
          {
            routeName: 'Corte Mujer',
            imageUrl: '/1029.png',
            difficulty: 'Duración: 45 min',
            rating: 4.9,
            reviews: 95,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Transformación completa de tu look',
            features: ['Asesoramiento personalizado', 'Técnicas avanzadas', 'Acabado perfecto'],
            link: '#reservas',
          },
          {
            routeName: 'Manicura',
            imageUrl: '/images.png',
            difficulty: 'Duración: 60 min',
            rating: 4.7,
            reviews: 78,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Uñas perfectas para cada ocasión',
            features: ['Diseños personalizados', 'Productos premium', 'Duración garantizada'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        items: [
          {
            title: '¿Necesito reservar con antelación?',
            content: 'Recomendamos reservar con al menos 24 horas de antelación para garantizar disponibilidad.',
            expanded: false,
          },
          {
            title: '¿Qué métodos de pago aceptan?',
            content: 'Aceptamos efectivo, tarjetas y transferencias bancarias.',
            expanded: false,
          },
        ],
      },
      pricing: {
        columns: [
          { key: 'service', label: 'Servicio' },
          { key: 'description', label: 'Descripción' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Corte Hombre', description: 'Corte y peinado', price: '25€' },
          { service: 'Corte Mujer', description: 'Corte y peinado', price: '35€' },
          { service: 'Manicura', description: 'Manicura completa', price: '20€' },
        ],
      },
      promotions: {
        premiumCards: [
          {
            title: 'Paquete Completo',
            description: 'Corte + Manicura + Tratamiento',
            image: '/retro-stars.png',
            price: '70€',
            discount: '-15%',
            icon: 'heroStar',
            tooltip: '¡Ahorra con nuestro paquete especial!',
          },
        ],
      },
      gallery: {
        images: [
          { src: '/retro-stars.png', alt: 'Trabajo 1' },
          { src: '/1029.png', alt: 'Trabajo 2' },
          { src: '/images.png', alt: 'Trabajo 3' },
        ],
      },
      products: {
        items: [
          {
            name: 'Tratamiento Capilar',
            image: '/retro-stars.png',
            description: 'Recupera el brillo y suavidad de tu cabello',
            price: '45€',
          },
        ],
      },
      testimonials: {
        items: [
          {
            quote: 'Excelente servicio, muy profesionales',
            author: 'María G.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true },
        { id: 'servicios', type: 'services', label: 'Servicios', visible: true },
        { id: 'precios', type: 'pricing', label: 'Precios', visible: true },
        { id: 'galeria', type: 'gallery', label: 'Galería', visible: true },
        { id: 'faq', type: 'faq', label: 'FAQ', visible: true },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass',
      },
    });

    // Template 2: Estudio de Tatuajes
    this.templates.push({
      id: 'tattoo-studio',
      name: 'Estudio de Tatuajes',
      description: 'Template para estudios de tatuajes profesionales',
      icon: '🎨',
      category: 'Arte',
      header: {
        variant: 'glass',
        title: 'Estudio de Tatuajes',
        subtitle: 'Arte en cada línea',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Inicio', href: '/home', active: true },
          { label: 'Tatuajes', href: '/home#servicios' },
          { label: 'Precios', href: '/home#precios' },
          { label: 'Galería', href: '/home#galeria' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'Estudio de Tatuajes',
        description: 'Creando arte permanente con pasión y profesionalidad',
        exploreLinks: [
          { label: 'Estilos', href: '#servicios', icon: '🖌️' },
          { label: 'Galería', href: '#galeria', icon: '🖼️' },
          { label: 'Precios', href: '#precios', icon: '💰' },
          { label: 'Reservas', href: '#reservas', icon: '📅' },
        ],
        trendLinks: [
          { label: 'FAQ', href: '#faq', icon: '❓' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
        ],
        copyrightText: '© 2025 Estudio de Tatuajes. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Tattoo',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Tatuajes', href: '/home#servicios', icon: '🖌️' },
          { label: 'Precios', href: '/home#precios', icon: '💰' },
          { label: 'Galería', href: '/home#galeria', icon: '🖼️' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Tu Visión, Nuestro Arte',
        subtitle: 'Diseños personalizados que cuentan tu historia',
        showCta: true,
        ctaLabel: 'Reservar Sesión',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '',
        navigationCards: [
          {
            icon: '🖌️',
            title: 'Estilos',
            description: 'Tradicional, geométrico, realista',
            sectionId: 'servicios',
          },
          {
            icon: '📅',
            title: 'Reservas',
            description: 'Agenda tu sesión',
            sectionId: 'reservas',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'neon',
        speed: 1.2,
        blur: 25,
        opacity: 0.8,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(255,30,86,0.1)',
        textColor: '#ffffff',
        accentColor: '#FF1E56',
        animation: 'pulse',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(255, 30, 86, 0.5)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'Nuestros Estilos',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#FF1E56',
        },
      },
      serviceCards: {
        items: [
          {
            routeName: 'Tatuaje Tradicional',
            imageUrl: '/retro-stars.png',
            difficulty: 'Duración: 2-3 horas',
            rating: 4.9,
            reviews: 85,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Estilo clásico con líneas definidas',
            features: ['Diseño personalizado', 'Material esterilizado', 'Seguimiento post-tatuaje'],
            link: '#reservas',
          },
          {
            routeName: 'Tatuaje Realista',
            imageUrl: '/1029.png',
            difficulty: 'Duración: 4-6 horas',
            rating: 4.8,
            reviews: 62,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Hiperrealismo en cada detalle',
            features: ['Técnicas avanzadas', 'Consulta previa', 'Retoques incluidos'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        items: [
          {
            title: '¿Duele hacerse un tatuaje?',
            content: 'El dolor varía según la zona y tu tolerancia. Trabajamos contigo para que estés cómodo durante todo el proceso.',
            expanded: false,
          },
          {
            title: '¿Cuánto tarda en sanar?',
            content: 'Generalmente 2-4 semanas con los cuidados adecuados que te proporcionaremos.',
            expanded: false,
          },
        ],
      },
      pricing: {
        columns: [
          { key: 'service', label: 'Servicio' },
          { key: 'description', label: 'Descripción' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Tatuaje Pequeño', description: 'Hasta 10 cm', price: '50€' },
          { service: 'Tatuaje Mediano', description: '10-20 cm', price: '100€' },
          { service: 'Sesión Completa', description: 'Diseño grande', price: '200€+' },
        ],
      },
      promotions: {
        premiumCards: [
          {
            title: 'Tatuaje + Retoque',
            description: 'Tatuaje mediano con retoque gratis',
            image: '/retro-stars.png',
            price: '120€',
            discount: '-10%',
            icon: 'heroStar',
            tooltip: '¡Perfecto para tu primer tatuaje!',
          },
        ],
      },
      gallery: {
        images: [
          { src: '/retro-stars.png', alt: 'Tatuaje 1' },
          { src: '/1029.png', alt: 'Tatuaje 2' },
          { src: '/images.png', alt: 'Tatuaje 3' },
        ],
      },
      products: {
        items: [],
      },
      testimonials: {
        items: [
          {
            quote: 'Increíble trabajo, superó mis expectativas',
            author: 'Carlos M.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true },
        { id: 'servicios', type: 'services', label: 'Servicios', visible: true },
        { id: 'precios', type: 'pricing', label: 'Precios', visible: true },
        { id: 'galeria', type: 'gallery', label: 'Galería', visible: true },
        { id: 'faq', type: 'faq', label: 'FAQ', visible: true },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass',
      },
    });

    // Template 3: Restaurante
    this.templates.push({
      id: 'restaurante',
      name: 'Restaurante',
      description: 'Template para restaurantes y bares',
      icon: '🍽️',
      category: 'Gastronomía',
      header: {
        variant: 'glass',
        title: 'Restaurante',
        subtitle: 'Sabores auténticos, experiencias únicas',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Inicio', href: '/home', active: true },
          { label: 'Menú', href: '/home#servicios' },
          { label: 'Reservas', href: '/home#reservas' },
          { label: 'Contacto', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'Restaurante',
        description: 'Cocina de autor con ingredientes locales',
        exploreLinks: [
          { label: 'Menú', href: '#servicios', icon: '📋' },
          { label: 'Carta', href: '#servicios', icon: '🍷' },
          { label: 'Reservas', href: '#reservas', icon: '📅' },
          { label: 'Eventos', href: '#servicios', icon: '🎉' },
        ],
        trendLinks: [
          { label: 'Contacto', href: '/contact', icon: '📞' },
          { label: 'Horarios', href: '#faq', icon: '🕐' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 Restaurante. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Restaurante',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Menú', href: '/home#servicios', icon: '🍽️' },
          { label: 'Reservas', href: '/home#reservas', icon: '📅' },
          { label: 'Galería', href: '/home#galeria', icon: '🖼️' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Sabores que Despiertan Sentidos',
        subtitle: 'Cocina tradicional con toque innovador',
        showCta: true,
        ctaLabel: 'Ver Menú',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '',
        navigationCards: [
          {
            icon: '🍽️',
            title: 'Menú',
            description: 'Platos principales',
            sectionId: 'servicios',
          },
          {
            icon: '🍷',
            title: 'Carta',
            description: 'Vinos y bebidas',
            sectionId: 'servicios',
          },
          {
            icon: '📅',
            title: 'Reservar',
            description: 'Mesa online',
            sectionId: 'reservas',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'oceanic',
        speed: 0.8,
        blur: 35,
        opacity: 0.6,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(255,193,7,0.1)',
        textColor: '#ffffff',
        accentColor: '#FFC107',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(255, 193, 7, 0.3)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'Nuestro Menú',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#FFC107',
        },
      },
      serviceCards: {
        items: [
          {
            routeName: 'Entrantes',
            imageUrl: '/retro-stars.png',
            difficulty: 'Desde',
            rating: 4.8,
            reviews: 150,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Selección de entrantes de temporada',
            features: ['Ingredientes locales', 'Preparación artesanal', 'Porciones generosas'],
            link: '#reservas',
          },
          {
            routeName: 'Platos Principales',
            imageUrl: '/1029.png',
            difficulty: 'Desde',
            rating: 4.9,
            reviews: 200,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Cocina de autor con productos frescos',
            features: ['Pescado del día', 'Carnes selectas', 'Opciones vegetarianas'],
            link: '#reservas',
          },
          {
            routeName: 'Postres',
            imageUrl: '/images.png',
            difficulty: 'Desde',
            rating: 4.7,
            reviews: 120,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Dulces caseros que endulzan tu día',
            features: ['Repostería propia', 'Sin azúcares añadidos', 'Opciones sin gluten'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        items: [
          {
            title: '¿Necesito reservar?',
            content: 'Recomendamos reservar especialmente los fines de semana para garantizar mesa.',
            expanded: false,
          },
          {
            title: '¿Tienen opciones vegetarianas?',
            content: 'Sí, tenemos una amplia selección de platos vegetarianos y veganos.',
            expanded: false,
          },
        ],
      },
      pricing: {
        columns: [
          { key: 'service', label: 'Plato' },
          { key: 'description', label: 'Descripción' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Menú del Día', description: 'Primero, segundo y postre', price: '15€' },
          { service: 'Carta Completa', description: 'A la carta', price: '30-50€' },
          { service: 'Menú Degustación', description: '5 platos', price: '65€' },
        ],
      },
      promotions: {
        premiumCards: [
          {
            title: 'Menú Especial',
            description: 'Menú degustación para dos personas',
            image: '/retro-stars.png',
            price: '120€',
            discount: '-15%',
            icon: 'heroStar',
            tooltip: '¡Ideal para una ocasión especial!',
          },
        ],
      },
      gallery: {
        images: [
          { src: '/retro-stars.png', alt: 'Plato 1' },
          { src: '/1029.png', alt: 'Plato 2' },
          { src: '/images.png', alt: 'Plato 3' },
        ],
      },
      products: {
        items: [],
      },
      testimonials: {
        items: [
          {
            quote: 'Excelente comida y servicio impecable',
            author: 'Ana L.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true },
        { id: 'servicios', type: 'services', label: 'Menú', visible: true },
        { id: 'precios', type: 'pricing', label: 'Precios', visible: true },
        { id: 'galeria', type: 'gallery', label: 'Galería', visible: true },
        { id: 'faq', type: 'faq', label: 'FAQ', visible: true },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass',
      },
    });

    // Template 4: Gimnasio
    this.templates.push({
      id: 'gimnasio',
      name: 'Gimnasio',
      description: 'Template para gimnasios y centros fitness',
      icon: '💪',
      category: 'Deportes',
      header: {
        variant: 'glass',
        title: 'Gimnasio',
        subtitle: 'Transforma tu cuerpo, transforma tu vida',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Inicio', href: '/home', active: true },
          { label: 'Servicios', href: '/home#servicios' },
          { label: 'Precios', href: '/home#precios' },
          { label: 'Contacto', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'Gimnasio',
        description: 'Entrena con los mejores equipos y profesionales',
        exploreLinks: [
          { label: 'Clases', href: '#servicios', icon: '🏋️' },
          { label: 'Personal Trainer', href: '#servicios', icon: '👨‍🏫' },
          { label: 'Instalaciones', href: '#galeria', icon: '🏋️‍♂️' },
          { label: 'Precios', href: '#precios', icon: '💰' },
        ],
        trendLinks: [
          { label: 'Inscripción', href: '#reservas', icon: '📝' },
          { label: 'Horarios', href: '#faq', icon: '🕐' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 Gimnasio. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Gym',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Servicios', href: '/home#servicios', icon: '🏋️' },
          { label: 'Precios', href: '/home#precios', icon: '💰' },
          { label: 'Galería', href: '/home#galeria', icon: '🖼️' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Tu Mejor Versión te Espera',
        subtitle: 'Equipamiento de última generación y entrenadores certificados',
        showCta: true,
        ctaLabel: 'Comenzar Ahora',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '',
        navigationCards: [
          {
            icon: '🏋️',
            title: 'Clases',
            description: 'Grupo y personalizadas',
            sectionId: 'servicios',
          },
          {
            icon: '💪',
            title: 'Entrenamiento',
            description: 'Zona de máquinas',
            sectionId: 'servicios',
          },
          {
            icon: '📝',
            title: 'Inscríbete',
            description: 'Únete hoy',
            sectionId: 'reservas',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'fiery',
        speed: 1.5,
        blur: 28,
        opacity: 0.75,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(220,38,38,0.1)',
        textColor: '#ffffff',
        accentColor: '#DC2626',
        animation: 'pulse',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(220, 38, 38, 0.4)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'Nuestros Servicios',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#DC2626',
        },
      },
      serviceCards: {
        items: [
          {
            routeName: 'Clases Grupales',
            imageUrl: '/retro-stars.png',
            difficulty: 'Todos los niveles',
            rating: 4.8,
            reviews: 200,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Yoga, spinning, zumba y más',
            features: ['Horarios flexibles', 'Instructores certificados', 'Ambiente motivador'],
            link: '#reservas',
          },
          {
            routeName: 'Personal Trainer',
            imageUrl: '/1029.png',
            difficulty: 'Personalizado',
            rating: 4.9,
            reviews: 85,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Entrenamiento personalizado a tus objetivos',
            features: ['Plan individualizado', 'Seguimiento constante', 'Resultados garantizados'],
            link: '#reservas',
          },
          {
            routeName: 'Zona de Máquinas',
            imageUrl: '/images.png',
            difficulty: 'Libre acceso',
            rating: 4.7,
            reviews: 300,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Equipamiento profesional 24/7',
            features: ['Última generación', 'Mantenimiento constante', 'Espacio amplio'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        items: [
          {
            title: '¿Necesito experiencia previa?',
            content: 'No, tenemos clases y programas para todos los niveles, desde principiantes hasta avanzados.',
            expanded: false,
          },
          {
            title: '¿Qué incluye la membresía?',
            content: 'Acceso a todas las instalaciones, clases grupales y descuentos en servicios adicionales.',
            expanded: false,
          },
        ],
      },
      pricing: {
        columns: [
          { key: 'service', label: 'Plan' },
          { key: 'description', label: 'Incluye' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Básico', description: 'Acceso zona máquinas', price: '30€/mes' },
          { service: 'Completo', description: 'Todo + clases grupales', price: '50€/mes' },
          { service: 'Premium', description: 'Todo + personal trainer', price: '80€/mes' },
        ],
      },
      promotions: {
        premiumCards: [
          {
            title: 'Primer Mes Gratis',
            description: 'Únete ahora y disfruta del primer mes sin coste',
            image: '/retro-stars.png',
            price: '0€',
            discount: '100%',
            icon: 'heroStar',
            tooltip: '¡Oferta limitada!',
          },
        ],
      },
      gallery: {
        images: [
          { src: '/retro-stars.png', alt: 'Instalación 1' },
          { src: '/1029.png', alt: 'Instalación 2' },
          { src: '/images.png', alt: 'Instalación 3' },
        ],
      },
      products: {
        items: [],
      },
      testimonials: {
        items: [
          {
            quote: 'He logrado mis objetivos gracias a este gimnasio',
            author: 'Pedro R.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true },
        { id: 'servicios', type: 'services', label: 'Servicios', visible: true },
        { id: 'precios', type: 'pricing', label: 'Precios', visible: true },
        { id: 'galeria', type: 'gallery', label: 'Galería', visible: true },
        { id: 'faq', type: 'faq', label: 'FAQ', visible: true },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass',
      },
    });
  }
}


