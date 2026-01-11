import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatItem {
  icon: string;
  label: string;
  value: string | number;
  description?: string;
}

@Component({
  selector: 'lib-ui-components-stats-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.scss']
})
export class UIStatsSectionComponent {
  @Input() title = 'Nuestros Métricas';
  @Input() subtitle = 'Indicadores clave de rendimiento.';
  @Input() variant: string = 'default';
  @Input() stats: StatItem[] = [
    { icon: '🚀', label: 'Velocidad', value: '0.8s', description: 'Tiempo de carga' },
    { icon: '🔒', label: 'Seguridad', value: '99.9%', description: 'Uptime' },
    { icon: '📈', label: 'Conversiones', value: '12%', description: 'Tasa de conversión' },
    { icon: '👥', label: 'Usuarios', value: '5k+', description: 'Visitantes mensuales' }
  ];

  get containerClasses(): string {
    return `stats-container stats--${this.variant}`;
  }
}
