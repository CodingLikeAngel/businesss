import { Component, signal, effect, AfterViewInit, OnDestroy, Renderer2, ElementRef, input, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'lib-forest-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forest-animation.component.html',
  styleUrls: ['./forest-animation.component.scss'],
})
export class ForestAnimationComponent implements AfterViewInit, OnDestroy {
  variant = input<'enchanted' | 'mystic' | 'ancient' | 'twilight' | 'frosty' | 'jungle' | 'desert' | 'candy' | 'oceanic' | 'fiery'>('enchanted');
  backgroundColor = input<string>('#0b3d0b');
  treeCount = input<number>(7);
  mushroomCount = input<number>(5);
  fireflyCount = input<number>(15);
  leafCount = input<number>(8);
  mistEnabled = input<boolean>(false);
  sporeCount = input<number>(10);
  butterflyCount = input<number>(5);
  lightBeamCount = input<number>(3);
  lumCount = input<number>(3);
  lianaCount = input<number>(4);

  private elementPool = signal<Map<string, HTMLElement[]>>(new Map());
  private intervalIds = signal<any[]>([]);
  private animationLayer = signal<HTMLElement | null>(null);
  private currentVariantIndex = signal<number>(0);
  private variants: Array<'enchanted' | 'mystic' | 'ancient' | 'twilight' | 'frosty' | 'jungle' | 'desert' | 'candy' | 'oceanic' | 'fiery'> = [
    'enchanted', 'mystic', 'ancient', 'twilight', 'frosty', 'jungle', 'desert', 'candy', 'oceanic', 'fiery'
  ];

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    effect(() => {
      const backgroundColor = this.backgroundColor();
      if (isPlatformBrowser(this.platformId)) {
        this.setupBackground(backgroundColor);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      this.animationLayer.set(this.el.nativeElement.querySelector('.animation-layer') as HTMLElement);
      if (!this.animationLayer()) {
        console.error('Animation layer not found!');
        return;
      }
      this.initializePool();
      this.setupBackground(this.backgroundColor());
      this.createMistLayer();
      this.createScene();
      this.startDynamicElements();
      this.setupInteractivity();
      this.startVariantCycle();
    } catch (error) {
      console.error('Error initializing forest animation:', error);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.intervalIds().forEach(id => clearInterval(id));
      this.elementPool().forEach(pool => pool.forEach(el => this.renderer.removeChild(this.animationLayer(), el)));
    }
  }

  private startVariantCycle(): void {
    this.intervalIds.update(ids => [
      ...ids,
      setInterval(() => {
        this.currentVariantIndex.update(index => (index + 1) % this.variants.length);
        this.updateScene();
      }, 5000)
    ]);
  }

  private updateScene(): void {
    const newVariant = this.variants[this.currentVariantIndex()];
    
    // Update mist layer
    this.createMistLayer();
    
    // Update existing elements
    this.elementPool().forEach((pool, type) => {
      pool.forEach(el => {
        this.renderer.removeClass(el, `${type}-${this.variants[(this.currentVariantIndex() - 1 + this.variants.length) % this.variants.length]}`);
        this.renderer.addClass(el, `${type}-${newVariant}`);
        
        // Update specific element content
        if (type === 'tree-animation') {
          this.renderer.setProperty(el, 'innerHTML', this.getTreeSvg(1));
        } else if (type === 'mushroom') {
          this.renderer.setProperty(el, 'innerHTML', this.getMushroomSvg());
        } else if (type === 'spore-particle') {
          this.renderer.setProperty(el, 'textContent', newVariant === 'frosty' ? '❄' : '✧');
        }
      });
    });
    
    // Update leaves
    const leaves = this.el.nativeElement.querySelectorAll('.leaf');
    leaves.forEach((leaf: HTMLElement) => {
      this.renderer.removeClass(leaf, `leaf-${this.variants[(this.currentVariantIndex() - 1 + this.variants.length) % this.variants.length]}`);
      this.renderer.addClass(leaf, `leaf-${newVariant}`);
    });
  }

  private initializePool(): void {
    const types = ['tree-animation', 'mushroom', 'spore-particle', 'firefly', 'butterfly', 'light-beam', 'lum', 'liana'];
    const newPool = new Map<string, HTMLElement[]>();

    types.forEach(type => {
      const pool: HTMLElement[] = [];
      const count = this.getPoolCount(type);
      for (let i = 0; i < count; i++) {
        const element = this.renderer.createElement('div');
        this.renderer.addClass(element, type);
        this.renderer.addClass(element, `${type}-${this.variants[this.currentVariantIndex()]}`);
        this.renderer.setStyle(element, 'display', 'none');
        if (type === 'tree-animation') {
          this.renderer.setProperty(element, 'innerHTML', this.getTreeSvg(1));
        } else if (type === 'mushroom') {
          this.renderer.setProperty(element, 'innerHTML', this.getMushroomSvg());
        } else if (type === 'spore-particle') {
          this.renderer.setProperty(element, 'textContent', this.variants[this.currentVariantIndex()] === 'frosty' ? '❄' : '✧');
        } else if (type === 'butterfly') {
          this.renderer.setProperty(element, 'textContent', '🦋');
        } else if (type === 'lum') {
          this.renderer.setProperty(element, 'textContent', '★');
        }
        this.renderer.appendChild(this.animationLayer(), element);
        pool.push(element);
      }
      newPool.set(type, pool);
    });
    this.elementPool.set(newPool);
  }

  private getPoolCount(type: string): number {
    const isMobile = isPlatformBrowser(this.platformId) && /Mobi|Android/i.test(navigator.userAgent);
    const counts = {
      'tree-animation': isMobile ? Math.min(this.treeCount(), 5) : this.treeCount() + 3,
      'mushroom': isMobile ? Math.min(this.mushroomCount(), 3) : this.mushroomCount(),
      'spore-particle': isMobile ? Math.min(this.sporeCount(), 5) : this.sporeCount(),
      'firefly': isMobile ? Math.min(this.fireflyCount(), 10) : this.fireflyCount(),
      'butterfly': isMobile ? Math.min(this.butterflyCount(), 3) : this.butterflyCount(),
      'light-beam': this.lightBeamCount(),
      'lum': isMobile ? Math.min(this.lumCount(), 2) : this.lumCount(),
      'liana': this.variants[this.currentVariantIndex()] === 'jungle' ? this.lianaCount() : 0,
    };
    return counts[type as keyof typeof counts] || 0;
  }

  private setupBackground(backgroundColor: string): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', backgroundColor);
    const farLayer = this.el.nativeElement.querySelector('.background-layer-far');
    if (farLayer) {
      this.renderer.setStyle(farLayer, 'backgroundImage', this.getFarBackground());
    }
  }

