import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as globalVariants } from '../models/ui-components-data.model';

// Variantes específicas del acordeón
export const accordionSpecificVariants = ['mi-variant-custom', 'otra-especial'] as const;

// Todas las variantes base (globales + específicas)
export const baseAccordionVariants = [...globalVariants, ...accordionSpecificVariants] as const;
type BaseAccordionVariant = typeof baseAccordionVariants[number];

export interface AccordionItem {
  title: string;
  content: string;
  expanded?: boolean;
}

// Interfaz para las propiedades CSS personalizadas
export interface AcordeonCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--accordion-bg'?: string;
  '--accordion-color'?: string;
  '--accordion-border'?: string;
  '--accordion-shadow'?: string;
  '--accordion-hover-bg'?: string;
  '--accordion-hover-shadow'?: string;
  '--accordion-header-bg'?: string;
  '--accordion-header-hover-bg'?: string;
  '--accordion-content-bg'?: string;
  '--accordion-content-color'?: string;
  '--accordion-item-border'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class UIAccordionComponent {
  // Convertimos los @Input en señales
  variant = input<BaseAccordionVariant | string>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<AccordionItem[]>([]);
  singleExpand = input<boolean>(false);
  customStyles = input<AcordeonCustomStyles>({}); // Estilos personalizados

  // Estado interno como señal
  expandedIndex = signal(-1);

  accordionStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--accordion-bg'] = customStyles['backgroundColor'];
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--accordion-color'] = customStyles['color'];
      styles['--theme-color'] = customStyles['color'];
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

  // Clases calculadas con computed basadas en señales
  accordionClasses = computed(() => {
    const classes = [
      'accordion-container',
      `variant-${this.variant()}`, // Changed from accordion-variant to match SCSS
      `accordion-rounded-${this.rounded()}`,
      `accordion-${this.size()}`,
      this.dark() ? 'dark' : '',
    ];
    return classes.filter(Boolean).join(' ');
  });

  headerClasses = computed(() => {
    const classes = [
      'accordion-header',
      `header-${this.size()}`,
      this.dark() ? 'dark' : '',
    ];
    return classes.join(' ');
  });

  contentClasses = computed(() => {
    const classes = [
      'accordion-content',
      `content-${this.size()}`,
      this.dark() ? 'dark' : '',
    ];
    return classes.join(' ');
  });

  toggleItem(index: number) {
    if (this.singleExpand()) {
      this.expandedIndex.set(this.expandedIndex() === index ? -1 : index);
    } else {
      const currentItems = this.items();
      const updatedItems = currentItems.map((item, i) => ({
        ...item,
        expanded: i === index ? !item.expanded : item.expanded,
      }));
      // Actualizamos los items manualmente ya que input no es writable
      console.log('Items actualizados:', updatedItems);
    }
  }
}
