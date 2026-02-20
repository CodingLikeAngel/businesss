import { Component, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as globalVariants } from '../models/ui-components-data.model';
import { mergeCustomStyles } from '../models/merge-custom-styles.util';

// Variantes específicas del accordion
export const accordionSpecificVariants = ['mi-variant-custom', 'otra-especial'] as const;

export const baseAccordionVariants = [...globalVariants, ...accordionSpecificVariants] as const;
type BaseAccordionVariant = typeof baseAccordionVariants[number];

export interface AccordionItem {
  title: string;
  content: string;
  expanded?: boolean;
}

export interface AccordionCustomStyles {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIAccordionComponent {
  variant = input<BaseAccordionVariant | string>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<AccordionItem[]>([]);
  singleExpand = input<boolean>(false);
  customStyles = input<AccordionCustomStyles>({});

  expandedIndex = signal(-1);

  accordionStyles = computed(() => {
    const base = mergeCustomStyles(this.customStyles(), 'accordion');
    return { '--accordion-bg': 'white', '--accordion-color': '#333', ...base };
  });

  private openItems = signal(new Set<number>());

  isItemExpanded(index: number, _expandedFromInput?: boolean): boolean {
    if (this.singleExpand()) {
      return this.expandedIndex() === index;
    }
    return this.openItems().has(index);
  }

  accordionClasses = computed(() => {
    const classes = [
      'accordion-container',
      `variant-${this.variant()}`,
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
      'accordion-content-wrapper',
      `content-${this.size()}`,
      this.dark() ? 'dark' : '',
    ];
    return classes.join(' ');
  });

  toggleItem(index: number) {
    if (this.singleExpand()) {
      this.expandedIndex.update((current) => (current === index ? -1 : index));
    } else {
      this.openItems.update((set) => {
        const newSet = new Set(set);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }
  }
}
