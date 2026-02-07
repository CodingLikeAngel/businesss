import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';

export const spacerVariants = [...baseVariants, 'decorative', 'empty', 'gradient'] as const;
export type SpacerVariantType = typeof spacerVariants[number] | (string & {});

export interface SpacerCustomStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  height?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-spacer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spacer.component.html',
  styleUrls: ['./spacer.component.scss'],
})
export class UISpacerComponent {
  variant = input<SpacerVariantType>('empty');
  height = input<string | number>('50px');
  customStyles = input<SpacerCustomStyles>({});

  spacerClasses = computed(() => {
    const classes = ['spacer', `spacer-${this.variant()}`];
    return classes.join(' ');
  });

  spacerStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    const h = this.height();

    // Height management
    styles['height'] = typeof h === 'number' ? `${h}px` : h;
    styles['min-height'] = styles['height'];

    // Customs
    if (customStyles['backgroundColor']) {
      styles['background-color'] = customStyles['backgroundColor'];
    }
    if (customStyles['backgroundImage']) {
      styles['background-image'] = customStyles['backgroundImage'];
    }

    // Merge others
    Object.keys(customStyles).forEach(key => {
      if (!['backgroundColor', 'backgroundImage', 'height'].includes(key)) {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });
}
