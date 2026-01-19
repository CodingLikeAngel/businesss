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
        .filter(result => !result.isValid && result.severity === 'error')
        .forEach(result => {
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
        this.renderer.setStyle(this.el.nativeElement, cssKey, value);

        // Fix: Auto-map to theme variables for components using the variant system
        if (key === 'backgroundColor') {
          this.renderer.setStyle(this.el.nativeElement, '--theme-bg', value);
        } else if (key === 'color') {
          this.renderer.setStyle(this.el.nativeElement, '--theme-color', value);
        } else if (key === 'boxShadow') {
          this.renderer.setStyle(this.el.nativeElement, '--theme-shadow', value);
        } else if (key === 'borderColor') {
           // Some components use border shorthand, but we can try setting specific var
           this.renderer.setStyle(this.el.nativeElement, '--theme-border-color', value);
           // If the variant uses --theme-border shorthand, this might not be enough,
           // but often border-color is sufficient if border-width/style are defined.
        } else if (key === 'borderRadius') {
           this.renderer.setStyle(this.el.nativeElement, '--theme-radius', value);
        }

        console.log(`✅ Applied style: ${cssKey} = ${value}`);
      } else {
        this.renderer.removeStyle(this.el.nativeElement, cssKey);

        // Remove mapped vars
        if (key === 'backgroundColor') this.renderer.removeStyle(this.el.nativeElement, '--theme-bg');
        if (key === 'color') this.renderer.removeStyle(this.el.nativeElement, '--theme-color');
        if (key === 'boxShadow') this.renderer.removeStyle(this.el.nativeElement, '--theme-shadow');
      }
    });
  }

  private applyAutoCorrections(originalStyles: any, report: any): any {
    const correctedStyles = { ...originalStyles };

    report.results.forEach(result => {
      if (!result.isValid && result.suggestions && result.suggestions.length > 0) {
        // Find the best auto-apply suggestion
        const autoSuggestion = result.suggestions.find(s => s.autoApply) || result.suggestions[0];
        if (autoSuggestion && autoSuggestion.confidence > 0.7) { // Only auto-apply high confidence corrections
          correctedStyles[result.property] = autoSuggestion.value;
          console.log(`🔧 Auto-corrected ${result.property}: ${result.value} → ${autoSuggestion.value}`);
        }
      }
    });

    return correctedStyles;
  }
}
