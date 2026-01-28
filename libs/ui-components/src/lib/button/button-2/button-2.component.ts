import { Component, input, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroStar, heroRocketLaunch, heroArrowRight } from '@ng-icons/heroicons/outline';
import { variants as globalVariants } from '../../models/ui-components-data.model';

// Variantes específicas del botón-2 (Bold/Prominent)
export const button2SpecificVariants = ['icon-only', 'text-only', 'glass'] as const;

// Combinamos variantes globales y específicas
export const baseButton2Variants = [...globalVariants, ...button2SpecificVariants] as const;
type BaseButton2Variant = typeof baseButton2Variants[number];

// Interfaz para estilos personalizados
export interface Button2CustomStyles {
  backgroundColor?: string;
  color?: string;
  '--btn-bg'?: string;
  '--btn-color'?: string;
  '--btn-border'?: string;
  '--btn-hover-bg'?: string;
  '--btn-hover-shadow'?: string;
  '--btn-disabled-bg'?: string;
  '--btn-disabled-color'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-button-2',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroStar, heroRocketLaunch, heroArrowRight })],
  templateUrl: './button-2.component.html',
  styleUrl: './button-2.component.scss',
})
export class UIButton2Component {
  variant = input<BaseButton2Variant | string>('primary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  leadingIcon = input<string | undefined>(undefined);
  trailingIcon = input<string | undefined>(undefined);
  ariaLabel = input<string | undefined>(undefined);
  disabled = input<boolean>(false);
  customStyles = input<Button2CustomStyles>({});
  loading = input<boolean>(false);
  expanded = input<boolean | undefined>(undefined);
  pressed = input<boolean | undefined>(undefined);
  soundUrl = input<string | undefined>(undefined);
  haptic = input<boolean>(false);

  rippleActive = false;

  buttonStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--btn-bg'] = customStyles['backgroundColor'];
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--btn-color'] = customStyles['color'];
      styles['--theme-color'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  buttonClick = output<Event>();

  buttonClasses = computed(() => {
    const classes = ['btn-2', `btn-2-${this.variant()}`];
    if (this.rounded() !== 'none') classes.push(`btn-2-rounded-${this.rounded()}`);
    classes.push(`btn-2-${this.size()}`);
    if (this.dark()) classes.push('dark');
    if (this.disabled()) classes.push('btn-2-disabled');
    if (this.rounded() === 'full' && !this.leadingIcon() && !this.trailingIcon()) classes.push('no-icons');
    return classes.join(' ');
  });

  handleClick(event: Event) {
    if (!this.disabled()) {
      this.buttonClick.emit(event);
      this.rippleActive = true;
      setTimeout(() => this.rippleActive = false, 600);
      if (this.soundUrl()) {
        const audio = new Audio(this.soundUrl());
        audio.play();
      }
      if (this.haptic() && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  }

  getIconType(icon: string | undefined): 'ng-icon' | 'svg' | 'text' {
    if (!icon) return 'text';
    if (icon.startsWith('<svg')) return 'svg';
    if (icon.startsWith('hero')) return 'ng-icon';
    return 'text';
  }
}
