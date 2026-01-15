import { Component, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { GlitchEffectPipe } from "./pipes/glitch-effect.pipe";
import { HighlightEffectPipe } from "./pipes/highlight-effect.pipe";
import { variants } from '../../models/ui-components-data.model';

// Tipos y constantes
export const cardVariants = variants;
export type CardVariant = typeof cardVariants[number];
export type CardAnimation = 'none' | 'fade' | 'slide-up' | 'zoom' | 'glitch' | 'pulse';
export type CardSize = 'small' | 'medium' | 'large';

export interface CustomStyles {
  '--card-bg'?: string;
  '--card-color'?: string;
  '--card-border'?: string;
  '--card-shadow'?: string;
  '--card-hover-bg'?: string;
  '--card-hover-shadow'?: string;
  '--card-overlay-opacity'?: string;
}

export interface UICardAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

@Component({
  selector: 'lib-ui-components-card',
  standalone: true,
  imports: [CommonModule, GlitchEffectPipe, HighlightEffectPipe],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cardHover', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms cubic-bezier(0.23, 1, 0.32, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('imageParallax', [
      transition('void => *', [
        style({ transform: 'translateZ(0) scale(1)' }),
        animate('600ms ease-out', style({ transform: 'translateZ(20px) scale(1.1)' }))
      ])
    ])
  ]
})
export class UICardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() image?: string;
  @Input() title = 'Card Title';
  @Input() description = 'This is a description for the card.';
  @Input() actions: UICardAction[] = [];
  @Input() animation: CardAnimation = 'none';
  @Input() size: CardSize = 'medium';
  @Input() customStyles: CustomStyles = {};
  isHovered = false;

  @HostBinding('class') get hostClasses() {
    return [
      'card',
      `card--${this.variant}`,
      this.image ? 'card--with-image' : '',
      `card--animation-${this.animation}`,
      `card--size-${this.size}`,
      this.isHovered ? 'card--hovered' : ''
    ].filter(Boolean);
  }

  @HostBinding('style') get hostStyles() {
    return { ...this.customStyles, '--card-overlay-opacity': this.isHovered ? '0.3' : '0' };
  }

  get cardClasses(): string[] {
    return ['card', `card--${this.variant}`, `card--size-${this.size}`];
  }

  get contentClasses(): string[] {
    return ['card-content', this.isHovered ? 'card-content--hovered' : ''];
  }

  get imageClasses(): string[] {
    return ['card-image', this.isHovered ? 'card-image--parallax' : ''];
  }

  actionClasses(index: number): string[] {
    const action = this.actions[index];
    return ['card-action', `card-action--${action.variant || 'default'}`];
  }

  onHover() {
    this.isHovered = true;
  }

  onLeave() {
    this.isHovered = false;
  }

  handleAction(action: UICardAction) {
    if (action.onClick) {
      action.onClick();
    }
  }
}
