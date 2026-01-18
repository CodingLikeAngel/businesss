import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatItem {
  icon: string;
  label: string;
  value: string | number;
  description?: string;
}

export interface StatsCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
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
  customStyles = input<StatsCustomStyles>({});
  stats = input<StatItem[]>([
    { icon: '🚀', label: 'Velocidad', value: '0.8s', description: 'Tiempo de carga' },
    { icon: '🔒', label: 'Seguridad', value: '99.9%', description: 'Uptime' },
    { icon: '📈', label: 'Conversiones', value: '12%', description: 'Tasa de conversión' },
    { icon: '👥', label: 'Usuarios', value: '5k+', description: 'Visitantes mensuales' }
  ]);

  statsStyles = computed(() => {
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

  containerClasses = computed(() => `stats-container stats--${this.variant()}`);
}

