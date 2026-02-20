import { Component, input, computed, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { isPlatformBrowser } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';
import { ChartTypeRegistry, Chart } from 'chart.js';

// Usamos las variantes globales
export const chartVariants = baseVariants;
export type DefaultChartVariant = typeof chartVariants[number];
export type ChartVariantType = DefaultChartVariant | (string & {});

import {
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  RadarController
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  RadarController
);

export type ChartType = keyof ChartTypeRegistry | 'area';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface ChartCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--chart-bg'?: string;
  '--chart-color'?: string;
  '--chart-border'?: string;
  '--chart-shadow'?: string;
  '--chart-hover-bg'?: string;
  '--chart-hover-shadow'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class UIChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  variant = input<ChartVariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  type = input<ChartType>('bar');
  data = input<ChartData>({ labels: [], datasets: [] });
  customStyles = input<ChartCustomStyles>({});
  
  chartStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
       styles['--chart-bg'] = customStyles['backgroundColor'];
       styles['--theme-bg'] = customStyles['backgroundColor'];
       styles['--component-bg'] = customStyles['backgroundColor'];
       styles['background'] = customStyles['backgroundColor'];
       styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
       styles['--chart-color'] = customStyles['color'];
       styles['--theme-color'] = customStyles['color'];
       styles['--component-text'] = customStyles['color'];
       styles['color'] = customStyles['color'];
    }
    
    // Copy any other custom styles
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  chartClasses = computed(() => {
    const classes = ['chart-container', `chart-${this.variant()}`];
    classes.push(`chart-rounded-${this.rounded()}`);
    classes.push(`chart-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderChart();
    }
  }

  private renderChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chartType = this.type() === 'area' ? 'line' : this.type();
    const datasets = this.type() === 'area'
      ? this.data().datasets.map(dataset => ({ ...dataset, fill: true }))
      : this.data().datasets;

    const chartConfig = {
      type: chartType as keyof ChartTypeRegistry,
      data: { ...this.data(), datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: {
                family: 'Orbitron',
              },
            },
          },
        },
        scales: ['pie', 'doughnut', 'radar'].includes(this.type()) ? {} : {
          x: {
            ticks: {
              font: {
                family: 'Orbitron',
              },
            },
          },
          y: {
            ticks: {
              font: {
                family: 'Orbitron',
              },
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }
}