  private getFarBackground(): string {
    return 'none';
  }

  private createMistLayer(): void {
    if (!this.mistEnabled()) return;
    const mist = this.el.nativeElement.querySelector('.mist-layer');
    if (mist) {
      this.renderer.setStyle(mist, 'background', this.getMistBackground(this.variants[this.currentVariantIndex()]));
    }
  }

  private getMistBackground(variant: string): string {
    switch (variant) {
      case 'enchanted':
        return 'linear-gradient(to bottom, rgba(200, 255, 200, 0.3), transparent)';
      case 'mystic':
        return 'linear-gradient(to bottom, rgba(147, 112, 219, 0.35), transparent)';
      case 'ancient':
        return 'linear-gradient(to bottom, rgba(139, 0, 0, 0.25), transparent)';
      case 'twilight':
        return 'linear-gradient(to bottom, rgba(255, 140, 0, 0.3), transparent)';
      case 'frosty':
        return 'linear-gradient(to bottom, rgba(173, 216, 230, 0.4), transparent)';
      case 'jungle':
        return 'linear-gradient(to bottom, rgba(46, 139, 87, 0.3), transparent)';
      case 'desert':
        return 'linear-gradient(to bottom, rgba(210, 180, 140, 0.2), transparent)';
      case 'candy':
        return 'linear-gradient(to bottom, rgba(255, 105, 180, 0.3), transparent)';
      case 'oceanic':
        return 'linear-gradient(to bottom, rgba(64, 224, 208, 0.35), transparent)';
      case 'fiery':
        return 'linear-gradient(to bottom, rgba(255, 69, 0, 0.3), transparent)';
      default:
        return 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent)';
    }
  }

  private createScene(): void {
    const containerHeight = this.el.nativeElement.offsetHeight || 400;
    this.elementPool().forEach((pool, type) => {
      pool.forEach(el => this.activateElement(el, type, containerHeight));
    });
    this.createLeaves();
  }

  private activateElement(el: HTMLElement, type: string, containerHeight: number): void {
    const scale = type === 'tree-animation' || type === 'mushroom' || type === 'liana' ? 0.7 + Math.random() * 0.5 : 1;
    const speed = this.getSpeed(type);

    this.renderer.setStyle(el, 'display', 'block');
    this.renderer.setStyle(el, 'left', `${Math.random() * 95}%`);
    if (type === 'tree-animation' || type === 'mushroom') {
      this.renderer.setStyle(el, 'bottom', `${Math.random() * 20}%`);
    } else if (type === 'liana') {
      this.renderer.setStyle(el, 'top', '0');
    } else {
      this.renderer.setStyle(el, 'bottom', `${Math.random() * containerHeight}px`);
    }
    this.renderer.setStyle(el, 'transform', `scale(${scale}) translateZ(0)`);
    if (type !== 'spore-particle' && type !== 'firefly' && type !== 'butterfly' && type !== 'lum') {
      this.renderer.setStyle(el, 'animationDuration', `${speed}s`);
    }
  }

  private getSpeed(type: string): number {
    switch (type) {
      case 'tree-animation':
        return 8 + Math.random() * 4;
      case 'mushroom':
        return 4 + Math.random() * 2;
      case 'light-beam':
        return 15;
      case 'liana':
        return 6 + Math.random() * 2;
      default:
        return 1;
    }
  }

  private getTreeSvg(scale: number): string {
    const height = 150 * scale;
    const color = this.variants[this.currentVariantIndex()] === 'enchanted' ? '#228B22' :
                  this.variants[this.currentVariantIndex()] === 'mystic' ? '#6A5ACD' :
                  this.variants[this.currentVariantIndex()] === 'ancient' ? '#8B0000' :
                  this.variants[this.currentVariantIndex()] === 'twilight' ? '#FF8C00' :
                  this.variants[this.currentVariantIndex()] === 'frosty' ? '#ADD8E6' :
                  this.variants[this.currentVariantIndex()] === 'jungle' ? '#2E8B57' :
                  this.variants[this.currentVariantIndex()] === 'desert' ? '#D2B48C' :
                  this.variants[this.currentVariantIndex()] === 'candy' ? '#FF69B4' :
                  this.variants[this.currentVariantIndex()] === 'oceanic' ? '#00B7EB' :
                  '#FF4500';
    return `
      <svg viewBox="0 0 100 ${height}" class="w-full h-full">
        <rect x="45" y="${height - 50}" width="10" height="50" fill="#8B5E3C" />
        <path d="M50 0 Q20 50 10 ${height - 50} Q50 ${height - 70} 90 ${height - 50} Q80 50 50 0" fill="${color}" />
        <path d="M50 20 Q25 60 20 ${height - 60} Q50 ${height - 80} 80 ${height - 60} Q75 60 50 20" fill="${color}" opacity="0.7" />
      </svg>
    `;
  }

  private getMushroomSvg(): string {
    const capColor = this.variants[this.currentVariantIndex()] === 'enchanted' ? '#FF6F61' :
                     this.variants[this.currentVariantIndex()] === 'mystic' ? '#DDA0DD' :
                     this.variants[this.currentVariantIndex()] === 'ancient' ? '#8B0000' :
                     this.variants[this.currentVariantIndex()] === 'twilight' ? '#FFA500' :
                     this.variants[this.currentVariantIndex()] === 'frosty' ? '#87CEEB' :
                     this.variants[this.currentVariantIndex()] === 'jungle' ? '#FFD700' :
                     this.variants[this.currentVariantIndex()] === 'desert' ? '#F4A460' :
                     this.variants[this.currentVariantIndex()] === 'candy' ? '#FFB6C1' :
                     this.variants[this.currentVariantIndex()] === 'oceanic' ? '#00BFFF' :
                     '#FF6347';
    return `
      <svg viewBox="0 0 50 50" class="w-full h-full">
        <ellipse cx="25" cy="20" rx="20" ry="10" fill="${capColor}" />
        <rect x="22" y="20" width="6" height="15" fill="#D2691E" />
        <circle cx="20" cy="15" r="3" fill="white" opacity="0.8" />
        <circle cx="30" cy="18" r="2" fill="white" opacity="0.8" />
      </svg>
    `;
  }

  private createLeaves(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  
    this.intervalIds.update(ids => [
      ...ids,
      setInterval(() => {
        const leaf = this.renderer.createElement('div');
        this.renderer.addClass(leaf, 'leaf');
        this.renderer.addClass(leaf, `leaf-${this.variants[this.currentVariantIndex()]}`);
        const left = Math.random() * 100;
        this.renderer.setStyle(leaf, 'left', `${left}%`);
        this.renderer.setStyle(leaf, 'top', '-10px');
        const duration = 4000 + Math.random() * 2000;
        this.renderer.setStyle(leaf, 'animation', `leafFall ${duration}ms linear`);
        this.renderer.appendChild(this.animationLayer(), leaf);
  
        setTimeout(() => {
          this.renderer.removeChild(this.animationLayer(), leaf);
        }, duration);
      }, 1000 / this.leafCount())
    ]);
  }

  private startDynamicElements(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Esporas
    this.intervalIds.update(ids => [
      ...ids,
      setInterval(() => {
        const spore = this.elementPool().get('spore-particle')?.find(el => el.style.display === 'none');
        if (spore) {
          this.renderer.setStyle(spore, 'display', 'block');
          this.renderer.setStyle(spore, 'left', `${Math.random() * 100}%`);
          this.renderer.setStyle(spore, 'bottom', '0%');
          const duration = 6000 + Math.random() * 2000;
          this.renderer.setStyle(spore, 'animation', `spore-rise ${duration}ms ease-in-out`);
          setTimeout(() => {
            this.renderer.setStyle(spore, 'display', 'none');
            this.renderer.removeStyle(spore, 'animation');
          }, duration);
        }
      }, 1000 / this.sporeCount())
    ]);

    // Luciérnagas
    this.intervalIds.update(ids => [
      ...ids,
      setInterval(() => {
        const firefly = this.elementPool().get('firefly')?.find(el => el.style.display === 'none');
        if (firefly) {
          const left = Math.random() * 100;
          const bottom = Math.random() * 100;
          this.renderer.setStyle(firefly, 'display', 'block');
          this.renderer.setStyle(firefly, 'left', `${left}%`);
          this.renderer.setStyle(firefly, 'bottom', `${bottom}%`);
          const duration = 2000 + Math.random() * 2000;
          this.renderer.setStyle(firefly, 'animation', `firefly-glow ${duration}ms ease-in-out`);
          setTimeout(() => {
            this.renderer.setStyle(firefly, 'display', 'none');
            this.renderer.removeStyle(firefly, 'animation');
          }, duration);
        }
      }, 1000 / this.fireflyCount())
    ]);

    // Mariposas
    this.intervalIds.update(ids => [
      ...ids,
      setInterval(() => {
        const butterfly = this.elementPool().get('butterfly')?.find(el => el.style.display === 'none');
        if (butterfly) {
          this.renderer.setStyle(butterfly, 'display', 'block');
          this.renderer.setStyle(butterfly, 'left', `${Math.random() * 100}%`);
          this.renderer.setStyle(butterfly, 'bottom', `${Math.random() * (this.el.nativeElement.offsetHeight || 400) * 0.8}px`);
          const duration = 4000 + Math.random() * 2000;
          this.renderer.setStyle(butterfly, 'animation', `butterfly-flutter ${duration}ms ease-in-out infinite`);
        }
      }, 1000 / this.butterflyCount())
    ]);

    // Lums
    this.intervalIds.update(ids => [
      ...ids,
      setInterval(() => {
        const lum = this.elementPool().get('lum')?.find(el => el.style.display === 'none');
        if (lum) {
          this.renderer.setStyle(lum, 'display', 'block');
          this.renderer.setStyle(lum, 'left', `${Math.random() * 100}%`);
          this.renderer.setStyle(lum, 'bottom', `${Math.random() * (this.el.nativeElement.offsetHeight || 400) * 0.8}px`);
          const duration = 5000;
          this.renderer.setStyle(lum, 'animation', `lum-pulse ${duration}ms ease-in-out`);
          setTimeout(() => {
            this.renderer.setStyle(lum, 'display', 'none');
            this.renderer.removeStyle(lum, 'animation');
          }, duration);
        }
      }, 3000 / this.lumCount())
    ]);
  }

  private setupInteractivity(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.renderer.listen(this.el.nativeElement, 'mousemove', (event: MouseEvent) => {
      const fireflies = this.elementPool().get('firefly') || [];
      fireflies.forEach(f => {
        if (f.style.display !== 'none') {
          const rect = f.getBoundingClientRect();
          const dx = (event.clientX - (rect.left + rect.width / 2)) / 20;
          const dy = (event.clientY - (rect.top + rect.height / 2)) / 20;
          this.renderer.setStyle(f, 'transform', `translate(${dx}px, ${dy}px) scale(1)`);
        }
      });
    });
  }
}