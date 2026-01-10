// list.component.ts (Hijo - UIListComponent)
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';

// Variantes específicas del componente hijo
const specificListVariants = ['cosmic-dust'] as const;

// Combinamos variantes globales con específicas
export const listVariants = [...baseVariants, ...specificListVariants] as const;
export type ListVariantType = typeof listVariants[number] | (string & {});

@Component({
  selector: 'lib-ui-components-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class UIListComponent {
  variant = input<ListVariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<string[]>([]);

  listClasses = computed(() => {
    const classes = ['list-container', `list-${this.variant()}`];
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