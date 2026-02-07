import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'blob' | 'wave' | 'custom';

export interface ShapeCustomStyles {
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  filter?: string;
  opacity?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-shape',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="shape-container" [ngStyle]="shapeStyles()">
      <svg [attr.viewBox]="viewBox()" preserveAspectRatio="none" class="shape-svg">
        <path [attr.d]="pathData()" 
              [attr.fill]="customStyles().fill || 'currentColor'"
              [attr.stroke]="customStyles().stroke || 'none'"
              [attr.stroke-width]="customStyles().strokeWidth || '0'" />
      </svg>
    </div>
  `,
  styles: [`
    .shape-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
    }
    .shape-svg {
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `]
})
export class UIShapeComponent {
  type = input<ShapeType>('circle');
  customPath = input<string | undefined>(undefined);
  customStyles = input<ShapeCustomStyles>({});
  
  viewBox = computed(() => {
    if (this.type() === 'blob' || this.type() === 'wave') return '0 0 200 200';
    return '0 0 100 100';
  });

  pathData = computed(() => {
    if (this.customPath()) return this.customPath()!;
    
    switch (this.type()) {
      case 'circle': return 'M 50, 50 m -50, 0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0';
      case 'square': return 'M 0,0 L 100,0 L 100,100 L 0,100 Z';
      case 'triangle': return 'M 50,0 L 100,100 L 0,100 Z';
      case 'blob': return 'M44.7,-76.4C58.3,-69.2,70.1,-57.4,77.6,-43.3C85.2,-29.2,88.5,-12.7,86.6,3.3C84.7,19.3,77.7,34.8,67.6,47.4C57.5,60,44.4,69.7,29.9,75.4C15.4,81.1,-0.5,82.8,-16.1,79.8C-31.7,76.8,-47,69.1,-58.5,57.4C-70.1,45.7,-77.9,30,-81.4,13.4C-84.9,-3.2,-84.1,-20.7,-76.3,-35.3C-68.5,-49.9,-53.7,-61.6,-38.6,-68.1C-23.5,-74.6,-8.2,-75.9,5.7,-85.8C19.7,-95.6,31.1,-83.6,44.7,-76.4Z';
      case 'wave': return 'M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,101.3C960,107,1056,181,1152,186.7C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z';
      default: return '';
    }
  });

  shapeStyles = computed(() => {
    const s = { ...this.customStyles() };
    if (this.customStyles().filter) s['filter'] = this.customStyles().filter;
    if (this.customStyles().opacity) s['opacity'] = this.customStyles().opacity;
    return s;
  });
}
