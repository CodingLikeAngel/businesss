import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { footerVariants, bubbleVariants, cardRutasVariants, titleVariants, NavLink, variants } from '@negocio/ui-components';

// Existing interfaces (NavLink, HeaderConfig, FooterConfig, NavBarConfig, HeroConfig, BubbleConfig, CardConfig, TitleConfig) remain unchanged

export interface Testimonial {
  quote: string;
  author: string;
}

export interface TestimonialsConfig {
  variant: string;
  items: Testimonial[];
}


export interface HeaderConfig {
  variant: string;
  title: string;
  subtitle: string;
  align: 'left' | 'center' | 'right';
  dark: boolean;
  navItems: { label: string; href: string; active?: boolean }[];
  visible: boolean;
  customStyles: { [key: string]: string };
}

export interface FooterConfig {
  variant: string;
  title: string;
  description: string;
  exploreLinks: { label: string; href: string; icon?: string }[];
  trendLinks: { label: string; href: string; icon?: string }[];
  socialIcons: { name: 'twitter' | 'facebook' | 'instagram'; href: string }[];
  copyrightText: string;
  showParticles: boolean;
  dark: boolean;
  visible: boolean;
  customStyles: { [key: string]: string };
}

export interface NavBarConfig {
  variant: string;
  logoText: string;
  showMobileMenu: boolean;
  isFixed: boolean;
  visible: boolean;
  navLinks: NavLink[];
  customStyles: { [key: string]: string };
}

export interface NavigationCard {
  icon: string;
  title: string;
  description: string;
  animationDelay?: string;
  sectionId: string;
  videoUrl?: string;
  posterUrl?: string;
}

export interface CarouselItem {
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  title: string;
  description: string;
  section: string;
}

export interface HeroConfig {
  variant: string;
  title: string;
  subtitle: string;
  showCta: boolean;
  ctaLabel: string;
  showScrollIcon: boolean;
  videoBackground: boolean;
  videoUrl: string;
  videoPoster: string;
  navigationCards: NavigationCard[];
  carouselItems: CarouselItem[];
  customStyles: { [key: string]: string };
}

export interface BubbleConfig {
  variant: string;
  speed?: number;
  blur?: number;
  opacity?: number;
}

export interface CardConfig {
  variant: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  animation: 'pulse' | 'fade' | 'slide' | 'bounce' | 'none';
  isMobile: boolean;
  customStyles: { [key: string]: string };
}

export interface TitleConfig {
  variant: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
  animation: 'none' | 'fade' | 'pulse' | 'bounce' | 'glitch' | 'slide';
  align: 'left' | 'center' | 'right';
  customStyles: { [key: string]: string };
}

// New interfaces for component data
export interface CardItem {
  routeName: string;
  imageUrl: string;
  difficulty: string;
  rating: number;
  reviews: number;
  duration: number;
  distance: number;
  ascent: number;
  description: string;
  features: string[];
  link: string;
}

export interface ServiceCardsConfig {
  variant: string;
  items: CardItem[];
}

export interface AccordionItem {
  title: string;
  content: string;
  expanded: boolean;
}

export interface FaqConfig {
  variant: string;
  items: AccordionItem[];
}

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableRow {
  [key: string]: string;
}

export interface PricingConfig {
  variant: string;
  columns: TableColumn[];
  rows: TableRow[];
}

export interface CardPremiumConfig {
  title: string;
  description: string;
  image: string;
  price: string;
  discount: string;
  icon: 'heroStar';
  tooltip: string;
}

