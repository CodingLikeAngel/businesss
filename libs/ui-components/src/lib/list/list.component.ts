// list.component.ts (Hijo - UIListComponent)
import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';
import { mergeCustomStyles } from '../models/merge-custom-styles.util';

// Variantes específicas del componente hijo
const specificListVariants = ['cosmic-dust'] as const;

// Combinamos variantes globales con específicas
export const listVariants = [...baseVariants, ...specificListVariants] as const;
export type ListVariantType = typeof listVariants[number] | (string & {});

export interface ListCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIListComponent {
  variant = input<ListVariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<string[]>([]);
  customStyles = input<ListCustomStyles>({});

  listStyles = computed(() => mergeCustomStyles(this.customStyles(), 'list'));

  listClasses = computed(() => {
    const classes = ['list-container', `variant-${this.variant()}`];
    classes.push(`list-rounded-${this.rounded()}`);
    classes.push(`list-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    const classes = ['list-item'];
    classes.push(`item-${this.size()}`);
    return classes.join(' ');
  });
}
