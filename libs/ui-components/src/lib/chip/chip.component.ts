// chip.component.ts (Hijo - UIChipComponent)
import { Component, input, computed, output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark, heroCheck } from '@ng-icons/heroicons/outline';
import { variants as baseVariants } from '../models/ui-components-data.model';
import { mergeCustomStyles } from '../models/merge-custom-styles.util';

// Variantes específicas del componente hijo
const specificChipVariants = ['magic-spark'] as const;

// Combinamos variantes globales con específicas
export const chipVariants = [...baseVariants, ...specificChipVariants] as const;
export type ChipVariantType = typeof chipVariants[number] | (string & {});

export interface ChipCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-chip',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroXMark, heroCheck })],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIChipComponent {
  variant = input<ChipVariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('full');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  removable = input<boolean>(false);
  selected = input<boolean>(false);
  disabled = input<boolean>(false);
  interactive = input<boolean>(true);
  avatarSrc = input<string>('');
  iconName = input<string>('');
  variantSystem = input<'filled' | 'outlined' | 'ghost'>('filled');
  multiSelected = input<boolean>(false);

  chipClick = output<Event>();
  removeClick = output<Event>();
  customStyles = input<ChipCustomStyles>({});

  chipStyles = computed(() => mergeCustomStyles(this.customStyles(), 'chip'));

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
    
    // Add variant system classes
    const variantSystem = this.variantSystem();
    if (variantSystem) {
      classes.push(`chip-${variantSystem}`);
    }
    
    // Add multi-selected class if needed
    if (this.multiSelected()) {
      classes.push('chip-multi-selected');
    }
    
    return classes.join(' ');
  });

  handleClick(event: Event) {
    if (!this.disabled()) {
      const chipElement = (event.target as HTMLElement).closest('.chip');
      if (chipElement && this.interactive()) {
        const rect = chipElement.getBoundingClientRect();
        const x = event instanceof MouseEvent ? event.clientX - rect.left : rect.width / 2;
        const y = event instanceof MouseEvent ? event.clientY - rect.top : rect.height / 2;
        
        const ripple = document.createElement('span');
        ripple.classList.add('chip-ripple-effect');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        chipElement.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
          ripple.remove();
        }, { once: true });
      }
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
      const chipElement = (event.target as HTMLElement).closest('.chip');
      if (chipElement) {
        chipElement.classList.add('chip-remove-animation');
        chipElement.addEventListener('animationend', () => {
          this.removeClick.emit(event);
        }, { once: true });
      } else {
        this.removeClick.emit(event);
      }
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
