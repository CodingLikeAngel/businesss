import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIButtonComponent } from '../../button/button.component';
import { variants as baseVariants } from '../../models/ui-components-data.model';

export const animatedCardVariants = [
  ...baseVariants,
  'default', 'product-3d', 'product-hover', 'guide', 'normativa', 'feature', 
  'reversible', 'minimal', 'ne-animated', 'river', 'glass',
  'mario', 'zelda', 'kirby', 'rayman', 'lum'
] as const;

export type AnimatedCardVariant = typeof animatedCardVariants[number];
export type AnimatedCardAnimation = 'bounce' | 'pulse' | 'float' | 'spin' | 'none';

export interface AnimatedCardCustomStyles {
  card?: string | string[] | { [key: string]: boolean };
  host?: { [key: string]: string };
  [key: string]: string | string[] | { [key: string]: boolean } | { [key: string]: string } | undefined;
}

@Component({
  selector: 'lib-ui-card-animated',
  standalone: true,
  imports: [CommonModule, UIButtonComponent],
  templateUrl: './card-animated.component.html',
  styleUrls: ['./card-animated.component.scss'],
})
export class UICardAnimatedComponent {
  @Input() icon? = '🌟';
  @Input() title = 'Título';
  @Input() id = 'id';
  @Input() subtitle = '';
  @Input() description = 'Descripción breve de la tarjeta.';
  @Input() variant: AnimatedCardVariant | string = 'default';
  @Input() borderColor = '#22d3ee';
  @Input() textColor = '#f8fafc';
  @Input() backgroundColor = 'rgba(47, 79, 79, 0.9)';
  @Input() hoverColor = '#ffd700';
  @Input() animation: AnimatedCardAnimation = 'bounce';
  @Input() animationDelay = '0s';
  @Input() image?: string;
  @Input() price?: number;
  @Input() tags?: string[] = [];
  @Input() avatar = '';
  @Input() rating = 0;
  @Input() link = '';
  @Input() customStyles: AnimatedCardCustomStyles = {};
  @Input() frontContent?: { image?: string; title: string } = { title: '' };
  @Input() backContent?: { description: string; comestible?: boolean } = { description: '' };
  @Input() dark = false;

  @Output() addToCart = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<any>();

  isHovered = false;
  isFlipped = false;

  @HostBinding('class') get hostClasses() {
    return [
      'card-animated',
      `card-animated--${this.variant}`,
      this.dark ? 'card-animated--dark' : '',
      `card-animated--animation-${this.animation}`,
      this.customStyles['card'] || '',
    ].filter(Boolean);
  }

  @HostBinding('style') get hostStyles() {
    return {
      '--border-color': this.borderColor,
      '--text-color': this.textColor,
      '--background-color': this.backgroundColor,
      '--hover-color': this.hoverColor,
      ...this.customStyles['host'],
    };
  }

  onHover(hovered: boolean): void {
    this.isHovered = hovered;
  }

  onAddToCart(): void {
    this.addToCart.emit();
  }

  onViewDetails(): void {
    this.viewDetails.emit({
      title: this.title,
      description: this.description,
      subtitle: this.subtitle,
      link: this.link,
      icon: this.icon,
      id: this.id,
    });
  }

  toggleFlip(event: MouseEvent | KeyboardEvent): void {
    if (event.type === 'click' || (event instanceof KeyboardEvent && (event.key === 'Enter' || event.key === ' '))) {
      this.isFlipped = !this.isFlipped;
    }
  }
}
