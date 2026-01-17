// chip.component.ts (Hijo - UIChipComponent)
import { Component, input, computed, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark, heroCheck } from '@ng-icons/heroicons/outline';
import { variants as baseVariants } from '../models/ui-components-data.model';

// Variantes específicas del componente hijo
const specificChipVariants = ['magic-spark'] as const;

// Combinamos variantes globales con específicas
export const chipVariants = [...baseVariants, ...specificChipVariants] as const;
export type ChipVariantType = typeof chipVariants[number] | (string & {});

@Component({
  selector: 'lib-ui-components-chip',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroXMark, heroCheck })],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class UIChipComponent {
  variant = input<ChipVariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('full');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  removable = input<boolean>(false);
  selected = input<boolean>(false);
  disabled = input<boolean>(false);

  chipClick = output<Event>();
  removeClick = output<Event>();
  customStyles = input<{[key: string]: string}>({});

  chipStyles = computed(() => {
    const styles: any = { ...this.customStyles() };
    if (styles['backgroundColor']) {
      styles['--theme-bg'] = styles['backgroundColor'];
    }
    if (styles['color']) {
      styles['--theme-color'] = styles['color'];
    }
    return styles;
  });

  chipClasses = computed(() => {
    const classes = ['chip'];
    classes.push(`chip-${this.variant()}`);
    if (this.rounded() !== 'none') {
      classes.push(`chip-rounded-${this.rounded()}`);
    }
    classes.push(`chip-${this.size()}`);
    if (this.dark()) {
      classes.push('dark');
    }
    if (this.selected()) {
      classes.push('chip-selected');
    }
    if (this.disabled()) {
      classes.push('chip-disabled');
    }
    return classes.join(' ');
  });

  handleClick(event: Event) {
    if (!this.disabled()) {
      this.chipClick.emit(event);
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (!this.disabled() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.chipClick.emit(event);
    }
  }

  handleRemove(event: Event) {
    if (!this.disabled()) {
      event.stopPropagation();
      this.removeClick.emit(event);
    }
  }

  handleRemoveKeyUp(event: KeyboardEvent) {
    if (!this.disabled() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.stopPropagation();
      this.removeClick.emit(event);
    }
  }
}
