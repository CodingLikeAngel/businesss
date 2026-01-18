import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  color?: string;
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
export class UIFeaturesSectionComponent {
  title = input('Nuestros Servicios Premium');
  subtitle = input('Descubre cómo podemos ayudarte a llevar tu negocio al siguiente nivel con nuestras soluciones innovadoras.');
  variant = input('default');
  customStyles = input<FeaturesCustomStyles>({});
  features = input<FeatureItem[]>([
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
    },
    {
      icon: '🎨',
      title: 'UI/UX Increíble',
      description: 'Creamos interfaces intuitivas que enamoran a tus usuarios desde el primer clic.',
      color: '#ef4444'
    },
    {
      icon: '🔍',
      title: 'SEO Optimizado',
      description: 'Escala posiciones en Google con nuestra arquitectura preparada para buscadores.',
      color: '#8b5cf6'
    },
    {
      icon: '📈',
      title: 'Análisis de Datos',
      description: 'Toma decisiones informadas con nuestras herramientas integradas de analítica.',
      color: '#ec4899'
    }
  ]);

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
}

