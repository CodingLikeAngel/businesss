import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[applyDynamicStyles]',
  standalone: true
})
export class ApplyDynamicStylesDirective implements OnChanges {
  @Input() applyDynamicStyles: any; // El objeto de estilos
  @Input() enableValidation = true; // Enable/disable validation
  @Input() autoCorrect = false; // Auto-apply corrections

  @Output() validationReport = new EventEmitter<any>();
  @Output() styleError = new EventEmitter<{ property: string; message: string; suggestions: any[] }>();

  private validationService: any = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    // Validation service will be injected by components that use it
  }

  /**
   * Set the validation service (called by parent components)
   */
  setValidationService(service: any): void {
    this.validationService = service;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['applyDynamicStyles']) {
      this.applyStyles();
    }
  }

  private applyStyles() {
    const styles = this.applyDynamicStyles;

    if (!styles || typeof styles !== 'object') {
      return;
    }

    // Validate styles if enabled
    let processedStyles = styles;
    if (this.enableValidation && this.validationService) {
      const report = this.validationService.validateStyles(styles);
      this.validationReport.emit(report);

      // Auto-correct if enabled
      if (this.autoCorrect && !report.isValid) {
        processedStyles = this.applyAutoCorrections(styles, report);
      }

      // Emit errors for invalid properties
      report.results
        .filter((result: { isValid: any; severity: string; }) => !result.isValid && result.severity === 'error')
        .forEach((result: { property: any; message: any; suggestions: any; }) => {
          this.styleError.emit({
            property: result.property,
            message: result.message,
            suggestions: result.suggestions || []
          });
        });
    }

    // Limpiar estilos previos (opcional, comentado para mantener estilos base)
    // Object.keys(processedStyles).forEach(key => {
    //   this.renderer.removeStyle(this.el.nativeElement, key);
    // });

    // Aplicar nuevos estilos
    Object.keys(processedStyles).forEach(key => {
      const value = processedStyles[key];
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();

      if (value !== undefined && value !== null && value !== '') {
        // Use setProperty for better compatibility with CSS variables and important flag
        const priority = (cssKey === 'position' || cssKey === 'width' || cssKey === 'height' || cssKey === 'left' || cssKey === 'top') ? 'important' : '';
        
        this.el.nativeElement.style.setProperty(cssKey, value, priority);

        // Fix: Auto-map to theme variables for components using the variant system
        if (key === 'backgroundColor') {
          this.el.nativeElement.style.setProperty('--theme-bg', value, 'important');
          this.el.nativeElement.style.setProperty('--background-color', value, 'important');
        } else if (key === 'color') {
          this.el.nativeElement.style.setProperty('--theme-color', value, 'important');
          this.el.nativeElement.style.setProperty('--text-color', value, 'important');
          this.el.nativeElement.style.setProperty('-webkit-text-fill-color', value, 'important');
        } else if (key === 'boxShadow') {
          this.el.nativeElement.style.setProperty('--theme-shadow', value, 'important');
        } else if (key === 'borderColor') {
           this.el.nativeElement.style.setProperty('--theme-border-color', value, 'important');
           this.el.nativeElement.style.setProperty('--border-color', value, 'important');
        } else if (key === 'borderRadius') {
           this.el.nativeElement.style.setProperty('--theme-radius', value, 'important');
        } else if (key === 'fontSize') {
           this.el.nativeElement.style.setProperty('--theme-fs', value, 'important');
        }

        // console.log(`✅ Applied style: ${cssKey} = ${value}`);
      } else {
        this.renderer.removeStyle(this.el.nativeElement, cssKey);

        // Remove mapped vars
        if (key === 'backgroundColor') {
           this.el.nativeElement.style.removeProperty('--theme-bg');
           this.el.nativeElement.style.removeProperty('--background-color');
        }
        if (key === 'color') {
           this.el.nativeElement.style.removeProperty('--theme-color');
           this.el.nativeElement.style.removeProperty('--text-color');
        }
      }
    });

    // Forced robustness for editor elements
    if (this.el.nativeElement.classList.contains('editor-element')) {
       this.el.nativeElement.style.setProperty('box-sizing', 'border-box', 'important');
    }
  }

  private applyAutoCorrections(originalStyles: any, report: any): any {
    const correctedStyles = { ...originalStyles };

    report.results.forEach((result: { isValid: any; suggestions: any[]; property: string | number; value: any; }) => {
      if (!result.isValid && result.suggestions && result.suggestions.length > 0) {
        // Find the best auto-apply suggestion
        const autoSuggestion = result.suggestions.find((s: { autoApply: any; }) => s.autoApply) || result.suggestions[0];
        if (autoSuggestion && autoSuggestion.confidence > 0.7) { // Only auto-apply high confidence corrections
          correctedStyles[result.property] = autoSuggestion.value;
          // console.log(`🔧 Auto-corrected ${result.property}: ${result.value} → ${autoSuggestion.value}`);
        }
      }
    });

    return correctedStyles;
  }
}
