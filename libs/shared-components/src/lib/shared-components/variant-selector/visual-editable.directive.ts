import { Directive, ElementRef, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { VisualEditorService, DragResizeConfig, ElementBounds } from './visual-editor.service';

@Directive({
  selector: '[visualEditable]',
  standalone: true
})
export class VisualEditableDirective implements OnInit, OnDestroy {
  @Input() visualEditable: boolean = true;
  @Input() visualConfig: Partial<DragResizeConfig> = {};
  @Input() visualType: 'section' | 'element' = 'element';
  
  @Output() visualResized = new EventEmitter<ElementBounds>();
  @Output() visualMoved = new EventEmitter<ElementBounds>();
  @Output() visualSelected = new EventEmitter<HTMLElement>();

  private cleanup?: () => void;

  constructor(
    private el: ElementRef<HTMLElement>,
    private visualEditor: VisualEditorService
  ) {}

  ngOnInit() {
    if (!this.visualEditable) return;

    // Configuración específica por tipo
    const config: Partial<DragResizeConfig> = {
      ...this.getDefaultConfigForType(),
      ...this.visualConfig
    };

    // Hacer el elemento editable
    this.cleanup = this.visualEditor.makeEditable(
      this.el.nativeElement,
      config
    );

    // Suscribirse a eventos
    this.setupEventListeners();
  }

  ngOnDestroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }

  private getDefaultConfigForType(): Partial<DragResizeConfig> {
    if (this.visualType === 'section') {
      return {
        enableDrag: false, // Las secciones no se mueven, solo se redimensionan
        enableResize: true,
        minHeight: 100,
        handles: {
          top: false,
          right: false,
          bottom: true, // Solo resize vertical para secciones
          left: false,
          topLeft: false,
          topRight: false,
          bottomLeft: false,
          bottomRight: false
        }
      };
    } else {
      return {
        enableDrag: true,
        enableResize: true,
        minWidth: 50,
        minHeight: 30,
        grid: 5 // Snap a grid de 5px
      };
    }
  }

  private setupEventListeners() {
    // Escuchar eventos de resize
    this.visualEditor.elementResized$.subscribe(({ element, bounds }) => {
      if (element === this.el.nativeElement) {
        this.visualResized.emit(bounds);
      }
    });

    // Escuchar eventos de movimiento
    this.visualEditor.elementMoved$.subscribe(({ element, bounds }) => {
      if (element === this.el.nativeElement) {
        this.visualMoved.emit(bounds);
      }
    });

    // Escuchar eventos de selección
    this.visualEditor.elementSelected$.subscribe((element) => {
      if (element === this.el.nativeElement) {
        this.visualSelected.emit(element);
      }
    });
  }
}
