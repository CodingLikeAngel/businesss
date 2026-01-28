import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const accordion2Variants = variants;
export type Accordion2VariantType = typeof accordion2Variants[number];

export interface Accordion2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Accordion2Item {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
}

@Component({
  selector: 'lib-ui-components-accordion-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-2.component.html',
  styleUrl: './accordion-2.component.scss',
})
export class UIAccordion2Component {
  variant = input<Accordion2VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<Accordion2Item[]>([]);
  customStyles = input<Accordion2CustomStyles>({});

  accordionStyles = computed(() => {
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

  accordionClasses = computed(() => {
    const classes = ['accordion-2', `accordion-2-${this.variant()}`];
    classes.push(`accordion-2-rounded-${this.rounded()}`);
    classes.push(`accordion-2-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses(item: Accordion2Item): string {
    const classes = ['accordion-2-item'];
    if (item.isOpen) classes.push('open');
    return classes.join(' ');
  }

  toggleItem(item: Accordion2Item): void {
    item.isOpen = !item.isOpen;
  }
}
