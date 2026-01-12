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
    console.log('TemplateService: Initializing templates...');
    this.initializeTemplates();
    console.log('TemplateService: Templates initialized, total:', this.templates.length);
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Trabajo 1' },
          { src: '/1029.png', alt: 'Trabajo 2' },
          { src: '/images.png', alt: 'Trabajo 3' },
        ],
      },
      products: {
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Tatuaje 1' },
          { src: '/1029.png', alt: 'Tatuaje 2' },
          { src: '/images.png', alt: 'Tatuaje 3' },
        ],
      },
      products: {
        variant: 'glass',
        items: [],
      },
      testimonials: {
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Plato 1' },
          { src: '/1029.png', alt: 'Plato 2' },
          { src: '/images.png', alt: 'Plato 3' },
        ],
      },
      products: {
        variant: 'glass',
        items: [],
      },
      testimonials: {
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
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
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Instalación 1' },
          { src: '/1029.png', alt: 'Instalación 2' },
          { src: '/images.png', alt: 'Instalación 3' },
        ],
      },
      products: {
        variant: 'glass',
        items: [],
      },
      testimonials: {
        variant: 'glass',
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

    // Template 5: Spa
    this.templates.push({
      id: 'spa',
      name: 'Spa & Bienestar',
      description: 'Template para spas, centros de masajes y bienestar',
      icon: '🧘',
      category: 'Bienestar',
      header: {
        variant: 'glass',
        title: 'Spa & Bienestar',
        subtitle: 'Relájate y renueva tu energía vital',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Inicio', href: '/home', active: true },
          { label: 'Tratamientos', href: '/home#servicios' },
          { label: 'Precios', href: '/home#precios' },
          { label: 'Contacto', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'Spa & Bienestar',
        description: 'Tu oasis de paz y rejuvenecimiento',
        exploreLinks: [
          { label: 'Masajes', href: '#servicios', icon: '💆' },
          { label: 'Tratamientos', href: '#servicios', icon: '✨' },
          { label: 'Reservas', href: '#reservas', icon: '📅' },
          { label: 'Horarios', href: '#faq', icon: '🕐' },
        ],
        trendLinks: [
          { label: 'Contacto', href: '/contact', icon: '📞' },
          { label: 'Ubicación', href: '#faq', icon: '📍' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 Spa & Bienestar. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Spa',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Tratamientos', href: '/home#servicios', icon: '💆' },
          { label: 'Precios', href: '/home#precios', icon: '💰' },
          { label: 'Galería', href: '/home#galeria', icon: '🖼️' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Encuentra tu Paz Interior',
        subtitle: 'Tratamientos personalizados para cuerpo y mente',
        showCta: true,
        ctaLabel: 'Reservar Tratamiento',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '',
        navigationCards: [
          {
            icon: '💆',
            title: 'Masajes',
            description: 'Relajación profunda',
            sectionId: 'servicios',
          },
          {
            icon: '✨',
            title: 'Tratamientos',
            description: 'Faciales y corporales',
            sectionId: 'servicios',
          },
          {
            icon: '🧘',
            title: 'Bienestar',
            description: 'Yoga y meditación',
            sectionId: 'servicios',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'oceanic',
        speed: 0.6,
        blur: 40,
        opacity: 0.5,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(0,255,255,0.1)',
        textColor: '#ffffff',
        accentColor: '#00FFFF',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(0, 255, 255, 0.3)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'Nuestros Tratamientos',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#00FFFF',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'Masaje Relajante',
            imageUrl: '/retro-stars.png',
            difficulty: '60 min',
            rating: 4.9,
            reviews: 120,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Masaje completo para eliminar tensiones',
            features: ['Técnicas suecas', 'Aceites esenciales', 'Ambiente relajante'],
            link: '#reservas',
          },
          {
            routeName: 'Tratamiento Facial',
            imageUrl: '/1029.png',
            difficulty: '90 min',
            rating: 4.8,
            reviews: 95,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Rejuvenecimiento y limpieza profunda',
            features: ['Productos naturales', 'Consulta personalizada', 'Resultados visibles'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Necesito reservar con antelación?',
            content: 'Recomendamos reservar al menos 24 horas antes para garantizar disponibilidad.',
            expanded: false,
          },
          {
            title: '¿Qué debo llevar?',
            content: 'Solo necesitas venir cómodo. Te proporcionamos todo lo necesario.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Tratamiento' },
          { key: 'description', label: 'Duración' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Masaje Relajante', description: '60 min', price: '50€' },
          { service: 'Tratamiento Facial', description: '90 min', price: '80€' },
          { service: 'Paquete Completo', description: '150 min', price: '120€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'Día de Spa',
            description: 'Masaje + facial + sauna',
            image: '/retro-stars.png',
            price: '150€',
            discount: '-20%',
            icon: 'heroStar',
            tooltip: '¡Experiencia completa de bienestar!',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Tratamiento 1' },
          { src: '/1029.png', alt: 'Tratamiento 2' },
          { src: '/images.png', alt: 'Tratamiento 3' },
        ],
      },
      products: {
        variant: 'glass',
        items: [],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'Una experiencia increíble, me siento renovada',
            author: 'María S.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true },
        { id: 'servicios', type: 'services', label: 'Tratamientos', visible: true },
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

    // Template 6: Clínica
    this.templates.push({
      id: 'clinic',
      name: 'Clínica Médica',
      description: 'Template para clínicas y consultorios médicos',
      icon: '🏥',
      category: 'Salud',
      header: {
        variant: 'glass',
        title: 'Clínica Médica',
        subtitle: 'Cuidamos de tu salud con profesionalidad',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Inicio', href: '/home', active: true },
          { label: 'Especialidades', href: '/home#servicios' },
          { label: 'Equipo', href: '/home#equipo' },
          { label: 'Contacto', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'Clínica Médica',
        description: 'Atención médica de calidad con tecnología avanzada',
        exploreLinks: [
          { label: 'Medicina General', href: '#servicios', icon: '👨‍⚕️' },
          { label: 'Especialidades', href: '#servicios', icon: '🩺' },
          { label: 'Citas', href: '#reservas', icon: '📅' },
          { label: 'Urgencias', href: '#faq', icon: '🚑' },
        ],
        trendLinks: [
          { label: 'Contacto', href: '/contact', icon: '📞' },
          { label: 'Ubicación', href: '#faq', icon: '📍' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 Clínica Médica. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Clínica',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Servicios', href: '/home#servicios', icon: '🩺' },
          { label: 'Equipo', href: '/home#equipo', icon: '👨‍⚕️' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Tu Salud es Nuestra Prioridad',
        subtitle: 'Atención médica integral con los mejores profesionales',
        showCta: true,
        ctaLabel: 'Pedir Cita',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '',
        navigationCards: [
          {
            icon: '👨‍⚕️',
            title: 'Medicina General',
            description: 'Atención primaria',
            sectionId: 'servicios',
          },
          {
            icon: '🩺',
            title: 'Especialistas',
            description: 'Consultas especializadas',
            sectionId: 'servicios',
          },
          {
            icon: '📅',
            title: 'Citas Online',
            description: 'Reserva tu turno',
            sectionId: 'reservas',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'medical',
        speed: 0.7,
        blur: 32,
        opacity: 0.6,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(34,197,94,0.1)',
        textColor: '#ffffff',
        accentColor: '#22C55E',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(34, 197, 94, 0.3)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'Nuestras Especialidades',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#22C55E',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'Medicina General',
            imageUrl: '/retro-stars.png',
            difficulty: 'Consulta',
            rating: 4.8,
            reviews: 200,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Atención médica integral para toda la familia',
            features: ['Médicos certificados', 'Equipos modernos', 'Atención personalizada'],
            link: '#reservas',
          },
          {
            routeName: 'Pediatría',
            imageUrl: '/1029.png',
            difficulty: 'Consulta',
            rating: 4.9,
            reviews: 150,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Cuidado especializado para los más pequeños',
            features: ['Ambiente infantil', 'Profesionales especializados', 'Vacunación'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Cómo puedo pedir cita?',
            content: 'Puedes llamar por teléfono o utilizar nuestro sistema de citas online.',
            expanded: false,
          },
          {
            title: '¿Aceptan seguros médicos?',
            content: 'Trabajamos con las principales compañías de seguros médicos.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Servicio' },
          { key: 'description', label: 'Descripción' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Consulta General', description: 'Primera visita', price: '60€' },
          { service: 'Consulta Especialista', description: 'Visita especializada', price: '80€' },
          { service: 'Revisión Anual', description: 'Chequeo completo', price: '100€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'Chequeo Completo',
            description: 'Análisis + consulta + electrocardiograma',
            image: '/retro-stars.png',
            price: '150€',
            discount: '-25%',
            icon: 'heroStar',
            tooltip: '¡Cuida tu salud preventiva!',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Instalación 1' },
          { src: '/1029.png', alt: 'Instalación 2' },
          { src: '/images.png', alt: 'Instalación 3' },
        ],
      },
      products: {
        variant: 'glass',
        items: [],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'Excelente atención y profesionales muy preparados',
            author: 'Carlos M.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true },
        { id: 'servicios', type: 'services', label: 'Especialidades', visible: true },
        { id: 'precios', type: 'pricing', label: 'Precios', visible: true },
        { id: 'galeria', type: 'gallery', label: 'Instalaciones', visible: true },
        { id: 'faq', type: 'faq', label: 'FAQ', visible: true },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass',
      },
    });

    // Template 7: Farmacia
    this.templates.push({
      id: 'pharmacy',
      name: 'Farmacia',
      description: 'Template para farmacias y parafarmacias',
      icon: '💊',
      category: 'Salud',
      header: {
        variant: 'glass',
        title: 'Farmacia',
        subtitle: 'Tu salud y bienestar en buenas manos',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Inicio', href: '/home', active: true },
          { label: 'Productos', href: '/home#productos' },
          { label: 'Servicios', href: '/home#servicios' },
          { label: 'Contacto', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'Farmacia',
        description: 'Productos farmacéuticos y consejos profesionales',
        exploreLinks: [
          { label: 'Medicamentos', href: '#productos', icon: '💊' },
          { label: 'Parafarmacia', href: '#productos', icon: '🧴' },
          { label: 'Servicios', href: '#servicios', icon: '🩺' },
          { label: 'Consejos', href: '#faq', icon: '💡' },
        ],
        trendLinks: [
          { label: 'Contacto', href: '/contact', icon: '📞' },
          { label: 'Horarios', href: '#faq', icon: '🕐' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 Farmacia. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Farmacia',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Productos', href: '/home#productos', icon: '💊' },
          { label: 'Servicios', href: '/home#servicios', icon: '🩺' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Cuidamos de tu Salud',
        subtitle: 'Productos farmacéuticos y atención profesional',
        showCta: true,
        ctaLabel: 'Ver Productos',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '',
        navigationCards: [
          {
            icon: '💊',
            title: 'Medicamentos',
            description: 'Con y sin receta',
            sectionId: 'productos',
          },
          {
            icon: '🧴',
            title: 'Parafarmacia',
            description: 'Cuidado personal',
            sectionId: 'productos',
          },
          {
            icon: '🩺',
            title: 'Servicios',
            description: 'Asesoramiento profesional',
            sectionId: 'servicios',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'medical',
        speed: 0.8,
        blur: 30,
        opacity: 0.7,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(34,197,94,0.1)',
        textColor: '#ffffff',
        accentColor: '#22C55E',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(34, 197, 94, 0.3)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'Nuestros Productos',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#22C55E',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'Asesoramiento Farmacéutico',
            imageUrl: '/retro-stars.png',
            difficulty: 'Consulta gratuita',
            rating: 4.8,
            reviews: 180,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Consejos profesionales sobre medicamentos y salud',
            features: ['Farmacéuticos titulados', 'Información fiable', 'Confidencialidad'],
            link: '#servicios',
          },
          {
            routeName: 'Toma de Tensión',
            imageUrl: '/1029.png',
            difficulty: 'Servicio gratuito',
            rating: 4.7,
            reviews: 120,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Control de presión arterial',
            features: ['Equipos certificados', 'Resultados inmediatos', 'Consejos preventivos'],
            link: '#servicios',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Necesito receta para medicamentos?',
            content: 'Algunos medicamentos requieren receta médica. Nuestros farmacéuticos te informarán.',
            expanded: false,
          },
          {
            title: '¿Hacen entregas a domicilio?',
            content: 'Sí, ofrecemos servicio de entrega a domicilio para mayor comodidad.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Producto' },
          { key: 'description', label: 'Descripción' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Paracetamol 1g', description: '20 comprimidos', price: '3.50€' },
          { service: 'Vitamina C', description: '60 cápsulas', price: '8.90€' },
          { service: 'Crema Hidratante', description: '200ml', price: '12.50€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'Kit Bienestar',
            description: 'Suplementos + cremas + consejos personalizados',
            image: '/retro-stars.png',
            price: '45€',
            discount: '-15%',
            icon: 'heroStar',
            tooltip: '¡Cuida tu salud integral!',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Producto 1' },
          { src: '/1029.png', alt: 'Producto 2' },
          { src: '/images.png', alt: 'Producto 3' },
        ],
      },
      products: {
        variant: 'glass',
        items: [
          {
            name: 'Paracetamol',
            image: '/retro-stars.png',
            description: 'Alivio del dolor y fiebre',
            price: '3.50€',
          },
          {
            name: 'Vitamina C',
            image: '/1029.png',
            description: 'Refuerzo del sistema inmunológico',
            price: '8.90€',
          },
        ],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'Siempre encuentro lo que necesito y el mejor consejo',
            author: 'Ana G.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true },
        { id: 'productos', type: 'products', label: 'Productos', visible: true },
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

    // Template 8: Escuela
    this.templates.push({
      id: 'school',
      name: 'Escuela',
      description: 'Template para escuelas e instituciones educativas',
      icon: '🎓',
      category: 'Educación',
      header: {
        variant: 'glass',
        title: 'Escuela',
        subtitle: 'Formando el futuro con excelencia académica',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Inicio', href: '/home', active: true },
          { label: 'Programas', href: '/home#servicios' },
          { label: 'Admisiones', href: '/home#admisiones' },
          { label: 'Contacto', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'Escuela',
        description: 'Educación de calidad para el desarrollo integral',
        exploreLinks: [
          { label: 'Primaria', href: '#servicios', icon: '📚' },
          { label: 'Secundaria', href: '#servicios', icon: '🎓' },
          { label: 'Admisiones', href: '#admisiones', icon: '📝' },
          { label: 'Calendario', href: '#faq', icon: '📅' },
        ],
        trendLinks: [
          { label: 'Contacto', href: '/contact', icon: '📞' },
          { label: 'Ubicación', href: '#faq', icon: '📍' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 Escuela. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Escuela',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Programas', href: '/home#servicios', icon: '📚' },
          { label: 'Admisiones', href: '/home#admisiones', icon: '📝' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Educando para el Futuro',
        subtitle: 'Aprendizaje integral con metodologías innovadoras',
        showCta: true,
        ctaLabel: 'Solicitar Información',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '',
        navigationCards: [
          {
            icon: '📚',
            title: 'Programas',
            description: 'Educación completa',
            sectionId: 'servicios',
          },
          {
            icon: '🎓',
            title: 'Admisiones',
            description: 'Proceso de ingreso',
            sectionId: 'admisiones',
          },
          {
            icon: '👨‍🏫',
            title: 'Profesores',
            description: 'Equipo docente',
            sectionId: 'equipo',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'educational',
        speed: 0.9,
        blur: 28,
        opacity: 0.6,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(59,130,246,0.1)',
        textColor: '#ffffff',
        accentColor: '#3B82F6',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(59, 130, 246, 0.3)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'Nuestros Programas',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#3B82F6',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'Educación Primaria',
            imageUrl: '/retro-stars.png',
            difficulty: '6-12 años',
            rating: 4.8,
            reviews: 150,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Formación integral para niños',
            features: ['Metodología activa', 'Actividades extracurriculares', 'Seguimiento personalizado'],
            link: '#admisiones',
          },
          {
            routeName: 'Educación Secundaria',
            imageUrl: '/1029.png',
            difficulty: '12-18 años',
            rating: 4.9,
            reviews: 120,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Preparación para la universidad',
            features: ['Bachillerato completo', 'Tecnología avanzada', 'Orientación vocacional'],
            link: '#admisiones',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Cuáles son los requisitos de admisión?',
            content: 'Documentación básica, entrevista familiar y evaluación del alumno.',
            expanded: false,
          },
          {
            title: '¿Ofrecen becas?',
            content: 'Sí, tenemos programas de becas basados en mérito y necesidad.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Programa' },
          { key: 'description', label: 'Duración' },
          { key: 'price', label: 'Matrícula' },
        ],
        rows: [
          { service: 'Primaria', description: 'Anual', price: '4.500€' },
          { service: 'Secundaria', description: 'Anual', price: '5.200€' },
          { service: 'Bachillerato', description: 'Anual', price: '5.800€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'Matrícula Anticipada',
            description: 'Descuento especial por matrícula antes del 31 de marzo',
            image: '/retro-stars.png',
            price: 'Descuento 10%',
            discount: '10%',
            icon: 'heroStar',
            tooltip: '¡Aprovecha esta oportunidad!',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Instalación 1' },
          { src: '/1029.png', alt: 'Instalación 2' },
          { src: '/images.png', alt: 'Instalación 3' },
        ],
      },
      products: {
        variant: 'glass',
        items: [],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'Mi hijo ha crecido académica y personalmente en esta escuela',
            author: 'María L.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true },
        { id: 'servicios', type: 'services', label: 'Programas', visible: true },
        { id: 'precios', type: 'pricing', label: 'Precios', visible: true },
        { id: 'galeria', type: 'gallery', label: 'Instalaciones', visible: true },
        { id: 'faq', type: 'faq', label: 'FAQ', visible: true },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass',
      },
    });

    // Additional templates can be added here...
    // Template 9: Barber Shop
    this.templates.push({
      id: 'barber-shop',
      name: 'Barbería',
      description: 'Template para barberías modernas',
      icon: '✂️',
      category: 'Belleza',
      header: {
        variant: 'glass',
        title: 'Barbería Moderna',
        subtitle: 'Estilo y elegancia para hombres',
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
        title: 'Barbería Moderna',
        description: 'Cortes profesionales con estilo contemporáneo',
        exploreLinks: [
          { label: 'Cortes', href: '#servicios', icon: '✂️' },
          { label: 'Barba', href: '#servicios', icon: '🧔' },
          { label: 'Reservas', href: '#reservas', icon: '📅' },
          { label: 'Productos', href: '#productos', icon: '🧴' },
        ],
        trendLinks: [
          { label: 'Contacto', href: '/contact', icon: '📞' },
          { label: 'Horarios', href: '#faq', icon: '🕐' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 Barbería Moderna. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Barber',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Servicios', href: '/home#servicios', icon: '✂️' },
          { label: 'Precios', href: '/home#precios', icon: '💰' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Estilo que Marca la Diferencia',
        subtitle: 'Cortes profesionales y cuidado personal masculino',
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
            icon: '🧔',
            title: 'Barba',
            description: 'Afeitado profesional',
            sectionId: 'servicios',
          },
          {
            icon: '📅',
            title: 'Reservar',
            description: 'Agenda tu cita',
            sectionId: 'reservas',
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
        text: 'Nuestros Servicios',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#FFC107',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'Corte Clásico',
            imageUrl: '/retro-stars.png',
            difficulty: '30 min',
            rating: 4.8,
            reviews: 200,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Corte tradicional con navaja',
            features: ['Técnicas clásicas', 'Productos premium', 'Acabado perfecto'],
            link: '#reservas',
          },
          {
            routeName: 'Corte Moderno',
            imageUrl: '/1029.png',
            difficulty: '45 min',
            rating: 4.9,
            reviews: 180,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Estilos contemporáneos y tendencias',
            features: ['Estilo personalizado', 'Consulta previa', 'Productos de calidad'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Necesito reservar cita?',
            content: 'Recomendamos reservar para evitar esperas, especialmente los fines de semana.',
            expanded: false,
          },
          {
            title: '¿Qué productos utilizan?',
            content: 'Utilizamos productos profesionales de marcas reconocidas.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Servicio' },
          { key: 'description', label: 'Descripción' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Corte + Lavado', description: 'Servicio completo', price: '18€' },
          { service: 'Barba Completa', description: 'Afeitado + perfilado', price: '15€' },
          { service: 'Corte + Barba', description: 'Pack completo', price: '30€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'Primera Visita',
            description: 'Descuento especial para nuevos clientes',
            image: '/retro-stars.png',
            price: '15€',
            discount: '-20%',
            icon: 'heroStar',
            tooltip: '¡Tu primera experiencia con nosotros!',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Trabajo 1' },
          { src: '/1029.png', alt: 'Trabajo 2' },
          { src: '/images.png', alt: 'Trabajo 3' },
        ],
      },
      products: {
        variant: 'glass',
        items: [
          {
            name: 'Crema para Barba',
            image: '/retro-stars.png',
            description: 'Hidrata y suaviza la barba',
            price: '12€',
          },
        ],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'Siempre salgo satisfecho con mi look',
            author: 'David R.',
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

    // Continue adding more templates...
    // Template 10: Boutique
    this.templates.push({
      id: 'boutique',
      name: 'Boutique',
      description: 'Template para boutiques y tiendas de moda',
      icon: '👗',
      category: 'Moda',
      header: {
        variant: 'glass',
        title: 'Boutique',
        subtitle: 'Moda exclusiva y tendencias únicas',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Inicio', href: '/home', active: true },
          { label: 'Colección', href: '/home#productos' },
          { label: 'Novedades', href: '/home#novedades' },
          { label: 'Contacto', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'Boutique',
        description: 'Descubre piezas únicas que definen tu estilo',
        exploreLinks: [
          { label: 'Mujer', href: '#productos', icon: '👗' },
          { label: 'Hombre', href: '#productos', icon: '👔' },
          { label: 'Accesorios', href: '#productos', icon: '👜' },
          { label: 'Sale', href: '#promociones', icon: '🏷️' },
        ],
        trendLinks: [
          { label: 'Contacto', href: '/contact', icon: '📞' },
          { label: 'Horarios', href: '#faq', icon: '🕐' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 Boutique. Todos los derechos reservados.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'Boutique',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inicio', href: '/home', icon: '🏠' },
          { label: 'Colección', href: '/home#productos', icon: '👗' },
          { label: 'Novedades', href: '/home#novedades', icon: '✨' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'Moda que Inspira',
        subtitle: 'Descubre piezas únicas seleccionadas con cuidado',
        showCta: true,
        ctaLabel: 'Ver Colección',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '',
        navigationCards: [
          {
            icon: '👗',
            title: 'Colección',
            description: 'Piezas exclusivas',
            sectionId: 'productos',
          },
          {
            icon: '✨',
            title: 'Novedades',
            description: 'Últimas tendencias',
            sectionId: 'novedades',
          },
          {
            icon: '🏷️',
            title: 'Ofertas',
            description: 'Descuentos especiales',
            sectionId: 'promociones',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'elegant',
        speed: 0.6,
        blur: 35,
        opacity: 0.5,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(236,72,153,0.1)',
        textColor: '#ffffff',
        accentColor: '#EC4899',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(236, 72, 153, 0.3)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'Colección Exclusiva',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#EC4899',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Hacen envíos?',
            content: 'Sí, realizamos envíos a toda España con entrega en 24-48 horas.',
            expanded: false,
          },
          {
            title: '¿Tienen cambios y devoluciones?',
            content: 'Aceptamos cambios y devoluciones en un plazo de 30 días.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Producto' },
          { key: 'description', label: 'Descripción' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Vestido Elegante', description: 'Talla única', price: '89€' },
          { service: 'Blusa de Seda', description: 'Disponible en varios colores', price: '45€' },
          { service: 'Accesorios', description: 'Complementos exclusivos', price: '25€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'Sale de Temporada',
            description: 'Hasta 50% descuento en colección anterior',
            image: '/retro-stars.png',
            price: '50% OFF',
            discount: '50%',
            icon: 'heroStar',
            tooltip: '¡Oportunidad única!',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/retro-stars.png', alt: 'Producto 1' },
          { src: '/1029.png', alt: 'Producto 2' },
          { src: '/images.png', alt: 'Producto 3' },
        ],
      },
      products: {
        variant: 'glass',
        items: [
          {
            name: 'Vestido Elegante',
            image: '/retro-stars.png',
            description: 'Diseño exclusivo para ocasiones especiales',
            price: '89€',
          },
          {
            name: 'Blusa de Seda',
            image: '/1029.png',
            description: 'Comodidad y elegancia en un solo look',
            price: '45€',
          },
        ],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'Siempre encuentro piezas únicas que me encantan',
            author: 'Sofia M.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true },
        { id: 'productos', type: 'products', label: 'Colección', visible: true },
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


