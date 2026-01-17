import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIGalleryComponent, CardVariant, GalleryImage } from '@negocio/ui-components';

@Component({
  selector: 'lib-gallery-section',
  standalone: true,
  imports: [CommonModule, UIGalleryComponent],
  template: `
    <div class="gallery-container">
      <div class="gallery-header">
        <h2 class="gallery-title">Nuestra Galería</h2>
        <p class="gallery-subtitle">Explora nuestro trabajo y descubre la calidad que ofrecemos</p>
      </div>
      <div class="gallery-content">
        <lib-ui-components-ui-gallery
          [variant]="variant"
          [images]="images"
          [autoSlide]="false"
          class="gallery-component"
        ></lib-ui-components-ui-gallery>
      </div>
    </div>
  `,
  styles: [
    `
      .gallery-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      }
      
      .gallery-header {
        text-align: center;
        margin-bottom: 2rem;
        padding: 1rem;
      }
      
      .gallery-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #2d3748;
        margin-bottom: 0.5rem;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .gallery-subtitle {
        font-size: 1.125rem;
        color: #718096;
        margin: 0;
      }
      
      .gallery-content {
        padding: 1rem;
        border-radius: 12px;
        background: white;
      }
      
      .gallery-component {
        border-radius: 12px;
        overflow: hidden;
      }
      
      @media (max-width: 768px) {
        .gallery-container {
          padding: 1rem;
        }
        
        .gallery-title {
          font-size: 2rem;
        }
      }
    `
  ]
})
export class GallerySectionComponent {
  @Input() variant: CardVariant = 'default';
  @Input() images: GalleryImage[] = [];
}