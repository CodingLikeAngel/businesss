import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomStyles } from '../models/custom-styles.interface';

export interface StatItem {
  icon: string;
  label: string;
  value: string | number;
  description?: string;
  progress?: number; // 0-100 for progress bars/circles
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string | number;
  historicalData?: Array<{ date: string; value: number }>;
  target?: string | number;
  unit?: string;
  animationDelay?: number;
}

@Component({
  selector: 'lib-ui-components-stats-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UIStatsLibSectionComponent {
  title = input('Nuestras Métricas');
  subtitle = input('Indicadores clave de rendimiento.');
  variant = input('default');
  customStyles = input<CustomStyles>({});
  stats = input<StatItem[]>([
    {
      icon: '🚀',
      label: 'Velocidad',
      value: '0.8s',
      description: 'Tiempo de carga',
      progress: 85,
      trend: 'up',
      trendValue: '+5%',
      unit: 's',
      historicalData: [
        { date: '2023-01', value: 1.2 },
        { date: '2023-02', value: 1.0 },
        { date: '2023-03', value: 0.9 },
        { date: '2023-04', value: 0.8 }
      ]
    },
    {
      icon: '🔒',
      label: 'Seguridad',
      value: '99.9%',
      description: 'Uptime',
      progress: 99.9,
      trend: 'stable',
      trendValue: '0%',
      unit: '%',
      historicalData: [
        { date: '2023-01', value: 99.5 },
        { date: '2023-02', value: 99.7 },
        { date: '2023-03', value: 99.8 },
        { date: '2023-04', value: 99.9 }
      ]
    },
    {
      icon: '📈',
      label: 'Conversiones',
      value: '12%',
      description: 'Tasa de conversión',
      progress: 12,
      trend: 'up',
      trendValue: '+2%',
      unit: '%',
      historicalData: [
        { date: '2023-01', value: 8 },
        { date: '2023-02', value: 9 },
        { date: '2023-03', value: 11 },
        { date: '2023-04', value: 12 }
      ]
    },
    {
      icon: '👥',
      label: 'Usuarios',
      value: '5k+',
      description: 'Visitantes mensuales',
      progress: 75,
      trend: 'up',
      trendValue: '+15%',
      unit: 'k',
      historicalData: [
        { date: '2023-01', value: 3500 },
        { date: '2023-02', value: 4200 },
        { date: '2023-03', value: 4800 },
        { date: '2023-04', value: 5000 }
      ]
    }
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

  getMaxHistoricalValue(stat: StatItem): number {
    if (!stat.historicalData || stat.historicalData.length === 0) return 1;
    return Math.max(...stat.historicalData.map(d => d.value));
  }

  getBarHeight(data: { value: number }, stat: StatItem): number {
    const max = this.getMaxHistoricalValue(stat);
    return max > 0 ? (data.value / max) * 100 : 0;
  }
}

