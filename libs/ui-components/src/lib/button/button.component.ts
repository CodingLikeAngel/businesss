import { Component, input, computed, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroStar, heroRocketLaunch, heroArrowRight } from '@ng-icons/heroicons/outline';
import { variants as globalVariants } from '../models/ui-components-data.model';

// Variantes específicas del botón
export const buttonSpecificVariants = ['icon-only', 'text-only'] as const;

// Combinamos variantes globales y específicas
export const baseButtonVariants = [...globalVariants, ...buttonSpecificVariants] as const;
type BaseButtonVariant = typeof baseButtonVariants[number];

// Interfaz para estilos personalizados (solo para variantes nuevas del padre)
export interface ButtonCustomStyles {
  '--btn-bg'?: string;
  '--btn-color'?: string;
  '--btn-border'?: string;
  '--btn-hover-bg'?: string;
  '--btn-hover-shadow'?: string;
  '--btn-disabled-bg'?: string;
  '--btn-disabled-color'?: string;
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
    if (!this.disabled()) this.buttonClick.emit(event);
  }

  isIconClass(icon: string | undefined): boolean {
    return icon?.startsWith('hero') || false;
  }
}