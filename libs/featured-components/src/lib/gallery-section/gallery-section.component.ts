import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GallerySectionImage {
  src: string;
  alt: string;
  category?: string;
}

export interface GallerySectionCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-gallery-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-section.component.html',
  styleUrls: ['./gallery-section.component.scss']
})
export class UIGallerySectionComponent {
  title = input('Galería de Proyectos');
  subtitle = input('Explora nuestro trabajo reciente.');
  variant = input('default');
  customStyles = input<GallerySectionCustomStyles>({});
  images = input<GallerySectionImage[]>([
    { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', alt: 'Proyecto 1' },
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', alt: 'Proyecto 2' },
    { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', alt: 'Proyecto 3' },
    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', alt: 'Proyecto 4' }
  ]);

  galleryStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  containerClasses = computed(() => `gallery-container gallery--${this.variant()}`);
}

