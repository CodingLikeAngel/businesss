import { Component, input, computed, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroStar, heroRocketLaunch, heroArrowRight } from '@ng-icons/heroicons/outline';
import { variants as globalVariants } from '../models/ui-components-data.model';

// Variantes específicas del botón
export const buttonSpecificVariants = ['icon-only', 'text-only', 'glass'] as const;

// Combinamos variantes globales y específicas
export const baseButtonVariants = [...globalVariants, ...buttonSpecificVariants] as const;
type BaseButtonVariant = typeof baseButtonVariants[number];

// Interfaz para estilos personalizados (solo para variantes nuevas del padre)
export interface ButtonCustomStyles {
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
  selector: 'lib-ui-components-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroStar, heroRocketLaunch, heroArrowRight })],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class UIButtonComponent {
  variant = input<BaseButtonVariant | string>('secondary');
  rounded = input<'none' | 'md' | 'full'>('none');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  leadingIcon = input<string | undefined>(undefined);
  trailingIcon = input<string | undefined>(undefined);
  ariaLabel = input<string | undefined>(undefined);
  disabled = input<boolean>(false);
  customStyles = input<ButtonCustomStyles>({}); // Solo para variantes personalizadas
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
    const classes = ['btn', `btn-${this.variant()}`];
    if (this.rounded() !== 'none') classes.push(`btn-rounded-${this.rounded()}`);
    classes.push(`btn-${this.size()}`);
    if (this.dark()) classes.push('dark');
    if (this.disabled()) classes.push('btn-disabled');
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
