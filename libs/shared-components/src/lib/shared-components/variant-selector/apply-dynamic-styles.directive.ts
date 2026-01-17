import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[applyDynamicStyles]',
  standalone: true
})
export class ApplyDynamicStylesDirective implements OnChanges {
  @Input() applyDynamicStyles: any; // El objeto de estilos

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

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

    // Limpiar estilos previos (opcional, comentado para mantener estilos base)
    // Object.keys(styles).forEach(key => {
    //   this.renderer.removeStyle(this.el.nativeElement, key);
    // });

    // Aplicar nuevos estilos
    Object.keys(styles).forEach(key => {
      const value = styles[key];
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
}
