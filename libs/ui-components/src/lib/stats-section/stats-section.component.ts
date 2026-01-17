import { Component, input, computed } from '@angular/core';
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
  styleUrl: './stats-section.component.scss'
})
export class UIStatsLibSectionComponent {
  title = input('Nuestras Métricas');
  subtitle = input('Indicadores clave de rendimiento.');
  variant = input('default');
  stats = input<StatItem[]>([
    { icon: '🚀', label: 'Velocidad', value: '0.8s', description: 'Tiempo de carga' },
    { icon: '🔒', label: 'Seguridad', value: '99.9%', description: 'Uptime' },
    { icon: '📈', label: 'Conversiones', value: '12%', description: 'Tasa de conversión' },
    { icon: '👥', label: 'Usuarios', value: '5k+', description: 'Visitantes mensuales' }
  ]);

  containerClasses = computed(() => `stats-container stats--${this.variant()}`);
}

