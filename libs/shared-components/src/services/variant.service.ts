import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { footerVariants, bubbleVariants, cardRutasVariants, titleVariants, NavLink, variants } from '@negocio/ui-components';

export type SectionType = 'hero' | 'features' | 'services' | 'products' | 'testimonials' | 'pricing' | 'gallery' | 'contact' | 'faq' | 'stats' | 'team' | 'blog' | 'cta' | 'promotions' | 'bubble' | 'custom' | 'header' | 'footer' | 'newsletter' | 'steps' | 'table' | 'breadcrumbs' | 'chip' | 'spinner' | 'chart' | 'showcase' | 'tabs' | 'accordion' | 'list' | 'navBar' | 'button' | 'image';

export interface ElementStyles {
  [key: string]: string | undefined;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  customCSS?: string;
}

export interface SectionStyles extends ElementStyles {
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  minHeight?: string;
}

// Existing interfaces (NavLink, HeaderConfig, FooterConfig, NavBarConfig, HeroConfig, BubbleConfig, CardConfig, TitleConfig) remain unchanged

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  variant?: string;
  styles?: { [key: string]: string };
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
  variant?: string;
  styles?: { [key: string]: string };
}

export interface CarouselItem {
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  title: string;
  description: string;
  section: string;
  variant?: string;
  styles?: { [key: string]: string };
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
  animation: 'pulse' | 'fade' | 'slide' | 'bounce' | 'glitch' | 'none';
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
  variant?: string;
  styles?: { [key: string]: string };
}

export interface ServiceCardsConfig {
  variant: string;
  items: CardItem[];
}

export interface AccordionItem {
  title: string;
  content: string;
  expanded: boolean;
  variant?: string;
  styles?: { [key: string]: string };
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
  variant?: string;
  styles?: { [key: string]: string };
}

