import { Component, input, computed, signal, AfterViewInit, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  color?: string;
  iconType?: string;
  category?: string;
  stats?: Array<{ value: number; label: string }>;
  tooltipTitle?: string;
  tooltipDescription?: string;
  tooltipPoints?: string[];
}

export interface FeatureCategory {
  id: string;
  name: string;
  icon: string;
}

export interface FeaturesCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss']
})
export class UIFeaturesSectionComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private elementRef = inject(ElementRef);
  title = input('Nuestros Servicios Premium');
  subtitle = input('Descubre cómo podemos ayudarte a llevar tu negocio al siguiente nivel con nuestras soluciones innovadoras.');
  variant = input('default');
  customStyles = input<FeaturesCustomStyles>({});
  categories = input<FeatureCategory[]>([
    { id: 'all', name: 'Todos', icon: '🌟' },
    { id: 'performance', name: 'Rendimiento', icon: '⚡' },
    { id: 'security', name: 'Seguridad', icon: '🛡️' },
    { id: 'design', name: 'Diseño', icon: '🎨' },
    { id: 'seo', name: 'SEO', icon: '🔍' }
  ]);
  features = input<FeatureItem[]>([
    {
      icon: '🚀',
      iconType: 'rocket',
      title: 'Alta Velocidad',
      description: 'Optimizamos cada línea de código para asegurar que tu web cargue en menos de un segundo.',
      color: '#3b82f6',
      category: 'performance',
      stats: [
        { value: 99, label: 'Velocidad' },
        { value: 1000, label: 'Usuarios' }
      ],
      tooltipTitle: 'Optimización de Rendimiento Avanzada',
      tooltipDescription: 'Utilizamos las últimas técnicas de optimización web incluyendo lazy loading, code splitting, y caching inteligente.',
      tooltipPoints: [
        'Carga en menos de 1 segundo',
        'Optimización automática de imágenes',
        'Cache inteligente de recursos',
        'CDN global integrado'
      ]
    },
    {
      icon: '🛡️',
      iconType: 'shield',
      title: 'Seguridad Total',
      description: 'Protegemos tus datos y los de tus clientes con los estándares más altos de la industria.',
      color: '#10b981',
      category: 'security',
      stats: [
        { value: 100, label: 'Seguro' },
        { value: 256, label: 'Encriptación' }
      ],
      tooltipTitle: 'Seguridad Empresarial de Nivel Enterprise',
      tooltipDescription: 'Implementamos múltiples capas de seguridad para proteger tu negocio y datos.',
      tooltipPoints: [
        'Encriptación SSL/TLS 256-bit',
        'Protección DDoS avanzada',
        'Autenticación de dos factores',
        'Cumplimiento GDPR y CCPA'
      ]
    },
    {
      icon: '📱',
      iconType: 'mobile',
      title: 'Diseño Responsive',
      description: 'Tu sitio se verá perfecto en cualquier dispositivo, desde móviles hasta pantallas 4K.',
      color: '#f59e0b',
      category: 'design',
      stats: [
        { value: 100, label: 'Compatible' },
        { value: 50, label: 'Dispositivos' }
      ],
      tooltipTitle: 'Diseño Adaptativo Multi-Dispositivo',
      tooltipDescription: 'Creamos experiencias perfectas en todos los dispositivos y tamaños de pantalla.',
      tooltipPoints: [
        'Compatible con todos los dispositivos',
        'Optimización móvil-first',
        'Pantallas táctiles avanzadas',
        'Soporte para accesibilidad'
      ]
    },
    {
      icon: '🎨',
      iconType: 'palette',
      title: 'UI/UX Increíble',
      description: 'Creamos interfaces intuitivas que enamoran a tus usuarios desde el primer clic.',
      color: '#ef4444',
      category: 'design',
      stats: [
        { value: 95, label: 'Satisfacción' },
        { value: 300, label: 'Horas UX' }
      ],
      tooltipTitle: 'Experiencia de Usuario Premium',
      tooltipDescription: 'Diseñamos interfaces que no solo se ven bien, sino que ofrecen experiencias excepcionales.',
      tooltipPoints: [
        'Investigación de usuarios profunda',
        'Prototipado interactivo',
        'Testing de usabilidad',
        'Iteración basada en datos'
      ]
    },
    {
      icon: '🔍',
      iconType: 'search',
      title: 'SEO Optimizado',
      description: 'Escala posiciones en Google con nuestra arquitectura preparada para buscadores.',
      color: '#8b5cf6',
      category: 'seo',
      stats: [
        { value: 85, label: 'Posicionamiento' },
        { value: 200, label: 'Keywords' }
      ],
      tooltipTitle: 'Optimización SEO Técnica Avanzada',
      tooltipDescription: 'Implementamos las mejores prácticas SEO para mejorar tu visibilidad en motores de búsqueda.',
      tooltipPoints: [
        'Optimización técnica completa',
        'Estrategia de contenido SEO',
        'Link building ético',
        'Monitoreo y reporting continuo'
      ]
    },
    {
      icon: '📈',
      iconType: 'chart',
      title: 'Análisis de Datos',
      description: 'Toma decisiones informadas con nuestras herramientas integradas de analítica.',
      color: '#ec4899',
      category: 'performance',
      stats: [
        { value: 1000, label: 'Métricas' },
        { value: 24, label: 'Monitoreo' }
      ],
      tooltipTitle: 'Analytics y Business Intelligence',
      tooltipDescription: 'Obtén insights valiosos sobre tu negocio con nuestras herramientas de analítica avanzada.',
      tooltipPoints: [
        'Google Analytics 4 integrado',
        'Dashboards personalizados',
        'Reportes automatizados',
        'A/B testing integrado'
      ]
    }
  ]);

  private activeCategorySignal = signal('all');

  activeCategory = this.activeCategorySignal.asReadonly();

  setActiveCategory(categoryId: string) {
    this.activeCategorySignal.set(categoryId);
  }

  filteredFeatures = computed(() => {
    const activeCategory = this.activeCategory();
    if (activeCategory === 'all') {
      return this.features();
    }
    return this.features().filter(feature => feature.category === activeCategory);
  });

  featuresStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  containerClasses = computed(() => `features-container features--${this.variant()}`);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Wait for DOM to be fully rendered
      setTimeout(() => {
        this.initIntersectionObserver();
      }, 100);
    }
  }

  private initIntersectionObserver() {
    const featureItems = this.elementRef.nativeElement.querySelectorAll('.feature-item');

    if (featureItems.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.animationDelay = `${index * 0.1}s`;
          element.classList.add('revealed');

          // Start counter animation when element is revealed
          const statNumbers = element.querySelectorAll('.stat-number');
          statNumbers.forEach((statEl) => {
            const target = parseInt(statEl.getAttribute('data-target') || '0');
            this.animateCounter(statEl as HTMLElement, target);
          });

          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe feature items
    featureItems.forEach((item: Element) => {
      observer.observe(item);
    });
  }


  private animateCounter(element: HTMLElement, target: number) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeOutQuart);

      element.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toString();
      }
    };

    requestAnimationFrame(updateCounter);
  }
}

