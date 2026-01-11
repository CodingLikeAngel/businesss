import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GallerySectionImage {
  src: string;
  alt: string;
  category?: string;
}

@Component({
  selector: 'lib-ui-components-gallery-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-section.component.html',
  styleUrls: ['./gallery-section.component.scss']
})
export class UIGallerySectionComponent {
  @Input() title = 'Galería de Proyectos';
  @Input() subtitle = 'Explora nuestro trabajo reciente.';
  @Input() variant: 'default' | 'glass' = 'default';
  @Input() images: GallerySectionImage[] = [
    { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', alt: 'Proyecto 1' },
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', alt: 'Proyecto 2' },
    { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', alt: 'Proyecto 3' },
    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', alt: 'Proyecto 4' }
  ];

  get containerClasses(): string {
    return `gallery-container gallery--${this.variant}`;
  }
}
