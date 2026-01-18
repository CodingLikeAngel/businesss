import { Injectable, Inject, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VisualStylingConfig } from './enhanced-visual-editing.interfaces';

/**
 * Unified Styling Service
 * Provides consistent visual styling for enhanced visual editing
 */
@Injectable({
  providedIn: 'root'
})
export class UnifiedStylingService {
  private renderer: Renderer2;
  private styleElement: HTMLStyleElement | null = null;
  private stylesInjected = false;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Inject base styles for enhanced visual editing
   */
  injectBaseStyles(): void {
    if (!isPlatformBrowser(this.platformId) || this.stylesInjected) {
      return;
    }

    this.styleElement = this.renderer.createElement('style');
    this.renderer.setAttribute(this.styleElement, 'id', 'enhanced-visual-editing-styles');
    this.renderer.setProperty(this.styleElement, 'textContent', this.getBaseStyles());
    this.renderer.appendChild(document.head, this.styleElement);
    this.stylesInjected = true;
  }

  /**
   * Remove injected styles
   */
  removeBaseStyles(): void {
    if (!isPlatformBrowser(this.platformId) || !this.styleElement) {
      return;
    }

    const existing = document.getElementById('enhanced-visual-editing-styles');
    if (existing) {
      this.renderer.removeChild(document.head, existing);
    }
    this.styleElement = null;
    this.stylesInjected = false;
  }

  /**
   * Apply styling configuration to an element
   */
  applyStyling(element: HTMLElement, config: VisualStylingConfig): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Apply selection outline
    this.renderer.setStyle(element, 'outline', config.selectionOutline);

    // Apply custom classes
    if (config.customClasses) {
      config.customClasses.forEach(className => {
        this.renderer.addClass(element, className);
      });
    }

    // Apply theme class
    if (config.theme) {
      this.renderer.setAttribute(element, 'data-theme', config.theme);
    }

    // Configure hover effects
    if (config.hoverEffects) {
      this.renderer.addClass(element, 'enhanced-hover-enabled');
    } else {
      this.renderer.removeClass(element, 'enhanced-hover-enabled');
    }

    // Configure dimension labels
    if (config.dimensionLabels) {
      this.renderer.setAttribute(element, 'data-show-dimensions', 'true');
    } else {
      this.renderer.removeAttribute(element, 'data-show-dimensions');
    }

