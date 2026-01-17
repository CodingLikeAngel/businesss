// spinner.component.ts (Hijo - UISpinnerComponent)
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';

// Variante específica del componente hijo
const specificSpinnerVariants = ['cosmic-dust'] as const;

// Combinamos variantes globales con específicas
export const spinnerVariants = [...baseVariants, ...specificSpinnerVariants] as const;
export type SpinnerVariantType = typeof spinnerVariants[number] | (string & {});

interface SpinnerCustomStyles {
  '--spinner-border'?: string;
  '--spinner-border-top'?: string;
  '--spinner-border-radius'?: string;
  '--spinner-bg'?: string;
  '--spinner-shadow'?: string;
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
    const styles: any = { ...this.customStyles() };
    if (styles['backgroundColor']) {
      styles['--spinner-bg'] = styles['backgroundColor']; // Specific var
      styles['--theme-bg'] = styles['backgroundColor'];   // Generic var
    }
    if (styles['color']) {
      styles['--spinner-border'] = styles['color'];       // Spinner color implies border
      styles['--theme-color'] = styles['color'];
    }
    return styles;
  });
}
