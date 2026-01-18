// spinner.component.ts (Hijo - UISpinnerComponent)
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';

// Variante específica del componente hijo
const specificSpinnerVariants = ['cosmic-dust'] as const;

// Combinamos variantes globales con específicas
export const spinnerVariants = [...baseVariants, ...specificSpinnerVariants] as const;
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

@Component({
  selector: 'lib-ui-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class UISpinnerComponent {
  variant = input<SpinnerVariantType>('secondary');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  customStyles = input<SpinnerCustomStyles>({}); // Nueva señal para estilos personalizados

  spinnerClasses = computed(() => {
    const classes = [
      'spinner',
      `spinner-${this.variant()}`, // Clase basada en la variante
      `spinner-${this.size()}`,    // Clase basada en el tamaño
    ];
    if (this.dark()) classes.push('dark');
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
}