export interface PromotionsConfig {
  variant: string;
  title?: string;
  description?: string;
  premiumCards: CardPremiumConfig[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  variant?: string;
  styles?: { [key: string]: string };
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
  variant?: string;
  styles?: { [key: string]: string };
}


export interface StatItem {
  icon: string;
  label: string;
  value: string | number;
  description?: string;
  variant?: string;
  styles?: { [key: string]: string };
}

export interface StatsConfig {
  variant: string;
  items: StatItem[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  color?: string;
  variant?: string;
  styles?: { [key: string]: string };
}

export interface FeaturesConfig {
  variant: string;
  items: FeatureItem[];
}

export interface CtaConfig {
  variant: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonLink: string;
  customStyles?: { [key: string]: string };
}

export interface ChartConfig {
   variant: string;
   type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'area';
   data: {
     labels: string[];
     datasets: {
       label: string;
       data: number[];
       backgroundColor?: string | string[];
       borderColor?: string | string[];
     }[];
   };
}

export interface ProductsConfig {
  variant: string;
  items: Product[];
}

export interface PageSection {
   id: string;
   type: SectionType;
   label: string; // User friendly name
   visible: boolean;
   name: string;
   position?: { x: number; y: number };
   size?: { width: number; height: number };
   styles: SectionStyles;
   content: { [key: string]: any };
   elements: any[];
   config: { [key: string]: any };
   customStyles: { [key: string]: string };
   animation: string;
   layout: string;
   animations?: any[];
   responsive?: {
     mobile: { visible: boolean; styles: SectionStyles };
     tablet: { visible: boolean; styles: SectionStyles };
     desktop: { visible: boolean; styles: SectionStyles };
   };
   zIndex?: number;
   order?: number;
   isGlobal?: boolean;
 }

export interface Page {
  id: string;
  name: string;
  slug: string;
  sections: PageSection[];
  globalStyles: { [key: string]: string };
  createdAt: Date;
  updatedAt: Date;
  order: number;
  visibleInHeader: boolean;
  visibleInFooter: boolean;
  isHomePage?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class VariantService {
  constructor() {
    this.loadFromLocalStorage();
  }

  /** Devuelve la configuración completa del editor (para exportar). */
  getFullConfig(): any {
    return {
      pageTitle: this.headerConfigSubject.value.title || 'Mi sitio Anto Studios',
      globalVariant: {
        theme: this.globalVariantSubject.value,
        styles: {} // Aquí se podrían añadir estilos globales computados
      },
      sections: this.sectionsSubject.value || [],
      header: this.headerConfigSubject.value,
      footer: this.footerConfigSubject.value,
      pages: this.pagesSubject.value,
      assets: [] // Placeholder para futuros assets
    };
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
    title: 'Eleva tu Negocio Digital',
    subtitle: 'Creamos experiencias web excepcionales que convierten visitantes en clientes. Diseño moderno, tecnología de vanguardia y resultados comprobados.',
    showCta: true,
    ctaLabel: 'Comienza tu Proyecto',
    showScrollIcon: true,
    videoBackground: false,
    videoUrl: '',
    videoPoster: '',
    navigationCards: [
      {
        icon: '🎨',
        title: 'Diseño Personalizado',
        description: 'Webs únicas y memorables que reflejan tu marca.',
        sectionId: 'servicios',
        animationDelay: '0s',
      },
      {
        icon: '⚡',
        title: 'Rendimiento Óptimo',
        description: 'Velocidad y eficiencia para una experiencia perfecta.',
        sectionId: 'precios',
        animationDelay: '0.2s',
      },
      {
        icon: '📱',
        title: '100% Responsive',
        description: 'Perfecto en todos los dispositivos.',
        sectionId: 'productos',
        animationDelay: '0.4s',
      },
    ],
    carouselItems: [
      {
        imageUrl: '/1029.png',
        title: 'Landing Page Premium',
        description: 'Captura leads y convierte visitantes con diseños impactantes.',
        section: 'servicios',
      },
      {
        imageUrl: '/1090.png',
        title: 'E-commerce Completo',
        description: 'Tiendas online con carrito avanzado y pagos seguros.',
        section: 'productos',
      },
      {
        imageUrl: '/retro-stars.png',
        title: 'Aplicaciones Web',
        description: 'Sistemas personalizados para automatizar tu negocio.',
        section: 'contacto',
      },
    ],
    customStyles: {
      '--hero-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      '--hero-overlay': 'rgba(0, 0, 0, 0.4)',
      '--hero-text-shadow': '0 4px 20px rgba(0, 0, 0, 0.3)',
      '--hero-animation-duration': '0.8s',
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

  private chartConfigSubject = new BehaviorSubject<ChartConfig>({
    variant: 'secondary',
    type: 'bar',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Ventas 2024',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
        }
      ]
    }
  });

  private featuresConfigSubject = new BehaviorSubject<FeaturesConfig>({
    variant: 'glass',
    items: [
      {
        icon: '🚀',
        title: 'Alta Velocidad',
        description: 'Optimizamos cada línea de código para asegurar que tu web cargue en menos de un segundo.',
        color: '#3b82f6'
      },
      {
        icon: '🛡️',
        title: 'Seguridad Total',
        description: 'Protegemos tus datos y los de tus clientes con los estándares más altos de la industria.',
        color: '#10b981'
      },
      {
        icon: '📱',
        title: 'Diseño Responsive',
        description: 'Tu sitio se verá perfecto en cualquier dispositivo, desde móviles hasta pantallas 4K.',
        color: '#f59e0b'
      }
    ]
  });

