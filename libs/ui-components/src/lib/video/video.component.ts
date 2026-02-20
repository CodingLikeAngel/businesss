import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface VideoCustomStyles {
  opacity?: string;
  overlayColor?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  filter?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-video',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-container" [ngStyle]="containerStyles()">
      <div class="video-overlay" [ngStyle]="overlayStyles()"></div>
      <video
        [src]="src()"
        [autoplay]="autoplay()"
        [loop]="loop()"
        [muted]="muted()"
        playsinline
        class="video-element"
        [ngStyle]="videoStyles()"
      ></video>
    </div>
  `,
  styles: [`
    .video-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000;
    }
    .video-element {
      width: 100%;
      height: 100%;
      display: block;
    }
    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      pointer-events: none;
    }
  `]
})
export class UIVideoComponent {
  src = input<string>('');
  autoplay = input<boolean>(true);
  loop = input<boolean>(true);
  muted = input<boolean>(true);
  customStyles = input<VideoCustomStyles>({});

  containerStyles = computed(() => ({
    opacity: this.customStyles().opacity || '1',
    filter: this.customStyles().filter || 'none'
  }));

  overlayStyles = computed(() => ({
    background: this.customStyles().overlayColor || 'transparent'
  }));

  videoStyles = computed(() => ({
    'object-fit': this.customStyles().objectFit || 'cover'
  }));
}
