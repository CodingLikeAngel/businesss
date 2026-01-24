import { Component, input, output, HostBinding, computed } from '@angular/core';
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
export type AnimatedCardAnimation = 'bounce' | 'pulse' | 'float' | 'spin' | 'glitch' | 'fade' | 'slide' | 'none';

export interface AnimatedCardCustomStyles {
  backgroundColor?: string;
  color?: string;
  card?: string | string[] | { [key: string]: boolean };
  host?: { [key: string]: string };
  [key: string]: string | string[] | { [key: string]: boolean } | { [key: string]: string } | undefined;
}

@Component({
  selector: 'lib-ui-components-card-animated',
  standalone: true,
  imports: [CommonModule, UIButtonComponent],
  templateUrl: './card-animated.component.html',
  styleUrls: ['./card-animated.component.scss'],
})
export class UICardAnimatedComponent {
  icon = input('🌟');
  title = input('Título');
  id = input('id');
  subtitle = input('');
  description = input('Descripción breve de la tarjeta.');
  variant = input<AnimatedCardVariant | string>('default');
  borderColor = input('#22d3ee');
  textColor = input('#f8fafc');
  backgroundColor = input('rgba(47, 79, 79, 0.9)');
  hoverColor = input('#ffd700');
  animation = input<AnimatedCardAnimation>('bounce');
  animationDelay = input('0s');
  image = input<string | undefined>(undefined);
  price = input<number | undefined>(undefined);
  tags = input<string[]>([]);
  avatar = input('');
  rating = input(0);
  link = input('');
  customStyles = input<AnimatedCardCustomStyles>({});
  frontContent = input<{ image?: string; title: string }>({ title: '' });
  backContent = input<{ description: string; comestible?: boolean }>({ description: '' });
  dark = input(false);

  addToCart = output<void>();
  viewDetails = output<any>();

  isHovered = false;
  isFlipped = false;

  @HostBinding('class') get hostClasses() {
    return [
      'card-animated',
      `card-animated--${this.variant()}`,
      this.dark() ? 'card-animated--dark' : '',
      `card-animated--animation-${this.animation()}`,
      this.customStyles()['card'] || '',
    ].filter(Boolean);
  }

  @HostBinding('style') get hostStyles() {
    return {
      '--border-color': this.borderColor(),
      '--text-color': this.textColor(),
      '--background-color': this.backgroundColor(),
      '--hover-color': this.hoverColor(),
      ...this.componentStyles(),
      ...(this.customStyles()['host'] as Record<string, string> || {}),
    };
  }

  componentStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    // Default robustness
    styles['box-sizing'] = 'border-box';
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
      styles['--background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
      styles['--text-color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color' && key !== 'card' && key !== 'host') {
        const cssKey = key.startsWith('--') ? key : key.replace(/([A-Z])/g, '-$1').toLowerCase();
        styles[cssKey] = customStyles[key];
      }
    });
    
    return styles;
  });

  onHover(hovered: boolean): void {
    this.isHovered = hovered;
  }

  onAddToCart(): void {
    this.addToCart.emit();
  }

  onViewDetails(): void {
    this.viewDetails.emit({
      title: this.title(),
      description: this.description(),
      subtitle: this.subtitle(),
      link: this.link(),
      icon: this.icon(),
      id: this.id(),
    });
  }

  toggleFlip(event: MouseEvent | KeyboardEvent): void {
    if (event.type === 'click' || (event instanceof KeyboardEvent && (event.key === 'Enter' || event.key === ' '))) {
      this.isFlipped = !this.isFlipped;
    }
  }
}
