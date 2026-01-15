import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIGalleryComponent, CardVariant, GalleryImage } from '@negocio/ui-components';

@Component({
  selector: 'lib-gallery-section',
  standalone: true,
  imports: [CommonModule, UIGalleryComponent],
  template: `
    <div class="p-4">
      <lib-ui-ui-gallery
        [variant]="variant"
        [images]="images"
        [autoSlide]="false"
      ></lib-ui-ui-gallery>
    </div>
  `,
})
export class GallerySectionComponent {
  @Input() variant: CardVariant = 'default';
  @Input() images: GalleryImage[] = [];
}