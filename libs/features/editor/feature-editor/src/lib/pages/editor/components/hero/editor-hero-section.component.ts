import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  HeroConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective
} from '@negocio/shared-components';
import {
  UITitleComponent,
  UICardAnimatedComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { VisualEditingConfig, VisualEditingEvent } from '@negocio/shared-components';

/**
 * Enhanced Editor Hero Section Component
 * Synchronized with UIHeroSectionComponent to provide the same visual experience
 * while maintaining visual editing capabilities.
 */
@Component({
  selector: 'lib-editor-hero-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardAnimatedComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-hero-section.component.html',
  styleUrls: ['./editor-hero-section.component.scss']
})
export class EditorHeroSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef;
  @ViewChild('subtitleElement', { static: true }) subtitleElement!: ElementRef;
  @ViewChild('ctaElement', { static: true }) ctaElement!: ElementRef;
  @ViewChild('matrixCanvas') matrixCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() heroConfig!: HeroConfig;

  private matrixInterval: any;
  activeCarouselIndex = 0;
  activeRetroIndex = 0;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    this.applyElementVisualEditing(this.subtitleElement, this.section.id + '_subtitle');
    this.applyElementVisualEditing(this.ctaElement, this.section.id + '_cta');

    if (this.isBrowser && this.getLayout() === 'matrix' && this.matrixCanvas) {
      this.initMatrixEffect();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
    }
  }

  /**
   * Get the layout type based on variant
   */
  getLayout(): string {
    const v = this.getVariant(this.section.id);
    const matrixLayout = ['matrix', 'bioshock', 'quantum', 'holo', 'neomorph'];
    const retroLayout = ['retro', 'super-meat-boy', 'portal', 'glitch', 'joycon', 'arcade', 'pixel'];
    const stellarLayout = ['stellar', 'cosmic', 'galactic'];
    const phoenixLayout = ['phoenix', 'fire', 'jungle', 'electoon'];
    const secondaryLayout = ['secondary', 'video', 'carousel'];
    const glassLayout = ['glass', 'frosted'];
    const cyberpunkLayout = ['cyberpunk', 'neon-pulse'];
    const neonLayout = ['neon', 'sparkle'];

    if (matrixLayout.includes(v)) return 'matrix';
    if (retroLayout.includes(v)) return 'retro';
    if (stellarLayout.includes(v)) return 'stellar';
    if (phoenixLayout.includes(v)) return 'phoenix';
    if (secondaryLayout.includes(v)) return 'secondary';
    if (glassLayout.includes(v)) return 'glass';
    if (cyberpunkLayout.includes(v)) return 'cyberpunk';
    if (neonLayout.includes(v)) return 'neon';
    
    return 'primary';
  }

  /**
   * Get section classes
   */
  getHeroClasses(): string[] {
    return ['hero-section', `hero-section--${this.getVariant(this.section.id)}`];
  }

  /**
   * Get section styles
   */
  getHeroStyles(): any {
    const styles: Record<string, any> = {};
    const customStyles = this.section.customStyles || {};
    
    if (customStyles['backgroundColor']) {
      styles['--hero-bg'] = customStyles['backgroundColor'];
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--hero-color'] = customStyles['color'];
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
  }

  /**
   * Platform-aware classes for sub-elements
   */
  getOverlayClass = () => `overlay--${this.getVariant(this.section.id)}`;
  getParticleClass = () => `particle--${this.getVariant(this.section.id)}`;
  getContentClass = () => `content--${this.getVariant(this.section.id)}`;
  getTitleClass = () => `title--${this.getVariant(this.section.id)}`;
  getSubtitleClass = () => `subtitle--${this.getVariant(this.section.id)}`;
  getCtaClassList = () => `cta--${this.getVariant(this.section.id)}`;
  getScrollIconClass = () => `scroll-icon--${this.getVariant(this.section.id)}`;

  getVideoClass(): string {
    const v = this.getVariant(this.section.id);
    const classes: { [key: string]: string } = {
      secondary: 'video-fullscreen',
      cyberpunk: 'video-neon',
      neon: 'video-overlay',
      stellar: 'video-starfield',
      retro: 'video-pixelated',
      phoenix: 'video-flame',
      default: 'video-gallery',
    };
    return classes[v] || 'video-standard';
  }

  showParticles(): boolean {
    return !['matrix', 'cyberpunk', 'neon', 'stellar', 'retro', 'phoenix', 'default'].includes(this.getVariant(this.section.id));
  }

  trackByFn(index: number, item: any): any { return index; }

  // Rest of navigation logic
  prevCarouselItem() { this.activeCarouselIndex = (this.activeCarouselIndex - 1 + (this.heroConfig.carouselItems?.length || 0)) % (this.heroConfig.carouselItems?.length || 1); }
  nextCarouselItem() { this.activeCarouselIndex = (this.activeCarouselIndex + 1) % (this.heroConfig.carouselItems?.length || 1); }
  prevRetroItem() { this.activeRetroIndex = (this.activeRetroIndex - 1 + (this.heroConfig.navigationCards?.length || 0)) % (this.heroConfig.navigationCards?.length || 1); }
  nextRetroItem() { this.activeRetroIndex = (this.activeRetroIndex + 1) % (this.heroConfig.navigationCards?.length || 1); }

  /**
   * Get configuration for the section container
   */
  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      constraints: {
        containment: 'parent',
        minDistance: { top: 10, right: 10, bottom: 10, left: 10 },
        collisionDetection: false,
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        dimensionLabels: true,
        resizeHandles: true
      }
    });
  }

  /**
   * Get configuration for elements
   */
  getTitleConfig(): VisualEditingConfig { return this.createElementConfig('element', { styling: { selectionOutline: '2px solid #10b981', hoverEffects: !this.platformInfo.isMobile, resizeHandles: true, dimensionLabels: true } }); }
  getSubtitleConfig(): VisualEditingConfig { return this.createElementConfig('element', { styling: { selectionOutline: '2px solid #f59e0b', hoverEffects: !this.platformInfo.isMobile, resizeHandles: true, dimensionLabels: true } }); }
  getCtaConfig(): VisualEditingConfig { return this.createElementConfig('element', { styling: { selectionOutline: '2px solid #ef4444', hoverEffects: !this.platformInfo.isMobile, resizeHandles: true, dimensionLabels: true } }); }

  /**
   * Handle visual editing events
   */
  handleSectionEvent(event: VisualEditingEvent): void { this.handleVisualEvent(event, this.section.id); }
  handleTitleEvent(event: VisualEditingEvent): void { this.handleVisualEvent(event, this.section.id + '_title'); }
  handleSubtitleEvent(event: VisualEditingEvent): void { this.handleVisualEvent(event, this.section.id + '_subtitle'); }
  handleCtaEvent(event: VisualEditingEvent): void { this.handleVisualEvent(event, this.section.id + '_cta'); }

  /**
   * Custom event handling for hero-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_title') {
      switch (event.type) {
        case 'moved':
        case 'resized':
          this.updateTitleStyles(event.bounds);
          break;
      }
    } else if (elementId === this.section.id + '_subtitle') {
      switch (event.type) {
        case 'moved':
        case 'resized':
          this.updateSubtitleStyles(event.bounds);
          break;
      }
    } else if (elementId === this.section.id + '_cta') {
      switch (event.type) {
        case 'moved':
        case 'resized':
          this.updateCtaStyles(event.bounds);
          break;
      }
    }
  }

  private updateTitleStyles(bounds: any): void {
    const currentStyles = this.section.content['titleStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute', // Ensure absolute positioning for visual editing
      width: bounds.width + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px',
      transform: 'none'
    };
    this.updateSectionContent({ titleStyles: newStyles });
  }

  private updateSubtitleStyles(bounds: any): void {
    const currentStyles = this.section.content['subtitleStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute',
      width: bounds.width + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px',
      transform: 'none'
    };
    this.updateSectionContent({ subtitleStyles: newStyles });
  }

  private updateCtaStyles(bounds: any): void {
    const currentStyles = this.section.content['ctaStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute',
      width: bounds.width + 'px',
      height: bounds.height + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px',
      transform: 'none'
    };
    this.updateSectionContent({ ctaStyles: newStyles });
  }

  private updateSectionContent(contentUpdates: any): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: {
        ...this.section.content,
        ...contentUpdates
      }
    });
  }

  private initMatrixEffect(): void {
    if (!this.matrixCanvas) return;
    const canvas = this.matrixCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) drops[x] = 1;

    const draw = () => {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    this.matrixInterval = setInterval(draw, 33);
  }
}

