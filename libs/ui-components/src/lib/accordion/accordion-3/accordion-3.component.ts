import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const accordion3Variants = variants;
export type Accordion3VariantType = typeof accordion3Variants[number];

export interface Accordion3CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Accordion3Item {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
}

@Component({
  selector: 'lib-ui-components-accordion-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-3.component.html',
  styleUrl: './accordion-3.component.scss',
})
export class UIAccordion3Component {
  variant = input<Accordion3VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<Accordion3Item[]>([]);
  customStyles = input<Accordion3CustomStyles>({});

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
    const classes = ['accordion-3', `accordion-3-${this.variant()}`];
    classes.push(`accordion-3-rounded-${this.rounded()}`);
    classes.push(`accordion-3-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses(item: Accordion3Item): string {
    const classes = ['accordion-3-item'];
    if (item.isOpen) classes.push('open');
    return classes.join(' ');
  }

  toggleItem(item: Accordion3Item): void {
    item.isOpen = !item.isOpen;
  }
}
