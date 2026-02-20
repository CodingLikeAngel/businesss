import { Component, input, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark, heroCheck } from '@ng-icons/heroicons/outline';
import { variants as baseVariants } from '../../models/ui-components-data.model';

// Variantes específicas del chip-3 (Modern/Sleek)
const specificChip3Variants = ['magic-spark'] as const;

// Combinamos variantes globales con específicas
export const chip3Variants = [...baseVariants, ...specificChip3Variants] as const;
export type Chip3VariantType = typeof chip3Variants[number] | (string & {});

export interface Chip3CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-chip-3',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroXMark, heroCheck })],
  templateUrl: './chip-3.component.html',
  styleUrl: './chip-3.component.scss',
})
export class UIChip3Component {
  variant = input<Chip3VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
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
  customStyles = input<Chip3CustomStyles>({});

  chipStyles = computed(() => {
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

  chipClasses = computed(() => {
    const classes = ['chip-3'];
    classes.push(`chip-3-${this.variant()}`);
    if (this.rounded() !== 'none') {
      classes.push(`chip-3-rounded-${this.rounded()}`);
    }
    classes.push(`chip-3-${this.size()}`);
    if (this.dark()) {
      classes.push('dark');
    }
    if (this.selected()) {
      classes.push('chip-3-selected');
    }
    if (this.disabled()) {
      classes.push('chip-3-disabled');
    }
    
    const variantSystem = this.variantSystem();
    if (variantSystem) {
      classes.push(`chip-3-${variantSystem}`);
    }
    
    if (this.multiSelected()) {
      classes.push('chip-3-multi-selected');
    }
    
    return classes.join(' ');
  });

  handleClick(event: Event) {
    if (!this.disabled()) {
      const chipElement = (event.target as HTMLElement).closest('.chip-3');
      if (chipElement && this.interactive()) {
        const rect = chipElement.getBoundingClientRect();
        const x = event instanceof MouseEvent ? event.clientX - rect.left : rect.width / 2;
        const y = event instanceof MouseEvent ? event.clientY - rect.top : rect.height / 2;
        
        const ripple = document.createElement('span');
        ripple.classList.add('chip-3-ripple-effect');
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
      const chipElement = (event.target as HTMLElement).closest('.chip-3');
      if (chipElement) {
        chipElement.classList.add('chip-3-remove-animation');
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
