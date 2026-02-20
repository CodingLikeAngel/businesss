// spinner.component.ts (Hijo - UISpinnerComponent)
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';

// Variante específica del componente hijo
const specificSpinnerVariants = ['cosmic-dust'] as const;

// Combinamos variantes globales con específicas
export const spinnerVariants = [...baseVariants, ...specificSpinnerVariants, 'dots', 'bars', 'rings', 'custom'] as const;
export type SpinnerVariantType = typeof spinnerVariants[number] | (string & {});

export interface SpinnerCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--spinner-border'?: string;
  '--spinner-border-top'?: string;
  '--spinner-border-radius'?: string;
  '--spinner-bg'?: string;
  '--spinner-shadow'?: string;
  [key: string]: string | undefined;
}

export interface SpinnerContext {
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  info?: boolean;
}

@Component({
  selector: 'lib-ui-components-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class UISpinnerComponent {
  variant = input<SpinnerVariantType>('secondary');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  customStyles = input<SpinnerCustomStyles>({}); // Nueva señal para estilos personalizados
  ariaLabel = input<string>('Loading'); // Descriptive label for accessibility
  progress = input<number | null>(null); // Progress percentage
  animate = input<boolean>(true); // Enable animations
  context = input<SpinnerContext>({}); // Contextual state

  spinnerClasses = computed(() => {
    const classes = [
      'spinner',
      `spinner-${this.variant()}`, // Clase basada en la variante
      `spinner-${this.size()}`,    // Clase basada en el tamaño
    ];
    if (this.dark()) classes.push('dark');
    
    // Add contextual classes
    const context = this.context();
    if (context.success) classes.push('spinner-success');
    if (context.error) classes.push('spinner-error');
    if (context.warning) classes.push('spinner-warning');
    if (context.info) classes.push('spinner-info');
    
    // Add animation classes
    if (this.animate()) classes.push('fade-in');
    
    return classes.join(' ');
  });

  spinnerStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--spinner-bg'] = customStyles['backgroundColor']; // Specific var
      styles['--theme-bg'] = customStyles['backgroundColor'];   // Generic var
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--spinner-border'] = `4px solid ${customStyles['color']}`; // Spinner color implies border
      styles['--spinner-border-top'] = `4px solid ${customStyles['color']}`;
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

  progressStyles = computed(() => {
    const styles: Record<string, any> = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: this.dark() ? '#ffffff' : '#111827',
      'font-size': '0.75em',
      'font-weight': 'bold',
      'text-shadow': '0 0 4px rgba(0, 0, 0, 0.5)'
    };
    return styles;
  });
}
