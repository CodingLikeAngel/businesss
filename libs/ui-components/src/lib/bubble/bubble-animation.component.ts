import { Component, AfterViewInit, ElementRef, ViewChild, HostBinding, Inject, PLATFORM_ID, ViewEncapsulation, OnDestroy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';



export const bubbleVariants = [
  ...baseVariants,
  'default',
  'primary',
  'secondary',
  'jungle',
  'aqua',
  'plasma',
  'cosmic',
  'vaporwave',
  'aurora'
] as const;


export type BubbleVariant = typeof bubbleVariants[number];

export interface BubbleConfig {
  variant: string;
  speed?: number;
  blur?: number;
  opacity?: number;
}



@Component({
  selector: 'lib-bubble-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubble-animation.component.html',
  styleUrls: ['./bubble-animation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BubbleAnimationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('interactiveBubble') interactiveBubble!: ElementRef<HTMLDivElement>;

  config = input<BubbleConfig>({
    speed: 1,
    blur: 40,
    opacity: 0.8,
    variant: 'default'
  });

  variant = input<BubbleVariant>('default');

  hostClasses = computed(() => {
    const v = this.variant();
    const effectiveVariant = bubbleVariants.includes(v) ? v : 'default';
    return ['bubble-container', `bubble--${effectiveVariant}`].join(' ');
  });

  hostStyles = computed(() => ({
      '--bubble-blur': `${this.config().blur ?? 40}px`,
      '--bubble-opacity': this.config().opacity ?? 0.8,
      '--bubble-speed': this.config().speed ?? 1
  }));

  @HostBinding('class') get hostClass() {
    return this.hostClasses();
  }

  @HostBinding('style') get hostStyle() {
    return this.hostStyles();
  }

  private curX = 0;
  private curY = 0;
  private tgX = 0;
  private tgY = 0;
  private rafId: number | null = null;
  private mouseHandler: ((e: MouseEvent) => void) | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnimation();
    }
  }

  ngOnDestroy(): void {
    if (this.mouseHandler && typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.mouseHandler);
      this.mouseHandler = null;
    }
    if (this.rafId != null && typeof window !== 'undefined') {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private initializeAnimation() {
    if (typeof window === 'undefined') return;
    this.mouseHandler = (event: MouseEvent) => {
      this.tgX = event.clientX;
      this.tgY = event.clientY;
    };
    window.addEventListener('mousemove', this.mouseHandler);

    this.move();
  }

  private move() {
    if (!this.config) return;
    this.curX += (this.tgX - this.curX) / (20 / (this.config().speed || 1));
    this.curY += (this.tgY - this.curY) / (20 / (this.config().speed || 1));

    if (this.interactiveBubble) {
      this.interactiveBubble.nativeElement.style.transform = 
        `translate(${Math.round(this.curX)}px, ${Math.round(this.curY)}px)`;
    }

    if (typeof window !== 'undefined') {
      this.rafId = requestAnimationFrame(() => this.move());
    }
  }
}