import { Component, Input, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DoCheck } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  HeroConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig, 
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UITitleComponent,
  UICardAnimatedComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

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
export class EditorHeroSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, OnDestroy, DoCheck {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef;
  @ViewChild('subtitleElement', { static: true }) subtitleElement!: ElementRef;
  @ViewChild('ctaElement', { static: true }) ctaElement!: ElementRef;
  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;
  @ViewChild('matrixCanvas') matrixCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() heroConfig!: HeroConfig;

  private matrixInterval: any;
  activeCarouselIndex = 0;
  activeRetroIndex = 0;

  ngDoCheck() {
    // Sync logic for array items (cards) being edited in isolation
    const selected = this.uiStateService.selectedElement;
    if (selected && selected.sectionId === this.section.id && selected.id && selected.id.indexOf('_card_') !== -1 && selected.index !== undefined) {
       const items = this.section.content['items'];
       
       // Safety check
       if (!items || !items[selected.index]) return;

       // Check if content differs (reference check is usually enough if editor creates new objects)
       if (items[selected.index] !== selected.content) {
           // Avoid mutating read-only array from store
           // Create a new array copy
           const newItems = [...items];
           newItems[selected.index] = selected.content;
           
           // Dispatch update to store instead of mutating local property
           // This complies with NgRx immutability and fixes TypeError
           this.variantService.updateSectionInCurrentPage(this.section.id, {
             content: {
               ...this.section.content,
               items: newItems,
               navigationCards: newItems
             }
           });
       }
    }
  }

  ngAfterViewInit() {
    // Standardize content: map navigationCards to 'items' for generic editor support
    // Wrapped in setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (!this.section.content['items']) {
        const initialCards = this.heroConfig.navigationCards || [];
        
        // Dispatch update to store to initialize items
        this.variantService.updateSectionInCurrentPage(this.section.id, {
          content: {
            ...this.section.content,
            items: JSON.parse(JSON.stringify(initialCards)),
            navigationCards: this.section.content['navigationCards'] ? undefined : JSON.parse(JSON.stringify(initialCards))
          }
        });
      }
    });

    // Apply standardized visual editing to static elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    this.applyElementVisualEditing(this.subtitleElement, this.section.id + '_subtitle');
    this.applyElementVisualEditing(this.ctaElement, this.section.id + '_cta');

    // Apply to dynamic cards
    this.applyCardsEditing();
    this.cardElements.changes.subscribe(() => this.applyCardsEditing());

    if (this.isBrowser && this.getLayout() === 'matrix' && this.matrixCanvas) {
      this.initMatrixEffect();
    }
  }

  private applyCardsEditing() {
    if (!this.cardElements) return;
    this.cardElements.forEach((cardRef: ElementRef, index: number) => {
      this.applyElementVisualEditing(
        cardRef, 
        `${this.section.id}_card_${index}`, 
        { 
          styling: { 
            selectionOutline: '2px solid #3b82f6', 
            resizeHandles: true,
            hoverEffects: true,
            dimensionLabels: true
          }
        }
      );
    });
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
    const customStyles = this.section.styles || {};
    
    const bgColor = customStyles['backgroundColor'] || customStyles['background'];
    if (bgColor) {
      styles['--hero-bg-color'] = bgColor;
      styles['--theme-bg'] = bgColor;
      styles['--component-bg'] = bgColor;
      styles['background-color'] = bgColor;
    }
    
    if (customStyles['color']) {
      styles['--hero-color'] = customStyles['color'];
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    // Copy all other styles (position, dimensions, etc)
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
  getCardConfig(): VisualEditingConfig { 
    return this.createElementConfig('element', { 
      enableDrag: true, 
      enableResize: true, 
      styling: { 
        selectionOutline: '2px solid #3b82f6', 
        hoverEffects: !this.platformInfo.isMobile, 
        resizeHandles: true, 
        dimensionLabels: true 
      } 
    }); 
  }

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
    // Let parent (BaseEditorFeatureComponent) handle these events
    // to avoid double updates with the global state (Store)
    
    /* 
    if (elementId === this.section.id + '_title') {
      // ...
    }
    */
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

  private updateCardStyles(index: number, bounds: any): void {
    let cards = this.section.content['items'];
    if (!cards || index >= cards.length) return;
    
    // Check if cards is basically empty or inherited properties are missing
    
    const newCards = [...cards];
    const cardToUpdate = { ...newCards[index] };
    
    const currentStyles = cardToUpdate.styles || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute',
      width: bounds.width + 'px',
      height: bounds.height + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px',
      transform: 'none'
    };
    
    cardToUpdate.styles = newStyles;
    newCards[index] = cardToUpdate;
    
    // Update items mostly
    this.updateSectionContent({ items: newCards, navigationCards: newCards });
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
