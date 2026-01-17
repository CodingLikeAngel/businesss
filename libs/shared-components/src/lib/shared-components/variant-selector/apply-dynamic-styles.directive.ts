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
      if (value !== undefined && value !== null && value !== '') {
        // Convertir camelCase a kebab-case para CSS
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        this.renderer.setStyle(this.el.nativeElement, cssKey, value);
        
        console.log(`✅ Applied style: ${cssKey} = ${value}`);
      }
    });
  }
}
