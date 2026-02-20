import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TitleConfig,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { UIContactSectionComponent } from '@negocio/featured-components';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorContactIsolatedModeComponent } from './editor-contact-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

/**
 * Enhanced Editor Contact Section Component
 * Modernized for granular store synchronization and visual editing.
 */
@Component({
  selector: 'lib-editor-contact-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UIContactSectionComponent,
    EnhancedVisualEditableDirective,
    EditorContactIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-contact-section.component.html',
  styleUrls: ['./editor-contact-section.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class EditorContactSectionComponent extends EnhancedBaseEditorSectionComponent implements OnInit, AfterViewInit, DoCheck {
  @Input() titleConfig!: TitleConfig;
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('contactFormElement', { static: true }) contactFormElement!: ElementRef;
  @ViewChild('contactInfoElement', { static: true }) contactInfoElement!: ElementRef;

  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  contactForm!: FormGroup;
  isSubmitting = false;
  showSuccess = false;

  contactMethods = [
    { value: 'email', label: 'Correo electrónico', icon: '📧' },
    { value: 'phone', label: 'Teléfono', icon: '📞' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' }
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    super(platformId);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.initForm();
  }

  ngDoCheck() {
    // Sincronización de items (info items) si se editan desde el panel lateral
    const selected = this.uiStateService.selectedElement;
    if (selected && selected.sectionId === this.section.id && selected.isItem && selected.index !== undefined) {
       const items = this.section.content['contactItems'];
       if (items && items[selected.index] && items[selected.index] !== selected.content) {
           const newItems = [...items];
           newItems[selected.index] = selected.content;
           
           this.variantService.updateSectionInCurrentPage(this.section.id, {
             content: {
               ...this.section.content,
               contactItems: newItems
             }
           });
       }
    }
  }

  ngAfterViewInit() {
    // Inicializar contact items si no existen
    if (!this.section.content['contactItems']) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          contactItems: [
            { icon: '📧', title: 'Email', value: 'info@empresa.com', link: 'mailto:info@empresa.com', linkText: 'Enviar email' },
            { icon: '📞', title: 'Teléfono', value: '+34 900 123 456', link: 'tel:+34900123456', linkText: 'Llamar ahora' },
            { icon: '📍', title: 'Dirección', value: 'Calle Principal 123, Ciudad', link: 'https://maps.google.com', linkText: 'Ver en mapa' }
          ]
        }
      });
    }

    // Aplicar edición visual técnica
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.contactFormElement, this.section.id + '_form_wrapper');
    this.applyElementVisualEditing(this.contactInfoElement, this.section.id + '_info_wrapper');
  }

  private initForm() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[\+]?[0-9\-\s\(\)]{10,}$/)]],
      contactMethod: ['email'],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccess = true;
        this.contactForm.reset();
        this.contactForm.patchValue({ contactMethod: 'email' });
        setTimeout(() => this.showSuccess = false, 5000);
      }, 2000);
    }
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  getFormWrapperConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  getInfoWrapperConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleFormWrapperEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_form_wrapper');
  }

  handleInfoWrapperEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_info_wrapper');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (['moved', 'resized'].includes(event.type)) {
      this.updateContactStyles(event.bounds, elementId);
    }
  }

  private updateContactStyles(bounds: any, elementId: string): void {
    const currentStyles = this.section.styles || {};
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      styles: {
        ...currentStyles,
        width: bounds.width + 'px',
        height: bounds.height + 'px',
        transform: `translate(${bounds.x}px, ${bounds.y}px)`
      }
    });
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_contact_wrapper',
      type: 'contact',
      content: { ...this.section.content },
      styles: { ...this.section.styles },
      position: { x: 0, y: 0 },
      size: { width: 1000, height: 600 }
    };
    if (typeof document !== 'undefined') document.body.classList.add('isolated-mode-active');
    this.showIsolatedMode = true;
  }

  onIsolatedModeClosed(): void {
    if (typeof document !== 'undefined') document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: { ...this.section.content, ...config.content },
      styles: { ...this.section.styles, ...config.styles }
    });
    if (typeof document !== 'undefined') document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
  }
}
