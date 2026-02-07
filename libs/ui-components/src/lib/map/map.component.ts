import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface MapCustomStyles {
  borderRadius?: string;
  boxShadow?: string;
  filter?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container" [ngStyle]="containerStyles()">
      <iframe
        [src]="safeUrl()"
        width="100%"
        height="100%"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <div class="map-overlay" *ngIf="showOverlay()"></div>
    </div>
  `,
  styles: [`
    .map-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      min-height: 300px;
      background: #f0f0f0;
      transition: all 0.3s ease;
    }
    .map-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      background: rgba(0,0,0,0);
      pointer-events: none;
    }
  `]
})
export class UIMapComponent {
  address = input<string>('Madrid, Spain');
  zoom = input<number>(14);
  customStyles = input<MapCustomStyles>({});
  showOverlay = input<boolean>(false);

  constructor(private sanitizer: DomSanitizer) {}

  safeUrl = computed<SafeResourceUrl>(() => {
    const encodedAddress = encodeURIComponent(this.address());
    const url = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=${this.zoom()}&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  containerStyles = computed(() => ({
    'border-radius': this.customStyles().borderRadius || '16px',
    'box-shadow': this.customStyles().boxShadow || '0 10px 30px rgba(0,0,0,0.15)',
    'filter': this.customStyles().filter || 'none'
  }));
}