export interface PromotionsConfig {
  variant: string;
  premiumCards: CardPremiumConfig[];
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryConfig {
  variant: string;
  images: GalleryImage[];
}

export interface Product {
  name: string;
  image: string;
  description: string;
  price: string;
}


export interface StatItem {
  icon: string;
  label: string;
  value: string | number;
  description?: string;
}

export interface StatsConfig {
  variant: string;
  items: StatItem[];
}

export interface ProductsConfig {
  variant: string;
  items: Product[];
}

export interface PageSection {
  id: string;
  type: 'hero' | 'services' | 'products' | 'testimonials' | 'pricing' | 'promotions' | 'faq' | 'gallery' | 'contact' | 'bubble' | 'features' | 'stats';
  label: string; // User friendly name
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class VariantService {
  constructor() {
    this.loadFromLocalStorage();
  }
  // Existing BehaviorSubjects
  private headerConfigSubject = new BehaviorSubject<HeaderConfig>({
    variant: 'glass',
    title: 'Solicita tu web profesional',
    subtitle: 'Diseños únicos y personalizados para tu negocio',
    align: 'center',
    dark: false,
    visible: true,
    navItems: [
      { label: 'Home', href: '/home', active: true },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    customStyles: {},
  });

  
  private footerConfigSubject = new BehaviorSubject<FooterConfig>({
    variant: 'glass',
    title: 'Webs Profesionales',
    description: 'Tu negocio merece una web única y optimizada',
    exploreLinks: [
      { label: 'Diseño', href: '#', icon: '🎨' },
      { label: 'SEO', href: '#', icon: '🔍' },
      { label: 'Reservas', href: '#', icon: '📅' },
      { label: 'Tienda', href: '#', icon: '🛒' },
    ],
    trendLinks: [
      { label: 'Ayuda', href: '#', icon: '❓' },
      { label: 'Soporte', href: '#', icon: '🛠️' },
      { label: 'Contacto', href: '#', icon: '✉️' },
    ],
    socialIcons: [
      { name: 'twitter', href: '#' },
      { name: 'facebook', href: '#' },
      { name: 'instagram', href: '#' },
    ],
    copyrightText: '© {{currentYear}} Webs Profesionales - Tu negocio, tu web',
    showParticles: true,
    dark: false,
    visible: true,
    customStyles: {},
  });

  private navBarConfigSubject = new BehaviorSubject<NavBarConfig>({
    variant: 'glass',
    logoText: 'Business Templates',
    showMobileMenu: true,
    isFixed: true,
    visible: true,
    navLinks: [
      { label: 'Inicio', href: '#hero', icon: '🏠' },
      { label: 'Belleza', href: '#belleza', icon: '💄', children: [
        { label: 'Peluquería', href: '/peluqueria' },
        { label: 'Spa', href: '/spa' },
        { label: 'Barbería', href: '/barber-shop' },
        { label: 'Maquillaje', href: '/makeup-artist' }
      ]},
      { label: 'Salud', href: '#salud', icon: '🏥', children: [
        { label: 'Clínica', href: '/clinic' },
        { label: 'Farmacia', href: '/pharmacy' },
        { label: 'Centro Wellness', href: '/wellness-center' }
      ]},
      { label: 'Educación', href: '#educacion', icon: '🎓', children: [
        { label: 'Escuela', href: '/school' },
        { label: 'Centro de Tutoring', href: '/tutoring-center' },
        { label: 'Instituto de Formación', href: '/training-institute' }
      ]},
      { label: 'Retail', href: '#retail', icon: '🛍️', children: [
        { label: 'Tienda de Ropa', href: '/clothing-store' },
        { label: 'Electrónica', href: '/electronics-shop' },
        { label: 'Boutique', href: '/boutique' }
      ]},
      { label: 'Arte', href: '#arte', icon: '🎨', children: [
        { label: 'Tatuajes', href: '/tattoo' }
      ]},
      { label: 'Gastronomía', href: '#gastronomia', icon: '🍽️', children: [
        { label: 'Restaurante', href: '/restaurant' },
        { label: 'Gimnasio', href: '/gym' }
      ]},
      { label: 'Servicios', href: '#servicios', icon: '🛠️' },
      { label: 'Productos', href: '#productos', icon: '🧩' },
      { label: 'Precios', href: '#precios', icon: '💰' },
      { label: 'Contacto', href: '#contacto', icon: '📞' },
    ],
    customStyles: {},
  });

  private heroConfigSubject = new BehaviorSubject<HeroConfig>({
    variant: 'glass',
    title: 'Eleva tu Negocio',
    subtitle: 'Webs a medida, rápidas, seguras y optimizadas para SEO.',
    showCta: true,
    ctaLabel: 'Solicita una Demo',
    showScrollIcon: true,
    videoBackground: true,
    videoUrl: 'https://www.w3schools.com/tags/mov_bbb.mp4',
    videoPoster: 'https://dummyimage.com/200x300/000/fff&text=Hola+León3',
    navigationCards: [
      {
        icon: '🖥️',
        title: 'Diseño Personalizado',
        description: 'Webs únicas, sin plantillas recicladas.',
        sectionId: 'servicios',
        videoUrl: 'https://www.w3schools.com/tags/mov_bbb.mp4',
        posterUrl: 'https://dummyimage.com/200x300/000/fff&text=Hola+León3',
      },
      {
        icon: '🚀',
        title: 'SEO Técnico',
        description: 'Optimización para Google desde el primer día.',
        sectionId: 'precios',
        videoUrl: 'https://www.w3schools.com/tags/mov_bbb.mp4',
        posterUrl: 'https://dummyimage.com/200x300/000/fff&text=Hola+León3',
      },
    ],
    carouselItems: [
      {
        videoUrl: 'https://www.w3schools.com/tags/mov_bbb.mp4',
        posterUrl: 'https://dummyimage.com/200x300/000/fff&text=Hola+León3',
        title: 'Web Básica',
        description: 'Perfecta para empezar con un diseño profesional.',
        section: 'servicios',
      },
      {
        videoUrl: 'https://www.w3schools.com/tags/mov_bbb.mp4',
        posterUrl: 'https://dummyimage.com/200x300/000/fff&text=Hola+León3',
        title: 'Tienda Online',
        description: 'Vende tus productos con un carrito optimizado.',
        section: 'modulos',
      },
    ],
    customStyles: {
      '--business-bg-image': 'url(/1029.png)',
    },
  });

  private bubbleConfigSubject = new BehaviorSubject<BubbleConfig>({
    variant: 'glass',
    speed: 0.8,
    blur: 30,
    opacity: 0.7,
  });

  private cardConfigSubject = new BehaviorSubject<CardConfig>({
    variant: 'glass',
    backgroundColor: 'rgba(255,255,255,0.05)',
    textColor: '#ffffff',
    accentColor: '#6366f1',
    animation: 'fade',
    isMobile: false,
    customStyles: {
      '--card-border': '1px solid rgba(255, 30, 86, 0.3)',
    },
  });

  private titleConfigSubject = new BehaviorSubject<TitleConfig>({
    variant: 'glass',
    level: 'h2',
    text: 'Nuestros Servicios',
    animation: 'slide',
    align: 'center',
    customStyles: {
      '--title-color': '#FACC15',
      '--title-shadow': '0 0 10px rgba(255, 30, 86, 0.5)',
    },
  });

  // New BehaviorSubjects for component data
  private serviceCardsConfigSubject = new BehaviorSubject<ServiceCardsConfig>({
    variant: 'glass',
    items: [
      {
        routeName: 'Web Básica',
        imageUrl: '/retro-stars.png',
        difficulty: 'Duración: 1-2 semanas',
        rating: 4.8,
        reviews: 50,
        duration: 0,
        distance: 0,
        ascent: 0,
        description: 'Diseño personalizado, SEO básico y responsive.',
        features: [
          'Diseño único y responsive',
          'Panel editable por el cliente',
          'SEO técnico básico',
          'Hosting y dominio 1 año',
          '1 cambio puntual al mes',
          'Soporte técnico básico',
          'Diseños especiales para campañas (Black Friday, Navidad, etc.)',
          'Actualizaciones y seguridad incluidas'
        ],
        
        link: '#contacto',
      },
      {
        routeName: 'Tienda Online',
        imageUrl: '/1029.png',
        difficulty: 'Duración: 3-4 semanas',
        rating: 4.9,
        reviews: 30,
        duration: 0,
        distance: 0,
        ascent: 0,
        description: 'Vende productos con carrito y pagos integrados.',
        features: ['Carrito de compras', 'Pagos Stripe', 'Panel de gestión'],
        link: '#contacto',
      },
      {
        routeName: 'Reservas Online',
        imageUrl: '/1090.png',
        difficulty: 'Duración: 2-3 semanas',
        rating: 4.7,
        reviews: 40,
        duration: 0,
        distance: 0,
        ascent: 0,
        description: 'Calendario de citas con notificaciones automáticas.',
        features: ['Calendario', 'Notificaciones', 'Gestión de citas'],
        link: '#contacto',
      },
    ],
  });

  private faqConfigSubject = new BehaviorSubject<FaqConfig>({
    variant: 'glass',
    items: [
      {
        title: '¿Cuánto tiempo tarda en estar lista mi web?',
        content: 'Una web básica tarda 1-2 semanas, una tienda o sistema de reservas 3-4 semanas.',
        expanded: false,
      },
      {
        title: '¿Puedo añadir más funciones después?',
        content: 'Sí, las webs son escalables. Puedes añadir módulos como tienda, reservas o estadísticas cuando quieras.',
        expanded: false,
      },
    ],
  });

  private pricingConfigSubject = new BehaviorSubject<PricingConfig>({
    variant: 'glass',
    columns: [
      { key: 'service', label: 'Servicio' },
      { key: 'description', label: 'Descripción' },
      { key: 'price', label: 'Precio' },
    ],
    rows: [
      { service: 'Web Básica', description: 'Diseño personalizado + SEO', price: '600€' },
      { service: 'Tienda Simple', description: 'Muestra de productos', price: '+150€' },
      { service: 'Reservas Online', description: 'Calendario y notificaciones', price: '+200-300€' },
    ],
  });

  private promotionsConfigSubject = new BehaviorSubject<PromotionsConfig>({
    variant: 'glass',
    premiumCards: [
      {
        title: 'Web + SEO Avanzado',
        description: 'Diseño único con optimización SEO completa.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        price: '800€',
        discount: '-10%',
        icon: 'heroStar',
        tooltip: '¡Mejora tu posicionamiento en Google!',
      },
      {
        title: 'Web + Tienda',
        description: 'Web profesional con carrito de compras.',
        image: 'https://images.unsplash.com/photo-1556742524-750f2ab41513',
        price: '1000€',
        discount: 'Oferta',
        icon: 'heroStar',
        tooltip: 'Empieza a vender online hoy.',
      },
      {
        title: 'Web + Reservas',
        description: 'Web con sistema de citas integrado.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        price: '850€',
        discount: 'Novedad',
        icon: 'heroStar',
        tooltip: 'Automatiza tus reservas.',
      },
    ],
  });

  private galleryConfigSubject = new BehaviorSubject<GalleryConfig>({
    variant: 'glass',
    images: [
      { src: '/1029.png', alt: 'Web 1' },
      { src: '/1090.png', alt: 'Web 2' },
      { src: '/retro-stars.png', alt: 'Web 3' },
    ],
  });

  private productsConfigSubject = new BehaviorSubject<ProductsConfig>({
    variant: 'glass',
    items: [
      {
        name: 'Módulo Reservas',
        image: '/1029.png',
        description: 'Sistema de citas con calendario y notificaciones.',
        price: '200-300€',
      },
      {
        name: 'Módulo Tienda',
        image: '/1029.png',
        description: 'Carrito de compras con pagos integrados.',
        price: '500€',
      },
      {
        name: 'Módulo Estadísticas',
        image: '/1029.png',
        description: 'Panel con datos de visitas y clics.',
        price: '200€',
      },
    ],
  });


  private testimonialsConfigSubject = new BehaviorSubject<TestimonialsConfig>({
    variant: 'glass',
    items: [
      {
        quote: 'Tenía una web en Wix que parecía de juguete. Ahora tengo una web profesional que me trae clientes cada semana.',
        author: '— Carlos, dueño de un centro de estética',
      },
      {
        quote: 'Con WordPress todo eran problemas. Esta web es más rápida, más clara y mucho más bonita.',
        author: '— Lucía, propietaria de casa rural en León',
      },
      {
        quote: '“Es la primera vez que un informático me habla claro y cumple plazos. Profesional de 10.”',
        author: '— Pedro, bar-restaurante familiar',
      },
    ],
  });

  private statsConfigSubject = new BehaviorSubject<StatsConfig>({
    variant: 'glass',
    items: [
      { icon: '🚀', label: 'Velocidad', value: '0.8s', description: 'Tiempo de carga' },
      { icon: '🔒', label: 'Seguridad', value: '99.9%', description: 'Uptime' },
      { icon: '📈', label: 'Conversiones', value: '12%', description: 'Tasa de conversión' },
      { icon: '👥', label: 'Usuarios', value: '5k+', description: 'Visitantes mensuales' }
    ]
  });

  private sectionsSubject = new BehaviorSubject<PageSection[]>([
    { id: 'sec_hero', type: 'hero', label: 'Portada Hero', visible: true },
    { id: 'sec_features', type: 'features', label: 'Características Premium', visible: true },
    { id: 'sec_stats', type: 'stats', label: 'Métricas (Stats)', visible: true },
    { id: 'sec_bubble', type: 'bubble', label: 'Efecto Burbujas', visible: true },
    { id: 'sec_services', type: 'services', label: 'Servicios', visible: true },
    { id: 'sec_products', type: 'products', label: 'Módulos/Productos', visible: true },
    { id: 'sec_testimonials', type: 'testimonials', label: 'Testimonios', visible: true },
    { id: 'sec_pricing', type: 'pricing', label: 'Tablas de Precio', visible: true },
    { id: 'sec_promotions', type: 'promotions', label: 'Promociones', visible: true },
    { id: 'sec_faq', type: 'faq', label: 'Preguntas Frecuentes', visible: true },
    { id: 'sec_gallery', type: 'gallery', label: 'Galería', visible: true },
    { id: 'sec_contact', type: 'contact', label: 'Contacto y Formulario', visible: true },
  ]);
  sections$ = this.sectionsSubject.asObservable();
  statsConfig$ = this.statsConfigSubject.asObservable();


  

  testimonialsConfig$: Observable<TestimonialsConfig> = this.testimonialsConfigSubject.asObservable();
  private componentVariantsSubject = new BehaviorSubject<{ [component: string]: string }>({});
  private globalVariantSubject = new BehaviorSubject<string>('glass');
  // Replaced simple boolean with full step state
  private builderStepSubject = new BehaviorSubject<'welcome' | 'editor' | 'preview'>('editor');
  builderStep$ = this.builderStepSubject.asObservable();
  
  // Keep previewMode$ for backward campatibility if needed, mapping from step
  previewMode$ = this.builderStepSubject.pipe(
    map((step) => step === 'preview')
  );

  private allValidVariants = variants;

  private isValidVariant(variant: any): boolean {
    return this.allValidVariants.includes(variant);
  }

  // Existing Observables
  headerConfig$: Observable<HeaderConfig> = this.headerConfigSubject.asObservable();
  footerConfig$: Observable<FooterConfig> = this.footerConfigSubject.asObservable();
  navBarConfig$: Observable<NavBarConfig> = this.navBarConfigSubject.asObservable();
  heroConfig$: Observable<HeroConfig> = this.heroConfigSubject.asObservable();
  bubbleConfig$: Observable<BubbleConfig> = this.bubbleConfigSubject.asObservable();
  cardConfig$: Observable<CardConfig> = this.cardConfigSubject.asObservable();
  titleConfig$: Observable<TitleConfig> = this.titleConfigSubject.asObservable();

  // New Observables
  serviceCardsConfig$: Observable<ServiceCardsConfig> = this.serviceCardsConfigSubject.asObservable();
  faqConfig$: Observable<FaqConfig> = this.faqConfigSubject.asObservable();
  pricingConfig$: Observable<PricingConfig> = this.pricingConfigSubject.asObservable();
  promotionsConfig$: Observable<PromotionsConfig> = this.promotionsConfigSubject.asObservable();
  galleryConfig$: Observable<GalleryConfig> = this.galleryConfigSubject.asObservable();
  productsConfig$: Observable<ProductsConfig> = this.productsConfigSubject.asObservable();

  componentVariants$: Observable<{ [component: string]: string }> = this.componentVariantsSubject.asObservable();
  globalVariant$: Observable<string> = this.globalVariantSubject.asObservable();

  // Existing setters (setHeaderConfig, setFooterConfig, etc.) remain unchanged
  setHeaderConfig(config: Partial<HeaderConfig>) {
    const current = this.headerConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    this.headerConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setFooterConfig(config: Partial<FooterConfig>) {
    const current = this.footerConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    this.footerConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setNavBarConfig(config: Partial<NavBarConfig>) {
    const current = this.navBarConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    this.navBarConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setTestimonialsConfig(config: Partial<TestimonialsConfig>) {
    const current = this.testimonialsConfigSubject.getValue();
    this.testimonialsConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }
  
  getCurrentTestimonialsConfig(): TestimonialsConfig {
    return this.testimonialsConfigSubject.getValue();
  }

  

  setStatsConfig(config: Partial<StatsConfig>) {
    const current = this.statsConfigSubject.getValue();
    this.statsConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  getCurrentStatsConfig(): StatsConfig {
    return this.statsConfigSubject.getValue();
  }

  setHeroConfig(config: Partial<HeroConfig>) {
    const current = this.heroConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    this.heroConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setBubbleConfig(config: Partial<BubbleConfig>) {
    const current = this.bubbleConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    this.bubbleConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setCardConfig(config: Partial<CardConfig>) {
    const current = this.cardConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    this.cardConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setTitleConfig(config: Partial<TitleConfig>) {
    const current = this.titleConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    this.titleConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  // New setters for component data
  setServiceCardsConfig(config: Partial<ServiceCardsConfig>) {
    const current = this.serviceCardsConfigSubject.getValue();
    this.serviceCardsConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setFaqConfig(config: Partial<FaqConfig>) {
    const current = this.faqConfigSubject.getValue();
    this.faqConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setPricingConfig(config: Partial<PricingConfig>) {
    const current = this.pricingConfigSubject.getValue();
    this.pricingConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setPromotionsConfig(config: Partial<PromotionsConfig>) {
    const current = this.promotionsConfigSubject.getValue();
    this.promotionsConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setGalleryConfig(config: Partial<GalleryConfig>) {
    const current = this.galleryConfigSubject.getValue();
    this.galleryConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setProductsConfig(config: Partial<ProductsConfig>) {
    const current = this.productsConfigSubject.getValue();
    this.productsConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  setGlobalVariant(variant: string) {
    if (this.isValidVariant(variant)) {
      this.globalVariantSubject.next(variant);
      
      // Aplicar forzosamente a todos los configs base para asegurar consistencia
      const update = { variant };
      this.setHeaderConfig(update);
      this.setFooterConfig(update);
      this.setNavBarConfig(update);
      this.setHeroConfig(update);
      this.setBubbleConfig(update);
      this.setCardConfig(update);
      this.setTitleConfig(update);
      
      // Aplicar también a las secciones específicas
      this.setServiceCardsConfig(update);
      this.setFaqConfig(update);
      this.setPricingConfig(update);
      this.setPromotionsConfig(update);
      this.setGalleryConfig(update);
      this.setProductsConfig(update);
      this.setTestimonialsConfig(update);
      this.setStatsConfig(update);
      
      this.saveToLocalStorage();
    }
  }

  setComponentVariant(component: string, variant: string | null) {
    const current = this.componentVariantsSubject.getValue();
    if (variant && this.isValidVariant(variant)) {
      this.componentVariantsSubject.next({ ...current, [component]: variant });
    } else {
      const { [component]: _, ...rest } = current;
      this.componentVariantsSubject.next(rest);
    }
    this.saveToLocalStorage();
  }

  clearAllComponentVariants() {
    this.componentVariantsSubject.next({});
    this.saveToLocalStorage();
  }

  setBuilderStep(step: 'welcome' | 'editor' | 'preview') {
    this.builderStepSubject.next(step);
  }

  // Deprecated/Adapter
  setPreviewMode(enabled: boolean) {
    this.setBuilderStep(enabled ? 'preview' : 'editor');
  }

  getVariantForComponent(component: string): string {
    const componentVariants = this.componentVariantsSubject.getValue();
    return componentVariants[component] || this.globalVariantSubject.getValue();
  }

  // Existing getters
  getCurrentHeaderConfig(): HeaderConfig {
    return this.headerConfigSubject.getValue();
  }

  getCurrentFooterConfig(): FooterConfig {
    return this.footerConfigSubject.getValue();
  }

  getCurrentNavBarConfig(): NavBarConfig {
    return this.navBarConfigSubject.getValue();
  }

  getCurrentHeroConfig(): HeroConfig {
    return this.heroConfigSubject.getValue();
  }

  getCurrentBubbleConfig(): BubbleConfig {
    return this.bubbleConfigSubject.getValue();
  }

  getCurrentCardConfig(): CardConfig {
    return this.cardConfigSubject.getValue();
  }

  getCurrentTitleConfig(): TitleConfig {
    return this.titleConfigSubject.getValue();
  }

  // New getters
  getCurrentSections(): PageSection[] {
    return this.sectionsSubject.getValue();
  }

  setSections(sections: PageSection[]) {
    this.sectionsSubject.next(sections);
    this.saveToLocalStorage();
  }
  getCurrentServiceCardsConfig(): ServiceCardsConfig {
    return this.serviceCardsConfigSubject.getValue();
  }

  getCurrentFaqConfig(): FaqConfig {
    return this.faqConfigSubject.getValue();
  }

  getCurrentPricingConfig(): PricingConfig {
    return this.pricingConfigSubject.getValue();
  }

  getCurrentPromotionsConfig(): PromotionsConfig {
    return this.promotionsConfigSubject.getValue();
  }

  getCurrentGalleryConfig(): GalleryConfig {
    return this.galleryConfigSubject.getValue();
  }

  getCurrentProductsConfig(): ProductsConfig {
    return this.productsConfigSubject.getValue();
  }

  // Get full configuration state (useful for snapshots/backups)
  getFullConfig() {
    return {
      header: this.headerConfigSubject.getValue(),
      footer: this.footerConfigSubject.getValue(),
      navBar: this.navBarConfigSubject.getValue(),
      hero: this.heroConfigSubject.getValue(),
      bubble: this.bubbleConfigSubject.getValue(),
      card: this.cardConfigSubject.getValue(),
      title: this.titleConfigSubject.getValue(),
      serviceCards: this.serviceCardsConfigSubject.getValue(),
      faq: this.faqConfigSubject.getValue(),
      pricing: this.pricingConfigSubject.getValue(),
      promotions: this.promotionsConfigSubject.getValue(),
      gallery: this.galleryConfigSubject.getValue(),
      products: this.productsConfigSubject.getValue(),
      testimonials: this.testimonialsConfigSubject.getValue(),
      globalVariant: this.globalVariantSubject.getValue(),
      componentVariants: this.componentVariantsSubject.getValue(),
      sections: this.sectionsSubject.getValue(),
    };
  }

  // Persistence
  private saveToLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const state = {
        header: this.headerConfigSubject.getValue(),
        footer: this.footerConfigSubject.getValue(),
        navBar: this.navBarConfigSubject.getValue(),
        hero: this.heroConfigSubject.getValue(),
        bubble: this.bubbleConfigSubject.getValue(),
        card: this.cardConfigSubject.getValue(),
        title: this.titleConfigSubject.getValue(),
        serviceCards: this.serviceCardsConfigSubject.getValue(),
        faq: this.faqConfigSubject.getValue(),
        pricing: this.pricingConfigSubject.getValue(),
        promotions: this.promotionsConfigSubject.getValue(),
        gallery: this.galleryConfigSubject.getValue(),
        products: this.productsConfigSubject.getValue(),
        globalVariant: this.globalVariantSubject.getValue(),
        componentVariants: this.componentVariantsSubject.getValue(),
        sections: this.sectionsSubject.getValue(),
      };
      localStorage.setItem('anto_studios_config', JSON.stringify(state));
    }
  }

  private loadFromLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('anto_studios_config');
      if (saved) {
        try {
          const state = JSON.parse(saved);
          if (state.header) this.headerConfigSubject.next(state.header);
          if (state.footer) this.footerConfigSubject.next(state.footer);
          if (state.navBar) this.navBarConfigSubject.next(state.navBar);
          if (state.hero) this.heroConfigSubject.next(state.hero);
          if (state.bubble) this.bubbleConfigSubject.next(state.bubble);
          if (state.card) this.cardConfigSubject.next(state.card);
          if (state.title) this.titleConfigSubject.next(state.title);
          if (state.serviceCards) this.serviceCardsConfigSubject.next(state.serviceCards);
          if (state.faq) this.faqConfigSubject.next(state.faq);
          if (state.pricing) this.pricingConfigSubject.next(state.pricing);
          if (state.promotions) this.promotionsConfigSubject.next(state.promotions);
          if (state.gallery) this.galleryConfigSubject.next(state.gallery);
          if (state.products) this.productsConfigSubject.next(state.products);
          if (state.globalVariant) this.globalVariantSubject.next(state.globalVariant);
          if (state.componentVariants) this.componentVariantsSubject.next(state.componentVariants);
          if (state.sections) this.sectionsSubject.next(state.sections);
        } catch (e) {
          console.error('Error loading config from localStorage', e);
        }
      }
    }
  }

  resetConfig() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('anto_studios_config');
      window.location.reload();
    }
  }

  // Apply template configuration
  applyTemplate(template: any) {
    console.log('VariantService: Applying template:', template?.name || 'Unknown template');

    // Apply all configurations from the template
    if (template.header) {
      console.log('Applying header config');
      this.headerConfigSubject.next(template.header);
    }
    if (template.footer) {
      console.log('Applying footer config');
      this.footerConfigSubject.next(template.footer);
    }
    if (template.navBar) {
      console.log('Applying navbar config');
      this.navBarConfigSubject.next(template.navBar);
    }
    if (template.hero) {
      console.log('Applying hero config');
      this.heroConfigSubject.next(template.hero);
    }
    if (template.bubble) {
      console.log('Applying bubble config');
      this.bubbleConfigSubject.next(template.bubble);
    }
    if (template.card) {
      console.log('Applying card config');
      this.cardConfigSubject.next(template.card);
    }
    if (template.title) {
      console.log('Applying title config');
      this.titleConfigSubject.next(template.title);
    }
    if (template.serviceCards) {
      console.log('Applying serviceCards config');
      this.serviceCardsConfigSubject.next(template.serviceCards);
    }
    if (template.faq) {
      console.log('Applying faq config');
      this.faqConfigSubject.next(template.faq);
    }
    if (template.pricing) {
      console.log('Applying pricing config');
      this.pricingConfigSubject.next(template.pricing);
    }
    if (template.promotions) {
      console.log('Applying promotions config');
      this.promotionsConfigSubject.next(template.promotions);
    }
    if (template.gallery) {
      console.log('Applying gallery config');
      this.galleryConfigSubject.next(template.gallery);
    }
    if (template.products) {
      console.log('Applying products config');
      this.productsConfigSubject.next(template.products);
    }
    if (template.testimonials) {
      console.log('Applying testimonials config');
      this.testimonialsConfigSubject.next(template.testimonials);
    }
    if (template.sections) {
      console.log('Applying sections config');
      this.sectionsSubject.next(template.sections);
    }
    if (template.globalVariant) {
      console.log('Applying globalVariant:', template.globalVariant);
      this.globalVariantSubject.next(template.globalVariant);
    }
    if (template.componentVariants) {
      console.log('Applying componentVariants');
      this.componentVariantsSubject.next(template.componentVariants);
    }

    this.saveToLocalStorage();
    console.log('Template application completed');
  }
}