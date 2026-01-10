import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { footerVariants, bubbleVariants, cardRutasVariants, titleVariants, NavLink } from '@negocio/ui-components';

// Existing interfaces (NavLink, HeaderConfig, FooterConfig, NavBarConfig, HeroConfig, BubbleConfig, CardConfig, TitleConfig) remain unchanged

export interface Testimonial {
  quote: string;
  author: string;
}

export interface TestimonialsConfig {
  items: Testimonial[];
}


export interface HeaderConfig {
  variant: string;
  title: string;
  subtitle: string;
  align: 'left' | 'center' | 'right';
  dark: boolean;
  navItems: { label: string; href: string; active?: boolean }[];
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
  customStyles: { [key: string]: string };
}

export interface NavBarConfig {
  variant: string;
  logoText: string;
  showMobileMenu: boolean;
  isFixed: boolean;
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
  items: CardItem[];
}

export interface AccordionItem {
  title: string;
  content: string;
  expanded: boolean;
}

export interface FaqConfig {
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
  premiumCards: CardPremiumConfig[];
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryConfig {
  images: GalleryImage[];
}

export interface Product {
  name: string;
  image: string;
  description: string;
  price: string;
}

export interface ProductsConfig {
  items: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class VariantService {
  // Existing BehaviorSubjects
  private headerConfigSubject = new BehaviorSubject<HeaderConfig>({
    variant: 'cartoon',
    title: 'Solicita tu web profesional',
    subtitle: 'Diseños únicos y personalizados para tu negocio',
    align: 'center',
    dark: false,
    navItems: [
      { label: 'Home', href: '/home', active: true },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    customStyles: {},
  });

  
  private footerConfigSubject = new BehaviorSubject<FooterConfig>({
    variant: 'matrix',
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
    customStyles: {},
  });

  private navBarConfigSubject = new BehaviorSubject<NavBarConfig>({
    variant: 'matrix',
    logoText: 'Webs Profesionales',
    showMobileMenu: true,
    isFixed: true,
    navLinks: [
      { label: 'Inicio', href: '#hero', icon: '🏠' },
      { label: 'Servicios', href: '#servicios', icon: '🛠️' },
      { label: 'Productos', href: '#productos', icon: '🧩' },
      { label: 'Testimonios', href: '#testimonios', icon: '⭐' },
      { label: 'Precios', href: '#precios', icon: '💰' },
      { label: 'Promociones', href: '#promociones', icon: '🎁' },
      { label: 'FAQ', href: '#faq', icon: '❓' },
      { label: 'Galería', href: '#galeria', icon: '🖼️' },
      { label: 'Contacto', href: '#contacto', icon: '📞' },
    ],
    customStyles: {},
  });

  private heroConfigSubject = new BehaviorSubject<HeroConfig>({
    variant: 'matrix',
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
    variant: 'matrix',
    speed: 0.8,
    blur: 30,
    opacity: 0.7,
  });

  private cardConfigSubject = new BehaviorSubject<CardConfig>({
    variant: 'matrix',
    backgroundColor: 'rgba(255,255,255,0.1)',
    textColor: '#FACC15',
    accentColor: '#FF1E56',
    animation: 'pulse',
    isMobile: false,
    customStyles: {
      '--card-border': '1px solid rgba(255, 30, 86, 0.3)',
    },
  });

  private titleConfigSubject = new BehaviorSubject<TitleConfig>({
    variant: 'matrix',
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
    images: [
      { src: '/1029.png', alt: 'Web 1' },
      { src: '/1090.png', alt: 'Web 2' },
      { src: '/retro-stars.png', alt: 'Web 3' },
    ],
  });

  private productsConfigSubject = new BehaviorSubject<ProductsConfig>({
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


  

  testimonialsConfig$: Observable<TestimonialsConfig> = this.testimonialsConfigSubject.asObservable();
  private componentVariantsSubject = new BehaviorSubject<{ [component: string]: string }>({});
  private globalVariantSubject = new BehaviorSubject<string>('matrix');

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
    if (config.variant && !footerVariants.includes(config.variant as any)) {
      config.variant = current.variant;
    }
    this.headerConfigSubject.next({ ...current, ...config });
  }

  setFooterConfig(config: Partial<FooterConfig>) {
    const current = this.footerConfigSubject.getValue();
    if (config.variant && !footerVariants.includes(config.variant as any)) {
      config.variant = current.variant;
    }
    this.footerConfigSubject.next({ ...current, ...config });
  }

  setNavBarConfig(config: Partial<NavBarConfig>) {
    const current = this.navBarConfigSubject.getValue();
    if (config.variant && !footerVariants.includes(config.variant as any)) {
      config.variant = current.variant;
    }
    this.navBarConfigSubject.next({ ...current, ...config });
  }

  setTestimonialsConfig(config: Partial<TestimonialsConfig>) {
    const current = this.testimonialsConfigSubject.getValue();
    this.testimonialsConfigSubject.next({ ...current, ...config });
  }
  
  getCurrentTestimonialsConfig(): TestimonialsConfig {
    return this.testimonialsConfigSubject.getValue();
  }

  

  setHeroConfig(config: Partial<HeroConfig>) {
    const current = this.heroConfigSubject.getValue();
    if (config.variant && !footerVariants.includes(config.variant as any)) {
      config.variant = current.variant;
    }
    this.heroConfigSubject.next({ ...current, ...config });
  }

  setBubbleConfig(config: Partial<BubbleConfig>) {
    const current = this.bubbleConfigSubject.getValue();
    if (config.variant && !bubbleVariants.includes(config.variant as any)) {
      config.variant = current.variant;
    }
    this.bubbleConfigSubject.next({ ...current, ...config });
  }

  setCardConfig(config: Partial<CardConfig>) {
    const current = this.cardConfigSubject.getValue();
    if (config.variant && !cardRutasVariants.includes(config.variant as any)) {
      config.variant = current.variant;
    }
    this.cardConfigSubject.next({ ...current, ...config });
  }

  setTitleConfig(config: Partial<TitleConfig>) {
    const current = this.titleConfigSubject.getValue();
    if (config.variant && !titleVariants.includes(config.variant as any)) {
      config.variant = current.variant;
    }
    this.titleConfigSubject.next({ ...current, ...config });
  }

  // New setters for component data
  setServiceCardsConfig(config: Partial<ServiceCardsConfig>) {
    const current = this.serviceCardsConfigSubject.getValue();
    this.serviceCardsConfigSubject.next({ ...current, ...config });
  }

  setFaqConfig(config: Partial<FaqConfig>) {
    const current = this.faqConfigSubject.getValue();
    this.faqConfigSubject.next({ ...current, ...config });
  }

  setPricingConfig(config: Partial<PricingConfig>) {
    const current = this.pricingConfigSubject.getValue();
    this.pricingConfigSubject.next({ ...current, ...config });
  }

  setPromotionsConfig(config: Partial<PromotionsConfig>) {
    const current = this.promotionsConfigSubject.getValue();
    this.promotionsConfigSubject.next({ ...current, ...config });
  }

  setGalleryConfig(config: Partial<GalleryConfig>) {
    const current = this.galleryConfigSubject.getValue();
    this.galleryConfigSubject.next({ ...current, ...config });
  }

  setProductsConfig(config: Partial<ProductsConfig>) {
    const current = this.productsConfigSubject.getValue();
    this.productsConfigSubject.next({ ...current, ...config });
  }

  setGlobalVariant(variant: string) {
    if (
      footerVariants.includes(variant as any) ||
      bubbleVariants.includes(variant as any) ||
      cardRutasVariants.includes(variant as any) ||
      titleVariants.includes(variant as any)
    ) {
      this.globalVariantSubject.next(variant);
      this.setHeaderConfig({ variant });
      this.setFooterConfig({ variant });
      this.setNavBarConfig({ variant });
      this.setHeroConfig({ variant });
      this.setBubbleConfig({ variant });
      this.setCardConfig({ variant });
      this.setTitleConfig({ variant });
    }
  }

  setComponentVariant(component: string, variant: string | null) {
    const current = this.componentVariantsSubject.getValue();
    if (
      variant &&
      (footerVariants.includes(variant as any) ||
        bubbleVariants.includes(variant as any) ||
        cardRutasVariants.includes(variant as any) ||
        titleVariants.includes(variant as any))
    ) {
      this.componentVariantsSubject.next({ ...current, [component]: variant });
    } else {
      const { [component]: _, ...rest } = current;
      this.componentVariantsSubject.next(rest);
    }
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
}