  private sectionsSubject = new BehaviorSubject<PageSection[]>([
    { id: 'sec_hero', type: 'hero', label: 'Portada Hero', visible: true, name: '', styles: {}, content: {
      title: 'Eleva tu Negocio Digital',
      subtitle: 'Creamos experiencias web excepcionales que convierten visitantes en clientes.',
      ctaLabel: 'Comienza tu Proyecto',
      showCta: true
    }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
    { id: 'sec_features', type: 'features', label: 'Características Premium', visible: true, name: '', styles: {}, content: {
      title: 'Nuestras Características',
      subtitle: 'Lo que nos hace diferentes'
    }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
    { id: 'sec_contact', type: 'contact', label: 'Contacto y Formulario', visible: true, name: '', styles: {}, content: {
      title: 'Solicita tu Demo Personalizada'
    }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
  ]);
  sections$ = this.sectionsSubject.asObservable();

  // Page management
  private pagesSubject = new BehaviorSubject<Page[]>([
    {
      id: 'page_home',
      name: 'Home',
      slug: 'home',
      sections: this.sectionsSubject.value,
      globalStyles: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      order: 0,
      visibleInHeader: true,
      visibleInFooter: false,
      isHomePage: true
    }
  ]);
  private currentPageSubject = new BehaviorSubject<Page | null>(this.pagesSubject.value[0]);
  pages$ = this.pagesSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();
  statsConfig$ = this.statsConfigSubject.asObservable();
  chartConfig$ = this.chartConfigSubject.asObservable();


  

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
  featuresConfig$: Observable<FeaturesConfig> = this.featuresConfigSubject.asObservable();

  // ========================================
  // SECTION MANAGEMENT METHODS
  // ========================================

  /**
   * Get all sections from the current state
   */
  getSections(): PageSection[] {
    return this.sectionsSubject.value;
  }

  /**
   * Get a specific section by ID
   */
  getSectionById(sectionId: string): PageSection | undefined {
    return this.sectionsSubject.value.find(s => s.id === sectionId);
  }

  /**
   * Update a section (immutable - creates new array)
   */
  updateSection(sectionId: string, updates: Partial<PageSection>): void {
    const sections = this.sectionsSubject.value;
    const index = sections.findIndex(s => s.id === sectionId);
    
    if (index !== -1) {
      const newSections = [...sections];
      newSections[index] = {
        ...newSections[index],
        ...updates,
        content: {
          ...newSections[index].content,
          ...(updates.content || {})
        },
        styles: {
          ...newSections[index].styles,
          ...(updates.styles || {})
        }
      };
      
      this.sectionsSubject.next(newSections);
      this.saveToLocalStorage();
    }
  }

  /**
   * Add a new section
   */
  addSection(section: PageSection): void {
    const sections = [...this.sectionsSubject.value, section];
    this.sectionsSubject.next(sections);
    this.saveToLocalStorage();
  }

  /**
   * Remove a section by ID
   */
  removeSection(sectionId: string): void {
    const sections = this.sectionsSubject.value.filter(s => s.id !== sectionId);
    this.sectionsSubject.next(sections);
    this.saveToLocalStorage();
  }

  /**
   * Reorder sections
   */
  reorderSections(newOrder: PageSection[]): void {
    this.sectionsSubject.next([...newOrder]);
    this.saveToLocalStorage();
  }

  /**
   * Update section visibility
   */
  toggleSectionVisibility(sectionId: string): void {
    const sections = this.sectionsSubject.value;
    const index = sections.findIndex(s => s.id === sectionId);
    
    if (index !== -1) {
      const newSections = [...sections];
      newSections[index] = {
        ...newSections[index],
        visible: !newSections[index].visible
      };
      this.sectionsSubject.next(newSections);
      this.saveToLocalStorage();
    }
  }

  componentVariants$: Observable<{ [component: string]: string }> = this.componentVariantsSubject.asObservable();
  globalVariant$: Observable<string> = this.globalVariantSubject.asObservable();

  // Existing setters (setHeaderConfig, setFooterConfig, etc.) remain unchanged
  setHeaderConfig(config: Partial<HeaderConfig>) {
    const current = this.headerConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    const newConfig = { ...current, ...config };
    this.headerConfigSubject.next(newConfig);
    
    if (config.variant) {
      this.setComponentVariant('navbar', config.variant);
    }
    this.saveToLocalStorage();
  }

  updateHeaderConfig(changes: Partial<HeaderConfig>) {
    const current = this.headerConfigSubject.getValue();
    const updated = {
      ...current,
      ...changes,
      customStyles: { ...(current.customStyles || {}), ...(changes.customStyles || {}) }
    };
    this.headerConfigSubject.next(updated);
    if (changes.variant) {
      this.setComponentVariant('navbar', changes.variant);
    }
    this.saveToLocalStorage();
  }

  setFooterConfig(config: Partial<FooterConfig>) {
    const current = this.footerConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    const newConfig = { ...current, ...config };
    this.footerConfigSubject.next(newConfig);

    if (config.variant) {
      this.setComponentVariant('footer', config.variant);
    }
    this.saveToLocalStorage();
  }

  updateFooterConfig(changes: Partial<FooterConfig>) {
    const current = this.footerConfigSubject.getValue();
    const updated = {
      ...current,
      ...changes,
      customStyles: { ...(current.customStyles || {}), ...(changes.customStyles || {}) }
    };
    this.footerConfigSubject.next(updated);
    if (changes.variant) {
      this.setComponentVariant('footer', changes.variant);
    }
    this.saveToLocalStorage();
  }

  setNavBarConfig(config: Partial<NavBarConfig>) {
    const current = this.navBarConfigSubject.getValue();
    if (config.variant && !this.isValidVariant(config.variant)) {
      config.variant = current.variant;
    }
    this.navBarConfigSubject.next({ ...current, ...config });

    if (config.variant) {
      this.setComponentVariant('navbar', config.variant);
    }
    this.saveToLocalStorage();
  }

  updateNavBarConfig(changes: Partial<NavBarConfig>) {
    const current = this.navBarConfigSubject.getValue();
    const updated = {
      ...current,
      ...changes,
      customStyles: { ...(current.customStyles || {}), ...(changes.customStyles || {}) }
    };
    this.navBarConfigSubject.next(updated);
    if (changes.variant) {
      this.setComponentVariant('navbar', changes.variant);
    }
    this.saveToLocalStorage();
  }

  setTestimonialsConfig(config: Partial<TestimonialsConfig>) {
    const current = this.testimonialsConfigSubject.getValue();
    const updated = { ...current, ...config };
    if (updated.items) updated.items = [...updated.items];
    this.testimonialsConfigSubject.next(updated);
    this.saveToLocalStorage();
  }
  
  getCurrentTestimonialsConfig(): TestimonialsConfig {
    return this.testimonialsConfigSubject.getValue();
  }

  

  setStatsConfig(config: Partial<StatsConfig>) {
    const current = this.statsConfigSubject.getValue();
    const updated = { ...current, ...config };
    if (updated.items) updated.items = [...updated.items];
    this.statsConfigSubject.next(updated);
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
    const updated = { ...current, ...config };
    if (updated.navigationCards) updated.navigationCards = [...updated.navigationCards];
    this.heroConfigSubject.next(updated);
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
    const updated = { ...current, ...config };
    if (updated.items) updated.items = [...updated.items];
    this.serviceCardsConfigSubject.next(updated);
    this.saveToLocalStorage();
  }

  setFaqConfig(config: Partial<FaqConfig>) {
    const current = this.faqConfigSubject.getValue();
    const updated = { ...current, ...config };
    if (updated.items) updated.items = [...updated.items];
    this.faqConfigSubject.next(updated);
    this.saveToLocalStorage();
  }

  setPricingConfig(config: Partial<PricingConfig>) {
    const current = this.pricingConfigSubject.getValue();
    const updated = { ...current, ...config };
    if (updated.columns) updated.columns = [...updated.columns];
    if (updated.rows) updated.rows = [...updated.rows];
    this.pricingConfigSubject.next(updated);
    this.saveToLocalStorage();
  }

  setPromotionsConfig(config: Partial<PromotionsConfig>) {
    const current = this.promotionsConfigSubject.getValue();
    const updated = { ...current, ...config };
    if (updated.premiumCards) updated.premiumCards = [...updated.premiumCards];
    this.promotionsConfigSubject.next(updated);
    this.saveToLocalStorage();
  }

  setGalleryConfig(config: Partial<GalleryConfig>) {
    const current = this.galleryConfigSubject.getValue();
    const updated = { ...current, ...config };
    if (updated.images) updated.images = [...updated.images];
    this.galleryConfigSubject.next(updated);
    this.saveToLocalStorage();
  }

  setProductsConfig(config: Partial<ProductsConfig>) {
    const current = this.productsConfigSubject.getValue();
    const updated = { ...current, ...config };
    if (updated.items) updated.items = [...updated.items];
    this.productsConfigSubject.next(updated);
    this.saveToLocalStorage();
  }

  setGlobalVariant(variant: string) {
    if (this.isValidVariant(variant)) {
      this.globalVariantSubject.next(variant);
      
      // Aplicar forzosamente a todos los configs base para asegurar consistencia
      // IMPORTANT: We must create NEW objects for Angular Change Detection to pick it up immediately
      const update = { variant };
      
      this.setHeaderConfig({ ...this.headerConfigSubject.value, ...update });
      this.setFooterConfig({ ...this.footerConfigSubject.value, ...update });
      this.setNavBarConfig({ ...this.navBarConfigSubject.value, ...update });
      this.setHeroConfig({ ...this.heroConfigSubject.value, ...update });
      this.setBubbleConfig({ ...this.bubbleConfigSubject.value, ...update });
      this.setCardConfig({ ...this.cardConfigSubject.value, ...update });
      this.setTitleConfig({ ...this.titleConfigSubject.value, ...update });
      
      // Aplicar también a las secciones específicas
      this.setServiceCardsConfig({ ...this.serviceCardsConfigSubject.value, ...update });
      this.setFaqConfig({ ...this.faqConfigSubject.value, ...update });
      this.setPricingConfig({ ...this.pricingConfigSubject.value, ...update });
      this.setPromotionsConfig({ ...this.promotionsConfigSubject.value, ...update });
      this.setGalleryConfig({ ...this.galleryConfigSubject.value, ...update });
      this.setProductsConfig({ ...this.productsConfigSubject.value, ...update });
      this.setTestimonialsConfig({ ...this.testimonialsConfigSubject.value, ...update });
      this.setStatsConfig({ ...this.statsConfigSubject.value, ...update });
      
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

  // Page management methods
  getCurrentPages(): Page[] {
    return this.pagesSubject.getValue();
  }

  getCurrentPage(): Page | null {
    return this.currentPageSubject.getValue();
  }

  createPage(name: string): Page {
    const newPage: Page = {
      id: `page_${new Date().getTime()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      sections: [],
      globalStyles: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      order: this.pagesSubject.value.length,
      visibleInHeader: true,
      visibleInFooter: false,
      isHomePage: false
    };

    const currentPages = [...this.pagesSubject.value, newPage];
    this.pagesSubject.next(currentPages);
    this.saveToLocalStorage();
    return newPage;
  }

  setCurrentPage(pageId: string): void {
    const page = this.pagesSubject.value.find(p => p.id === pageId);
    if (page) {
      this.currentPageSubject.next(page);
      // Update sections to match current page
      this.sectionsSubject.next(page.sections);
    }
  }

  updatePage(pageId: string, changes: Partial<Page>): void {
    const updatedPages = this.pagesSubject.value.map(page =>
      page.id === pageId ? { ...page, ...changes, updatedAt: new Date() } : page
    );
    this.pagesSubject.next(updatedPages);

    // Update current page if it's the one being updated
    const currentPage = this.currentPageSubject.getValue();
    if (currentPage?.id === pageId) {
      const updatedPage = updatedPages.find(p => p.id === pageId);
      if (updatedPage) {
        this.currentPageSubject.next(updatedPage);
        this.sectionsSubject.next(updatedPage.sections);
      }
    }

    this.saveToLocalStorage();
  }

  deletePage(pageId: string): void {
    const currentPages = this.pagesSubject.value.filter(p => p.id !== pageId);
    this.pagesSubject.next(currentPages);

    // If current page is deleted, set to first page or null
    const currentPage = this.currentPageSubject.getValue();
    if (currentPage?.id === pageId) {
      const newCurrentPage = currentPages.length > 0 ? currentPages[0] : null;
      this.currentPageSubject.next(newCurrentPage);
      this.sectionsSubject.next(newCurrentPage?.sections || []);
    }

    this.saveToLocalStorage();
  }

  // Page-aware section management
  addSectionToCurrentPage(section: PageSection): void {
    const currentPage = this.currentPageSubject.getValue();
    if (!currentPage) return;

    const updatedSections = [...currentPage.sections, section];
    this.updatePage(currentPage.id, { sections: updatedSections });
  }

  updateSectionInCurrentPage(sectionId: string, changes: Partial<PageSection>): void {
    const currentPage = this.currentPageSubject.getValue();
    if (!currentPage) return;

    // ROBUSTNESS: Sanitize structural components to prevent "disintegration"
    const isStructural = sectionId.toLowerCase().includes('header') || sectionId.toLowerCase().includes('footer') || sectionId.startsWith('global_');
    
    if (isStructural && changes.styles) {
       const cleanStyles = { ...changes.styles };
       delete cleanStyles['position'];
       delete cleanStyles['top'];
       delete cleanStyles['left'];
       delete cleanStyles['right'];
       delete cleanStyles['bottom'];
       changes.styles = cleanStyles;
    }

    const updatedSections = currentPage.sections.map(section =>
      section.id === sectionId ? { ...section, ...changes } : section
    );
    this.updatePage(currentPage.id, { sections: updatedSections });
  }

  removeSectionFromCurrentPage(sectionId: string): void {
    const currentPage = this.currentPageSubject.getValue();
    if (!currentPage) return;

    const updatedSections = currentPage.sections.filter(section => section.id !== sectionId);
    this.updatePage(currentPage.id, { sections: updatedSections });
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



  // Persistence
  getCurrentFeaturesConfig(): FeaturesConfig {
    return this.featuresConfigSubject.getValue();
  }

  setFeaturesConfig(config: Partial<FeaturesConfig>) {
    const current = this.featuresConfigSubject.getValue();
    this.featuresConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  getCurrentChartConfig(): ChartConfig {
    return this.chartConfigSubject.getValue();
  }


  setChartConfig(config: Partial<ChartConfig>): void {
    const current = this.chartConfigSubject.getValue();
    this.chartConfigSubject.next({ ...current, ...config });
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
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
        chart: this.chartConfigSubject.getValue(),
        globalVariant: this.globalVariantSubject.getValue(),
        componentVariants: this.componentVariantsSubject.getValue(),
        sections: this.sectionsSubject.getValue(),
        pages: this.pagesSubject.getValue(),
        currentPageId: this.currentPageSubject.getValue()?.id || null,
      };
      localStorage.setItem('anto_studios_config', JSON.stringify(state));
    }
  }

  /**
   * Update styles for a specific element (by ID) in the current page
   * This is used by the Visual Editor to persist drag/resize changes
   */
  updateElementStyles(elementId: string, styles: { [key: string]: string }) {
    const currentPage = this.currentPageSubject.value;
    if (!currentPage) return;

    let updated = false;
    const newSections = currentPage.sections.map(section => {
      // Check if the section itself is the element
      if (section.id === elementId) {
        updated = true;
        return {
          ...section,
          styles: { ...section.styles, ...styles }
        };
      }
      
      // Check if the element is inside this section (elements array)
      if (section.elements && section.elements.length > 0) {
        const elemIndex = section.elements.findIndex(e => e.id === elementId);
        if (elemIndex !== -1) {
          updated = true;
          const newElements = [...section.elements];
          newElements[elemIndex] = {
            ...newElements[elemIndex],
            styles: { ...(newElements[elemIndex].styles || {}), ...styles }
          };
          return { ...section, elements: newElements };
        }
      }

      return section;
    });

    if (updated) {
      this.updatePage(currentPage.id, { sections: newSections });
      console.log(`VariantService: Updated styles for ${elementId}`);
    } else {
      console.warn(`VariantService: Element ${elementId} not found for style update`);
    }
  }

  /**
   * Resets all layout-related styles for a section
   * Use this to recover when items are lost or layout is broken
   */
  resetSectionLayout(sectionId: string) {
    const currentPage = this.currentPageSubject.value;
    if (!currentPage) return;

    const newSections = currentPage.sections.map(section => {
      if (section.id === sectionId) {
        const content = { ...(section.content || {}) };
        
        // Remove style objects from content (titleStyles, subtitleStyles, etc)
        Object.keys(content).forEach(key => {
          if (key.endsWith('Styles')) content[key] = {};
        });

        // Reset list items styles
        const listKeys = ['items', 'navigationCards', 'premiumCards', 'images', 'testimonials'];
        listKeys.forEach(lk => {
          if (content[lk] && Array.isArray(content[lk])) {
            content[lk] = content[lk].map((i: any) => ({ ...i, styles: {} }));
          }
        });

        return {
          ...section,
          styles: {}, // Clear main section styles
          content
        };
      }
      return section;
    });

    this.updatePage(currentPage.id, { sections: newSections });
    console.log(`🛡️ Reset layout for section: ${sectionId}`);
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
          if (state.pages) {
            this.pagesSubject.next(state.pages);
            // Set current page
            if (state.currentPageId) {
              const currentPage = state.pages.find((p: Page) => p.id === state.currentPageId);
              if (currentPage) {
                this.currentPageSubject.next(currentPage);
                this.sectionsSubject.next(currentPage.sections);
              }
            } else if (state.pages.length > 0) {
              // Default to first page if no current page set
              this.currentPageSubject.next(state.pages[0]);
              this.sectionsSubject.next(state.pages[0].sections);
            }
          }
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
    if (!template) return;
    
    console.log('VariantService: Applying template:', template.name || template.id || 'Unknown');

    // 1. Structural Application: If it has sections, apply them to the current page
    if (template.sections) {
      console.log('VariantService: Applying sections structure');
      const currentPage = this.currentPageSubject.getValue();
      if (currentPage) {
        this.updatePage(currentPage.id, {
          sections: [...template.sections],
          globalStyles: template.globalStyles || {}
        });
      }
    }

    // 2. Data/Config Application: Apply all component configurations
    // This MUST run even if sections are present, to fill the components with correct data
    if (template.header) this.setHeaderConfig(template.header);
    if (template.footer) this.setFooterConfig(template.footer);
    if (template.navBar) this.setNavBarConfig(template.navBar);
    if (template.hero) this.setHeroConfig(template.hero);
    if (template.bubble) this.setBubbleConfig(template.bubble);
    if (template.card) this.setCardConfig(template.card);
    if (template.title) this.setTitleConfig(template.title);
    if (template.serviceCards) this.setServiceCardsConfig(template.serviceCards);
    if (template.faq) this.setFaqConfig(template.faq);
    if (template.pricing) this.setPricingConfig(template.pricing);
    if (template.promotions) this.setPromotionsConfig(template.promotions);
    if (template.gallery) this.setGalleryConfig(template.gallery);
    if (template.products) this.setProductsConfig(template.products);
    if (template.testimonials) this.setTestimonialsConfig(template.testimonials);
    if (template.stats) this.setStatsConfig(template.stats);
    
    // 3. Variant Application
    if (template.globalVariant) {
      this.setGlobalVariant(template.globalVariant);
    }
    if (template.componentVariants) {
      this.componentVariantsSubject.next({ ...template.componentVariants });
    }

    this.saveToLocalStorage();
    console.log('VariantService: Template application completed successfully');
  }
}