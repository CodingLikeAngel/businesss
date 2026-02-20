import { Component, AfterViewInit, OnDestroy, Renderer2, ElementRef, ChangeDetectionStrategy, OnInit, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-water-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './water-animation.component.html',
  styleUrl: './water-animation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaterAnimationComponent implements OnInit, AfterViewInit, OnDestroy {
  variant = input<'river-shallow' | 'river-deep' | 'river-forest' | 'river-calm' | 'river-rapid' | 'river-murky' | 'river-clear' | 'river-polluted' | 'river-artificial' | 'river-estuary'>('river-shallow');
  backgroundColor = input<string>('#FFD54F');
  characterCount = input<number>(20);
  animationSpeed = input<number>(1);
  isMobile = input<boolean>(false);

  adjustedCharacterCount = computed(() => this.isMobile() ? Math.min(this.characterCount(), 10) : this.characterCount());

  private elementPool: Map<string, HTMLElement[]> = new Map();
  private resizeObserver!: ResizeObserver;
  private intervalIds: number[] = [];
  private animationLayer!: HTMLElement;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    console.log('Componente inicializado con variant:', this.variant(), 'y characterCount:', this.adjustedCharacterCount());
  }

  ngAfterViewInit(): void {
    this.animationLayer = this.el.nativeElement.querySelector('.animation-layer') as HTMLElement;
    if (!this.animationLayer) {
      console.error('Animation layer no encontrado!');
      return;
    }
    console.log('Animation layer encontrado:', this.animationLayer);

    this.initializePool();
    this.createScene();
    this.setupResizeObserver();
    this.startDynamicElements();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.intervalIds.forEach(id => clearInterval(id));
    this.elementPool.forEach(pool => pool.forEach(el => this.renderer.removeChild(this.animationLayer, el)));
  }

  private initializePool(): void {
    const variantTypes = {
      'river-shallow': ['trout', 'rock', 'reed', 'lums', 'leaf', 'insect'],
      'river-deep': ['trout', 'rock', 'lums', 'bubble'],
      'river-forest': ['trout', 'rock', 'reed', 'lums', 'leaf'],
      'river-calm': ['trout', 'rock', 'lums', 'bubble'],
      'river-rapid': ['trout', 'rock', 'bubble', 'insect'],
      'river-murky': ['trout', 'rock', 'leaf', 'debris'],
      'river-clear': ['trout', 'rock', 'reed', 'lums'],
      'river-polluted': ['rock', 'debris', 'bubble'],
      'river-artificial': ['rock', 'bubble', 'insect'],
      'river-estuary': ['trout', 'rock', 'reed', 'lums', 'leaf']
    };
    const types = variantTypes[this.variant()] || ['trout', 'rock', 'leaf'];

    types.forEach(type => {
      const pool: HTMLElement[] = [];
      const count = this.getPoolCount(type);
      for (let i = 0; i < count; i++) {
        const element = this.renderer.createElement('div');
        this.renderer.addClass(element, 'river-character');
        this.renderer.addClass(element, type);
        this.renderer.setStyle(element, 'position', 'absolute');
        this.renderer.setStyle(element, 'display', 'none');
        this.renderer.appendChild(this.animationLayer, element);
        pool.push(element);
      }
      this.elementPool.set(type, pool);
      console.log(`Pool para ${type} creado con ${pool.length} elementos`);
    });
  }

  private getPoolCount(type: string): number {
    const counts = {
      trout: this.isMobile() ? 3 : 6,
      rock: this.isMobile() ? 4 : 8,
      reed: this.isMobile() ? 3 : 6,
      lums: this.isMobile() ? 2 : 5,
      leaf: this.isMobile() ? 5 : 10,
      insect: this.isMobile() ? 2 : 4,
      bubble: this.isMobile() ? 4 : 8,
      debris: this.isMobile() ? 3 : 6
    };
    return counts[type as keyof typeof counts] || 1;
  }

  private createScene(): void {
    const containerWidth = this.el.nativeElement.offsetWidth;
    const containerHeight = this.el.nativeElement.offsetHeight;
    const density = Math.min(this.adjustedCharacterCount(), containerWidth / (this.isMobile() ? 60 : 40));

    console.log('Creando escena con ancho:', containerWidth, 'alto:', containerHeight, 'densidad:', density);

    this.elementPool.forEach((pool, type) => {
      const count = Math.min(pool.length, Math.ceil(density * (type === 'trout' || type === 'reed' || type === 'lums' ? 1.5 : 1)));
      pool.slice(0, count).forEach(el => this.activateCharacter(el, type, containerHeight));
    });
  }

  private activateCharacter(el: HTMLElement, type: string, containerHeight: number): void {
    const startX = Math.random() * 100;
    let startY: number;
    if (['rock', 'reed'].includes(type)) {
      startY = containerHeight - (this.isMobile() ? 80 : 120); // Más abajo para profundidad
    } else if (type === 'lums') {
      startY = Math.random() * containerHeight * 0.5 + containerHeight * 0.3; // Flotan en el medio
    } else {
      startY = Math.random() * containerHeight * 0.8; // Distribución natural
    }

    this.renderer.setStyle(el, 'display', 'block');
    this.renderer.setStyle(el, 'left', `${startX}%`);
    this.renderer.setStyle(el, 'top', `${startY}px`);
    console.log(`Activando ${type} en x:${startX}%, y:${startY}px`);
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.elementPool.forEach(pool => pool.forEach(el => this.renderer.removeChild(this.animationLayer, el)));
      this.elementPool.clear();
      this.initializePool();
      this.createScene();
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  private startDynamicElements(): void {
    this.intervalIds.push(setInterval(() => {
      // Partículas dinámicas (burbujas, hojas, destellos al estilo BioShock/Rayman)
      const types = ['bubble', 'leaf', 'lum-particle'];
      const type = types[Math.floor(Math.random() * types.length)];
      const particle = this.renderer.createElement('div');
      this.renderer.addClass(particle, 'particle');
      this.renderer.addClass(particle, type);

      const startX = Math.random() * 100;
      const startY = Math.random() * 30; // Aparecen desde la parte inferior
      const swayAmount = (Math.random() - 0.5) * 30; // Más movimiento lateral
      const duration = 2 + Math.random() * 3;

      this.renderer.setStyle(particle, 'position', 'absolute');
      this.renderer.setStyle(particle, 'left', `${startX}%`);
      this.renderer.setStyle(particle, 'bottom', `${startY}%`);
      this.renderer.setStyle(particle, '--sway-amount', `${swayAmount}px`);

      const animation = type === 'bubble' ? 'bubbleRise' : type === 'leaf' ? 'leafDrift' : 'lumFloat';
      this.renderer.setStyle(particle, 'animation', `${animation} ${duration}s ease-out forwards, sway 1.5s ease-in-out infinite`);
      this.renderer.appendChild(this.animationLayer, particle);
      console.log(`Añadido partícula ${type} en x:${startX}%, y:${startY}%`);
      setTimeout(() => this.renderer.removeChild(this.animationLayer, particle), duration * 1000);

      // Peces pequeños ocasionales (inspiración Rayman)
      if (Math.random() > 0.9) {
        const fish = this.renderer.createElement('div');
        this.renderer.addClass(fish, 'river-character');
        this.renderer.addClass(fish, 'small-fish');
        this.renderer.setStyle(fish, 'position', 'absolute');
        this.renderer.setStyle(fish, 'left', `${startX}%`);
        this.renderer.setStyle(fish, 'top', `${Math.random() * 50 + 20}%`);
        this.renderer.setStyle(fish, 'animation', `fishSwim ${3 + Math.random() * 2}s ease-in-out infinite`);
        this.renderer.appendChild(this.animationLayer, fish);
        setTimeout(() => this.renderer.removeChild(this.animationLayer, fish), 5000);
      }

      // Destellos al estilo BioShock
      if (Math.random() > 0.85) {
        const sparkle = this.renderer.createElement('div');
        this.renderer.addClass(sparkle, 'sparkle');
        this.renderer.setStyle(sparkle, 'left', `${Math.random() * 100}%`);
        this.renderer.setStyle(sparkle, 'bottom', `${Math.random() * 80}%`);
        this.renderer.appendChild(this.animationLayer, sparkle);
        setTimeout(() => this.renderer.removeChild(this.animationLayer, sparkle), 1500);
      }
    }, this.isMobile() ? 500 : 300) as unknown as number);
  }
}