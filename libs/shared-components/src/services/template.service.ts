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
    // Template 1: Peluquería (Luxury Salon)
    this.templates.push({
      id: 'peluqueria',
      name: 'AURA | Luxury Hair & Art',
      description: 'Arquitectura del cabello y medicina estética capilar de alto nivel.',
      icon: '💇‍♀️',
      category: 'Belleza',
      header: {
        variant: 'glass',
        title: 'AURA ART STUDIO',
        subtitle: 'Más allá de la belleza, una experiencia sensorial',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Filosofía', href: '/home#servicios', active: true },
          { label: 'Colecciones', href: '/home#galeria' },
          { label: 'Atelier de Precios', href: '/home#precios' },
          { label: 'Cita VIP', href: '/contact' },
        ],
        customStyles: { '--header-text': '#fdf2f8' },
      },
      footer: {
        variant: 'glass',
        title: 'AURA LUXURY',
        description: 'Especialistas en rubios icónicos y salud capilar avanzada. Utilizamos exclusivamente productos biodegradables de alta gama.',
        exploreLinks: [
          { label: 'Balayage Artístico', href: '#servicios', icon: '✨' },
          { label: 'Ritual Olaplex', href: '#servicios', icon: '🧪' },
          { label: 'Novias Atelier', href: '#servicios', icon: '👰' },
        ],
        trendLinks: [
          { label: 'Academy', href: '#', icon: '📖' },
          { label: 'Shop Online', href: '#', icon: '🛒' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 AURA ART STUDIO. Defining Elegance.',
        showParticles: false,
        dark: false,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'AURA',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Menu de Autor', href: '/home#servicios', icon: '✂️' },
          { label: 'Tarifas', href: '/home#precios', icon: '💰' },
          { label: 'Portfolio', href: '/home#galeria', icon: '🖼️' },
          { label: 'Reservar', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'TU CABELLO ES TU MEJOR ACCESORIO',
        subtitle: 'Atelier especializado en colorimetría avanzada y arquitectura del corte. Diseñamos tu imagen con precisión milimétrica.',
        showCta: true,
        ctaLabel: 'RESERVAR EXPERIENCIA',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/hair-luxury-bg.jpg',
        navigationCards: [
          {
            icon: '🎨',
            title: 'COLOR MASTER',
            description: 'Técnicas de Lyon',
            sectionId: 'servicios',
          },
          {
            icon: '✂️',
            title: 'ARCHITECTURE',
            description: 'Corte de precisión',
            sectionId: 'servicios',
          },
          {
            icon: '✨',
            title: 'GLOSS RITUAL',
            description: 'Brillo diamante',
            sectionId: 'servicios',
          },
        ],
        carouselItems: [],
        customStyles: { '--hero-bg-opacity': '0.7' },
      },
      bubble: {
        variant: 'neon',
        speed: 0.5,
        blur: 40,
        opacity: 0.4,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(255,255,255,0.03)',
        textColor: '#ffffff',
        accentColor: '#ec4899',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(236, 72, 153, 0.2)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'EL ART DE LA COIFFURE',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#fdf2f8',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'Balayage Signature',
            imageUrl: '/1029.png',
            difficulty: 'A partir de 120€',
            rating: 5.0,
            reviews: 320,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Degradados hechos a mano alzada para un efecto natural iluminado por el sol.',
            features: ['Protección Bond included', 'Tonalización personalizada', 'Peinado editorial'],
            link: '#reservas',
          },
          {
            routeName: 'Ritual Reconstruction',
            imageUrl: '/images.png',
            difficulty: 'Desde 65€',
            rating: 4.9,
            reviews: 180,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Tratamiento intensivo con colágeno y seda para cabellos castigados.',
            features: ['Diagnóstico capilar digital', 'Masaje craneal 15 min', 'Infusión de Keratina'],
            link: '#reservas',
          },
          {
            routeName: 'Corte Geométrico',
            imageUrl: '/retro-stars.png',
            difficulty: 'Citas desde 45€',
            rating: 4.8,
            reviews: 95,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Cortes que mantienen su forma durante meses gracias a técnicas estructurales.',
            features: ['Asesoría facial', 'Lavado sensorial', 'Styling premium'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Trabajáis con cabellos rizados?',
            content: 'Somos especialistas en el Método Aura para rizos. Realizamos cortes en seco para respetar la caída natural del bucle.',
            expanded: false,
          },
          {
            title: '¿Qué productos utilizáis?',
            content: 'Exclusivamente Kerastase y Shu Uemura, además de nuestra propia línea de tintes sin amoníacos ni sulfatos.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Servicio' },
          { key: 'description', label: 'Especialista' },
          { key: 'price', label: 'Tarifa' },
        ],
        rows: [
          { service: 'Corte & Peinado', description: 'Senior Stylist', price: '55€' },
          { service: 'Tinte & Brillo', description: 'Creative Colorist', price: '85€' },
          { service: 'Balayage Premium', description: 'Art Director', price: '145€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'WEDDING PASS',
            description: 'Prueba de peinado + Maquillaje + Ritual Brillo.',
            image: '/images.png',
            price: '210€',
            discount: 'Incluye Kit Viaje',
            icon: 'heroStar',
            tooltip: 'Tu gran día merece la perfección.',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/hair-1.jpg', alt: 'Aura Blond' },
          { src: '/hair-2.jpg', alt: 'Art Cut' },
          { src: '/hair-3.jpg', alt: 'Editorial Look' },
        ],
      },
      products: {
        variant: 'glass',
        items: [
          {
            name: 'Aura Elixir Oil',
            image: '/1029.png',
            description: 'Aceite seco nutritivo con aroma a Jazmín.',
            price: '38€',
          },
        ],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'Nunca habían entendido mi rubio como aquí. Es el lugar definitivo para el color.',
            author: 'Patricia S.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Entrada Triunfal', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Nuestra Carta', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Inversión Belleza', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'galeria', type: 'gallery', label: 'Showcase', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'faq', type: 'faq', label: 'Consultas Comunes', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'glass',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass',
        card: 'glass'
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
        { id: 'hero', type: 'hero', label: 'Hero', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Servicios', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Precios', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'galeria', type: 'gallery', label: 'Galería', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'faq', type: 'faq', label: 'FAQ', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
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
        { id: 'hero', type: 'hero', label: 'Hero', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Menú', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Precios', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'galeria', type: 'gallery', label: 'Galería', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'faq', type: 'faq', label: 'FAQ', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass',
      },
    });

    // Template 4: Gimnasio (Elite Performance)
    this.templates.push({
      id: 'gimnasio',
      name: 'Elite Performance Center',
      description: 'El estándar de oro en entrenamiento personal y rendimiento atlético.',
      icon: '🏋️‍♂️',
      category: 'Deportes',
      header: {
        variant: 'cyberpunk',
        title: 'ELITE PERFORMANCE',
        subtitle: 'Donde los límites se rompen',
        align: 'left',
        dark: true,
        visible: true,
        navItems: [
          { label: 'El Método', href: '/home#metodo', active: true },
          { label: 'Centro', href: '/home#galeria' },
          { label: 'Membresías', href: '/home#precios' },
          { label: 'Únete', href: '/contact' },
        ],
        customStyles: { '--header-bg': 'rgba(2, 6, 23, 0.9)' },
      },
      footer: {
        variant: 'neon',
        title: 'ELITE PERFORMANCE',
        description: 'No somos solo un gimnasio. Somos un centro de transformación biomecánica y mental.',
        exploreLinks: [
          { label: 'Área HIIT', href: '#servicios', icon: '⚡' },
          { label: 'Recovery Lab', href: '#servicios', icon: '❄️' },
          { label: 'Personalized Coaching', href: '#servicios', icon: '👤' },
        ],
        trendLinks: [
          { label: 'Masterclasses', href: '#reservas', icon: '🎓' },
          { label: 'Performance Gear', href: '#faq', icon: '👕' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'twitter', href: '#' },
        ],
        copyrightText: '© 2025 ELITE PERFORMANCE CENTER. Elevate your DNA.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'neon',
        logoText: 'ELITE',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Entrenamientos', href: '/home#servicios', icon: '💪' },
          { label: 'Precios', href: '/home#precios', icon: '💎' },
          { label: 'Galería', href: '/home#galeria', icon: '📷' },
          { label: 'Contacto', href: '/contact', icon: '✉️' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'cyberpunk',
        title: 'LIBERA TU POTENCIAL DE ÉLITE',
        subtitle: 'Programas de entrenamiento basados en ciencia, dirigidos por atletas olímpicos. El cambio real empieza aquí.',
        showCta: true,
        ctaLabel: 'SOLICITAR ANÁLISIS BIO-MECÁNICO',
        showScrollIcon: true,
        videoBackground: true,
        videoUrl: 'https://v1.bg.gym-promo.mp4', // Placeholder
        videoPoster: '/hero-gym-dark.jpg',
        navigationCards: [
          {
            icon: '⚡',
            title: 'HIIT V.2',
            description: 'Intensidad extrema',
            sectionId: 'servicios',
          },
          {
            icon: '🧠',
            title: 'MENTAL EDGE',
            description: 'Coaching mental',
            sectionId: 'servicios',
          },
          {
            icon: '💎',
            title: 'PLATINUM VIP',
            description: 'Acceso total 24/7',
            sectionId: 'precios',
          },
        ],
        carouselItems: [],
        customStyles: { '--hero-overlay': 'linear-gradient(to bottom, rgba(2,6,23,0.8), rgba(2,6,23,0.4))' },
      },
      bubble: {
        variant: 'fiery',
        speed: 1.8,
        blur: 20,
        opacity: 0.6,
      },
      card: {
        variant: 'neon',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        textColor: '#ffffff',
        accentColor: '#6366f1',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(99, 102, 241, 0.3)',
          '--card-glow': '0 0 20px rgba(99, 102, 241, 0.2)'
        },
      },
      title: {
        variant: 'cyberpunk',
        level: 'h2',
        text: 'NUESTRA METODOLOGÍA',
        animation: 'slide',
        align: 'left',
        customStyles: {
          '--title-accent': '#6366f1',
        },
      },
      serviceCards: {
        variant: 'neon',
        items: [
          {
            routeName: 'Entrenamiento Biomecánico',
            imageUrl: '/1090.png',
            difficulty: 'Alta Intensidad',
            rating: 4.9,
            reviews: 450,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Optimiza cada movimiento. Menos lesiones, más resultados medibles en solo 21 días.',
            features: ['Análisis de postura 3D', 'Sensores de potencia', 'Feedback en tiempo real'],
            link: '#reservas',
          },
          {
            routeName: 'Recovery & Cryo Lab',
            imageUrl: '/1029.png',
            difficulty: 'Recuperación',
            rating: 5.0,
            reviews: 120,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Cámaras de crioterapia y botas de compresión para una recuperación de atleta profesional.',
            features: ['Inmersión en frío', 'Luz Roja Terapéutica', 'Drenaje linfático'],
            link: '#reservas',
          },
          {
            routeName: 'CrossFit Elite WOD',
            imageUrl: '/retro-stars.png',
            difficulty: 'Desafío Total',
            rating: 4.8,
            reviews: 215,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'La comunidad más competitiva. Grupos reducidos para un coaching de máxima calidad.',
            features: ['Material Rogue Premium', 'Coach L3 Certificado', 'App de progresión'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        variant: 'neon',
        items: [
          {
            title: '¿Tengo que estar en forma para empezar?',
            content: 'Absolutamente no. El 70% de nuestros miembros Platinum empezaron desde cero. Nuestro análisis inicial adapta el peso y la intensidad a tu nivel actual.',
            expanded: false,
          },
          {
            title: '¿Qué incluye el pase Platinum VIP?',
            content: 'Acceso 24/7 con biometría facial, 4 sesiones mensuales de Recovery Lab, plan nutricional personalizado y toallas de repuesto ilimitadas.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'neon',
        columns: [
          { key: 'service', label: 'Paquete de Rendimiento' },
          { key: 'description', label: 'Ventajas Elite' },
          { key: 'price', label: 'Inversión' },
        ],
        rows: [
          { service: 'Athlete Base', description: 'Acceso total + App Móvil', price: '49€/mes' },
          { service: 'Pro Performance', description: 'Athlete + Recovery Lab (2/mes)', price: '85€/mes' },
          { service: 'Platinum Legend', description: 'Todo Incluido + Personal Coach', price: '149€/mes' },
        ],
      },
      promotions: {
        variant: 'neon',
        premiumCards: [
          {
            title: 'FOUNDER MEMBER',
            description: 'Últimos 10 cupos con precio vitalicio y kit de bienvenida Nike.',
            image: '/1029.png',
            price: '39€',
            discount: '-30% Life',
            icon: 'heroStar',
            tooltip: '¡Únete a la leyenda!',
          },
        ],
      },
      gallery: {
        variant: 'cyberpunk',
        images: [
          { src: '/gym-main.jpg', alt: 'Main Arena' },
          { src: '/gym-recovery.jpg', alt: 'Recovery Lab' },
          { src: '/gym-people.jpg', alt: 'Comunidad Elite' },
        ],
      },
      products: {
        variant: 'neon',
        items: [
          {
            name: 'WHEY ISO ELITE',
            image: '/prod-prote.png',
            description: 'Proteína pura con absorción de 15 min.',
            price: '34.99€',
          },
        ],
      },
      testimonials: {
        variant: 'neon',
        items: [
          {
            quote: 'Cambié mi cuerpo en 3 meses, pero mi mentalidad cambió en la primera semana. Este lugar es otro nivel.',
            author: 'Marc V. (CEO & Triatleta)',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Impacto Inicial', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'stats', type: 'stats', label: 'Resultados Reales', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Punta de Lanza', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Plan de Éxito', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'galeria', type: 'gallery', label: 'El Templo', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'faq', type: 'faq', label: 'Dudas Críticas', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'cyberpunk',
      componentVariants: {
        hero: 'cyberpunk',
        navbar: 'neon',
        footer: 'neon',
        card: 'neon',
        stats: 'neon'
      },
    });

    // Template 3: Restaurante (Fine Dining)
    this.templates.push({
      id: 'restaurante',
      name: 'L’Artiste | Gastronomique',
      description: 'Una oda a la alta cocina de vanguardia y el producto de temporada.',
      icon: '👨‍🍳',
      category: 'Gastronomía',
      header: {
        variant: 'glass',
        title: 'L’ARTISTE',
        subtitle: 'Poesía en cada bocado',
        align: 'center',
        dark: true,
        visible: true,
        navItems: [
          { label: 'La Experiencia', href: '/home#servicios', active: true },
          { label: 'Menú Degustación', href: '/home#precios' },
          { label: 'La Cava', href: '/home#galeria' },
          { label: 'Reservar Mesa', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'L’ARTISTE RESTAURANT',
        description: 'Ubicados en el corazón de la ciudad, ofreciendo una experiencia multisensorial desde 1998.',
        exploreLinks: [
          { label: 'Menú Seasonal', href: '#servicios', icon: '🍃' },
          { label: 'Wine Pairing', href: '#servicios', icon: '🍷' },
          { label: 'Private Events', href: '#servicios', icon: '🏛️' },
        ],
        trendLinks: [
          { label: 'Awards', href: '#', icon: '⭐' },
          { label: 'Careers', href: '#', icon: '💼' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 L’ARTISTE. Gastronomic Excellence.',
        showParticles: false,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'L’ARTISTE',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'El Menú', href: '/home#servicios', icon: '🍽️' },
          { label: 'Cata de Vinos', href: '/home#galeria', icon: '🍷' },
          { label: 'Reservar', href: '/contact', icon: '📅' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'DONDE LA GASTRONOMÍA SE VUELVE ARTE',
        subtitle: 'Ingredientes puros explorados a través de la técnica clásica y la innovación disruptiva. Una mesa te espera.',
        showCta: true,
        ctaLabel: 'EXPLORAR EL MENÚ',
        showScrollIcon: true,
        videoBackground: true,
        videoUrl: '/kitchen-slowmo.mp4',
        videoPoster: '/dish-luxury.jpg',
        navigationCards: [
          {
            icon: '🌿',
            title: 'NATURE',
            description: 'Vegetales KM 0',
            sectionId: 'servicios',
          },
          {
            icon: '🌊',
            title: 'OCEAN',
            description: 'Pesca del día',
            sectionId: 'servicios',
          },
          {
            icon: '🔥',
            title: 'FIRE',
            description: 'Brasa de roble',
            sectionId: 'servicios',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'oceanic',
        speed: 0.4,
        blur: 50,
        opacity: 0.3,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(255,255,255,0.02)',
        textColor: '#ffffff',
        accentColor: '#fbbf24',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(251, 191, 36, 0.2)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'MANIFIESTO CULINARIO',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#fbbf24',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'Menú Mar y Montaña',
            imageUrl: '/1029.png',
            difficulty: '9 Pasos',
            rating: 5.0,
            reviews: 156,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Un viaje por la costa y la sierra en una secuencia de platos que desafían la gravedad.',
            features: ['Pescado salvaje', 'Carnes maduradas', 'Postres de autor'],
            link: '#reservas',
          },
          {
            routeName: 'La Mesa del Chef',
            imageUrl: '/1090.png',
            difficulty: 'Privado',
            rating: 4.9,
            reviews: 42,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Cena exclusiva dentro de nuestra cocina. Observa el ballet culinario en primera fila.',
            features: ['Maridaje Premium', 'Interacción con el Chef', 'Menú sorpresa'],
            link: '#reservas',
          },
          {
            routeName: 'Atelier de Pastelería',
            imageUrl: '/images.png',
            difficulty: 'Dulce Final',
            rating: 4.8,
            reviews: 89,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Arquitectura dulce que combina texturas heladas y crujientes con especias exóticas.',
            features: ['Cacao de origen', 'Sin azúcares refinados', 'Vino de postre'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Tienen opciones para alergias?',
            content: 'Por supuesto. Al realizar la reserva, indíquenos cualquier restricción dietética y nuestro equipo adaptará el menú sin sacrificar la esencia del plato.',
            expanded: false,
          },
          {
            title: '¿Cuál es el código de vestimenta?',
            content: 'Recomendamos un estilo Smart Casual para armonizar con el ambiente refinado de nuestro salón principal.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Secuencia' },
          { key: 'description', label: 'Detalles' },
          { key: 'price', label: 'Cubierto' },
        ],
        rows: [
          { service: 'Menú Petit', description: '5 Pasos + Snack', price: '75€' },
          { service: 'Menú Grand', description: '9 Pasos + Maridaje Base', price: '125€' },
          { service: 'L’Artiste Experience', description: '12 Pasos + Maridaje Icono', price: '195€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'GIFT EXPERIENCE',
            description: 'Regala una cena inolvidable para dos personas en sobre lacre.',
            image: '/1090.png',
            price: '250€',
            discount: 'Incluye Champagne',
            icon: 'heroStar',
            tooltip: 'El regalo perfecto para los amantes del buen comer.',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/dish-1.jpg', alt: 'Vieira a la Brasa' },
          { src: '/dish-2.jpg', alt: 'Cava de Vinos' },
          { src: '/dish-3.jpg', alt: 'El Salón' },
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
            quote: 'Más que una comida, fue un espectáculo. Cada plato cuenta una historia.',
            author: 'Julian R. (Food Critic)',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Bienvenida', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'La Propuesta', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Cartas', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'galeria', type: 'gallery', label: 'La Cava', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'faq', type: 'faq', label: 'Protocolo', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'glass',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass',
        card: 'glass'
      },
    });

    // Template 6: Clínica (Modern Health)
    this.templates.push({
      id: 'clinic',
      name: 'MediCore | Advanced Health',
      description: 'Liderazgo médico centrado en el paciente con tecnología de diagnóstico de última generación.',
      icon: '🩺',
      category: 'Salud',
      header: {
        variant: 'glass',
        title: 'MEDICORE ADVANCED',
        subtitle: 'Excelencia científica al servicio de tu bienestar',
        align: 'left',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Unidades Médicas', href: '/home#servicios', active: true },
          { label: 'Tecnología', href: '/home#galeria' },
          { label: 'Preguntas', href: '/home#faq' },
          { label: 'Cita en Línea', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'MEDICORE HEALTH GROUP',
        description: 'Certificados bajo estándares internacionales de seguridad y calidad hospitalaria.',
        exploreLinks: [
          { label: 'Telemedicina 24/7', href: '#servicios', icon: '💻' },
          { label: 'Chequeo Preventivo', href: '#servicios', icon: '🛡️' },
          { label: 'Resultados Digitales', href: '#servicios', icon: '📊' },
        ],
        trendLinks: [
          { label: 'Emergency', href: '#', icon: '🚑' },
          { label: 'Research Lab', href: '#', icon: '🔬' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 MEDICORE SOLUTIONS. Healthcare Evolved.',
        showParticles: true,
        dark: false,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'MEDICORE',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Especialidades', href: '/home#servicios', icon: '🩺' },
          { label: 'Seguros', href: '/home#faq', icon: '🛡️' },
          { label: 'Pedir Cita', href: '/contact', icon: '📅' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'oceanic',
        title: 'TU SALUD EN MANOS DE EXPERTOS',
        subtitle: 'Combinamos el calor humano con la precisión de la inteligencia artificial para ofrecerte el mejor diagnóstico médico del país.',
        showCta: true,
        ctaLabel: 'SOLICITAR CITA DE VALORACIÓN',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/clinic-modern-blue.jpg',
        navigationCards: [
          {
            icon: '❤️',
            title: 'CARDIOLOGÍA',
            description: 'Ritmo vital',
            sectionId: 'servicios',
          },
          {
            icon: '🧬',
            title: 'GENÉTICA',
            description: 'Medicina preventiva',
            sectionId: 'servicios',
          },
          {
            icon: '🏥',
            title: 'URGENCIAS',
            description: 'Atención inmediata',
            sectionId: 'servicios',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'medical',
        speed: 0.5,
        blur: 35,
        opacity: 0.4,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(255,255,255,0.05)',
        textColor: '#1e293b',
        accentColor: '#3b82f6',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(59, 130, 246, 0.2)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'EXCELENCIA EN CADA UNIDAD',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#1d4ed8',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'Medicina Interna & IA',
            imageUrl: '/1029.png',
            difficulty: 'Unidad Central',
            rating: 5.0,
            reviews: 840,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Uso de algoritmos de soporte para diagnósticos ultra-precisos y seguimiento 360 del paciente.',
            features: ['Historial en la nube', 'Monitoreo remoto', 'Seguidores de salud'],
            link: '#reservas',
          },
          {
            routeName: 'Pediatría Humanizada',
            imageUrl: '/images.png',
            difficulty: 'Unidad Infantil',
            rating: 4.9,
            reviews: 310,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Entornos libres de estrés para los más pequeños, con especialistas en neurodesarrollo y alergias.',
            features: ['Área de juegos tech', 'Vacunación sin dolor', 'Nutricionista infantil'],
            link: '#reservas',
          },
          {
            routeName: 'Unidad del Dolor & Rehab',
            imageUrl: '/retro-stars.png',
            difficulty: 'Recuperación',
            rating: 4.8,
            reviews: 215,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Fisioterapia avanzada y tratamientos mínimamente invasivos para recuperar tu calidad de vida.',
            features: ['Láser terapéutico', 'Piscina de rehabilitación', 'Terapia ocupacional'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Qué seguros médicos aceptan?',
            content: 'Trabajamos con Sanitas, Adeslas, Mapfre y la mayoría de mutuas profesionales internacionales. Consúltenos su póliza.',
            expanded: false,
          },
          {
            title: '¿Ofrecen consultas por vídeo?',
            content: 'Sí, disponemos de una plataforma propia de telemedicina segura (cumple con GDPR) para consultas de seguimiento y resultados.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Servicio' },
          { key: 'description', label: 'Especialista' },
          { key: 'price', label: 'Inversión' },
        ],
        rows: [
          { service: 'Consulta Especialista', description: 'Visita presencial / Online', price: '75€' },
          { service: 'Chequeo Integral', description: 'Laboratorio + Consulta + Eco', price: '180€' },
          { service: 'Plan Salud Familiar', description: 'Cobertura 3 personas / año', price: '450€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'FULL BODY SCAN',
            description: 'Análisis preventivo completo con resonancia y marcadores genéticos.',
            image: '/1029.png',
            price: '300€',
            discount: '-20% Members',
            icon: 'heroStar',
            tooltip: 'La prevención es tu mejor medicina.',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/clinic-1.jpg', alt: 'Modern Operating Room' },
          { src: '/clinic-2.jpg', alt: 'Reception Area' },
          { src: '/clinic-3.jpg', alt: 'Patient Room' },
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
            quote: 'El trato humano y la tecnología disponible me dieron la tranquilidad que necesitaba en un momento difícil.',
            author: 'Elena M.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Impacto Médico', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Especialidades', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Planes de Salud', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'faq', type: 'faq', label: 'Atención Asegurado', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'glass',
      componentVariants: {
        hero: 'oceanic',
        navbar: 'glass',
        footer: 'glass',
        card: 'glass'
      },
    });

    // Template 7: Farmacia (Wellness & Clinical)
    this.templates.push({
      id: 'pharmacy',
      name: 'PharmaLife | Wellness Lab',
      description: 'Más que una farmacia, tu centro de biotecnología y cuidado preventivo avanzado.',
      icon: '🧪',
      category: 'Salud',
      header: {
        variant: 'glass',
        title: 'PHARMALIFE CLINICAL',
        subtitle: 'Ciencia aplicada a tu longevidad',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Wellness Shop', href: '/home#productos', active: true },
          { label: 'Análisis Lab', href: '/home#servicios' },
          { label: 'Consejo Experto', href: '/home#faq' },
          { label: 'Farmacia 24h', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'PHARMALIFE GLOBAL',
        description: 'Líderes en dermocosmética avanzada y nutrición de alto rendimiento desde hace 20 años.',
        exploreLinks: [
          { label: 'Bio-Suplementos', href: '#productos', icon: '🍃' },
          { label: 'Dermo-Estética', href: '#productos', icon: '✨' },
          { label: 'Unidad de Nutrición', href: '#servicios', icon: '🍎' },
        ],
        trendLinks: [
          { label: 'Blog Salud', href: '#', icon: '📝' },
          { label: 'Receta Digital', href: '#', icon: '📲' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 PHARMALIFE WELLNESS LAB. Science for Life.',
        showParticles: true,
        dark: false,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'PHARMALIFE',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Productos', href: '/home#productos', icon: '💊' },
          { label: 'Servicios Lab', href: '/home#servicios', icon: '🔬' },
          { label: 'Promociones', href: '/home#precios', icon: '🏷️' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'oceanic',
        title: 'TU BIENESTAR, NUESTRA CIENCIA',
        subtitle: 'Descubre nuestra línea exclusiva de suplementación celular y dermocosmética premium. Diagnóstico capilar y de piel gratuito.',
        showCta: true,
        ctaLabel: 'COMPRAR LÍNEA PREMIUM',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/pharmacy-clean-bg.jpg',
        navigationCards: [
          {
            icon: '🧬',
            title: 'BIO-DIAGNÓSTICO',
            description: 'Piel y Cabello',
            sectionId: 'servicios',
          },
          {
            icon: '🧴',
            title: 'SKIN PRESTIGE',
            description: 'Alta cosmética',
            sectionId: 'productos',
          },
          {
            icon: '🍏',
            title: 'NUTRI-ELITE',
            description: 'Rendimiento puro',
            sectionId: 'productos',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'medical',
        speed: 0.6,
        blur: 35,
        opacity: 0.5,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(255,255,255,0.04)',
        textColor: '#0f172a',
        accentColor: '#10b981',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(16, 185, 129, 0.2)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'CUIDADO CLÍNICO AVANZADO',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#059669',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'Formulación Magistral',
            imageUrl: '/1029.png',
            difficulty: 'Laboratorio Propio',
            rating: 5.0,
            reviews: 145,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Creamos medicamentos y cosméticos personalizados adaptados exactamente a tu necesidad dermatológica.',
            features: ['Pureza garantizada', 'I+D farmacéutico', 'Entrega 24h'],
            link: '#servicios',
          },
          {
            routeName: 'Test de Intolerancias',
            imageUrl: '/1090.png',
            difficulty: 'Resultados Rápidos',
            rating: 4.8,
            reviews: 210,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Análisis avanzado para detectar 200+ intolerancias alimentarias y mejorar tu digestión hoy mismo.',
            features: ['Sin pinchazos', 'Informe médico', 'Plan dietético'],
            link: '#servicios',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Tienen servicio de guardia?',
            content: 'Estamos abiertos los 365 días del año de 9:00 a 22:00, y coordinamos con las farmacias de guardia de la zona para emergencias nocturnas.',
            expanded: false,
          },
          {
            title: '¿Qué es el análisis dermo-estético?',
            content: 'Es un estudio digital de las capas profundas de tu piel para recomendarte una rutina que realmente funcione.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Pack Ahorro' },
          { key: 'description', label: 'Contenido' },
          { key: 'price', label: 'Inversión' },
        ],
        rows: [
          { service: 'Pack Verano', description: 'Solar + Aftersun + Labial', price: '35€' },
          { service: 'Cuidado Capilar', description: 'Champú + Mascarilla Pro', price: '42€' },
          { service: 'Detox 21 días', description: 'Suplementos + Guía', price: '58€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'CLUB PHARMALIFE',
            description: 'Únete y obtén un 5% de descuento directo en parafarmacia para siempre.',
            image: '/images.png',
            price: 'Gratis',
            discount: 'Socio VIP',
            icon: 'heroStar',
            tooltip: '¡Beneficios de por vida!',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/pharmacy-1.jpg', alt: 'Laboratorio' },
          { src: '/pharmacy-2.jpg', alt: 'Fachada' },
        ],
      },
      products: {
        variant: 'glass',
        items: [
          {
            name: 'Suero Vitamina C+',
            image: '/1029.png',
            description: 'Efecto iluminador instantáneo y anti-oxidante.',
            price: '28.90€',
          },
          {
            name: 'Magnesio Elite',
            image: '/1090.png',
            description: 'Máxima absorción para recuperación muscular.',
            price: '19.50€',
          },
        ],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'La atención es impecable. El análisis de piel me cambió la cara por completo.',
            author: 'Laura B.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Portada', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'productos', type: 'products', label: 'Línea Premium', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Unidades Clínicas', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'faq', type: 'faq', label: 'Dudas Salud', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'glass',
      componentVariants: {
        hero: 'oceanic',
        navbar: 'glass',
        footer: 'glass'
      },
    });

    // Template 8: Escuela (Premier International School)
    this.templates.push({
      id: 'school',
      name: 'Lumina Global School',
      description: 'Formando a los líderes del mañana con un currículo internacional y bilingüe de prestigio.',
      icon: '🏰',
      category: 'Educación',
      header: {
        variant: 'glass',
        title: 'LUMINA ACADEMY',
        subtitle: 'Excelencia, Innovación, Comunidad',
        align: 'left',
        dark: true,
        visible: true,
        navItems: [
          { label: 'El Colegio', href: '/home', active: true },
          { label: 'Currículo', href: '/home#servicios' },
          { label: 'Vida Estudiantil', href: '/home#galeria' },
          { label: 'Proceso de Admisión', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'LUMINA GLOBAL',
        description: 'Institución acreditada por los estándares educativos más altos de Europa y América.',
        exploreLinks: [
          { label: 'Early Years', href: '#servicios', icon: '🧸' },
          { label: 'IB Diploma', href: '#servicios', icon: '🏅' },
          { label: 'Sports Club', href: '#servicios', icon: '⚽' },
        ],
        trendLinks: [
          { label: 'Summer Camp', href: '#', icon: '☀️' },
          { label: 'Portal Padres', href: '#', icon: '🔑' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
          { name: 'facebook', href: '#' },
        ],
        copyrightText: '© 2025 LUMINA GLOBAL SCHOOL. Designing Futures.',
        showParticles: false,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'LUMINA',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Oferta Académica', href: '/home#servicios', icon: '📚' },
          { label: 'Campus', href: '/home#galeria', icon: '🏫' },
          { label: 'Admisiones', href: '/home#precios', icon: '📝' },
          { label: 'Contactar', href: '/contact', icon: '✉️' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'DONDE EL POTENCIAL NO TIENE LÍMITES',
        subtitle: 'Metodologías activas en un entorno multinacional. Preparamos ciudadanos del mundo con pensamiento crítico y valores sólidos.',
        showCta: true,
        ctaLabel: 'SOLICITAR TOUR PRIVADO',
        showScrollIcon: true,
        videoBackground: true,
        videoUrl: '/campus-aerial.mp4',
        videoPoster: '/school-hero-main.jpg',
        navigationCards: [
          {
            icon: '🌎',
            title: '100% BILINGÜE',
            description: 'Inglés Nativo',
            sectionId: 'servicios',
          },
          {
            icon: '💻',
            title: 'STEAM HUB',
            description: 'Robótica & Arte',
            sectionId: 'servicios',
          },
          {
            icon: '🎓',
            title: 'TOP 5%',
            description: 'Resultados PISA',
            sectionId: 'servicios',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'educational',
        speed: 0.7,
        blur: 30,
        opacity: 0.5,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(255,255,255,0.03)',
        textColor: '#1e293b',
        accentColor: '#3b82f6',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(59, 130, 246, 0.2)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'NUESTROS PILARES',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#1e3a8a',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'IB Program',
            imageUrl: '/1029.png',
            difficulty: 'Middle & High School',
            rating: 5.0,
            reviews: 540,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Bachillerato Internacional enfocado en la investigación propia y la mentalidad abierta.',
            features: ['Acreditación CIS', 'Preparación Universitaria', 'Tutoría 1 a 1'],
            link: '#servicios',
          },
          {
            routeName: 'Creative Arts Center',
            imageUrl: '/images.png',
            difficulty: 'All Levels',
            rating: 4.9,
            reviews: 180,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Música, teatro y artes visuales como parte fundamental del desarrollo cognitivo.',
            features: ['Auditorio propio', 'Apple Distinguished', 'Expertos externos'],
            link: '#servicios',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Tienen transporte escolar?',
            content: 'Contamos con una flota de 12 rutas modernas que cubren toda el área metropolitana y alrededores.',
            expanded: false,
          },
          {
            title: '¿Qué idiomas se imparten?',
            content: 'Inglés como lengua vehicular, además de Alemán, Francés y Chino Mandarín como lenguas opcionales.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Etapa' },
          { key: 'description', label: 'Anualidad' },
          { key: 'price', label: 'Mensual' },
        ],
        rows: [
          { service: 'Nivel Inicial', description: '3 a 5 años', price: '450€' },
          { service: 'Primaria', description: 'Y1 a Y6', price: '620€' },
          { service: 'Secundaria & IB', description: 'Y7 a Y13', price: '890€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'SCHOLARSHIP 2025',
            description: 'Convocatoria abierta para talentos académicos y deportivos sobresalientes.',
            image: '/1090.png',
            price: 'Hasta 75%',
            discount: 'Beca Mérito',
            icon: 'heroStar',
            tooltip: 'Premiamos tu excelencia.',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/school-1.jpg', alt: 'Library' },
          { src: '/school-2.jpg', alt: 'Labs' },
          { src: '/school-3.jpg', alt: 'Sports Fields' },
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
            quote: 'Lumina no solo enseña materias, enseña a amar el aprendizaje.',
            author: 'Familia Thompson.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Bienvenida', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Académico', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Fee Structure', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'galeria', type: 'gallery', label: 'Campus Life', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass'
      },
    });

    // Template 9: Barbería (Iron & Oak)
    this.templates.push({
      id: 'barber-shop',
      name: 'Iron & Oak | Master Barbers',
      description: 'El refugio definitivo del caballero moderno. Cortes de precisión y rituales de afeitado.',
      icon: '🪒',
      category: 'Belleza',
      header: {
        variant: 'retro',
        title: 'IRON & OAK',
        subtitle: 'Estilo. Tradición. Whiskey.',
        align: 'center',
        dark: true,
        visible: true,
        navItems: [
          { label: 'Servicios', href: '/home#servicios', active: true },
          { label: 'El Equipo', href: '/home#equipo' },
          { label: 'Precios', href: '/home#precios' },
          { label: 'Reservar', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'retro',
        title: 'IRON & OAK BARBERSHOP',
        description: 'Recuperando el arte del afeitado clásico en un entorno contemporáneo.',
        exploreLinks: [
          { label: 'Corte Degradado', href: '#servicios', icon: '✂️' },
          { label: 'Ritual de Toalla', href: '#servicios', icon: '🧖' },
          { label: 'Perfilado Barba', href: '#servicios', icon: '🧔' },
        ],
        trendLinks: [
          { label: 'Tienda Productos', href: '#', icon: '💈' },
          { label: 'Franquicias', href: '#', icon: '📍' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
        ],
        copyrightText: '© 2025 IRON & OAK. Stay Sharp.',
        showParticles: false,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'retro',
        logoText: 'IRON&OAK',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Servicios', href: '/home#servicios', icon: '✂️' },
          { label: 'Tarifas', href: '/home#precios', icon: '💰' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'retro',
        title: 'MÁS QUE UN CORTE, UN RITUAL',
        subtitle: 'Ponte cómodo, disfruta de un buen café o un whiskey seleccionado mientras transformamos tu imagen.',
        showCta: true,
        ctaLabel: 'RESERVAR SILLÓN',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/barber-vintage-dark.jpg',
        navigationCards: [
          {
            icon: '💈',
            title: 'HAIR CUT',
            description: 'Diseño personal',
            sectionId: 'servicios',
          },
          {
            icon: '🚬',
            title: 'THE SHAVE',
            description: 'Toalla caliente',
            sectionId: 'servicios',
          },
          {
            icon: '🍸',
            title: 'BAR & LOUNGE',
            description: 'Cortesía VIP',
            sectionId: 'servicios',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'neon',
        speed: 0.3,
        blur: 45,
        opacity: 0.3,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(25,25,25,0.7)',
        textColor: '#ffffff',
        accentColor: '#d4af37',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(212, 175, 55, 0.3)',
        },
      },
      title: {
        variant: 'retro',
        level: 'h2',
        text: 'MENÚ DE AUTOR',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#d4af37',
        },
      },
      serviceCards: {
        variant: 'glass',
        items: [
          {
            routeName: 'The Executive Cut',
            imageUrl: '/1029.png',
            difficulty: 'Top Seller',
            rating: 5.0,
            reviews: 630,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Lavado, corte de diseño, peinado con pomada premium y masaje relajante.',
            features: ['Incluye Bebida', 'Perfilado Cejas', 'Higiene Facial'],
            link: '#reservas',
          },
          {
            routeName: 'Royal Shave Ritual',
            imageUrl: '/retro-stars.png',
            difficulty: 'Experiencia 45 min',
            rating: 4.9,
            reviews: 180,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Afeitado tradicional a navaja con 3 capas de toalla caliente y aceites de Cedro.',
            features: ['Aftershave artesano', 'Masaje hombros', 'Hidratación intensa'],
            link: '#reservas',
          },
        ],
      },
      faq: {
        variant: 'glass',
        items: [
          {
            title: '¿Puedo elegir barbero?',
            content: 'Sí, a través de nuestra App puedes ver el portafolio de cada Master Barber y elegir tu favorito.',
            expanded: false,
          },
          {
            title: '¿Tienen aparcamiento?',
            content: 'Disponemos de convenio con el parking de la calle principal para clientes.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Servicio' },
          { key: 'description', label: 'Tiempo' },
          { key: 'price', label: 'Precio' },
        ],
        rows: [
          { service: 'Corte Master', description: '40 min', price: '25€' },
          { service: 'Arreglo de Barba', description: '20 min', price: '15€' },
          { service: 'Combo completo', description: '60 min', price: '35€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'FIRST SHARP',
            description: 'Viene por primera vez y llévate una cera de brillo gratis.',
            image: '/1090.png',
            price: '-10%',
            discount: 'Welcome',
            icon: 'heroStar',
            tooltip: '¡Te esperamos en el sillón!',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/barber-1.jpg', alt: 'The Shop' },
          { src: '/barber-2.jpg', alt: 'Precision Work' },
        ],
      },
      products: {
        variant: 'glass',
        items: [
          {
            name: 'Pomade Iron & Oak',
            image: '/1029.png',
            description: 'Fijación media, brillo discreto.',
            price: '18€',
          },
        ],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'No es solo cortarse el pelo, es el ambiente y la maestría.',
            author: 'Carlos G.',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Entrada', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Menú Ritual', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Tarifas', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'faq', type: 'faq', label: 'FAQ', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'retro',
      componentVariants: {
        hero: 'retro',
        navbar: 'retro',
        footer: 'retro'
      },
    });

    // Continue adding more templates...
    // Template 10: Boutique (High Fashion)
    this.templates.push({
      id: 'boutique',
      name: 'MANIFIESTO | High Fashion',
      description: 'Curaduría de moda independiente y piezas de autor para una identidad única.',
      icon: '👗',
      category: 'Moda',
      header: {
        variant: 'glass',
        title: 'MANIFIESTO STUDIO',
        subtitle: 'Viste tu verdad',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Colección Otoño', href: '/home#productos', active: true },
          { label: 'Lookbook', href: '/home#galeria' },
          { label: 'Sostenibilidad', href: '/home#faq' },
          { label: 'Showroom', href: '/contact' },
        ],
        customStyles: { '--header-text': '#111827' },
      },
      footer: {
        variant: 'glass',
        title: 'MANIFIESTO RETAIL',
        description: 'Comprometidos con el slow-fashion y la producción ética en talleres locales.',
        exploreLinks: [
          { label: 'Vestidos de Autor', href: '#productos', icon: '👗' },
          { label: 'Accesorios Hand-made', href: '#productos', icon: '👜' },
          { label: 'Gift Card', href: '#promociones', icon: '🎁' },
        ],
        trendLinks: [
          { label: 'Journal', href: '#', icon: '📖' },
          { label: 'Newsletter', href: '#', icon: '📩' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
        ],
        copyrightText: '© 2025 MANIFIESTO STUDIO. Conscious Luxury.',
        showParticles: false,
        dark: false,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'MANIFIESTO',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Shop', href: '/home#productos', icon: '🛒' },
          { label: 'Novedades', href: '/home#promociones', icon: '✨' },
          { label: 'Portfolio', href: '/home#galeria', icon: '🖼️' },
          { label: 'Contacto', href: '/contact', icon: '✉️' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'ARQUITECTURA PARA EL CUERPO',
        subtitle: 'Diseños que desafían las tendencias efímeras. Descubre piezas creadas para perdurar en tu armario y en tu historia.',
        showCta: true,
        ctaLabel: 'EXPLORAR LOOKBOOK',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/boutique-hero-fashion.jpg',
        navigationCards: [
          {
            icon: '🧥',
            title: 'EDICIÓN LIMITADA',
            description: 'Solo 50 unidades',
            sectionId: 'productos',
          },
          {
            icon: '🌿',
            title: 'ECO-SILK',
            description: 'Seda orgánica',
            sectionId: 'productos',
          },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'elegant',
        speed: 0.5,
        blur: 40,
        opacity: 0.4,
      },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(255,255,255,0.8)',
        textColor: '#111827',
        accentColor: '#db2777',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-border': '1px solid rgba(0,0,0,0.05)',
        },
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'CURADURIA TEMPORAL',
        animation: 'slide',
        align: 'center',
        customStyles: {
          '--title-color': '#111827',
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
            title: '¿De dónde vienen sus tejidos?',
            content: 'Trabajamos directamente con cooperativas textiles en Italia y España que garantizan salarios justos y trazabilidad total.',
            expanded: false,
          },
          {
            title: '¿Hacen arreglos a medida?',
            content: 'Sí, disponemos de un servicio de sastrería en tienda para asegurar que cada pieza te siente como una segunda piel.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Línea de Diseño' },
          { key: 'description', label: 'Material' },
          { key: 'price', label: 'Inversión' },
        ],
        rows: [
          { service: 'Básicos de Lujo', description: 'Algodón Pima', price: '45€' },
          { service: 'Sastrería Aura', description: 'Lana Virgen', price: '120€' },
          { service: 'Atelier Pieza Única', description: 'Seda & Bordado', price: '250€' },
        ],
      },
      promotions: {
        variant: 'glass',
        premiumCards: [
          {
            title: 'PRIVATE SALE',
            description: 'Solo para miembros de la comunidad. 20% en toda la colección de invierno.',
            image: '/images.png',
            price: '-20%',
            discount: 'EXCLUSIVO',
            icon: 'heroStar',
            tooltip: 'Introduce tu código en el checkout.',
          },
        ],
      },
      gallery: {
        variant: 'glass',
        images: [
          { src: '/fashion-1.jpg', alt: 'Minimalist look' },
          { src: '/fashion-2.jpg', alt: 'Details' },
        ],
      },
      products: {
        variant: 'glass',
        items: [
          {
            name: 'Blazer Oversize Gris',
            image: '/1029.png',
            description: 'Lana prensada con forro de seda.',
            price: '189€',
          },
          {
            name: 'Vestido Minimal Lino',
            image: '/1090.png',
            description: 'Estructura asimétrica, color crudo.',
            price: '115€',
          },
        ],
      },
      testimonials: {
        variant: 'glass',
        items: [
          {
            quote: 'Piezas que cuentan historias. Calidad táctil excepcional.',
            author: 'Valeria R. (Estilista)',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Inicio', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'productos', type: 'products', label: 'Store', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Tarifario', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'galeria', type: 'gallery', label: 'Visuals', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass'
      },
    });

    // Template 11: Inmobiliaria (Prestige Estates)
    this.templates.push({
      id: 'real-estate',
      name: 'Prestige Estates | Luxury Living',
      description: 'Expertos en la comercialización de activos inmobiliarios de alto valor y proyectos de inversión.',
      icon: '🏛️',
      category: 'Servicios',
      header: {
        variant: 'luxury',
        title: 'PRESTIGE REAL ESTATE',
        subtitle: 'Donde vive la exclusividad',
        align: 'left',
        dark: true,
        visible: true,
        navItems: [
          { label: 'Villas', href: '/home#productos', active: true },
          { label: 'Investment', href: '/home#servicios' },
          { label: 'Nosotros', href: '/home#faq' },
          { label: 'Agendar Visita', href: '/contact' },
        ],
        customStyles: { '--header-bg': '#0f172a' },
      },
      footer: {
        variant: 'luxury',
        title: 'PRESTIGE GLOBAL',
        description: 'Consultoría inmobiliaria 360 con presencia en las principales capitales europeas.',
        exploreLinks: [
          { label: 'Off-Market Properties', href: '#productos', icon: '🔒' },
          { label: 'Penthouse Collection', href: '#productos', icon: '🏙️' },
          { label: 'Estate Management', href: '#servicios', icon: '🔑' },
        ],
        trendLinks: [
          { label: 'Inversores', href: '#', icon: '📈' },
          { label: 'Legal Advisor', href: '#', icon: '⚖️' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
        ],
        copyrightText: '© 2025 PRESTIGE ESTATES. High-End Assets.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'luxury',
        logoText: 'PRESTIGE',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Portfolio', href: '/home#productos', icon: '🏘️' },
          { label: 'Inversión', href: '/home#servicios', icon: '💹' },
          { label: 'Blog', href: '#', icon: '📝' },
          { label: 'Contacto', href: '/contact', icon: '📞' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'luxury',
        title: 'CONECTAMOS VIDAS CON LUGARES ÚNICOS',
        subtitle: 'Acceso exclusivo a las propiedades más deseadas del mercado Off-Market. Discreción, rigor y excelencia en cada transacción.',
        showCta: true,
        ctaLabel: 'VER DOSSIER PRIVADO',
        showScrollIcon: true,
        videoBackground: true,
        videoUrl: '/luxury-villa-tour.mp4',
        videoPoster: '/estate-hero-skyline.jpg',
        navigationCards: [],
        carouselItems: [],
        customStyles: {},
      },
      bubble: {
        variant: 'luxury',
        speed: 0.4,
        blur: 50,
        opacity: 0.3,
      },
      card: {
        variant: 'luxury',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        accentColor: '#b45309',
        animation: 'fade',
        isMobile: false,
        customStyles: {
          '--card-shadow': '0 20px 40px rgba(0,0,0,0.05)',
        },
      },
      title: {
        variant: 'luxury',
        level: 'h2',
        text: 'PROPIEDADES ICONO',
        animation: 'slide',
        align: 'left',
        customStyles: {
          '--title-color': '#0f172a',
        },
      },
      serviceCards: {
        variant: 'luxury',
        items: [
          {
            routeName: 'Personal Shopper Inmobiliario',
            imageUrl: '/1029.png',
            difficulty: 'Servicio VIP',
            rating: 5,
            reviews: 120,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Buscamos, negociamos y gestionamos la compra de tu propiedad ideal sin que tengas que preocuparte de nada.',
            features: ['Filtro Off-Market', 'Auditoría Legal', 'Project Management'],
            link: '#contacto',
          },
        ],
      },
      faq: {
        variant: 'luxury',
        items: [
          {
            title: '¿Qué es el mercado Off-Market?',
            content: 'Son propiedades de alto standing que no se publican en portales convencionales para mantener la privacidad de sus dueños.',
            expanded: false,
          },
        ],
      },
      pricing: {
        variant: 'luxury',
        columns: [],
        rows: [],
      },
      promotions: {
        variant: 'luxury',
        premiumCards: [],
      },
      gallery: {
        variant: 'luxury',
        images: [
          { src: '/interior-1.jpg', alt: 'Living area' },
          { src: '/interior-2.jpg', alt: 'Pool side' },
        ],
      },
      products: {
        variant: 'luxury',
        items: [
          {
            name: 'Villa Blue Horizon',
            image: '/1029.png',
            description: '600m2 sobre el mar, domótica Gira, cine privado.',
            price: 'P.O.A.',
          },
          {
            name: 'The Glass House',
            image: '/1090.png',
            description: 'Diseño arquitectónico premiado en Beverly Hills local.',
            price: '2.400.000€',
          },
        ],
      },
      testimonials: {
        variant: 'luxury',
        items: [
          {
            quote: 'Su red de contactos es simplemente inalcanzable para otras agencias.',
            author: 'Robert K. (Inversor)',
          },
        ],
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Intro', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'productos', type: 'products', label: 'Listing', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Servicios', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'luxury',
      componentVariants: {
        hero: 'luxury',
        navbar: 'luxury',
        footer: 'luxury'
      },
    });

    // Template 12: Taller Especializado (Precision Autoworks)
    this.templates.push({
      id: 'auto-repair',
      name: 'Precision Autoworks | High-End Garage',
      description: 'Ingeniería y mantenimiento experto para vehículos de alto rendimiento y clásicos.',
      icon: '🏎️',
      category: 'Servicios',
      header: {
        variant: 'glass',
        title: 'PRECISION AUTOWORKS',
        subtitle: 'Ingeniería de confianza',
        align: 'center',
        dark: true,
        visible: true,
        navItems: [
          { label: 'Diagnostico', href: '/home#servicios' },
          { label: 'Cita Taller', href: '/home#reservas' },
          { label: 'Garantía', href: '/home#faq' },
          { label: 'Urgencias', href: '/contact' },
        ],
        customStyles: {},
      },
      footer: {
        variant: 'glass',
        title: 'PRECISION AUTO',
        description: 'Reparaciones con recambios certificados originales y la última tecnología Bosch Diagnos.',
        exploreLinks: [
          { label: 'Motores Turbo', href: '#servicios', icon: '⚙️' },
          { label: 'Electrónica', href: '#servicios', icon: '⚡' },
        ],
        trendLinks: [
          { label: 'Opiniones Real', href: '#', icon: '⭐' },
        ],
        socialIcons: [],
        copyrightText: '© 2025 PRECISION AUTOWORKS. Performance First.',
        showParticles: false,
        dark: true,
        visible: true,
        customStyles: {},
      },
      navBar: {
        variant: 'glass',
        logoText: 'PRECISION',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Servicios', href: '/home#servicios', icon: '🔧' },
          { label: 'Reserva Online', href: '/contact', icon: '📅' },
        ],
        customStyles: {},
      },
      hero: {
        variant: 'glass',
        title: 'MANTÉN TU PASIÓN EN MOVIMIENTO',
        subtitle: 'Diagnóstico computarizado avanzado y mecánica de precisión para conductores exigentes.',
        showCta: true,
        ctaLabel: 'SOLICITAR DIAGNÓSTICO GRATUITO',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/garage-modern-bg.jpg',
        navigationCards: [
          { icon: '🏎️', title: 'RACING PREP', description: 'Setup de pista', sectionId: 'servicios' },
          { icon: '🛠️', title: 'MAINTENANCE', description: 'Punto por punto', sectionId: 'servicios' },
        ],
        carouselItems: [],
        customStyles: {},
      },
      bubble: { variant: 'metal', speed: 0.5, blur: 15, opacity: 0.6 },
      card: {
        variant: 'metal',
        backgroundColor: '#111827',
        textColor: '#f9fafb',
        accentColor: '#ef4444',
        animation: 'fade',
        isMobile: false,
        customStyles: { '--card-border': '1px solid #374151' },
      },
      title: {
        variant: 'metal',
        level: 'h2',
        text: 'UNIDAD DE INGENIERÍA',
        animation: 'none',
        align: 'center',
        customStyles: { '--title-color': '#ef4444' },
      },
      serviceCards: {
        variant: 'metal',
        items: [
          {
            routeName: 'Reprogramación ECU',
            imageUrl: '/1090.png',
            difficulty: 'Electrónica',
            rating: 5.0,
            reviews: 80,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Optimizamos el rendimiento de tu motor para mayor potencia y menor consumo.',
            features: ['Stage 1 & 2', 'Dyno Test', 'Garantía 2 años'],
            link: '#reservas'
          },
        ]
      },
      faq: {
        variant: 'metal',
        items: [
          { title: '¿Tienen coche de sustitución?', content: 'Disponemos de una flota de cortesía para reparaciones de más de 48 horas bajo reserva previa.', expanded: false },
        ]
      },
      pricing: {
        variant: 'metal',
        columns: [{ key: 'service', label: 'Especialidad' }, { key: 'price', label: 'Precio Base' }],
        rows: [
          { service: 'Cambio Aceite Castrol Edge', price: '85€' },
          { service: 'Carga Aire Bi-zona', price: '65€' },
        ]
      },
      promotions: { variant: 'metal', premiumCards: [] },
      gallery: { variant: 'metal', images: [] },
      products: { variant: 'metal', items: [] },
      testimonials: { variant: 'metal', items: [] },
      sections: [
        { id: 'hero', type: 'hero', label: 'Hero', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Boxes', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'precios', type: 'pricing', label: 'Budget', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'metal',
      componentVariants: {
        hero: 'glass',
        navbar: 'metal',
        footer: 'metal'
      },
    });

    // Template 13: Peluquería Canina (Paws & Bubbles)
    this.templates.push({
      id: 'pet-grooming',
      name: 'Paws & Bubbles | Pet Spa',
      description: 'Cuidado estético holístico y relajación total para tu mejor amigo.',
      icon: '🐶',
      category: 'Servicios',
      header: {
        variant: 'pixel',
        title: 'PAWS & BUBBLES SPA',
        subtitle: 'Mimos que dejan huella',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [],
        customStyles: {}
      },
      footer: {
        variant: 'pixel',
        title: 'HAPPY PAWS',
        description: 'Especialistas en perros con miedo o ansiedad. Paciencia y amor infinitos.',
        exploreLinks: [],
        trendLinks: [],
        socialIcons: [],
        copyrightText: '© 2025 PAWS & BUBBLES. Furry Friends Only.',
        showParticles: true,
        dark: false,
        visible: true,
        customStyles: {}
      },
      navBar: {
        variant: 'pixel',
        logoText: 'PAWS',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Servicios de Spa', href: '/home#servicios', icon: '🛁' },
          { label: 'Reservar Cita', href: '/contact', icon: '📅' },
        ],
        customStyles: {}
      },
      hero: {
        variant: 'mario',
        title: 'EL DÍA MÁS FELIZ PARA TU PERRO',
        subtitle: 'Champús orgánicos, aceites esenciales y un corte que lo hará sentirse como un cachorro de nuevo.',
        showCta: true,
        ctaLabel: 'SOLICITAR CITA SPA',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/dog-spa-happy.jpg',
        navigationCards: [],
        carouselItems: [],
        customStyles: {}
      },
      bubble: { variant: 'mario', speed: 1.0, blur: 8, opacity: 0.7 },
      card: {
        variant: 'mario',
        backgroundColor: '#ffffff',
        textColor: '#4b5563',
        accentColor: '#f43f5e',
        animation: 'bounce',
        isMobile: false,
        customStyles: { '--card-radius': '30px' }
      },
      title: {
        variant: 'pixel',
        level: 'h2',
        text: 'MENÚ DE MIMOS',
        animation: 'bounce',
        align: 'center',
        customStyles: { '--title-color': '#f43f5e' }
      },
      serviceCards: {
        variant: 'mario',
        items: [
          {
            routeName: 'Ritual de Lavado Zen',
            imageUrl: '/1029.png',
            difficulty: '1 a 2 horas',
            rating: 5,
            reviews: 340,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Agua ozonizada, champú de avena y masaje relajante para un pelaje brillante y piel sana.',
            features: ['Secado suave', 'Perfilado higiénico', 'Perfume natural'],
            link: '#contact'
          }
        ]
      },
      faq: { variant: 'pixel', items: [] },
      pricing: { variant: 'pixel', columns: [], rows: [] },
      promotions: { variant: 'pixel', premiumCards: [] },
      gallery: { variant: 'pixel', images: [] },
      products: { variant: 'pixel', items: [] },
      testimonials: { variant: 'pixel', items: [] },
      sections: [
        { id: 'hero', type: 'hero', label: 'Bienvenida', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Atención', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'animal-crossing',
      componentVariants: {
        hero: 'mario',
        navbar: 'pixel',
        footer: 'pixel'
      },
    });

    // Template 14: Electrónica (Nexus Tech)
    this.templates.push({
      id: 'electronics-shop',
      name: 'Nexus Tech | Next-Gen Store',
      description: 'Tu hub de tecnología avanzada y componentes de computación extrema.',
      icon: '⚡',
      category: 'Retail',
      header: {
        variant: 'cyberpunk',
        title: 'NEXUS TECH HUB',
        subtitle: 'Hardware for the Bold',
        align: 'left',
        dark: true,
        visible: true,
        navItems: [
          { label: 'PC Master Race', href: '/home#productos' },
          { label: 'Workstations', href: '/home#productos' },
          { label: 'Soporte', href: '/contact' },
        ],
        customStyles: {}
      },
      footer: {
        variant: 'cyberpunk',
        title: 'NEXUS TERMINAL',
        description: 'Punto de control para entusiastas del hardware y la innovación digital.',
        exploreLinks: [],
        trendLinks: [],
        socialIcons: [],
        copyrightText: '© 2025 NEXUS TECH. Connectivity guaranteed.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {}
      },
      navBar: {
        variant: 'cyberpunk',
        logoText: 'NEXUS',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Inventario', href: '/home#productos', icon: '💽' },
          { label: 'Contacto', href: '/contact', icon: '📧' },
        ],
        customStyles: {}
      },
      hero: {
        variant: 'cyberpunk',
        title: 'DOMINA EL ENTORNO DIGITAL',
        subtitle: 'Componentes de grado militar y estaciones de trabajo configuradas por expertos para creadores de contenido y gamers de élite.',
        showCta: true,
        ctaLabel: 'INICIAR CONFIGURACIÓN',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/nexus-tech-dark-bg.jpg',
        navigationCards: [],
        carouselItems: [],
        customStyles: {}
      },
      bubble: { variant: 'matrix', speed: 1.5, blur: 5, opacity: 0.6 },
      card: {
        variant: 'cyberpunk',
        backgroundColor: '#050505',
        textColor: '#00ff41',
        accentColor: '#00ff41',
        animation: 'glitch',
        isMobile: false,
        customStyles: { '--card-border': '1px solid #00ff41' }
      },
      title: {
        variant: 'cyberpunk',
        level: 'h2',
        text: 'TERMINALES DISPONIBLES',
        animation: 'glitch',
        align: 'center',
        customStyles: {}
      },
      serviceCards: { variant: 'cyberpunk', items: [] },
      faq: { variant: 'cyberpunk', items: [] },
      pricing: { variant: 'cyberpunk', columns: [], rows: [] },
      promotions: { variant: 'cyberpunk', premiumCards: [] },
      gallery: { variant: 'cyberpunk', images: [] },
      products: {
        variant: 'cyberpunk',
        items: [
          {
            name: 'Nebula Workstation V',
            image: '/1090.png',
            description: 'Infinite cores for deep learning and 4K editing.',
            price: '3499€'
          },
        ]
      },
      testimonials: { variant: 'cyberpunk', items: [] },
      sections: [
        { id: 'hero', type: 'hero', label: 'Terminal', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'productos', type: 'products', label: 'Sectors', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'cyberpunk',
      componentVariants: {
        hero: 'cyberpunk',
        navbar: 'cyberpunk',
        footer: 'cyberpunk'
      },
    });

    // Template 15: Makeup Artist (Vogue Beauty)
    this.templates.push({
      id: 'makeup-artist',
      name: 'VOGUE | Makeup & Glow',
      description: 'Diseño de imagen para novias de alta costura y campañas editoriales de moda.',
      icon: '💅',
      category: 'Belleza',
      header: {
        variant: 'elegant',
        title: 'VOGUE BEAUTY STUDIO',
        subtitle: 'Luz y sofisticación',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [],
        customStyles: {}
      },
      footer: {
        variant: 'elegant',
        title: 'VOGUE BY ANNA',
        description: 'Utilizando lo último en micro-pigmentación y técnicas de iluminación de pasarela.',
        exploreLinks: [],
        trendLinks: [],
        socialIcons: [],
        copyrightText: '© 2025 VOGUE BEAUTY. Glowing from inside.',
        showParticles: true,
        dark: false,
        visible: true,
        customStyles: {}
      },
      navBar: {
        variant: 'elegant',
        logoText: 'VOGUE',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Bridal Art', href: '/home#galeria', icon: '👰' },
          { label: 'Servicios', href: '/home#servicios', icon: '💄' },
          { label: 'Cita VIP', href: '/contact', icon: '✉️' },
        ],
        customStyles: {}
      },
      hero: {
        variant: 'elegant',
        title: 'TRANSFORMA TU LUZ EN ARTE',
        subtitle: 'Especialista en acabados HD para fotografía y novias que buscan una elegancia atemporal y radiante.',
        showCta: true,
        ctaLabel: 'SOLICITAR DISPONIBILIDAD',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/makeup-fashion-bg.jpg',
        navigationCards: [],
        carouselItems: [],
        customStyles: {}
      },
      bubble: { variant: 'elegant', speed: 0.3, blur: 25, opacity: 0.4 },
      card: {
        variant: 'glass',
        backgroundColor: '#fffcfc',
        textColor: '#be185d',
        accentColor: '#db2777',
        animation: 'fade',
        isMobile: false,
        customStyles: { '--card-radius': '0px' }
      },
      title: {
        variant: 'elegant',
        level: 'h2',
        text: 'COLECCIÓN DE SERVICIOS',
        animation: 'slide',
        align: 'center',
        customStyles: { '--title-color': '#be185d' }
      },
      serviceCards: {
        variant: 'elegant',
        items: [
          {
            routeName: 'Bridal Deluxe Experience',
            imageUrl: '/1029.png',
            difficulty: 'Trial Included',
            rating: 5,
            reviews: 140,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Paquete completo para novias que incluye prueba de diseño, preparación de piel y maquillaje el día del enlace.',
            features: ['Skin Kit Regalo', 'Pestañas Mink', 'Sellado HD'],
            link: '#contact'
          }
        ]
      },
      faq: { variant: 'elegant', items: [] },
      pricing: {
        variant: 'glass',
        columns: [
          { key: 'service', label: 'Inversión Artística' },
          { key: 'price', label: 'Desde' }
        ],
        rows: [
          { service: 'Evento Social', price: '85€' },
          { service: 'Editorial / Media', price: '150€' },
          { service: 'Novia Signature', price: '350€' }
        ]
      },
      promotions: { variant: 'elegant', premiumCards: [] },
      gallery: {
        variant: 'elegant',
        images: [
          { src: '/makeup-1.jpg', alt: 'Editorial look' },
          { src: '/makeup-2.jpg', alt: 'Bridal glow' }
        ]
      },
      products: { variant: 'elegant', items: [] },
      testimonials: {
        variant: 'glass',
        items: [
          { quote: 'Nadie entiende la luz como Anna. Mi maquillaje duró perfecto 18 horas.', author: 'Marina J.' }
        ]
      },
      sections: [
        { id: 'hero', type: 'hero', label: 'Bienvenida', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Ateliers', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'galeria', type: 'gallery', label: 'Editorial', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'rose-radial',
      componentVariants: {
        hero: 'elegant',
        navbar: 'elegant',
        footer: 'elegant'
      },
    });

    // Template 16: Proto Studio (Digital Agency)
    this.templates.push({
      id: 'anto-studios',
      name: 'PROTO STUDIO | Product Design',
      description: 'Construimos el futuro digital de marcas valientes a través del código y el diseño disruptivo.',
      icon: '👾',
      category: 'Creativo',
      header: {
        variant: 'minimal',
        title: 'PROTO® STUDIO',
        subtitle: 'Engineering Aesthetics',
        align: 'left',
        dark: true,
        visible: true,
        navItems: [
          { label: 'Work', href: '/home#galeria' },
          { label: 'Stack', href: '#' },
          { label: 'Estimate', href: '/contact' },
        ],
        customStyles: {}
      },
      footer: {
        variant: 'minimal',
        title: 'PROTO SYSTEMS',
        description: 'Boutique tecnológica especializada en Next.js, WebGL y marcas narrativas.',
        exploreLinks: [
          { label: 'E-Commerce Pro', href: '#', icon: '⚡' },
          { label: 'SAAS Design', href: '#', icon: '💎' },
        ],
        trendLinks: [
          { label: 'Jobs', href: '#', icon: '✉️' },
        ],
        socialIcons: [
          { name: 'instagram', href: '#' },
        ],
        copyrightText: '© 2025 PROTO STUDIO. No limits.',
        showParticles: false,
        dark: true,
        visible: true,
        customStyles: {}
      },
      navBar: {
        variant: 'minimal',
        logoText: 'PROTO.',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Proyectos', href: '/home#galeria', icon: '📂' },
          { label: 'Hablar', href: '/contact', icon: '✉️' },
        ],
        customStyles: {}
      },
      hero: {
        variant: 'minimal',
        title: 'MOVING PIXELS WITH PURPOSE',
        subtitle: 'Diseño estratégico para empresas que no se conforman con lo ordinario.',
        showCta: true,
        ctaLabel: 'EMPEZAR PROYECTO',
        showScrollIcon: true,
        videoBackground: true,
        videoUrl: '/abstract-waves.mp4',
        videoPoster: '/proto-dark-bg.jpg',
        navigationCards: [],
        carouselItems: [],
        customStyles: {}
      },
      bubble: { variant: 'minimal', speed: 0.4, blur: 0, opacity: 0.05 },
      card: {
        variant: 'minimal',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        animation: 'fade',
        isMobile: false,
        customStyles: { 'border': '1px solid #222' }
      },
      title: {
        variant: 'minimal',
        level: 'h2',
        text: 'SELECTED WORKS',
        animation: 'fade',
        align: 'left',
        customStyles: {}
      },
      serviceCards: { variant: 'minimal', items: [] },
      faq: { variant: 'minimal', items: [] },
      pricing: { variant: 'minimal', columns: [], rows: [] },
      promotions: { variant: 'minimal', premiumCards: [] },
      gallery: {
        variant: 'minimal',
        images: [
          { src: '/work-1.jpg', alt: 'Fintech App' },
          { src: '/work-2.jpg', alt: 'Nike Concept' }
        ]
      },
      products: { variant: 'minimal', items: [] },
      testimonials: { variant: 'minimal', items: [] },
      sections: [
        { id: 'hero', type: 'hero', label: 'Intro', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'galeria', type: 'gallery', label: 'Archivos', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'minimal',
      componentVariants: {
        hero: 'minimal',
        navbar: 'minimal',
        footer: 'minimal'
      },
    });

    // Template 17: Urban Edge (Clothing Store)
    this.templates.push({
      id: 'clothing-store',
      name: 'URBAN EDGE | Concept Store',
      description: 'Streetwear de alto octanaje para la selva de asfalto.',
      icon: '🕶️',
      category: 'Moda',
      header: {
        variant: 'glass',
        title: 'URBAN EDGE',
        subtitle: 'Fearless Gear',
        align: 'center',
        dark: true,
        visible: true,
        navItems: [
          { label: 'Drops', href: '/home#productos' },
          { label: 'Comunidad', href: '#' },
        ],
        customStyles: {}
      },
      footer: {
        variant: 'glass',
        title: 'URBAN EDGE CO.',
        description: 'No seguimos reglas, creamos uniformes para los que las rompen.',
        exploreLinks: [],
        trendLinks: [],
        socialIcons: [],
        copyrightText: '© 2025 URBAN EDGE. Stay Bold.',
        showParticles: true,
        dark: true,
        visible: true,
        customStyles: {}
      },
      navBar: {
        variant: 'glass',
        logoText: 'URBAN_EDG',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Hoodies', href: '/home#productos', icon: '👕' },
          { label: 'Techwear', href: '/home#productos', icon: '🎒' },
        ],
        customStyles: {}
      },
      hero: {
        variant: 'glass',
        title: 'RESISTENCIA URBANA',
        subtitle: 'Materiales técnicos y cortes agresivos. New Drop 001: Cyber Punk.',
        showCta: true,
        ctaLabel: 'VER DROP ACTUAL',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/urban-hero-bg.jpg',
        navigationCards: [],
        carouselItems: [],
        customStyles: {}
      },
      bubble: { variant: 'oceanic', speed: 1.2, blur: 20, opacity: 0.4 },
      card: {
        variant: 'glass',
        backgroundColor: 'rgba(0,0,0,0.9)',
        textColor: '#fff',
        accentColor: '#facc15',
        animation: 'slide',
        isMobile: false,
        customStyles: {}
      },
      title: {
        variant: 'glass',
        level: 'h2',
        text: 'NUEVO ARSENAL',
        animation: 'slide',
        align: 'center',
        customStyles: { '--title-color': '#facc15' }
      },
      serviceCards: { variant: 'glass', items: [] },
      faq: { variant: 'glass', items: [] },
      pricing: { variant: 'glass', columns: [], rows: [] },
      promotions: { variant: 'glass', premiumCards: [] },
      gallery: { variant: 'glass', images: [] },
      products: {
        variant: 'glass',
        items: [
          {
            name: 'Cargo Matrix Pants',
            image: '/1029.png',
            description: '12 bolsillos, tejido impermeable.',
            price: '115€'
          },
          {
            name: 'Cyber-Neon Hoodie',
            image: '/1090.png',
            description: 'Bordado reflectante 3M.',
            price: '89€'
          }
        ]
      },
      testimonials: { variant: 'glass', items: [] },
      sections: [
        { id: 'hero', type: 'hero', label: 'Gate', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'productos', type: 'products', label: 'Drop', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'glass',
        navbar: 'glass',
        footer: 'glass'
      },
    });

    // Template 18: Skyrise Academy (Executive Learning)
    this.templates.push({
      id: 'training-institute',
      name: 'Skyrise Academy | Leaders',
      description: 'Programas de alto impacto para C-Level y equipos de alto rendimiento.',
      icon: '📈',
      category: 'Educación',
      header: {
        variant: 'corporate',
        title: 'SKYRISE ACADEMY',
        subtitle: 'The Executive Path',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [
          { label: 'Executive Programs', href: '/home#servicios' },
          { label: 'Corporate Training', href: '/home#servicios' },
        ],
        customStyles: {}
      },
      footer: {
        variant: 'corporate',
        title: 'SKYRISE GLOBAL',
        description: 'Certificaciones internacionales para la nueva economía digital.',
        exploreLinks: [],
        trendLinks: [],
        socialIcons: [],
        copyrightText: '© 2025 SKYRISE ACADEMY. Reach Higher.',
        showParticles: false,
        dark: true,
        visible: true,
        customStyles: {}
      },
      navBar: {
        variant: 'corporate',
        logoText: 'SKYRISE',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Certificaciones', href: '/home#servicios', icon: '📜' },
          { label: 'Empresas', href: '/contact', icon: '🏢' },
        ],
        customStyles: {}
      },
      hero: {
        variant: 'corporate',
        title: 'LIDERA LA TRANSFORMACIÓN',
        subtitle: 'Formación de élite diseñada por CEOs para CEOs. Domina la estrategia competitiva y la IA en la gestión.',
        showCta: true,
        ctaLabel: 'VER CALENDARIO EXECUTIVE',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/corporate-hero-glass.jpg',
        navigationCards: [],
        carouselItems: [],
        customStyles: {}
      },
      bubble: { variant: 'corporate', speed: 0.3, blur: 10, opacity: 0.2 },
      card: {
        variant: 'corporate',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#1d4ed8',
        animation: 'fade',
        isMobile: false,
        customStyles: { 'border-left': '4px solid #1d4ed8' }
      },
      title: {
        variant: 'corporate',
        level: 'h2',
        text: 'PATHWAYS TO MASTERY',
        animation: 'fade',
        align: 'center',
        customStyles: { '--title-color': '#111827' }
      },
      serviceCards: {
        variant: 'corporate',
        items: [
          {
            routeName: 'MBA Executive Accelerate',
            imageUrl: '/1029.png',
            difficulty: '9 Meses',
            rating: 5,
            reviews: 320,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Intensivo presencial enfocado en toma de decisiones bajo presión y red de contactos VIP.',
            features: ['Mentorship 1:1', 'Fin de semana en Davos', 'Alumni Network'],
            link: '#contact'
          }
        ]
      },
      faq: { variant: 'corporate', items: [] },
      pricing: { variant: 'corporate', columns: [], rows: [] },
      promotions: { variant: 'corporate', premiumCards: [] },
      gallery: { variant: 'corporate', images: [] },
      products: { variant: 'corporate', items: [] },
      testimonials: { variant: 'corporate', items: [] },
      sections: [
        { id: 'hero', type: 'hero', label: 'Portada', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Programas', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'corporate',
      componentVariants: {
        hero: 'corporate',
        navbar: 'corporate',
        footer: 'corporate'
      },
    });

    // Template 19: Genius Hub (Elite Tutoring)
    this.templates.push({
      id: 'tutoring-center',
      name: 'Genius Hub | Private Tutoring',
      description: 'Entrenamiento académico de alto nivel para estudiantes con grandes aspiraciones.',
      icon: '🧠',
      category: 'Educación',
      header: {
        variant: 'pixel',
        title: 'GENIUS HUB',
        subtitle: 'Aprender es un superpoder',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [],
        customStyles: {}
      },
      footer: {
        variant: 'pixel',
        title: 'GENIUS ACADEMY',
        description: 'Especialistas en olimpiadas matemáticas y preparación Ivy League.',
        exploreLinks: [],
        trendLinks: [],
        socialIcons: [],
        copyrightText: '© 2025 GENIUS HUB. Unlock Brain Power.',
        showParticles: true,
        dark: false,
        visible: true,
        customStyles: {}
      },
      navBar: {
        variant: 'pixel',
        logoText: 'GENIUS+',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Materias Prep', href: '/home#servicios', icon: '🧪' },
          { label: 'Agendar Sesión', href: '/contact', icon: '📅' },
        ],
        customStyles: {}
      },
      hero: {
        variant: 'mario',
        title: 'CONVIÉRTETE EN TU MEJOR VERSIÓN',
        subtitle: 'Tutorías personalizadas que no solo enseñan, sino que motivan y estructuran el pensamiento crítico.',
        showCta: true,
        ctaLabel: 'INICIAR TEST DE NIVEL',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/genius-study-bg.jpg',
        navigationCards: [],
        carouselItems: [],
        customStyles: {}
      },
      bubble: { variant: 'mario', speed: 1.0, blur: 4, opacity: 0.8 },
      card: {
        variant: 'pixel',
        backgroundColor: '#ffffff',
        textColor: '#166534',
        accentColor: '#16a34a',
        animation: 'bounce',
        isMobile: false,
        customStyles: { '--card-border': '4px solid #16a34a' }
      },
      title: {
        variant: 'pixel',
        level: 'h2',
        text: 'ÁREAS DE EXCELENCIA',
        animation: 'bounce',
        align: 'center',
        customStyles: { '--title-color': '#16a34a' }
      },
      serviceCards: {
        variant: 'mario',
        items: [
          {
            routeName: 'STEM Master Class',
            imageUrl: '/1090.png',
            difficulty: 'Avanzado',
            rating: 5,
            reviews: 180,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Física, Cálculo y Programación con mentores de universidades TOP.',
            features: ['Resolución de problemas real', 'Acceso a Labs', 'Simulacros examen'],
            link: '#contact'
          }
        ]
      },
      faq: { variant: 'pixel', items: [] },
      pricing: { variant: 'pixel', columns: [], rows: [] },
      promotions: { variant: 'pixel', premiumCards: [] },
      gallery: { variant: 'pixel', images: [] },
      products: { variant: 'pixel', items: [] },
      testimonials: { variant: 'pixel', items: [] },
      sections: [
        { id: 'hero', type: 'hero', label: 'Home', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Especialidades', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'animal-crossing',
      componentVariants: {
        hero: 'mario',
        navbar: 'pixel',
        footer: 'pixel'
      },
    });

    // Template 20: Nirvana Wellness (Holistic Sanctuary)
    this.templates.push({
      id: 'wellness-center',
      name: 'NIRVANA | holistic Sanctuary',
      description: 'Un viaje hacia el interior para equilibrar alma, cuerpo y espíritu.',
      icon: '🧘',
      category: 'Bienestar',
      header: {
        variant: 'oceanic',
        title: 'NIRVANA WELLNESS',
        subtitle: 'El silencio habla',
        align: 'center',
        dark: false,
        visible: true,
        navItems: [],
        customStyles: {}
      },
      footer: {
        variant: 'oceanic',
        title: 'NIRVANA LIFE',
        description: 'Santuario urbano dedicado a la sanación profunda y el mindfulness.',
        exploreLinks: [],
        trendLinks: [],
        socialIcons: [],
        copyrightText: '© 2025 NIRVANA. Peace is within.',
        showParticles: true,
        dark: false,
        visible: true,
        customStyles: {}
      },
      navBar: {
        variant: 'oceanic',
        logoText: 'NIRVANA',
        showMobileMenu: true,
        isFixed: true,
        visible: true,
        navLinks: [
          { label: 'Rituales', href: '/home#servicios', icon: '🕯️' },
          { label: 'Reservar Calma', href: '/contact', icon: '✉️' },
        ],
        customStyles: {}
      },
      hero: {
        variant: 'oceanic',
        title: 'RECUPERA TU EQUILIBRIO VITAL',
        subtitle: 'Terapias ancestrales combinadas con neurociencia para reducir el cortisol y elevar tu consciencia.',
        showCta: true,
        ctaLabel: 'EMPEZAR RETIRO URBANO',
        showScrollIcon: true,
        videoBackground: false,
        videoUrl: '',
        videoPoster: '/wellness-hero-zen.jpg',
        navigationCards: [],
        carouselItems: [],
        customStyles: {}
      },
      bubble: { variant: 'oceanic', speed: 0.8, blur: 50, opacity: 0.4 },
      card: {
        variant: 'oceanic',
        backgroundColor: 'rgba(255,255,255,0.9)',
        textColor: '#134e4a',
        accentColor: '#14b8a6',
        animation: 'fade',
        isMobile: false,
        customStyles: { 'border-radius': '60px 0px 60px 0px' }
      },
      title: {
        variant: 'oceanic',
        level: 'h2',
        text: 'NUESTROS RITUALES',
        animation: 'fade',
        align: 'center',
        customStyles: { '--title-color': '#0d9488' }
      },
      serviceCards: {
        variant: 'oceanic',
        items: [
          {
            routeName: 'Sound Healing & Reiki',
            imageUrl: '/1029.png',
            difficulty: '90 min',
            rating: 5,
            reviews: 210,
            duration: 0,
            distance: 0,
            ascent: 0,
            description: 'Vibración de cuencos de cuarzo y transferencia de energía para un reset total del sistema nervioso.',
            features: ['Aromaterapia Pro', 'Infusión Detox', 'Set de Cristales'],
            link: '#contact'
          }
        ]
      },
      faq: { variant: 'oceanic', items: [] },
      pricing: { variant: 'oceanic', columns: [], rows: [] },
      promotions: { variant: 'oceanic', premiumCards: [] },
      gallery: { variant: 'oceanic', images: [] },
      products: { variant: 'oceanic', items: [] },
      testimonials: { variant: 'oceanic', items: [] },
      sections: [
        { id: 'hero', type: 'hero', label: 'Zen', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'servicios', type: 'services', label: 'Rituales', visible: true, name: '', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
      ],
      globalVariant: 'default',
      componentVariants: {
        hero: 'oceanic',
        navbar: 'oceanic',
        footer: 'oceanic'
      },
    });
  }
}



