import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DeepFooterCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-deep-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deep-footer.component.html',
  styleUrl: './deep-footer.component.scss',
})
export class UIDeepFooterComponent {
  theme = input<string>('theme-mario');
  customStyles = input<DeepFooterCustomStyles>({});

  deepFooterStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
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
}

