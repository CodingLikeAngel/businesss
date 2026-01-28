import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const accordion1Variants = variants;
export type Accordion1VariantType = typeof accordion1Variants[number];

export interface Accordion1CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Accordion1Item {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
}

@Component({
  selector: 'lib-ui-components-accordion-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-1.component.html',
  styleUrl: './accordion-1.component.scss',
})
export class UIAccordion1Component {
  variant = input<Accordion1VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<Accordion1Item[]>([]);
  customStyles = input<Accordion1CustomStyles>({});

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
    const classes = ['accordion-1', `accordion-1-${this.variant()}`];
    classes.push(`accordion-1-rounded-${this.rounded()}`);
    classes.push(`accordion-1-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses(item: Accordion1Item): string {
    const classes = ['accordion-1-item'];
    if (item.isOpen) classes.push('open');
    return classes.join(' ');
  }

  toggleItem(item: Accordion1Item): void {
    item.isOpen = !item.isOpen;
  }
}
