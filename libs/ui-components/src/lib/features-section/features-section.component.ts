import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  color?: string;
}

@Component({
  selector: 'lib-ui-components-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss']
})
export class UIFeaturesSectionComponent {
  @Input() title = 'Nuestros Servicios Premium';
  @Input() subtitle = 'Descubre cómo podemos ayudarte a llevar tu negocio al siguiente nivel con nuestras soluciones innovadoras.';
  @Input() variant: string = 'default';
  @Input() features: FeatureItem[] = [
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
  ];

  get containerClasses(): string {
    return `features-container features--${this.variant}`;
  }
}
