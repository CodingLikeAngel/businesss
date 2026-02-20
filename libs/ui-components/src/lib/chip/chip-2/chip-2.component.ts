import { Component, input, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark, heroCheck } from '@ng-icons/heroicons/outline';
import { variants as baseVariants } from '../../models/ui-components-data.model';

// Variantes específicas del chip-2 (Bold/Prominent)
const specificChip2Variants = ['magic-spark'] as const;

// Combinamos variantes globales con específicas
export const chip2Variants = [...baseVariants, ...specificChip2Variants] as const;
export type Chip2VariantType = typeof chip2Variants[number] | (string & {});

export interface Chip2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-chip-2',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroXMark, heroCheck })],
  templateUrl: './chip-2.component.html',
  styleUrl: './chip-2.component.scss',
})
export class UIChip2Component {
  variant = input<Chip2VariantType>('primary');
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
  customStyles = input<Chip2CustomStyles>({});

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
    const classes = ['chip-2'];
    classes.push(`chip-2-${this.variant()}`);
    if (this.rounded() !== 'none') {
      classes.push(`chip-2-rounded-${this.rounded()}`);
    }
    classes.push(`chip-2-${this.size()}`);
    if (this.dark()) {
      classes.push('dark');
    }
    if (this.selected()) {
      classes.push('chip-2-selected');
    }
    if (this.disabled()) {
      classes.push('chip-2-disabled');
    }
    
    const variantSystem = this.variantSystem();
    if (variantSystem) {
      classes.push(`chip-2-${variantSystem}`);
    }
    
    if (this.multiSelected()) {
      classes.push('chip-2-multi-selected');
    }
    
    return classes.join(' ');
  });

  handleClick(event: Event) {
    if (!this.disabled()) {
      const chipElement = (event.target as HTMLElement).closest('.chip-2');
      if (chipElement && this.interactive()) {
        const rect = chipElement.getBoundingClientRect();
        const x = event instanceof MouseEvent ? event.clientX - rect.left : rect.width / 2;
        const y = event instanceof MouseEvent ? event.clientY - rect.top : rect.height / 2;
        
        const ripple = document.createElement('span');
        ripple.classList.add('chip-2-ripple-effect');
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
      const chipElement = (event.target as HTMLElement).closest('.chip-2');
      if (chipElement) {
        chipElement.classList.add('chip-2-remove-animation');
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