    // Configure resize handles
    if (config.resizeHandles) {
      this.renderer.setAttribute(element, 'data-show-handles', 'true');
    } else {
      this.renderer.removeAttribute(element, 'data-show-handles');
    }
  }

  /**
   * Update styling configuration for an element
   */
  updateStyling(element: HTMLElement, config: Partial<VisualStylingConfig>): void {
    // Remove existing styling first
    this.removeStyling(element);
    // Apply new styling
    this.applyStyling(element, { ...this.getDefaultStyling(), ...config });
  }

  /**
   * Remove styling from an element
   */
  removeStyling(element: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove outline
    this.renderer.removeStyle(element, 'outline');

    // Remove custom classes (assuming they start with 'enhanced-')
    const classes = Array.from(element.classList);
    classes.forEach(className => {
      if (className.startsWith('enhanced-')) {
        this.renderer.removeClass(element, className);
      }
    });

    // Remove theme attribute
    this.renderer.removeAttribute(element, 'data-theme');

    // Remove configuration attributes
    this.renderer.removeAttribute(element, 'data-show-dimensions');
    this.renderer.removeAttribute(element, 'data-show-handles');
  }

  /**
   * Get platform-specific styling adjustments
   */
  getPlatformStyling(isMobile: boolean): Partial<VisualStylingConfig> {
    if (isMobile) {
      return {
        selectionOutline: '3px solid #6366f1',
        hoverEffects: false, // Disable hover on touch devices
        dimensionLabels: false, // Reduce visual clutter on mobile
        resizeHandles: true // Keep handles for touch interaction
      };
    }

    return {
      selectionOutline: '2px solid #6366f1',
      hoverEffects: true,
      dimensionLabels: true,
      resizeHandles: true
    };
  }

  /**
   * Get theme-specific styling
   */
  getThemeStyling(theme: string): Partial<VisualStylingConfig> {
    const themeStyles: Record<string, Partial<VisualStylingConfig>> = {
      dark: {
        selectionOutline: '2px solid #818cf8',
        customClasses: ['theme-dark']
      },
      pokemon: {
        selectionOutline: '2px solid #ef4444',
        customClasses: ['theme-pokemon']
      },
      minecraft: {
        selectionOutline: '2px solid #16a34a',
        customClasses: ['theme-minecraft']
      },
      retro: {
        selectionOutline: '2px solid #f59e0b',
        customClasses: ['theme-retro']
      }
    };

    return themeStyles[theme] || {};
  }

  /**
   * Get default styling configuration
   */
  private getDefaultStyling(): VisualStylingConfig {
    return {
      selectionOutline: '2px solid #6366f1',
      hoverEffects: true,
      dimensionLabels: true,
      resizeHandles: true
    };
  }

  /**
   * Get base CSS styles for enhanced visual editing
   */
  private getBaseStyles(): string {
    return `
      /* Enhanced Visual Editing Base Styles */

      .enhanced-visual-editable {
        position: relative;
        transition: outline 0.2s ease;
      }

      .enhanced-visual-editable.enhanced-hover-enabled:hover {
        outline: 2px dashed rgba(99, 102, 241, 0.6) !important;
        outline-offset: 2px;
      }

      .enhanced-visual-selected {
        outline: 2px solid #6366f1 !important;
        outline-offset: 2px;
        z-index: 10;
      }

      /* Mobile-specific adjustments */
      @media (max-width: 768px) {
        .enhanced-visual-editable {
          touch-action: none; /* Prevent scrolling during editing */
        }

        .enhanced-visual-selected {
          outline: 3px solid #6366f1 !important;
        }

        .enhanced-resize-handle {
          width: 16px !important;
          height: 16px !important;
        }
      }

      /* Theme-specific overrides */
      .enhanced-visual-editable[data-theme="dark"] {
        --selection-color: #818cf8;
        --hover-color: rgba(129, 140, 248, 0.6);
      }

      .enhanced-visual-editable[data-theme="pokemon"] {
        --selection-color: #ef4444;
        --hover-color: rgba(239, 68, 68, 0.6);
      }

      .enhanced-visual-editable[data-theme="minecraft"] {
        --selection-color: #16a34a;
        --hover-color: rgba(22, 163, 74, 0.6);
      }

      .enhanced-visual-editable[data-theme="retro"] {
        --selection-color: #f59e0b;
        --hover-color: rgba(245, 158, 11, 0.6);
      }

      /* Enhanced edit overlay */
      .enhanced-edit-overlay {
        position: absolute;
        pointer-events: none;
        z-index: 9999;
        border-radius: 4px;
      }

      .enhanced-selection-border {
        position: absolute;
        inset: -2px;
        border: 2px solid var(--selection-color, #6366f1);
        border-radius: 4px;
        box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2),
                    0 0 20px rgba(99, 102, 241, 0.3);
        animation: enhanced-pulse-border 2s ease-in-out infinite;
      }

      @keyframes enhanced-pulse-border {
        0%, 100% {
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2),
                      0 0 20px rgba(99, 102, 241, 0.3);
        }
        50% {
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.4),
                      0 0 30px rgba(99, 102, 241, 0.5);
        }
      }

      /* Enhanced dimension label */
      .enhanced-dimension-label {
        position: absolute;
        top: -28px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--selection-color, #6366f1);
        color: white;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        font-family: 'Courier New', monospace;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        pointer-events: none;
      }

      /* Enhanced resize handles */
      .enhanced-resize-handle {
        position: absolute;
        background: white;
        border: 2px solid var(--selection-color, #6366f1);
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
        cursor: pointer;
        pointer-events: all;
      }

      .enhanced-resize-handle:hover {
        background: var(--selection-color, #6366f1);
        transform: scale(1.3);
      }

      /* Handle positions */
      .enhanced-handle-top { top: -6px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
      .enhanced-handle-right { top: 50%; right: -6px; transform: translateY(-50%); cursor: ew-resize; }
      .enhanced-handle-bottom { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
      .enhanced-handle-left { top: 50%; left: -6px; transform: translateY(-50%); cursor: ew-resize; }
      .enhanced-handle-top-left { top: -6px; left: -6px; cursor: nwse-resize; }
      .enhanced-handle-top-right { top: -6px; right: -6px; cursor: nesw-resize; }
      .enhanced-handle-bottom-left { bottom: -6px; left: -6px; cursor: nesw-resize; }
      .enhanced-handle-bottom-right { bottom: -6px; right: -6px; cursor: nwse-resize; }

      /* Mobile handle adjustments */
      @media (max-width: 768px) {
        .enhanced-resize-handle {
          width: 16px;
          height: 16px;
        }

        .enhanced-handle-top { top: -8px; }
        .enhanced-handle-right { right: -8px; }
        .enhanced-handle-bottom { bottom: -8px; }
        .enhanced-handle-left { left: -8px; }
        .enhanced-handle-top-left { top: -8px; left: -8px; }
        .enhanced-handle-top-right { top: -8px; right: -8px; }
        .enhanced-handle-bottom-left { bottom: -8px; left: -8px; }
        .enhanced-handle-bottom-right { bottom: -8px; right: -8px; }
      }

      /* Accessibility improvements */
      @media (prefers-reduced-motion: reduce) {
        .enhanced-visual-editable,
        .enhanced-resize-handle,
        .enhanced-selection-border {
          transition: none;
          animation: none;
        }
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .enhanced-selection-border {
          border-width: 3px;
        }

        .enhanced-resize-handle {
          border-width: 3px;
        }
      }
    `;
  }
}