import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ShowcaseLayout = 'vertical' | 'horizontal' | 'centered';
export type ShowcaseVariant = 'default' | 'glass' | 'neon' | 'cyberpunk' | 'minimal';

export interface ShowcaseCustomStyles {
  iconColor?: string;
  titleColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-showcase-atom',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="showcaseClasses()" [style]="showcaseStyles()">
      <div class="showcase-icon-container" *ngIf="icon()">
        <span class="showcase-icon">{{ icon() }}</span>
      </div>
      <div class="showcase-content">
        <h4 class="showcase-title" *ngIf="title()">{{ title() }}</h4>
        <p class="showcase-text" *ngIf="text()">{{ text() }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .showcase-atom {
      padding: 1.5rem;
      border-radius: 1rem;
      transition: all 0.3s ease;
      display: flex;
      gap: 1.25rem;
      background: var(--showcase-bg, transparent);
      border: 1px solid var(--showcase-border, transparent);
    }

    /* Layouts */
    .showcase-layout-vertical { flex-direction: column; }
    .showcase-layout-centered { flex-direction: column; align-items: center; text-align: center; }
    .showcase-layout-horizontal { flex-direction: row; align-items: flex-start; }

    .showcase-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      min-width: 3.5rem;
      height: 3.5rem;
      background: var(--showcase-icon-bg, rgba(99, 102, 241, 0.1));
      color: var(--showcase-icon-color, #6366f1);
      border-radius: 0.75rem;
      transition: transform 0.3s ease;
    }

    .showcase-atom:hover .showcase-icon-container {
      transform: scale(1.1);
    }

    .showcase-content { flex: 1; }
    .showcase-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--showcase-title-color, #1e293b);
    }
    .showcase-text {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--showcase-text-color, #64748b);
    }

    /* Variants */
    .showcase-variant-glass {
      backdrop-filter: blur(8px);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      --showcase-title-color: #fff;
      --showcase-text-color: rgba(255, 255, 255, 0.7);
    }

    .showcase-variant-neon {
      background: #000;
      border: 1px solid #00f3ff;
      box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
      --showcase-icon-color: #00f3ff;
      --showcase-title-color: #00f3ff;
      --showcase-text-color: #fff;
    }

    .showcase-variant-cyberpunk {
      background: #f3f315;
      clip-path: polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%);
      --showcase-icon-color: #000;
      --showcase-title-color: #000;
      --showcase-text-color: #333;
    }
  `]
})
export class UIShowcaseAtomComponent {
  icon = input<string>('✨');
  title = input<string>('Título del Showcase');
  text = input<string>('Descripción corta del elemento showcase para explicar sus beneficios.');
  layout = input<ShowcaseLayout>('vertical');
  variant = input<ShowcaseVariant>('default');
  customStyles = input<ShowcaseCustomStyles>({});

  showcaseClasses = computed(() => {
    return [
      'showcase-atom',
      `showcase-layout-${this.layout()}`,
      `showcase-variant-${this.variant()}`
    ].join(' ');
  });

  showcaseStyles = computed(() => {
    const s = this.customStyles();
    const styles: any = {};
    if (s.backgroundColor) styles['--showcase-bg'] = s.backgroundColor;
    if (s.borderColor) styles['--showcase-border'] = s.borderColor;
    if (s.iconColor) styles['--showcase-icon-color'] = s.iconColor;
    if (s.titleColor) styles['--showcase-title-color'] = s.titleColor;
    if (s.textColor) styles['--showcase-text-color'] = s.textColor;
    if (s.borderRadius) styles['border-radius'] = s.borderRadius;
    
    // Add raw styles
    Object.keys(s).forEach(key => {
      if (!['iconColor', 'titleColor', 'textColor', 'backgroundColor', 'borderColor', 'borderRadius'].includes(key)) {
        styles[key] = s[key];
      }
    });
    
    return styles;
  });
}
