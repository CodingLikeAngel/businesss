import { Component, AfterViewInit, ElementRef, ViewChild, Input, HostBinding, Inject, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
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
export class BubbleAnimationComponent implements AfterViewInit {
  @ViewChild('interactiveBubble') interactiveBubble!: ElementRef<HTMLDivElement>;

  @Input() config: BubbleConfig = {
    speed: 1,
    blur: 40,
    opacity: 0.8,
    variant: 'default'
  };

  @Input()
  set variant(value: BubbleVariant) {
    this._variant = bubbleVariants.includes(value) ? value : 'default';
  }
  get variant(): BubbleVariant {
    return this._variant;
  }
  private _variant: BubbleVariant = 'default';

  @HostBinding('class') get hostClasses() {
    return ['bubble-container', `bubble--${this.variant}`];
  }

  @HostBinding('style') get hostStyles() {
    return {
      '--bubble-blur': `${this.config.blur ?? 40}px`,
      '--bubble-opacity': this.config.opacity ?? 0.8,
      '--bubble-speed': this.config.speed ?? 1
    };
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
    this.curX += (this.tgX - this.curX) / (20 / (this.config.speed || 1));
    this.curY += (this.tgY - this.curY) / (20 / (this.config.speed || 1));

    if (this.interactiveBubble) {
      this.interactiveBubble.nativeElement.style.transform = 
        `translate(${Math.round(this.curX)}px, ${Math.round(this.curY)}px)`;
    }

    if (typeof window !== 'undefined') {
      this.rafId = requestAnimationFrame(() => this.move());
    }
  }
}